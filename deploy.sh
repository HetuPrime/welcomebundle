#!/bin/bash

# WelcomeBundle Docker 部署脚本

set -e

echo "🎁 WelcomeBundle Docker 部署"
echo "=============================="

# 检查 .env 文件
if [ ! -f .env ]; then
    echo "❌ 未找到 .env 文件"
    echo "请先复制 .env.example 并填写配置："
    echo "  cp .env.example .env"
    echo "  nano .env"
    exit 1
fi

# 检查必要的环境变量
source .env

if [ -z "$BABY_NAME" ] || [ -z "$PARENT_EMAIL" ]; then
    echo "❌ 请在 .env 中设置 BABY_NAME 和 PARENT_EMAIL"
    exit 1
fi

if [ -z "$ENCRYPTION_KEY" ]; then
    echo "❌ 请在 .env 中设置 ENCRYPTION_KEY"
    echo "运行: openssl rand -base64 32"
    exit 1
fi

if [ -z "$TELEGRAM_BOT_TOKEN" ] || [ -z "$TELEGRAM_CHAT_ID" ]; then
    echo "⚠️  未设置 Telegram Bot 配置"
    echo "将使用命令行模式"
fi

# 创建数据目录
mkdir -p data

# 构建并启动
echo ""
echo "🏗️  构建 Docker 镜像..."
docker-compose build

echo ""
echo "🚀 启动服务..."
docker-compose up -d

echo ""
echo "✅ 部署完成!"
echo ""
echo "查看日志:"
echo "  docker-compose logs -f"
echo ""
echo "停止服务:"
echo "  docker-compose down"
echo ""
