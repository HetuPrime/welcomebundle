# 🎁 WelcomeBundle

> A digital welcome bundle for your newborn — automatically register gaming and platform accounts on their birth day.

## ⚠️ 重要：邮箱验证方式选择

### 临时邮箱 - 仅用于测试

```
❌ 不适合正式使用！原因：
   - 邮箱几小时后失效
   - 无法找回密码
   - 无法接收二次验证邮件
   - 无法修改密码
   - 部分平台拒绝临时邮箱

✅ 仅用于：测试流程是否正常
```

### 真实邮箱 (IMAP) - 推荐正式使用

```
✅ 推荐方式：
   方案 A: 用父母的邮箱注册（最简单）
          - 所有验证邮件发到父母邮箱
          - 父母可以管理、修改密码
          - 孩子长大后移交账号
   
   方案 B: 为孩子创建专用邮箱
          - 创建 childname2024@gmail.com
          - 设置自动转发到父母邮箱
          - 孩子长大后移交邮箱和账号
```

---

## Quick Start

### Step 1: 配置邮箱（推荐）

**Gmail 配置**（需要 App Password）：

1. 访问 https://myaccount.google.com/apppasswords
2. 选择"邮件"应用 → "其他(WelcomeBundle)"
3. 复制生成的 16 位密码

```bash
# .env
EMAIL_PROVIDER=gmail
EMAIL_USER=parent@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop  # App Password
PARENT_EMAIL=parent@gmail.com
```

### Step 2: 选择平台

```bash
# .env
ENABLED_PLATFORMS=github,steam,reddit

# 可选平台: github, gitlab, steam, epic_games, 
#           battlenet, nintendo, reddit, medium
```

### Step 3: 运行

```bash
npm install
npm run register
```

---

## 完整流程图

```
┌─────────────────────────────────────────────────────────┐
│  孩子出生前                                              │
│  ├─ 创建 Gmail App Password                             │
│  ├─ 配置 .env                                           │
│  └─ 测试: DRY_RUN=true                                  │
├─────────────────────────────────────────────────────────┤
│  孩子出生时 🎉                                           │
│  ├─ 发送 /register 到 Telegram Bot                      │
│  │   或                                                 │
│  ├─ 运行 npm run register                               │
│  └─ 系统自动执行:                                        │
│      • 打开浏览器                                        │
│      • 填写注册表单                                      │
│      • 用你的邮箱注册                                    │
│      • 自动读取验证邮件                                  │
│      • 自动点击验证链接                                  │
│      • 保存账号信息                                      │
├─────────────────────────────────────────────────────────┤
│  结果                                                    │
│  ├─ 账号创建时间 = 孩子生日                              │
│  ├─ 验证邮件发到你的邮箱                                  │
│  └─ 你可以随时管理这些账号                                │
└─────────────────────────────────────────────────────────┘
```

---

## Platform Selection

Choose which platforms to register:

```bash
# Enable specific platforms
ENABLED_PLATFORMS=github,reddit,steam,epic_games

# Or disable specific platforms
DISABLED_PLATFORMS=battlenet,nintendo
```

**Available Platforms**:
| Platform | Type | Username Style |
|----------|------|----------------|
| `github` | Developer | `{babyname}` |
| `gitlab` | Developer | `{babyname}` |
| `steam` | Gaming | `{babyname}_gaming` |
| `epic_games` | Gaming | `{babyname}` |
| `battlenet` | Gaming | `{babyname}` |
| `nintendo` | Gaming | `{babyname}` |
| `reddit` | Community | `{babyname}` |
| `medium` | Blog | `{babyname}` |

---

## Telegram Bot Setup

1. Open Telegram, find **@BotFather**
2. Send `/newbot` and follow instructions
3. Get your **Bot Token**
4. Send any message to your new bot
5. Visit: `https://api.telegram.org/bot<TOKEN>/getUpdates`
6. Find `"chat":{"id":123456789}` — that's your **Chat ID**

---

## Configuration

Edit `.env`:

```bash
# Run Mode
DRY_RUN=true   # Simulation mode
# DRY_RUN=false  # Actual registration

# Baby Information
BABY_NAME=Emma
LAST_NAME=Smith

# Parent Email (用于接收验证邮件)
PARENT_EMAIL=parent@gmail.com

# Email Verification (推荐使用真实邮箱)
EMAIL_PROVIDER=gmail
EMAIL_USER=parent@gmail.com
EMAIL_PASSWORD=your-app-password  # Gmail App Password

# Platform Selection
ENABLED_PLATFORMS=github,steam,reddit

# Security
ENCRYPTION_KEY=  # Run: openssl rand -base64 32

# Telegram Bot
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```

---

## Docker Deployment

```bash
./deploy.sh   # Build and start
./logs.sh     # View logs
./stop.sh     # Stop service
```

---

## Security

- ✅ All credentials are encrypted at rest
- ✅ Only whitelisted chat ID can trigger the bot
- ✅ No hardcoded secrets in code
- ✅ `.env` is excluded from git
- ⚠️ **Use App Passwords for Gmail, never your main password**
- ⚠️ **Never use temporary email for permanent accounts**

---

## FAQ

**Q: 为什么不用临时邮箱？**
A: 临时邮箱会失效，无法找回密码、无法接收验证邮件。正式使用必须用真实邮箱。

**Q: 用谁的邮箱注册？**
A: 建议用父母邮箱。孩子长大后，父母可以把账号移交给孩子。

**Q: Gmail 需要什么配置？**
A: 需要 App Password（不是 Gmail 密码）。在 Google 账户设置中创建。

**Q: 可以注册哪些平台？**
A: GitHub, GitLab, Steam, Epic Games, Battle.net, Nintendo, Reddit, Medium。更多平台正在添加。

---

## License

MIT License - Use responsibly and with love.

---

Made with ❤️ for parents who want to give their children a unique digital legacy.
