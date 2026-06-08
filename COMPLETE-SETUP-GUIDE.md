# Complete Setup Guide
## ICA Context Studio GitHub Integration

This guide walks you through the complete setup from scratch.

---

## 🎯 What You'll Build

A system where you can ask ICA in natural language to trigger GitHub workflows:
- "Deploy to production"
- "Run tests in staging"
- "Build the application"

---

## 📋 Prerequisites

- ✅ IBM Consulting Advantage (ICA) access
- ✅ Context Studio access (part of ICA)
- ✅ GitHub repository with Actions enabled
- ✅ GitHub Personal Access Token
- ✅ Node.js v18+ installed

---

## Part 1: Setup GitHub Workflow

### Step 1.1: Create Workflow File

In your GitHub repository, create `.github/workflows/main.yml`:

```yaml
name: ICA Triggered Workflow

on:
  workflow_dispatch:
    inputs:
      task:
        description: 'Task to execute'
        required: false
        default: 'deploy'
        type: string
      environment:
        description: 'Environment to run in'
        required: false
        default: 'production'
        type: choice
        options:
          - development
          - staging
          - production
      message:
        description: 'Custom message'
        required: false
        type: string

jobs:
  execute-task:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
      
      - name: Display workflow information
        run: |
          echo "Task: ${{ github.event.inputs.task }}"
          echo "Environment: ${{ github.event.inputs.environment }}"
          echo "Message: ${{ github.event.inputs.message }}"
          echo "Triggered by: ${{ github.actor }}"
      
      - name: Execute task
        run: |
          echo "Executing ${{ github.event.inputs.task }} in ${{ github.event.inputs.environment }}"
          # Add your actual deployment/build/test commands here
```

### Step 1.2: Commit and Push

```bash
git add .github/workflows/main.yml
git commit -m "Add ICA triggered workflow"
git push origin main
```

---

## Part 2: Setup Local API Server

### Step 2.1: Install Dependencies

```powershell
cd C:\Users\MuhammedRizwanKP\Desktop\ICA-CONTEXT-STUDIO-GITHUB
npm install
```

### Step 2.2: Configure Environment

1. Copy `.env.example` to `.env`:
```powershell
copy .env.example .env
```

2. Edit `.env` with your credentials:
```env
GITHUB_TOKEN=ghp_your_actual_token_here
GITHUB_OWNER=your-github-username
GITHUB_REPO=your-repository-name
PORT=3000
API_KEY=generate_with_crypto_randomBytes
```

3. Generate API key:
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 2.3: Test the Server

```powershell
npm start
```

Should show:
```
🚀 ICA Context Studio GitHub Integration Server Started
📡 Server running on port 3000
```

Test health endpoint:
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/health"
```

---

## Part 3: Setup Context Studio

### Step 3.1: Create GitHub Workflows Context

1. Go to **Context Studio**: https://servicesessentials.ibm.com/context-studio

2. Click **"New Context"**

3. Fill in details:
   - **Name**: `GitHub Workflows Knowledge`
   - **Description**: `Knowledge base for GitHub Actions workflows and deployment procedures`
   - **Domain**: Select appropriate domain

4. Click **"Create"**

### Step 3.2: Upload Knowledge Documents

Create and upload these markdown files to your context:

**File 1: `github-workflows-overview.md`**
```markdown
# GitHub Workflows Overview

## Available Workflows

### Main Workflow (main.yml)
- **Purpose**: Handles deployments, builds, and tests
- **Trigger**: Manual via workflow_dispatch
- **Inputs**:
  - task: deploy, build, test
  - environment: development, staging, production
  - message: Custom message

## Deployment Procedures

### Production Deployment
1. Ensure all tests pass
2. Trigger workflow with:
   - task: deploy
   - environment: production
3. Monitor GitHub Actions for completion

### Staging Deployment
1. Trigger workflow with:
   - task: deploy
   - environment: staging
2. Verify deployment
3. Run smoke tests

### Running Tests
1. Trigger workflow with:
   - task: test
   - environment: development
2. Review test results in Actions tab
```

**File 2: `deployment-best-practices.md`**
```markdown
# Deployment Best Practices

## Before Deploying

- ✅ All tests must pass
- ✅ Code review completed
- ✅ Staging environment tested
- ✅ Rollback plan prepared

## Deployment Process

1. **Staging First**: Always deploy to staging before production
2. **Monitor**: Watch GitHub Actions logs during deployment
3. **Verify**: Check application health after deployment
4. **Rollback**: If issues occur, trigger rollback workflow

## Emergency Procedures

If deployment fails:
1. Check GitHub Actions logs
2. Identify the failure point
3. Fix the issue
4. Re-trigger deployment or rollback
```

Upload these files to your Context Studio context.

### Step 3.3: Expose Context as MCP Server

1. In Context Studio, go to your context's **Overview** tab

2. Scroll to **"MCP Exposure"** section

3. Click **"Expose as MCP"**

4. Follow the wizard and **copy**:
   - MCP Gateway URL
   - MCP Gateway Token
   - Context ID

5. Save these for later use

---

## Part 4: Create ICA Agentic App

### Step 4.1: Access Agentic App Studio

1. Go to: https://servicesessentials.ibm.com/launchpad/agent-assistant-studio

2. Ensure you're in your **Personal Team** or appropriate team

3. Click **"Create an Agentic App"**

### Step 4.2: Configure App

- **App Name**: `GitHub Workflow Automation`
- **Description**: `Triggers GitHub Actions workflows using natural language commands`

Click **"Create"**

### Step 4.3: Verify MCP Server Connection

1. Navigate to **"MCP Servers"** page in your app

2. Click **"Access MCP Gateway"**

3. Verify your Context Studio MCP server appears

4. If not, add it manually with the URL and token from Step 3.3

---

## Part 5: Create and Configure Agent

### Step 5.1: Create Agent

1. Go to **"Agents"** page

2. Click **"Create Agent Orchestration"**

3. Use Interactive Assistant:
   - **Platform**: ICA
   - **Framework**: Strands
   - **Model**: GPT-5.1
   - **Pattern**: Single

### Step 5.2: Configure Agent Prompt

```
You are a GitHub workflow automation agent with access to Context Studio knowledge about GitHub workflows.

Your capabilities:
1. Query Context Studio for workflow information and best practices
2. Trigger GitHub Actions workflows via API
3. Provide deployment guidance based on Context Studio knowledge

When a user requests a deployment or workflow trigger:
1. First, query Context Studio for relevant procedures and best practices
2. Confirm the action with the user
3. Trigger the appropriate workflow via the GitHub API
4. Report the result with the GitHub Actions URL

Available workflows:
- main.yml: Handles deploy, build, and test tasks

Environments:
- development: For testing
- staging: For pre-production validation
- production: For live deployments

Always follow best practices from Context Studio before triggering workflows.
```

### Step 5.3: Configure Tools

The agent needs access to:

1. **Context Studio MCP Tools** (automatic via MCP server)
2. **GitHub API Tools** (configure custom tools)

**Add Custom Tool: trigger_github_workflow**

- **Type**: HTTP Request
- **Method**: POST
- **URL**: `http://localhost:3000/trigger-workflow` (or ngrok URL)
- **Headers**:
  ```json
  {
    "Content-Type": "application/json",
    "x-api-key": "your-api-key"
  }
  ```
- **Body Template**:
  ```json
  {
    "workflow_id": "main.yml",
    "ref": "main",
    "inputs": {
      "task": "${task}",
      "environment": "${environment}",
      "message": "${message}"
    }
  }
  ```

### Step 5.4: Deploy Agent

Click **"Deploy"** and wait for deployment to complete.

---

## Part 6: Create Workflow

### Step 6.1: Build Workflow

1. Go to **"Workflow"** page

2. Click **"Create New Workflow"**

3. Add components:
   - **Chat Input** → **ICA Agent** → **Chat Output**

4. Configure ICA Agent:
   - **Agentic App ID**: Copy from app header
   - **Agent Name**: Select your deployed agent

5. Connect all components

### Step 6.2: Test in Playground

1. Click **"Playground"**

2. Test commands:
   - "What workflows are available?"
   - "Deploy to staging"
   - "Run tests"
   - "Deploy to production"

3. Verify:
   - Agent queries Context Studio
   - Agent triggers workflows
   - GitHub Actions runs appear

---

## Part 7: Deploy and Use

### Step 7.1: Configure API Access

1. Click **"Share"** → **"API Access"**

2. Create API Key

3. Save the cURL command (change host to `langflow.servicesessentials.ibm.com`)

### Step 7.2: Test via API

```powershell
curl --request POST `
  --url 'https://langflow.servicesessentials.ibm.com/api/v1/run/YOUR_APP_ID?stream=false' `
  --header 'Content-Type: application/json' `
  --header "x-api-key: YOUR_API_KEY" `
  --data '{
    "output_type": "chat",
    "input_type": "chat",
    "input_value": "Deploy to production",
    "session_id": "test-001"
  }'
```

---

## ✅ Success Criteria

Your setup is complete when:

- ✅ Local API server runs without errors
- ✅ Context Studio has workflow knowledge
- ✅ Context is exposed as MCP server
- ✅ ICA Agentic App is created
- ✅ Agent is deployed and responds
- ✅ Workflow works in playground
- ✅ Natural language commands trigger GitHub workflows
- ✅ GitHub Actions runs appear in repository

---

## 🎯 Usage Examples

Once setup is complete, you can ask ICA:

- "Deploy the application to production"
- "Run tests in the development environment"
- "Build for staging"
- "What are the deployment best practices?"
- "Show me recent workflow runs"

ICA will:
1. Query Context Studio for relevant knowledge
2. Follow best practices
3. Trigger the appropriate workflow
4. Report success with GitHub Actions URL

---

## 🐛 Troubleshooting

### Issue: Agent doesn't query Context Studio

**Solution:**
- Verify MCP server is connected in app settings
- Check Context Studio MCP exposure is active
- Ensure agent prompt mentions Context Studio

### Issue: Workflow trigger fails

**Solution:**
- Verify API server is running
- Check GitHub token has correct permissions
- Ensure workflow file exists in repository
- Verify API key is correct

### Issue: Context Studio returns no results

**Solution:**
- Upload more detailed knowledge documents
- Ensure documents are indexed (may take a few minutes)
- Try more specific queries

---

## 📚 Additional Resources

- [Context Studio Documentation](https://servicesessentials.ibm.com/docs/context-studio)
- [ICA Agentic App Studio Guide](https://servicesessentials.ibm.com/docs/agentic-app-studio)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

**Made with ❤️ by Bob**

Last Updated: 2026-06-08