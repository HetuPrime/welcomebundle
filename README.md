# 🎁 WelcomeBundle

> A digital welcome bundle for your newborn — automatically register gaming and platform accounts on their birth day.

## Why?

When your baby is born, you want to give them something special. A set of accounts created on their exact birth date — Steam, GitHub, Epic Games, Nintendo... Each account's creation timestamp becomes a permanent record of that moment.

**This is a time capsule. A digital gift. A "Welcome to the world."**

---

## 简单流程

```
孩子出生时：
  1. 创建专用邮箱 (如 emma2024@gmail.com)
  2. 配置 .env
  3. 运行注册脚本
  4. 自动注册所有平台账号

孩子长大后：
  - 邮箱是孩子的
  - 所有账号是孩子的
  - 完全移交，无需额外操作
```

---

## Quick Start

### Step 1: 创建孩子的专用邮箱

```
推荐 Gmail：
  邮箱名：孩子的名字 + 出生年份
  例如：emma2024@gmail.com, lucas2025@gmail.com
  
为什么用 Gmail：
  - 大多数平台接受 Gmail
  - 可以创建 App Password 用于自动化
  - 孩子长大后直接使用
```

### Step 2: 获取 Gmail App Password

1. 登录孩子的 Gmail
2. 访问 https://myaccount.google.com/apppasswords
3. 选择"邮件"应用 → "其他(WelcomeBundle)"
4. 复制生成的 16 位密码

### Step 3: 配置

```bash
# 克隆项目
git clone https://github.com/HetuPrime/welcomebundle.git
cd welcomebundle

# 复制配置
cp .env.example .env
nano .env
```

```bash
# .env 配置

# 孩子的信息
BABY_NAME=Emma
LAST_NAME=Smith

# 孩子的专用邮箱
PARENT_EMAIL=emma2024@gmail.com      # ← 用孩子的邮箱

# Gmail IMAP 配置（自动验证邮件）
EMAIL_PROVIDER=gmail
EMAIL_USER=emma2024@gmail.com        # ← 孩子的邮箱
EMAIL_PASSWORD=abcd efgh ijkl mnop   # ← App Password

# 要注册的平台
ENABLED_PLATFORMS=github,steam,reddit,epic_games

# 加密密钥
ENCRYPTION_KEY=  # 运行: openssl rand -base64 32
```

### Step 4: 测试

```bash
# 安装依赖
npm install

# 测试模式（不会实际注册）
DRY_RUN=true npm run register

# 实际注册
npm run register
```

---

## 平台选择

```bash
# 指定要注册的平台
ENABLED_PLATFORMS=github,reddit,steam,epic_games

# 或排除某些平台
DISABLED_PLATFORMS=battlenet,nintendo
```

| Platform | Type | Username |
|----------|------|----------|
| `github` | Developer | `{babyname}` |
| `gitlab` | Developer | `{babyname}` |
| `steam` | Gaming | `{babyname}_gaming` |
| `epic_games` | Gaming | `{babyname}` |
| `battlenet` | Gaming | `{babyname}` |
| `nintendo` | Gaming | `{babyname}` |
| `reddit` | Community | `{babyname}` |
| `medium` | Blog | `{babyname}` |

**默认**: `github`, `steam`, `epic_games`

---

## Docker 部署（长期运行）

```bash
# 配置
cp .env.example .env
nano .env

# 启动
./deploy.sh

# 查看日志
./logs.sh

# 停止
./stop.sh
```

### Telegram Bot（远程触发）

```bash
# .env 添加
TELEGRAM_BOT_TOKEN=your-token
TELEGRAM_CHAT_ID=your-chat-id

# 启动 Bot
npm run bot

# 医院里发送 /register 触发注册
```

---

## 完整流程图

```
┌─────────────────────────────────────────────────────────┐
│  孩子出生前（准备）                                       │
│  ├─ 创建孩子的专用邮箱 (emma2024@gmail.com)               │
│  ├─ 获取 Gmail App Password                             │
│  ├─ 配置 .env                                           │
│  └─ 测试: DRY_RUN=true                                  │
├─────────────────────────────────────────────────────────┤
│  孩子出生时 🎉                                           │
│  ├─ 发送 /register 到 Telegram Bot                      │
│  │   或                                                 │
│  ├─ 运行 npm run register                               │
│  └─ 系统自动执行:                                        │
│      • 打开浏览器                                        │
│      • 用孩子的邮箱注册各平台                             │
│      • 自动读取验证邮件                                  │
│      • 自动点击验证链接                                  │
│      • 保存账号信息                                      │
├─────────────────────────────────────────────────────────┤
│  结果                                                    │
│  ├─ 所有账号创建时间 = 孩子生日                          │
│  ├─ 所有账号邮箱 = 孩子的邮箱                            │
│  └─ 孩子长大后，邮箱+账号全部属于ta                       │
└─────────────────────────────────────────────────────────┘
```

---

## 安全

- ✅ 所有凭证加密存储
- ✅ 仅白名单 Chat ID 可触发 Bot
- ✅ 无硬编码密钥
- ✅ `.env` 排除在 git 之外
- ⚠️ 使用 App Password，不要用 Gmail 主密码

---

## FAQ

**Q: 用孩子的邮箱注册，会不会有问题？**
A: 不会。大多数平台只要求邮箱验证，不限制年龄。账号由家长代管，孩子长大后移交。

**Q: 孩子长大后怎么接管账号？**
A: 直接把邮箱密码给孩子即可。所有账号都是用这个邮箱注册的，孩子可以自己管理。

**Q: Gmail App Password 是什么？**
A: 是一个 16 位密码，用于第三方应用访问 Gmail。不是你的 Gmail 登录密码。在 Google 账户设置中创建。

**Q: 可以用其他邮箱吗？**
A: 可以。Outlook、Yahoo 都支持 IMAP。配置方法类似。

**Q: 临时邮箱能用吗？**
A: 不推荐。临时邮箱会失效，无法找回密码。请用孩子的真实邮箱。

---

## License

MIT License

---

Made with ❤️ for parents.
