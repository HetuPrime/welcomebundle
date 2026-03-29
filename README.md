# 🎁 WelcomeBundle

> A digital welcome bundle for your newborn — automatically register gaming and platform accounts on their birth day.

## Why?

When your baby is born, you want to give them something special. A set of accounts created on their exact birth date — Steam, GitHub, Epic Games, Nintendo... Each account's creation timestamp becomes a permanent record of that moment.

**This is a time capsule. A digital gift. A "Welcome to the world."**

## Features

- 🎮 **Gaming Platforms**: Steam, Epic Games, Battle.net, Nintendo, PlayStation, Xbox
- 💻 **Dev Platforms**: GitHub, GitLab
- 🌐 **Community**: Reddit, Medium, Discord
- 🤖 **Telegram Bot**: Trigger registration from anywhere with a message
- ⏰ **Remote Trigger**: Start registration from your phone at the hospital
- 📋 **Pre-configuration**: Fill in account info beforehand, one-click execution
- 🔐 **Secure Storage**: Encrypted storage for credentials

## Quick Start

### Method 1: Local Command Line

```bash
# Clone
git clone https://github.com/HetuPrime/welcomebundle.git
cd welcomebundle

# Install
npm install
npx playwright install chromium

# Configure
cp .env.example .env
# Edit .env with your preferences

# Run when baby is born
npm run register
```

### Method 2: Telegram Bot (Recommended)

Perfect for triggering from your phone at the hospital!

```bash
# 1. Create a Telegram Bot
# - Open Telegram, find @BotFather
# - Send /newbot and follow instructions
# - Get your Bot Token

# 2. Get your Chat ID
# - Send any message to your new bot
# - Visit: https://api.telegram.org/bot<TOKEN>/getUpdates
# - Find "chat":{"id":123456789} - that's your Chat ID

# 3. Configure
cp .env.example .env
# Edit .env and fill in:
# - TELEGRAM_BOT_TOKEN=your-bot-token
# - TELEGRAM_CHAT_ID=your-chat-id
# - BABY_NAME=Emma
# - PARENT_EMAIL=your@email.com

# 4. Start the bot
npm run bot
```

Now at the hospital, just send `/register` to your bot!

## Telegram Bot Commands

| Command | Description |
|---------|-------------|
| `/start` | Show configured platforms |
| `/register` | Start account registration |
| `/status` | Check current status |
| `/help` | Show help message |

## How It Works

```
┌─────────────────────────────────────────────────────────┐
│  Before Birth (During Pregnancy)                        │
│  ├─ Clone and install the project                       │
│  ├─ Configure baby name and parent email                │
│  ├─ Set up Telegram bot (optional)                      │
│  └─ Test with dry-run                                   │
├─────────────────────────────────────────────────────────┤
│  On Birth Day 🎉                                         │
│  ├─ Option A: Run `npm run register` on computer        │
│  ├─ Option B: Send `/register` to Telegram bot          │
│  └─ Bot opens browser and starts registration           │
├─────────────────────────────────────────────────────────┤
│  Result                                                  │
│  ├─ Accounts created with birth timestamp              │
│  ├─ Credentials saved to encrypted vault               │
│  └─ Telegram notification with summary                 │
└─────────────────────────────────────────────────────────┘
```

## Platform Support

### ✅ Fully Supported (Email Only)

| Platform | Status | Notes |
|----------|--------|-------|
| GitHub | ✅ | Dev platform, email verification |
| GitLab | ✅ | Dev platform |
| Epic Games | ✅ | Gaming, email + DOB |
| Steam | ✅ | Gaming, email verification |
| Reddit | ✅ | Community, email optional |
| Medium | ✅ | Blogging |

### ⚠️ Requires Attention

| Platform | Status | Notes |
|----------|--------|-------|
| Battle.net | ⚠️ | May trigger captcha |
| Nintendo | ⚠️ | Email verification |
| PlayStation | ⚠️ | Email verification |
| Discord | ⚠️ | May require phone |
| Xbox/Microsoft | ⚠️ | May require phone |

### ❌ Not Supported

| Platform | Reason |
|----------|--------|
| 微信/微博 | Real-name verification required |
| Telegram | Phone verification required |
| Twitter/X | High risk of ban |

## Configuration

Edit `.env` file:

```bash
# Baby Information
BABY_NAME=Emma
BABY_EXPECTED_DATE=2024-06-01

# Parent Contact
PARENT_EMAIL=your@email.com
LAST_NAME=Smith

# Security (required)
ENCRYPTION_KEY=  # Run: openssl rand -base64 32

# Telegram Bot (optional)
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=123456789
```

## Security

- ✅ All credentials are encrypted at rest
- ✅ No plain-text passwords in config
- ✅ Only you can access your bot (chat ID whitelist)
- ⚠️ Recommended: Use a dedicated email for verification

## Disclaimer

- This tool is for personal use only
- Creating accounts with your own identity is legal
- Check each platform's Terms of Service before use
- The authors are not responsible for any account suspensions

## License

MIT License - Use responsibly and with love.

---

Made with ❤️ for parents who want to give their children a unique digital legacy.
