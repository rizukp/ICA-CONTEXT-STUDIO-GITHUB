# Quick Start Guide
## Get Running in 10 Minutes

Follow these steps to get your ICA GitHub integration working quickly.

---

## Step 1: Install Dependencies (2 minutes)

```powershell
cd C:\Users\MuhammedRizwanKP\Desktop\ICA-CONTEXT-STUDIO-GITHUB
npm install
```

---

## Step 2: Configure Environment (3 minutes)

1. **Copy environment file:**
```powershell
copy .env.example .env
```

2. **Edit `.env` file** with your details:
```env
GITHUB_TOKEN=ghp_your_token_here
GITHUB_OWNER=your-username
GITHUB_REPO=your-repo-name
PORT=3000
API_KEY=your_generated_key
```

3. **Generate API key:**
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Step 3: Start Server (1 minute)

```powershell
npm start
```

You should see:
```
🚀 ICA Context Studio GitHub Integration Server Started
📡 Server running on port 3000
```

---

## Step 4: Test Server (1 minute)

```powershell
Invoke-WebRequest -Uri "http://localhost:3000/health"
```

Should return status 200 OK.

---

## Step 5: Setup Context Studio (3 minutes)

1. Go to https://servicesessentials.ibm.com/context-studio
2. Create new context: "GitHub Workflows"
3. Upload knowledge files from `context-data/` folder
4. Click "Expose as MCP"
5. Copy MCP Gateway URL and Token

---

## Step 6: Create ICA App (Quick)

1. Go to https://servicesessentials.ibm.com/launchpad/agent-assistant-studio
2. Create new app: "GitHub Automation"
3. Verify Context Studio MCP server appears
4. Create agent with prompt from `COMPLETE-SETUP-GUIDE.md`
5. Deploy agent
6. Create workflow: Chat Input → Agent → Chat Output
7. Test in playground: "Deploy to production"

---

## ✅ Done!

You can now ask ICA to trigger GitHub workflows!

**Next:** Read [COMPLETE-SETUP-GUIDE.md](COMPLETE-SETUP-GUIDE.md) for detailed configuration.

---

**Made with ❤️ by Bob**