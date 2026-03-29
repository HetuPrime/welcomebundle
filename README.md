# 🎁 WelcomeBundle

> A digital welcome bundle for your newborn — automatically register gaming and platform accounts on their birth day.

## Why?

When your baby is born, you want to give them something special. A set of accounts created on their exact birth date — Steam, GitHub, Epic Games, Nintendo... Each account's creation timestamp becomes a permanent record of that moment.

**This is a time capsule. A digital gift. A "Welcome to the world."**

## Features

- 🎮 **8 Supported Platforms**: GitHub, GitLab, Steam, Epic Games, Battle.net, Nintendo, Reddit, Medium
- ✅ **Free Platform Selection**: Choose which platforms to register
- 🤖 **Telegram Bot**: Trigger registration from anywhere with a message
- 📧 **Temp Email**: Automatic verification code handling
- 🐳 **Docker Ready**: Deploy once, run forever
- ⏰ **Remote Trigger**: Start registration from your phone at the hospital
- 🔐 **Secure Storage**: Encrypted storage for credentials
- ✅ **Well Tested**: 40+ unit tests, all passing

## Quick Start

### Method 1: Docker (Recommended)

```bash
# Clone
git clone https://github.com/HetuPrime/welcomebundle.git
cd welcomebundle

# Configure
cp .env.example .env
nano .env  # Fill in your values

# Deploy
chmod +x deploy.sh
./deploy.sh

# View logs
./logs.sh
```

### Method 2: Local

```bash
# Clone
git clone https://github.com/HetuPrime/welcomebundle.git
cd welcomebundle

# Install
npm install
npx playwright install chromium

# Configure
cp .env.example .env
nano .env

# Run
npm run bot    # Telegram bot mode
# or
npm run register  # One-time run
```

## Platform Selection

You can freely choose which platforms to register:

### Method 1: Enable Specific Platforms

```bash
# .env
ENABLED_PLATFORMS=github,reddit,steam,epic_games
```

### Method 2: Disable Specific Platforms

```bash
# .env
DISABLED_PLATFORMS=battlenet,nintendo
```

### Available Platforms

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

**Default**: `github`, `steam`, `epic_games`

### Priority

If both `ENABLED_PLATFORMS` and `DISABLED_PLATFORMS` are set, `ENABLED_PLATFORMS` takes priority.

## Telegram Bot Setup

1. Open Telegram, find **@BotFather**
2. Send `/newbot` and follow instructions
3. Get your **Bot Token**
4. Send any message to your new bot
5. Visit: `https://api.telegram.org/bot<TOKEN>/getUpdates`
6. Find `"chat":{"id":123456789}` — that's your **Chat ID**
7. Fill in `.env`:
   ```
   TELEGRAM_BOT_TOKEN=your-token
   TELEGRAM_CHAT_ID=your-chat-id
   ```

## Bot Commands

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
│  ├─ Clone and configure the project                     │
│  ├─ Set up Telegram bot                                 │
│  ├─ Deploy to server (Docker)                           │
│  └─ Bot waits for /register command                     │
├─────────────────────────────────────────────────────────┤
│  On Birth Day 🎉                                         │
│  ├─ Open Telegram on your phone                         │
│  ├─ Send /register to your bot                          │
│  └─ Bot runs on your server                             │
├─────────────────────────────────────────────────────────┤
│  Result                                                  │
│  ├─ Accounts created with birth timestamp              │
│  ├─ Credentials saved to encrypted vault               │
│  └─ Telegram notification with summary                 │
└─────────────────────────────────────────────────────────┘
```

## Configuration

Edit `.env`:

```bash
# Baby Information
BABY_NAME=Emma
LAST_NAME=Smith

# Parent Email (for verification links)
PARENT_EMAIL=your@email.com

# Platform Selection
ENABLED_PLATFORMS=github,steam,reddit,epic_games
# or
# DISABLED_PLATFORMS=battlenet,nintendo

# Security
ENCRYPTION_KEY=  # Run: openssl rand -base64 32

# Telegram Bot
TELEGRAM_BOT_TOKEN=123456789:ABC...
TELEGRAM_CHAT_ID=123456789

# Optional: Use temp email for auto-verification
USE_TEMP_EMAIL=false
```

## Docker Commands

```bash
# Deploy
./deploy.sh

# View logs
./logs.sh

# Stop
./stop.sh

# Or use docker-compose directly
docker-compose up -d
docker-compose logs -f
docker-compose down
```

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Build
npm run build
```

## Security

- ✅ All credentials are encrypted at rest
- ✅ Only whitelisted chat ID can trigger the bot
- ✅ Docker container runs with minimal privileges
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
