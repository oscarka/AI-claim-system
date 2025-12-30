<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/12MsQT_4FmVApHJ1zipcSjdt6zBZGzxCl

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to Cloudflare Pages

快速部署到 Cloudflare Pages，让其他人可以访问你的应用。

📖 **详细部署指南**: 查看 [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) 或 [DEPLOY.md](./DEPLOY.md)

**快速步骤**:
1. 推送代码到 GitHub
2. 在 Cloudflare Pages 连接仓库
3. 配置环境变量 `GEMINI_API_KEY`
4. 部署完成！

**获取 Gemini API Key**: https://makersuite.google.com/app/apikey
