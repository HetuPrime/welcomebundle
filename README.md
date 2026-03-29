# 🎁 WelcomeBundle

> 当孩子来到这个世界的那一刻，世界是什么样子？

**输入孩子的出生时间，生成一张有温度的"数字出生证明"**

---

## ✨ 它是什么？

WelcomeBundle 是一个**数字出生证明生成器**——为孩子记录她来到这个世界的那一刻，世界是什么样子。

```
┌────────────────────────────────────────┐
│                                        │
│  🎂 Emma                               │
│  ──────────────────────                │
│  数字世界的第一天                      │
│                                        │
│  2024.03.29  14:30                     │
│  ♈ 白羊座  🐲 龙年  📍北京            │
│                                        │
│  ──────────────────────                │
│  ☀️ 这一天的天气                       │
│  晴  18°C  微风                        │
│                                        │
│  ──────────────────────                │
│  📰 这一天，世界在发生                 │
│  • [正向新闻1]                         │
│  • [正向新闻2]                         │
│                                        │
│  ──────────────────────                │
│  📜 历史上的今天                       │
│  • 1973年 越战结束                     │
│                                        │
│  ──────────────────────                │
│  👤 同日出生的名人                      │
│  • Elvis Presley (1935)                │
│                                        │
│  ──────────────────────                │
│  🎵 那一天，世界在听                   │
│  Flowers - Miley Cyrus                 │
│                                        │
│           welcomebundle.dev            │
│                                        │
└────────────────────────────────────────┘
```

---

## 🎯 核心价值

| 维度 | 说明 |
|------|------|
| 情感价值 | 记录孩子来到这个世界的那一刻 |
| 纪念意义 | 可打印、可分享、可保存 |
| 社交货币 | 精美的卡片适合分享 |
| 仪式感 | 父母为孩子准备的第一份数字礼物 |

---

## 🚀 快速开始

### 安装

```bash
git clone https://github.com/HetuPrime/welcomebundle.git
cd welcomebundle
npm install
```

### 生成证明

```bash
# 基础用法
npm run proof -- --name=Emma --date=2024-03-29

# 完整用法
npm run proof -- \
  --name=Emma \
  --date=2024-03-29 \
  --time=14:30 \
  --location="北京" \
  --message="愿你在数字世界里，自由生长"
```

### 配置 API Keys（可选）

```bash
# .env
OPENWEATHER_API_KEY=xxx      # 天气数据
NEWS_API_KEY=xxx             # 新闻数据
SPOTIFY_ACCESS_TOKEN=xxx     # 热歌数据
```

不配置 API Keys 也能用，会使用默认数据。

---

## 📊 卡片包含什么？

| 区块 | 数据 | 说明 |
|------|------|------|
| 基本信息 | 名字、日期、时间、地点 | 用户输入 |
| 星座生肖 | 根据日期计算 | 自动生成 |
| 天气 | 出生当日天气 | OpenWeatherMap |
| 新闻 | 3条正向新闻 | NewsAPI + 过滤 |
| 历史事件 | 2-3条历史事件 | Wikipedia |
| 同日名人 | 2-3位名人 | Wikipedia |
| 热歌 | 1首热门歌曲 | Spotify/Billboard |
| 父母寄语 | 自定义文字 | 用户输入 |

---

## 🎨 卡片风格

提供多种风格：

| 风格 | 特点 | 适合 |
|------|------|------|
| 简约现代 | 干净、留白多 | 喜欢简洁的父母 |
| 复古证书 | 边框、装饰纹 | 喜欢仪式感、打印保存 |
| 插画可爱 | 手绘风格、柔和色彩 | 年轻父母、女孩宝宝 |
| 暗色高级 | 深色背景、金色点缀 | 喜欢高级感 |

---

## 📱 输出格式

| 格式 | 用途 |
|------|------|
| PNG | 社交分享（推荐） |
| PDF | 打印保存 |
| HTML | 可交互版本 |

---

## ⚙️ API 集成

### 天气数据

```javascript
// OpenWeatherMap History API
const weather = await getWeather('北京', '2024-03-29');
// { condition: '晴', temp: 18, wind: '微风' }
```

### 新闻数据

```javascript
// NewsAPI + 正向过滤
const news = await getNews('2024-03-29');
// [{ title: '...', source: '...' }, ...]
```

### 历史事件

```javascript
// Wikipedia On This Day
const history = await getHistory('03-29');
// [{ year: 1973, text: '越战结束' }, ...]
```

### 热门歌曲

```javascript
// Spotify Top 50
const song = await getTopSong('2024-03-29');
// { title: 'Flowers', artist: 'Miley Cyrus' }
```

---

## 🔧 命令行工具

```bash
# 生成数字出生证明
npm run proof -- --name=Emma --date=2024-03-29

# 指定输出格式
npm run proof -- --name=Emma --date=2024-03-29 --format=pdf

# 选择风格
npm run proof -- --name=Emma --date=2024-03-29 --style=vintage

# 完整参数
npm run proof -- \
  --name=Emma \              # 宝宝名字
  --date=2024-03-29 \        # 出生日期
  --time=14:30 \             # 出生时间
  --location=北京 \          # 出生地点
  --message="愿你的世界充满爱" \  # 父母寄语
  --style=modern \           # 卡片风格
  --format=png               # 输出格式
```

---

## 🛠️ 技术栈

- **语言**: TypeScript
- **运行时**: Node.js
- **渲染**: Canvas / html2canvas
- **APIs**: OpenWeatherMap, NewsAPI, Wikipedia, Spotify
- **成本**: $0（使用免费 API）

---

## 📁 项目结构

```
welcomebundle/
├── src/
│   ├── core/
│   │   ├── proof.ts          # 出生证明生成
│   │   ├── api/
│   │   │   ├── weather.ts    # 天气 API
│   │   │   ├── news.ts       # 新闻 API
│   │   │   ├── history.ts    # 历史事件 API
│   │   │   └── music.ts      # 热歌 API
│   │   └── utils/
│   │       ├── zodiac.ts     # 星座生肖
│   │       └── filter.ts     # 新闻过滤
│   ├── cli-proof.ts          # CLI 工具
│   └── index.ts              # 入口
├── output/
│   └── proofs/               # 生成的证明
└── README.md
```

---

## ⚠️ 重要说明

- 所有数据仅在本地处理
- 不存储用户输入的信息
- 不需要注册/登录
- API Keys 仅用于获取公开数据

---

## 📄 许可证

MIT License

---

<div align="center">

Made with ❤️ for parents

**让每一个新生命，都有一份独特的数字纪念**

</div>
