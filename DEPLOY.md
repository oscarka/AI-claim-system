# Cloudflare Pages 部署指南

## 📋 部署前准备

### 1. 必需准备
- ✅ GitHub 账号（用于连接 Cloudflare Pages）
- ✅ Cloudflare 账号（免费注册：https://dash.cloudflare.com/sign-up）
- ✅ Google Gemini API Key（获取地址：https://makersuite.google.com/app/apikey）

### 2. 获取 Gemini API Key
1. 访问 https://makersuite.google.com/app/apikey
2. 登录 Google 账号
3. 点击 "Create API Key"
4. 复制生成的 API Key（格式类似：`AIza...`）

---

## 🚀 部署步骤

### 方法一：通过 Cloudflare Dashboard（推荐）

#### 步骤 1：推送代码到 GitHub
```bash
# 如果还没有 GitHub 仓库
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/你的用户名/AI-claim-system.git
git push -u origin main
```

#### 步骤 2：连接 Cloudflare Pages
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 点击左侧菜单 **"Workers & Pages"**
3. 点击 **"Create application"** → **"Pages"** → **"Connect to Git"**
4. 选择 **GitHub**，授权 Cloudflare 访问你的仓库
5. 选择仓库：`你的用户名/AI-claim-system`
6. 点击 **"Begin setup"**

#### 步骤 3：配置构建设置
在构建配置页面填写：

- **Project name**: `ai-claim-system`（或自定义）
- **Production branch**: `main`（或 `master`）
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/`（留空或填写 `/`）

#### 步骤 4：配置环境变量
在 **"Environment variables"** 部分添加：

| 变量名 | 值 | 环境 |
|--------|-----|------|
| `GEMINI_API_KEY` | 你的 Gemini API Key | Production, Preview |

⚠️ **重要提示**：
- API Key 会暴露在前端代码中，仅适用于演示项目
- 生产环境建议使用 Cloudflare Workers 作为后端代理

#### 步骤 5：部署
1. 点击 **"Save and Deploy"**
2. 等待构建完成（通常 2-5 分钟）
3. 部署成功后，你会得到一个 URL：`https://你的项目名.pages.dev`

---

### 方法二：使用 Wrangler CLI

#### 安装 Wrangler
```bash
npm install -g wrangler
```

#### 登录 Cloudflare
```bash
wrangler login
```

#### 配置环境变量
```bash
# 在项目根目录创建 .dev.vars 文件（仅本地开发使用）
echo "GEMINI_API_KEY=你的API密钥" > .dev.vars
```

#### 部署
```bash
npm run build
wrangler pages deploy dist --project-name=ai-claim-system
```

---

## 🔧 构建配置说明

### Vite 构建配置
项目使用 Vite 构建，配置文件：`vite.config.ts`

- **输出目录**: `dist/`
- **构建命令**: `npm run build`
- **预览命令**: `npm run preview`（本地测试构建结果）

### 环境变量处理
- 构建时，`GEMINI_API_KEY` 会被注入到前端代码中
- 变量通过 `process.env.GEMINI_API_KEY` 访问
- ⚠️ **安全警告**：API Key 会暴露在浏览器中，任何人都可以看到

---

## 🌐 自定义域名（可选）

### 添加自定义域名
1. 在 Cloudflare Pages 项目设置中
2. 点击 **"Custom domains"**
3. 输入你的域名（如：`claims.yourdomain.com`）
4. 按照提示配置 DNS 记录

---

## 🔍 故障排查

### 构建失败
- 检查 Node.js 版本（需要 18+）
- 查看构建日志中的错误信息
- 确认 `package.json` 中的依赖是否正确

### API 调用失败
- 检查环境变量是否正确配置
- 确认 Gemini API Key 是否有效
- 查看浏览器控制台的错误信息

### 页面路由 404
- 确认 `_redirects` 文件已添加到项目根目录
- 检查 Cloudflare Pages 的构建输出目录是否为 `dist`

---

## 📝 注意事项

### ⚠️ 安全警告
1. **API Key 暴露**：当前配置会将 API Key 暴露在前端代码中
   - 适用于：演示、测试、内部使用
   - 不适用于：生产环境、公开访问的应用

2. **API 配额限制**：Gemini API 有使用限制
   - 免费版有每日/每月配额
   - 建议设置使用监控

### 💡 改进建议
如果需要在生产环境使用，建议：
1. 使用 Cloudflare Workers 作为后端代理
2. 在 Worker 中调用 Gemini API
3. 前端只调用 Worker，不直接调用 Gemini API

---

## 📚 相关链接

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)
- [Google Gemini API 文档](https://ai.google.dev/docs)

---

## ✅ 部署检查清单

- [ ] 代码已推送到 GitHub
- [ ] Cloudflare 账号已创建
- [ ] Gemini API Key 已获取
- [ ] 环境变量已配置
- [ ] 构建命令和输出目录已设置
- [ ] `_redirects` 文件已添加
- [ ] 部署成功，可以访问
- [ ] 功能测试通过

---

**部署完成后，你的应用将在 `https://你的项目名.pages.dev` 可访问！** 🎉

