#!/bin/bash

# WelcomeBundle 本地测试脚本

set -e

echo "🎁 WelcomeBundle 本地测试"
echo "=============================="
echo ""

# 检查是否已安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
fi

# 创建测试配置
if [ ! -f ".env" ]; then
    echo "📝 创建测试配置..."
    cp .env.test .env
    echo ""
    echo "✅ 已创建 .env 文件（测试模式）"
    echo ""
    echo "当前配置:"
    echo "  - DRY_RUN=true (模拟模式，不会实际注册)"
    echo "  - ENABLED_PLATFORMS=github,reddit"
    echo "  - BABY_NAME=TestBaby"
    echo ""
fi

# 运行测试
echo "🧪 运行单元测试..."
npm test

echo ""
echo "🚀 运行 DRY RUN 测试..."
npm run register

echo ""
echo "✅ 测试完成!"
echo ""
echo "要实际执行注册:"
echo "  1. 编辑 .env 文件"
echo "  2. 设置 DRY_RUN=false"
echo "  3. 填写真实的 PARENT_EMAIL"
echo "  4. 设置 ENABLED_PLATFORMS 为你想注册的平台"
echo "  5. 运行: npm run register"
echo ""
