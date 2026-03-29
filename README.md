# 🎁 WelcomeBundle

> A digital welcome bundle for your newborn — automatically register gaming and platform accounts on their birth day.

## Why?

When your baby is born, you want to give them something special. A set of accounts created on their exact birth date — Steam, GitHub, Epic Games, Nintendo... Each account's creation timestamp becomes a permanent record of that moment.

**This is a time capsule. A digital gift. A "Welcome to the world."**

## Features

- 🎮 **8 Supported Platforms**: GitHub, GitLab, Steam, Epic Games, Battle.net, Nintendo, Reddit, Medium
- ✅ **Free Platform Selection**: Choose which platforms to register
- 🤖 **Telegram Bot**: Trigger registration from anywhere with a message
- 📧 **Auto Email Verification**: Automatic email verification via IMAP or temp email
- 🐳 **Docker Ready**: Deploy once, run forever
- ⏰ **Remote Trigger**: Start registration from your phone at the hospital
- 🔐 **Secure Storage**: Encrypted storage for credentials
- ✅ **Well Tested**: 50+ unit tests, all passing

## Quick Start

### Method 1: Docker (Recommended for Production)

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

### Method 2: Local Test (Recommended for Testing)

```bash
# Clone
git clone https://github.com/HetuPrime/welcomebundle.git
cd welcomebundle

# Configure for testing
cp .env.example .env
# Edit .env and set DRY_RUN=true

# Install and test
npm install
npm test

# Dry run (simulation, no actual registration)
npm run register
```

## Email Verification Automation

### Method 1: Temporary Email (Default)

No configuration needed. The system automatically creates temporary email addresses for verification.

**Pros**: Zero setup
**Cons**: Some platforms may not accept temporary emails

### Method 2: IMAP Email (Recommended)

Connect your real email account to automatically receive verification emails.

**Gmail Setup**:
1. Go to https://myaccount.google.com/apppasswords
2. Create an App Password for "Mail" → "WelcomeBundle"
3. Add to `.env`:
   ```bash
   EMAIL_PROVIDER=gmail
   EMAIL_USER=yourname@gmail.com
   EMAIL_PASSWORD=abcd efgh ijkl mnop  # Your App Password
   ```

**Outlook Setup**:
```bash
EMAIL_PROVIDER=outlook
EMAIL_USER=yourname@outlook.com
EMAIL_PASSWORD=your-password
```

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

**Default**: `github`, `steam`, `epic_games`

## Telegram Bot Setup

1. Open Telegram, find **@BotFather**
2. Send `/newbot` and follow instructions
3. Get your **Bot Token**
4. Send any message to your new bot
5. Visit: `https://api.telegram.org/bot<TOKEN>/getUpdates`
6. Find `"chat":{"id":123456789}` — that's your **Chat ID**
7. Add to `.env`:
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

## Configuration

Edit `.env`:

```bash
# Run Mode
DRY_RUN=true   # Simulation mode
# DRY_RUN=false  # Actual registration

# Baby Information
BABY_NAME=Emma
LAST_NAME=Smith

# Parent Email
PARENT_EMAIL=your@email.com

# Platform Selection
ENABLED_PLATFORMS=github,steam,reddit

# Email Verification (Method 2)
EMAIL_PROVIDER=gmail
EMAIL_USER=yourname@gmail.com
EMAIL_PASSWORD=your-app-password

# Security
ENCRYPTION_KEY=  # Run: openssl rand -base64 32

# Telegram Bot
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```

## Docker Commands

```bash
./deploy.sh   # Build and start
./logs.sh     # View logs
./stop.sh     # Stop service
```

## Development

```bash
npm install           # Install dependencies
npm test              # Run tests
npm run test:coverage # Run tests with coverage
npm run register      # Run registration (DRY_RUN mode)
```

## Security

- ✅ All credentials are encrypted at rest
- ✅ Only whitelisted chat ID can trigger the bot
- ✅ No hardcoded secrets in code
- ✅ `.env` is excluded from git
- ⚠️ Use App Passwords for Gmail, never your main password

## Disclaimer

- This tool is for personal use only
- Creating accounts with your own identity is legal
- Check each platform's Terms of Service before use
- The authors are not responsible for any account suspensions

## License

MIT License - Use responsibly and with love.

---

Made with ❤️ for parents who want to give their children a unique digital legacy.
