# 🎁 WelcomeBundle

> 当孩子还在摇篮里，你已经在为她准备数字世界的一席之地

---

## ✨ 它是什么？

WelcomeBundle 是一份**数字出生礼包**——在孩子出生的那一天，为她创建数字身份、封存时间胶囊、生成精美的数字出生证明。

```
🎂 孩子出生那天
    ↓
🎫 自动注册 GitHub、Steam、Reddit 等账号
    ↓
📜 生成数字出生证明（可打印、可分享）
    ↓
💌 封存父母的信和视频（18年后解锁）
    ↓
🎉 一份陪伴孩子一生的数字礼物
```

---

## 🎬 使用场景

> **场景一**
> 
> 孩子出生的那天，你运行 WelcomeBundle。
> 它为她注册了第一个 GitHub 账号、第一个 Steam 账号...
> 同时生成了一张精美的"数字出生证明"。
> 
> 你把证明打印出来，和出生证一起放进相册。

> **场景二**
> 
> 你写了一封信给孩子，录了一段视频，
> 封存在时间胶囊里。
> 
> 18年后，她收到邮件提醒，打开时间胶囊，
> 看到你在 18 年前为她准备的一切。

---

## 🚀 快速开始

### Step 1: 创建孩子的邮箱

```
推荐 Gmail：
  邮箱名：孩子的名字 + 出生年份
  例如：emma2024@gmail.com
```

### Step 2: 获取 Gmail App Password

1. 访问 https://myaccount.google.com/apppasswords
2. 选择"邮件" → "其他(WelcomeBundle)"
3. 复制生成的 16 位密码

### Step 3: 配置

```bash
# 克隆项目
git clone https://github.com/HetuPrime/welcomebundle.git
cd welcomebundle

# 配置
cp .env.example .env
nano .env
```

```bash
# .env
BABY_NAME=Emma
LAST_NAME=Smith
PARENT_EMAIL=emma2024@gmail.com

EMAIL_PROVIDER=gmail
EMAIL_USER=emma2024@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop

ENABLED_PLATFORMS=github,steam,reddit
```

### Step 4: 运行

```bash
npm install
npm run register
```

---

## 🎁 它能做什么？

| 功能 | 说明 |
|------|------|
| 🎫 **数字身份** | 为孩子注册 GitHub、Steam、Reddit 等账号 |
| 📜 **出生证明** | 生成精美的数字出生证明（PNG/PDF） |
| 💌 **时间胶囊** | 封存父母的信，18年后解锁 |
| 📅 **成长时间线** | 每年发送提醒邮件 |
| 🌍 **数字足迹** | 记录当天的天气、新闻、热歌 |

---

## 📜 数字出生证明

注册完成后，自动生成一张精美的证明：

```
┌────────────────────────────────────┐
│                                    │
│     🎂 Emma 的数字出生证明          │
│                                    │
│     注册时间: 2024-03-29 21:06:42  │
│                                    │
│     ━━━━━ 数字身份 ━━━━━           │
│                                    │
│     ✓ GitHub    @emma             │
│     ✓ Steam     emma_gaming       │
│     ✓ Reddit    u/emma            │
│                                    │
│     ━━━━━ 数字足迹 ━━━━━           │
│                                    │
│     ☀️ 天气: 晴 18°C               │
│     📰 新闻: [当日头条]            │
│     🎵 热歌: [Spotify Top 1]       │
│                                    │
│     created with ❤️               │
│     welcomebundle.dev              │
│                                    │
└────────────────────────────────────┘
```

---

## 📱 Telegram Bot

远程触发，医院里也能用：

```
👋 欢迎来到 WelcomeBundle！

请告诉我宝宝的名字: Emma

🎉 Emma！多美的名字！
正在为 Emma 准备数字出生礼包...

━━━━━━━━━━━━━━━━━━━━
🎫 创建数字身份...
━━━━━━━━━━━━━━━━━━━━

✨ GitHub
   ✓ 用户名: @emma
   ✓ 注册时间: 2024-03-29 21:06
   🎊 Emma 的第一个开发者身份！

🎮 Steam  
   ✓ 用户名: emma_gaming
   🎊 游戏之旅从这里开始！

━━━━━━━━━━━━━━━━━━━━
🎁 Emma 的数字出生礼包完成！

📊 查看出生证明: /proof
📤 分享给朋友: /share
💌 封存更多内容: /capsule
━━━━━━━━━━━━━━━━━━━━
```

---

## 🎮 支持的平台

| 平台 | 类型 | 用户名格式 |
|------|------|-----------|
| GitHub | 开发者 | `{babyname}` |
| GitLab | 开发者 | `{babyname}` |
| Steam | 游戏 | `{babyname}_gaming` |
| Epic Games | 游戏 | `{babyname}` |
| Battle.net | 游戏 | `{babyname}` |
| Nintendo | 游戏 | `{babyname}` |
| Reddit | 社区 | `{babyname}` |
| Medium | 博客 | `{babyname}` |

---

## 🐳 Docker 部署

```bash
./deploy.sh   # 启动
./logs.sh     # 查看日志
./stop.sh     # 停止
```

---

## ⚠️ 重要提醒

- **使用孩子的邮箱注册**，方便日后移交
- **使用 Gmail App Password**，不要用主密码
- **妥善保管加密密钥**，丢失无法恢复时间胶囊
- **检查平台服务条款**，确保合规使用

---

## 🛠️ 开发

```bash
npm install           # 安装依赖
npm test              # 运行测试
npm run register      # 运行注册
```

---

## 📄 许可证

MIT License

---

<div align="center">

Made with ❤️ for parents

**让每一个新生命，都有一份数字世界的欢迎礼**

</div>
