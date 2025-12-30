# 🚀 快速部署到 Cloudflare Pages

## 5 分钟快速部署

### 1️⃣ 准备 GitHub 仓库
```bash
git add .
git commit -m "准备部署到 Cloudflare"
git push
```

### 2️⃣ 获取 Gemini API Key
- 访问：https://makersuite.google.com/app/apikey
- 创建 API Key 并复制

### 3️⃣ 在 Cloudflare Pages 部署

1. **登录 Cloudflare**
   - 访问：https://dash.cloudflare.com/
   - 注册/登录账号（免费）

2. **创建 Pages 项目**
   - 点击左侧 **"Workers & Pages"**
   - 点击 **"Create application"** → **"Pages"** → **"Connect to Git"**
   - 选择 **GitHub**，授权并选择你的仓库

3. **配置构建设置**
   ```
   Build command:    npm run build
   Build output dir: dist
   Root directory:    (留空)
   ```

4. **添加环境变量**
   - 在 "Environment variables" 部分
   - 添加变量：`GEMINI_API_KEY` = `你的API密钥`
   - 勾选：Production 和 Preview

5. **部署**
   - 点击 **"Save and Deploy"**
   - 等待 2-5 分钟构建完成

### 4️⃣ 完成！
你的应用将在 `https://你的项目名.pages.dev` 可访问

---

## ⚠️ 重要提示

1. **API Key 安全**：当前配置会将 API Key 暴露在前端，仅适用于演示
2. **配额限制**：注意 Gemini API 的使用配额
3. **路由问题**：已添加 `_redirects` 文件处理 SPA 路由

---

## 🔧 如果构建失败

检查以下几点：
- ✅ Node.js 版本（Cloudflare 默认使用 18+）
- ✅ 环境变量是否正确配置
- ✅ 查看构建日志中的错误信息

详细说明请查看 [DEPLOY.md](./DEPLOY.md)

