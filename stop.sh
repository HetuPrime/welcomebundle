#!/bin/bash

# 停止并清理

echo "🛑 停止 WelcomeBundle..."
docker-compose down

echo ""
echo "清理数据? (y/N)"
read -r response

if [[ "$response" =~ ^[Yy]$ ]]; then
    echo "🗑️  删除数据..."
    rm -rf data/
fi

echo "✅ 完成"
