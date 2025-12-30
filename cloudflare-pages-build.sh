#!/bin/bash
# Cloudflare Pages 构建脚本（可选，如果默认构建失败可以使用）

# 安装依赖
npm ci

# 构建项目
npm run build

# 检查构建输出
if [ -d "dist" ]; then
  echo "✅ 构建成功！输出目录: dist/"
  ls -la dist/
else
  echo "❌ 构建失败！dist 目录不存在"
  exit 1
fi

