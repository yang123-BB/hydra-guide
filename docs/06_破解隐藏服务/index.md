# 第六章：破解隐藏服务 🔍

> **Hydra初学者指南** · 第六章 · ⭐⭐⭐ 中级 · ⏱️ 预计 40 分钟

---

## 📚 学习目标

完成本章学习后，你将能够：

1. **理解隐藏服务的概念** —— 掌握什么是非标准端口服务、为什么管理员会将服务部署在非默认端口上
2. **使用Nmap扫描发现隐藏服务** —— 学会全端口扫描、服务版本探测、操作系统识别等关键技术
3. **进行服务指纹识别** —— 能够通过Banner抓取、协议行为分析等手段准确判断服务类型
4. **针对非标准端口执行Hydra爆破** —— 掌握指定自定义端口、服务类型自动推断、手动指定模块等技巧
5. **构建Nmap+Hydra自动化流程** —— 学会编写扫描脚本，实现从端口发现到密码爆破的全自动化

---

## 🧠 背景知识

### 6.1 什么是隐藏服务？

#### 6.1.1 隐藏服务的定义

在网络安全领域，**隐藏服务（Hidden Services）** 并不是一个严谨的学术概念，而是一个约定俗成的术语，泛指那些**没有运行在标准默认端口上的网络服务**，或者**通过某种方式试图规避常规检测和扫描的网络服务**。

在日常网络管理中，很多服务都有其"默认端口"——这是IANA（互联网名称与数字地址分配机构）或相关协议规范约定的标准通信端口。例如：

| 服务 | 默认端口 | 协议 |
|------|---------|------|
| SSH（Secure Shell） | 22 | TCP |
| FTP（File Transfer Protocol） | 21 | TCP |
| Telnet | 23 | TCP |
| SMTP（Simple Mail Transfer Protocol） | 25 | TCP |
| HTTP（Hypertext Transfer Protocol） | 80 | TCP |
| HTTPS | 443 | TCP |
| MySQL | 3306 | TCP |
| PostgreSQL | 5432 | TCP |
| RDP（Remote Desktop Protocol） | 3389 | TCP |
| VNC（Virtual Network Computing） | 5900 | TCP |
| Redis | 6379 | TCP |
| MongoDB | 27017 | TCP |

当管理员出于各种原因将某个服务部署到**非标准端口**上时，我们就可以称之为"隐藏服务"。例如，将SSH服务从默认的22端口改到2222端口，或者将MySQL从3306改到13306端口。

#### 6.1.2 为什么要隐藏服务？

管理员将服务部署在非标准端口上的原因多种多样：

**🔒 安全目的——"隐匿即安全"**

许多管理员认为，将服务放在非标准端口上可以实现"隐匿即安全（Security by Obscurity）"。其基本逻辑是：攻击者通常只会扫描常见端口，如果服务不在常见端口上，就不会被发现，从而降低被攻击的概率。

虽然这种做法在安全领域被广泛认为**不够充分**（因为全端口扫描仍然可以发现这些服务），但在实际环境中确实可以过滤掉大量"脚本小子"级别的自动化扫描。

**🔧 技术原因**

- **端口冲突**：一台服务器上可能需要运行多个相同类型的服务实例，例如两个MySQL实例，它们不能共享同一个端口
- **多租户环境**：在同一台服务器上为不同用户或应用提供隔离的服务环境
- **容器化部署**：Docker等容器技术中，端口映射经常将服务映射到非标准宿主机端口

**🚫 合规与策略原因**

- 某些企业安全策略可能禁止在默认端口上运行特定服务
- 防火墙规则可能只允许特定端口范围的流量通过
- ISP（互联网服务提供商）可能封锁了某些默认端口

**⚠️ 恶意目的**

攻击者和恶意软件也经常使用隐藏服务来规避检测：
- 后门程序监听在非标准端口
- C2（Command & Control）服务器使用随机高端口
- 恶意脚本通过端口敲门（Port Knocking）技术隐藏真实服务端口

#### 6.1.3 端口的基本分类

理解端口分类是发现隐藏服务的基础：

**📌 Well-Known Ports（知名端口）：0-1023**

这些端口通常分配给最常用和最基础的网络服务。在Linux系统中，绑定到这些端口通常需要root权限。

- 22: SSH
- 21: FTP
- 80: HTTP
- 443: HTTPS

**📌 Registered Ports（注册端口）：1024-49151**

这些端口由IANA分配给特定的服务或应用程序，但不像知名端口那样固定和通用。

- 3306: MySQL
- 5432: PostgreSQL
- 6379: Redis
- 3389: RDP
- 8080: HTTP Alternate

**📌 Dynamic/Ephemeral Ports（动态/临时端口）：49152-65535**

操作系统通常将这些端口用于临时的客户端连接，但并不意味着服务不能绑定到这些端口。实际上，很多隐藏服务恰恰选择这些高端口来部署。

#### 6.1.4 常见的隐藏服务端口模式

根据实践经验，管理员选择隐藏端口时往往有一定的规律：

```
📊 常见隐藏端口模式

模式一：端口偏移法
  SSH → 2222, 22222, 2022
  FTP → 2121, 21212
  HTTP → 8080, 8888, 8000, 9000

模式二：高端口法（>10000）
  SSH → 12345, 10022
  MySQL → 13306, 33060

模式三：伪装法（将服务放在看似是其他服务的端口）
  SSH → 443（伪装成HTTPS）
  SSH → 53（伪装成DNS）

模式四：随机高端口（>50000）
  几乎不遵循任何规律
```

### 6.2 端口扫描发现隐藏服务

#### 6.2.1 为什么端口扫描是第一步？

在渗透测试中，发现目标是第一步。如果目标服务不在默认端口上，传统的"检查默认端口是否存在服务"的方法就会完全失效。此时，**全端口扫描**成为发现隐藏服务的唯一可靠手段。

端口扫描的本质是：向目标主机的各个端口发送特定类型的网络数据包，根据响应来判断该端口是**开放的（Open）**、**关闭的（Closed）**还是**被过滤的（Filtered）**。

#### 6.2.2 Nmap扫描技术详解

**Nmap** 是最强大、最广泛使用的网络扫描工具。在发现隐藏服务的场景中，我们需要掌握以下关键扫描技术：

**① TCP SYN扫描（半开放扫描）**

```
原理：发送TCP SYN包，如果收到SYN-ACK，说明端口开放；如果收到RST，说明端口关闭；如果无响应，说明端口被过滤。
优点：速度快，隐蔽性好（不建立完整连接）
语法：nmap -sS target
```

这是Nmap的**默认扫描模式**（需要root权限），也是我们最常用的扫描方式。

**② TCP Connect扫描（全连接扫描）**

```
原理：完成完整的TCP三次握手来探测端口状态
优点：不需要root权限
缺点：速度较慢，容易被日志记录
语法：nmap -sT target
```

**③ UDP扫描**

```
原理：向UDP端口发送空数据包，根据ICMP响应判断端口状态
注意：UDP扫描速度非常慢，且不可靠
语法：nmap -sU target
```

**④ 版本探测（-sV）**

```
原理：发送特定协议的探测请求，根据服务响应的Banner和协议行为来判断服务类型
这是发现隐藏服务后进行指纹识别的关键
语法：nmap -sV target
```

**⑤ 全端口扫描（-p-）**

```
扫描全部65535个端口，而非默认的Top 1000端口
这是发现隐藏服务的必要手段
语法：nmap -p- target
```

#### 6.2.3 针对隐藏服务的Nmap命令组合

发现隐藏服务通常需要组合使用多个Nmap选项：

```bash
# 最基础的全端口扫描
nmap -p- 192.168.1.100

# 全端口扫描 + 服务版本探测 + 操作系统识别
nmap -p- -sV -O 192.168.1.100

# 全端口扫描 + 版本探测 + 脚本扫描（更详细的服务识别）
nmap -p- -sV -sC 192.168.1.100

# 快速全端口扫描（仅扫描，不做版本探测，速度快）
nmap -p- -T4 --min-rate 1000 192.168.1.100

# 针对特定端口范围扫描（例如高端口区域）
nmap -p 10000-65535 -sV 192.168.1.100
```

**参数说明：**

| 参数 | 含义 |
|------|------|
| `-p-` | 扫描全部65535个端口 |
| `-sV` | 探测开放端口上的服务版本 |
| `-O` | 启用操作系统检测 |
| `-sC` | 使用默认脚本进行更深入探测 |
| `-T4` | 使用T4计时模板（比默认更快） |
| `--min-rate 1000` | 保证每秒至少发送1000个包（加速扫描） |

#### 6.2.4 扫描结果分析

Nmap扫描结果中的端口状态有以下几种：

```
open        - 端口开放，有应用程序在该端口上监听
closed      - 端口可达但没有应用程序监听
filtered    - 端口被防火墙/ACL过滤，Nmap无法确定其状态
open|filtered - 无法区分开放还是被过滤
closed|filtered - 无法区分关闭还是被过滤
```

输出示例：

```
$ nmap -p- -sV -sC 192.168.1.100

Starting Nmap 7.94 ( https://nmap.org ) at 2025-06-08 10:00:00
Nmap scan report for 192.168.1.100
Host is up (0.0023s latency).

PORT      STATE  SERVICE    VERSION
22/tcp    closed ssh
23/tcp    filtered telnet
80/tcp    open   http       Apache httpd 2.4.52
443/tcp   open   ssl/http   Apache httpd 2.4.52
8080/tcp  open   http       Nginx 1.18.0
2222/tcp  open   ssh        OpenSSH 8.9p1 Ubuntu 3ubuntu0.4
33060/tcp open   mysql      MySQL 8.0.32
5901/tcp  open   vnc        VNC (protocol 3.8)
```

**解读：** 在上面的结果中，我们可以看到几个明显的隐藏服务：
- **2222/tcp** 运行着SSH（OpenSSH 8.9p1）—— 这是SSH从默认22端口隐藏到了2222
- **33060/tcp** 运行着MySQL 8.0.32 —— 这是MySQL从默认3306端口隐藏到了33060
- **5901/tcp** 运行着VNC —— 注意5900是VNC的标准端口，5901通常是VNC的第二个桌面会话

### 6.3 服务指纹识别

#### 6.3.1 什么是服务指纹？

**服务指纹（Service Fingerprint）** 是指通过分析网络服务的特定行为和响应特征，来唯一标识该服务类型及其版本的技术。就像人的指纹可以唯一识别一个人一样，服务的指纹也可以帮助我们准确判断一个端口上运行的是什么服务。

服务指纹识别对于发现隐藏服务至关重要，原因在于：

**🎯 确定攻击面** —— 只有知道服务类型，才能选择正确的攻击手段和工具
**🎯 选择正确的Hydra模块** —— Hydra针对不同服务使用不同的认证协议模块，需要指定正确的 `-s` 模块
**🎯 了解攻击难度** —— 不同服务版本的安全性和漏洞情况差异巨大

#### 6.3.2 Banner抓取

**Banner** 是服务在建立连接时主动发送的一段文本信息，通常包含服务类型、版本号等关键信息。这是最简单直接的服务指纹识别方法。

```bash
# 使用Netcat抓取Banner
nc -v 192.168.1.100 2222

# 使用curl抓取HTTP Banner
curl -I http://192.168.1.100:8080

# 使用telnet抓取Banner
telnet 192.168.1.100 2222
```

**SSH Banner抓取示例：**

```
$ nc -v 192.168.1.100 2222
Connection to 192.168.1.100 2222 port [tcp/*] succeeded!
SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.4
```

从Banner `SSH-2.0-OpenSSH_8.9p1` 中，我们可以明确得出：
- 协议版本：SSH 2.0
- 软件名称：OpenSSH
- 软件版本：8.9p1
- 发行版：Ubuntu

**HTTP Banner抓取示例：**

```
$ curl -I http://192.168.1.100:8080
HTTP/1.1 200 OK
Server: nginx/1.18.0
Date: Sun, 08 Jun 2025 02:00:00 GMT
Content-Type: text/html; charset=UTF-8
X-Powered-By: PHP/7.4.33
```

从响应头中我们可以识别出：Nginx Web服务器 + PHP后端。

#### 6.3.3 Nmap服务版本探测原理

Nmap的 `-sV` 选项使用了一套精密的服务指纹匹配系统。其工作原理如下：

```
步骤1：发送空TCP连接请求，观察响应
步骤2：发送特定协议的握手请求（如HTTP GET请求、SSL ClientHello等）
步骤3：收集多种探测的响应数据
步骤4：与Nmap内置的服务指纹数据库（nmap-service-probes）进行匹配
步骤5：返回最佳匹配的服务类型和版本信息
```

Nmap的服务指纹数据库包含数千种已知服务的指纹模式，覆盖了从常见服务到罕见服务的各种情况。

#### 6.3.4 常见服务的指纹特征

了解常见服务的指纹特征，有助于我们手动识别服务：

| 服务 | 典型Banner特征 | 关键识别标志 |
|------|---------------|-------------|
| SSH | `SSH-2.0-OpenSSH_X.XpX` | 以"SSH-"开头 |
| HTTP | `HTTP/1.1 XXX OK` | 以"HTTP/"开头 |
| FTP | `220 Welcome to FTP` | 以"220"开头 |
| SMTP | `220 mail.example.com ESMTP` | 以"220"开头 |
| MySQL | 二进制握手协议（不可读） | 端口+版本探测 |
| PostgreSQL | 认证请求报文 | 二进制协议 |
| Redis | 可能响应空数据或无Banner | 发送PING后返回PONG |
| RDP | SSL/TLS握手 | 端口3389 |
| Telnet | 无Banner，等待用户输入 | 命令行交互 |

#### 6.3.5 手动服务识别技巧

当Nmap无法准确识别服务时，我们可以手动进行识别：

```bash
# 1. 确认端口是否响应TCP连接
nc -zv 192.168.1.100 2222

# 2. 抓取Banner
nc -v 192.168.1.100 2222 2>&1 | head -5

# 3. 如果是文本协议，尝试发送协议命令
echo "PING" | nc 192.168.1.100 6379   # 测试是否是Redis

# 4. 使用Nmap的深度脚本扫描
nmap -p 2222 -sV --version-intensity 5 192.168.1.100

# 5. 使用Nmap特定脚本
nmap -p 2222 --script ssh-banner 192.168.1.100
```

---

## 🖥️ 实验环境

### 环境要求

#### 攻击机配置

| 项目 | 要求 |
|------|------|
| 操作系统 | Kali Linux 2024.x / Ubuntu 22.04+ / Parrot OS |
| 网络连接 | 与靶机在同一局域网 |
| 必需工具 | Nmap ≥ 7.80, Hydra ≥ 9.0, Netcat, Curl |
| 可选工具 | Masscan, RustScan, Python 3.x |
| 权限 | root（Nmap SYN扫描需要root权限） |

#### 靶机配置

| 项目 | 要求 |
|------|------|
| 操作系统 | Ubuntu 22.04 LTS Server |
| IP地址 | 192.168.1.100（示例，按实际修改） |
| 服务 | 多个非标准端口服务 |

### 搭建非标准端口服务靶机环境

下面我们将在一台Ubuntu Server上搭建包含多个隐藏服务的靶机环境。

#### 步骤一：安装基础服务

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装所需服务
sudo apt install -y openssh-server \
    vsftpd \
    telnetd \
    apache2 \
    mysql-server \
    postgresql \
    redis-server \
    xrdp
```

#### 步骤二：创建测试账户

```bash
# 创建多个测试账户用于爆破实验
sudo useradd -m -s /bin/bash testuser1
sudo useradd -m -s /bin/bash testuser2
sudo useradd -m -s /bin/bash testuser3
sudo useradd -m -s /bin/bash admin

# 设置密码
echo "testuser1:password123" | sudo chpasswd
echo "testuser2:letmein" | sudo chpasswd
echo "testuser3:qwerty123" | sudo chpasswd
echo "admin:admin123" | sudo chpasswd

# 创建MySQL测试账户
sudo mysql -e "CREATE USER 'dbuser1'@'%' IDENTIFIED BY 'dbpass123';"
sudo mysql -e "CREATE USER 'dbuser2'@'%' IDENTIFIED BY 'mysqldog';"
sudo mysql -e "GRANT ALL PRIVILEGES ON *.* TO 'dbuser1'@'%';"
sudo mysql -e "GRANT ALL PRIVILEGES ON *.* TO 'dbuser2'@'%';"

# 创建PostgreSQL测试账户
sudo -u postgres psql -c "CREATE USER pguser1 WITH PASSWORD 'pgpass123';"
sudo -u postgres psql -c "CREATE USER pguser2 WITH PASSWORD 'postbird';"
```

#### 步骤三：配置SSH隐藏服务

```bash
# 复制SSH配置文件
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config_hidden

# 修改隐藏SSH配置
sudo tee /etc/ssh/sshd_config_hidden > /dev/null << 'EOF'
# 隐藏SSH服务 - 运行在2222端口
Port 2222
ListenAddress 0.0.0.0
PermitRootLogin yes
PasswordAuthentication yes
ChallengeResponseAuthentication no
UsePAM yes
AcceptEnv LANG LC_*
Subsystem sftp /usr/lib/openssh/sftp-server
EOF

# 启动隐藏SSH服务（使用独立的配置文件）
sudo /usr/sbin/sshd -f /etc/ssh/sshd_config_hidden
```

#### 步骤四：配置FTP隐藏服务

```bash
# 复制FTP配置文件
sudo cp /etc/vsftpd.conf /etc/vsftpd_hidden.conf

# 创建隐藏FTP配置
sudo tee /etc/vsftpd_hidden.conf > /dev/null << 'EOF'
# 隐藏FTP服务 - 运行在2121端口
listen=YES
listen_ipv6=NO
anonymous_enable=NO
local_enable=YES
write_enable=YES
local_umask=022
dirmessage_enable=YES
use_localtime=YES
xferlog_enable=YES
connect_from_port_20=NO
listen_port=2121
ftpd_banner=Welcome to Hidden FTP Service.
chroot_local_user=YES
allow_writeable_chroot=YES
pam_service_name=vsftpd
EOF

# 启动隐藏FTP服务
sudo /usr/sbin/vsftpd /etc/vsftpd_hidden.conf
```

#### 步骤五：配置MySQL隐藏服务

```bash
# 修改MySQL配置，添加隐藏实例
sudo tee /etc/mysql/mysql.conf.d/hide-port.cnf > /dev/null << 'EOF'
[mysqld]
# 注意：MySQL多实例配置较复杂
# 这里我们修改现有实例的端口为非标准端口
# 额外监听端口 33060
EOF

# 为MySQL添加额外监听端口
# 方法：使用iptables端口转发（简单有效）
sudo iptables -t nat -A PREROUTING -p tcp --dport 33060 -j REDIRECT --to-port 3306
sudo iptables -t nat -A PREROUTING -p tcp --dport 13306 -j REDIRECT --to-port 3306
```

#### 步骤六：配置Redis隐藏服务

```bash
# 修改Redis配置
sudo tee /etc/redis/redis.conf.d/hide.conf > /dev/null << 'EOF'
port 6380
bind 0.0.0.0
requirepass redispanda
EOF

# 或者直接修改主配置文件中的端口
sudo sed -i 's/^port 6379/port 6379/' /etc/redis/redis.conf

# 启动第二个Redis实例（监听6380端口）
sudo redis-server --port 6380 --daemonize yes --requirepass redispanda
```

#### 步骤七：配置Telnet隐藏服务

```bash
# 安装并启动Telnet服务（inetd方式）
sudo apt install -y xinetd telnetd

# 配置隐藏Telnet服务（端口2300）
sudo tee /etc/xinetd.d/telnet_hidden > /dev/null << 'EOF'
service telnet_hidden
{
    disable         = no
    flags           = REUSE
    socket_type     = stream
    wait            = no
    user            = root
    server          = /usr/sbin/in.telnetd
    log_on_failure  += USERID
    port            = 2300
}
EOF

# 重启xinetd使配置生效
sudo systemctl restart xinetd
```

#### 步骤八：验证靶机环境

```bash
# 在靶机上验证所有隐藏服务是否正常运行
echo "=== 验证隐藏服务 ==="

# SSH on 2222
echo -n "SSH (2222): " && sudo ss -tlnp | grep ":2222 " && echo "✅ 运行中" || echo "❌ 未运行"

# FTP on 2121
echo -n "FTP (2121): " && sudo ss -tlnp | grep ":2121 " && echo "✅ 运行中" || echo "❌ 未运行"

# MySQL on 3306 (正常) + 33060/13306 (转发)
echo -n "MySQL (3306): " && sudo ss -tlnp | grep ":3306 " && echo "✅ 运行中" || echo "❌ 未运行"

# Redis on 6380
echo -n "Redis (6380): " && sudo ss -tlnp | grep ":6380 " && echo "✅ 运行中" || echo "❌ 未运行"

# Telnet on 2300
echo -n "Telnet (2300): " && sudo ss -tlnp | grep ":2300 " && echo "✅ 运行中" || echo "❌ 未运行"

# 显示所有监听端口
echo ""
echo "=== 所有监听端口 ==="
sudo ss -tlnp | sort -t: -k2 -n
```

预期输出：

```
=== 验证隐藏服务 ===
SSH (2222): 0  0 0.0.0.0:2222  ✅ 运行中
FTP (2121): 0  0 0.0.0.0:2121  ✅ 运行中
MySQL (3306): 0  0 0.0.0.0:3306  ✅ 运行中
Redis (6380): 0  0 0.0.0.0:6380  ✅ 运行中
Telnet (2300): 0  0 0.0.0.0:2300  ✅ 运行中

=== 所有监听端口 ===
State   Recv-Q  Send-Q  Local Address:Port  Peer Address:Port  Process
LISTEN  0       128     0.0.0.0:22         0.0.0.0:*          users:(("sshd",pid=1234,fd=3))
LISTEN  0       128     0.0.0.0:2121       0.0.0.0:*          users:(("vsftpd",pid=5678,fd=4))
LISTEN  0       70      0.0.0.0:2222       0.0.0.0:*          users:(("sshd",pid=2345,fd=3))
LISTEN  0       80      127.0.0.1:3306     0.0.0.0:*          users:(("mysqld",pid=8901,fd=22))
LISTEN  0       511     0.0.0.0:6380       0.0.0.0:*          users:(("redis-server",pid=3456,fd=6))
LISTEN  0       128     0.0.0.0:2300       0.0.0.0:*          users:(("xinetd",pid=7890,fd=5))
```

---

## 🧪 实验步骤

### 任务一：端口扫描发现隐藏服务 🔍

#### 步骤1.1：基础全端口扫描

```bash
# 执行全端口扫描（扫描全部65535个端口）
nmap -p- 192.168.1.100
```

**预期输出：**

```
$ nmap -p- 192.168.1.100

Starting Nmap 7.94 ( https://nmap.org ) at 2025-06-08 10:05:00
Nmap scan report for target (192.168.1.100)
Host is up (0.0035s latency).

PORT      STATE  SERVICE
22/tcp    open   ssh
2121/tcp  open   ftp
2222/tcp  open   ssh
2300/tcp  open   unknown
3306/tcp  open   mysql
6380/tcp  open   unknown
33060/tcp open   mysql
13306/tcp open   mysql

Nmap done: 1 IP address (1 host up) scanned in 12.35 seconds
```

**🔍 输出解读：**

| 端口 | 服务 | 分析 |
|------|------|------|
| 22/tcp | ssh | SSH默认端口——这是正常的SSH服务 |
| 2121/tcp | ftp | **隐藏服务！** FTP运行在非标准端口2121上 |
| 2222/tcp | ssh | **隐藏服务！** 另一个SSH实例运行在2222端口 |
| 2300/tcp | unknown | **隐藏服务！** Nmap无法识别，需要进一步探测 |
| 3306/tcp | mysql | MySQL默认端口 |
| 6380/tcp | unknown | **隐藏服务！** 可能是Redis（默认6379的偏移） |
| 33060/tcp | mysql | **隐藏服务！** MySQL的X协议端口（或端口转发） |
| 13306/tcp | mysql | **隐藏服务！** 端口转发到3306 |

> 💡 **关键发现**：Nmap的默认服务识别将2121识别为ftp（因为它在注册端口表中有记录），但将2300和6380标记为"unknown"，这意味着我们需要进一步探测。

#### 步骤1.2：加速全端口扫描

```bash
# 使用T4模板 + 最小速率限制加速扫描
nmap -p- -T4 --min-rate 5000 192.168.1.100

# 或者使用RustScan进行超快速端口发现，再用Nmap进行服务识别
rustscan -a 192.168.1.100 --ulimit 5000 -r 1-65535
```

**RustScan输出示例：**

```
$ rustscan -a 192.168.1.100

.----. .-. .----. .---.  .----. .---.   .-. .-. .----. .---.
| {}  }| | { {__  |   }  | {}  }| |_)  |  `-.`-'  { {__  |   |
| [] }| |.-'} } `---.  | {}  }|  _)  |    } {    .-'} }`---'
`----'`-'`----'`----'  `----'`-`  `-'    `-'  `----'`----'
--------------------------------------------------
🤖 Open 192.168.1.100:22
🤖 Open 192.168.1.100:2121
🤖 Open 192.168.1.100:2222
🤖 Open 192.168.1.100:2300
🤖 Open 192.168.1.100:3306
🤖 Open 192.168.1.100:6380
🤖 Open 192.168.1.100:33060
🤖 Open 192.168.1.100:13306
```

#### 步骤1.3：服务版本探测

```bash
# 对发现的所有端口进行服务版本探测
nmap -p 22,2121,2222,2300,3306,6380,33060,13306 -sV -sC 192.168.1.100
```

**预期输出：**

```
$ nmap -p 22,2121,2222,2300,3306,6380,33060,13306 -sV -sC 192.168.1.100

Starting Nmap 7.94 ( https://nmap.org ) at 2025-06-08 10:08:00
Nmap scan report for 192.168.1.100
Host is up (0.0030s latency).

PORT      STATE  SERVICE    VERSION
22/tcp    open   ssh        OpenSSH 8.9p1 Ubuntu 3ubuntu0.4 (Ubuntu Linux; protocol 2.0)
2121/tcp  open   ftp        vsftpd 3.0.5
2222/tcp  open   ssh        OpenSSH 8.9p1 Ubuntu 3ubuntu0.4 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   2048 xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx (RSA)
|   256 xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx (ECDSA)
|   256 xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx (ED25519)
2300/tcp  open   telnet     Linux telnetd
3306/tcp  open   mysql      MySQL 8.0.32-0ubuntu0.22.04.2
6380/tcp  open   redis      Redis v7.0.11
33060/tcp open   mysql      MySQL 8.0.32-0ubuntu0.22.04.2
13306/tcp open   mysql      MySQL 8.0.32-0ubuntu0.22.04.2
```

**🔍 关键发现：**

- **2300/tcp** 现在被正确识别为 `telnet`！之前标记为"unknown"的服务原来是隐藏的Telnet服务
- **6380/tcp** 被识别为 `Redis v7.0.11`！证实了我们的猜测——Redis隐藏在6380端口
- 两个MySQL端口（33060和13306）实际上是通过端口转发指向同一个3306实例

---

### 任务二：识别服务类型并准备爆破策略 🎯

#### 步骤2.1：Banner抓取确认

```bash
# SSH Banner确认
echo "" | nc -v 192.168.1.100 2222 2>&1 | head -3
```

**输出：**
```
Connection to 192.168.1.100 2222 port [tcp/*] succeeded!
SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.4
```

```bash
# Telnet Banner确认
echo "" | nc -v 192.168.1.100 2300 2>&1 | head -5
```

**输出：**
```
Connection to 192.168.1.100 2300 port [tcp/*] succeeded!
Trying 192.168.1.100...
Connected to 192.168.1.100.
Escape character is '^]'.
Ubuntu 22.04.3 LTS
login:
```

```bash
# FTP Banner确认
echo "" | nc -v 192.168.1.100 2121 2>&1 | head -3
```

**输出：**
```
Connection to 192.168.1.100 2121