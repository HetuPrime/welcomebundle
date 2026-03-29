# 🎁 WelcomeBundle

> A digital welcome bundle for your newborn — automatically register gaming and platform accounts on their birth day.

## Why?

When your baby is born, you want to give them something special. A set of accounts created on their exact birth date — Steam, GitHub, Epic Games, Nintendo... Each account's creation timestamp becomes a permanent record of that moment.

**This is a time capsule. A digital gift. A "Welcome to the world."**

## Features

- 🎮 **Gaming Platforms**: Steam, Epic Games, Battle.net, Nintendo, PlayStation, Xbox
- 💻 **Dev Platforms**: GitHub, GitLab
- 🌐 **Community**: Reddit, Medium, Discord
- ⏰ **Trigger System**: Manual trigger or webhook when the baby is born
- 📋 **Pre-configuration**: Fill in account info beforehand, one-click execution
- 🔐 **Secure Storage**: Encrypted storage for credentials

## Quick Start

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

# Run
npm run register
```

## How It Works

```
┌─────────────────────────────────────────────────────────┐
│  Before Birth                                           │
│  ├─ Select platforms you want to register              │
│  ├─ Fill in desired usernames and emails               │
│  └─ Save configuration (encrypted)                     │
├─────────────────────────────────────────────────────────┤
│  On Birth Day                                           │
│  ├─ Send message to trigger (Telegram/HTTP)            │
│  ├─ Or press the "Execute" button                      │
│  └─ Bot starts registration                            │
├─────────────────────────────────────────────────────────┤
│  Result                                                 │
│  ├─ Accounts created with birth timestamp              │
│  ├─ Credentials saved to encrypted vault               │
│  └─ Generate "Digital Birth Card"                      │
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

Edit `config/platforms.yaml`:

```yaml
platforms:
  - name: github
    enabled: true
    username: ${BABY_NAME}
    email: ${PARENT_EMAIL}
    
  - name: steam
    enabled: true
    username: ${BABY_NAME}_gaming
    email: ${PARENT_EMAIL}
    
  - name: epic_games
    enabled: true
    username: ${BABY_NAME}
    email: ${PARENT_EMAIL}
    dob: ${BABY_DOB}
```

## Security

- All credentials are encrypted at rest
- No plain-text passwords in config
- Temporary email services supported for verification
- Recommended: Use a dedicated email for this purpose

## Disclaimer

- This tool is for personal use only
- Creating accounts with your own identity is legal
- Check each platform's Terms of Service before use
- The authors are not responsible for any account suspensions

## License

MIT License - Use responsibly and with love.

---

Made with ❤️ for parents who want to give their children a unique digital legacy.
