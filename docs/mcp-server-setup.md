# GitHub Workflows MCP Server Setup Guide

## Overview

This guide explains how to set up and use the GitHub Workflows MCP (Model Context Protocol) server with ICA Context Studio. The MCP server exposes GitHub Actions workflow operations as tools that ICA agents can directly call.

## Architecture

```
ICA Agentic App (Cloud)
    ↓
Context Studio MCP Server (Your GitHub Workflows Knowledge)
    ↓
GitHub Workflows MCP Server (Local - This Server)
    ↓
GitHub API
    ↓
GitHub Actions
```

## What is the MCP Server?

The MCP server (`mcp-server.js`) is a Node.js application that:

1. **Exposes GitHub workflow operations as MCP tools**
2. **Communicates via stdio** (standard input/output)
3. **Integrates with ICA** through Context Forge
4. **Provides 4 main tools**:
   - `trigger_github_workflow` - Trigger deployments, builds, tests
   - `list_github_workflows` - List available workflows
   - `get_workflow_runs` - Get recent workflow execution history
   - `get_workflow_run_status` - Check specific run status

## Prerequisites

- ✅ Node.js v18+ installed
- ✅ GitHub Personal Access Token with `repo` and `workflow` scopes
- ✅ GitHub repository with workflows configured
- ✅ Access to ICA Context Studio and Agentic App Studio

## Setup Instructions

### Step 1: Install Dependencies

```bash
cd ICA-CONTEXT-STUDIO-GITHUB
npm install
```

### Step 2: Configure Environment Variables

1. Copy the environment template:
```bash
cp .env.example .env
```

2. Edit `.env` with your credentials:
```env
GITHUB_TOKEN=paste_your_token_here
GITHUB_OWNER=your-github-username
GITHUB_REPO=your-repository-name
PORT=3000
API_KEY=your_secure_api_key_here
```

3. Generate a secure API key (for the HTTP server):
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 3: Test the MCP Server Locally

Run the MCP server:
```bash
npm run mcp
```

You should see:
```
🚀 GitHub Workflows MCP Server Started
📦 Repository: your-username/your-repo
🔑 GitHub Token: Configured ✅

📋 Available tools:
  - trigger_github_workflow: Trigger a workflow
  - list_github_workflows: List all workflows
  - get_workflow_runs: Get recent workflow runs
  - get_workflow_run_status: Get specific run status
```

Press `Ctrl+C` to stop the server.

## Exposing MCP Server to ICA

### Option 1: Using ngrok with SSE Transport (Recommended)

1. **Start the HTTP server** (for SSE transport):
```bash
npm start
```

2. **In another terminal, start ngrok**:
```bash
ngrok http 3000
```

3. **Copy the ngrok URL** (e.g., `https://abc123.ngrok.io`)

4. **In ICA Context Forge**, add MCP server:
   - **Server Name**: `GitHub Workflows MCP`
   - **Server URL**: `https://abc123.ngrok.io/mcp` (your ngrok URL + /mcp)
   - **Transport Type**: `SSE` or `Streamable HTTP`
   - **Authentication**: `Bearer Token`
   - **Token**: Your API_KEY from `.env`

### Option 2: Using stdio Transport (Advanced)

For stdio transport, you need to deploy the MCP server where ICA can execute it directly. This typically requires:

1. Deploying to a cloud service that supports stdio
2. Configuring ICA to execute the command
3. More complex setup - recommended for production only

## Available MCP Tools

### 1. trigger_github_workflow

**Purpose**: Triggers a GitHub Actions workflow

**Parameters**:
- `workflow_id` (optional): Workflow file name (default: "main.yml")
- `ref` (optional): Git branch/tag/commit (default: "main")
- `task` (required): Task to execute - "deploy", "build", or "test"
- `environment` (required): Target environment - "development", "staging", or "production"
- `message` (optional): Custom message for the workflow run

**Example Usage in ICA**:
```
User: "Deploy to production"

Agent calls: trigger_github_workflow
Parameters:
{
  "task": "deploy",
  "environment": "production",
  "message": "Production deployment requested by user"
}

Response:
{
  "success": true,
  "message": "Workflow triggered successfully",
  "workflow": "main.yml",
  "task": "deploy",
  "environment": "production",
  "github_url": "https://github.com/user/repo/actions"
}
```

### 2. list_github_workflows

**Purpose**: Lists all available workflows in the repository

**Parameters**: None

**Example Usage**:
```
User: "What workflows are available?"

Agent calls: list_github_workflows

Response:
{
  "success": true,
  "repository": "user/repo",
  "workflows": [
    {
      "id": 12345,
      "name": "ICA Triggered Workflow",
      "path": ".github/workflows/main.yml",
      "state": "active",
      "url": "https://github.com/user/repo/actions/workflows/main.yml"
    }
  ],
  "total": 1
}
```

### 3. get_workflow_runs

**Purpose**: Gets recent execution history for a workflow

**Parameters**:
- `workflow_id` (optional): Workflow file name (default: "main.yml")
- `per_page` (optional): Number of results (default: 10, max: 100)

**Example Usage**:
```
User: "Show recent deployments"

Agent calls: get_workflow_runs
Parameters:
{
  "workflow_id": "main.yml",
  "per_page": 5
}

Response:
{
  "success": true,
  "workflow": "main.yml",
  "runs": [
    {
      "id": 9876543210,
      "name": "ICA Triggered Workflow",
      "status": "completed",
      "conclusion": "success",
      "created_at": "2026-06-09T10:00:00Z",
      "html_url": "https://github.com/user/repo/actions/runs/9876543210",
      "actor": "username"
    }
  ],
  "total": 5
}
```

### 4. get_workflow_run_status

**Purpose**: Gets detailed status of a specific workflow run

**Parameters**:
- `run_id` (required): Workflow run ID

**Example Usage**:
```
User: "Check the status of run 9876543210"

Agent calls: get_workflow_run_status
Parameters:
{
  "run_id": "9876543210"
}

Response:
{
  "success": true,
  "run": {
    "id": 9876543210,
    "name": "ICA Triggered Workflow",
    "status": "completed",
    "conclusion": "success",
    "created_at": "2026-06-09T10:00:00Z",
    "updated_at": "2026-06-09T10:05:00Z",
    "html_url": "https://github.com/user/repo/actions/runs/9876543210",
    "actor": "username",
    "event": "workflow_dispatch",
    "head_branch": "main",
    "head_sha": "abc123..."
  }
}
```

## Configuring ICA Agentic App

### Step 1: Add MCP Server in Context Forge

1. Navigate to your ICA Agentic App
2. Go to **MCP Servers** page
3. Click **Access MCP Gateway** (opens Context Forge)
4. In Context Forge, go to **MCP Servers** tab
5. Click **Add New MCP Server**
6. Configure:
   - **Server Name**: `GitHub Workflows MCP`
   - **Server URL**: Your ngrok URL + `/mcp` endpoint
   - **Description**: `MCP server for triggering GitHub Actions workflows`
   - **Transport Type**: `Streamable HTTP` or `SSE`
   - **Authentication Type**: `Bearer Token`
   - **Bearer Token**: Your API_KEY from `.env`
7. Click **Save**

### Step 2: Configure Virtual Server

1. In Context Forge, go to **Virtual Server** tab
2. Find the default virtual server
3. Click **Edit**
4. Select **all tools** from the GitHub Workflows MCP server:
   - ✅ trigger_github_workflow
   - ✅ list_github_workflows
   - ✅ get_workflow_runs
   - ✅ get_workflow_run_status
5. Click **Save Changes**

### Step 3: Verify Tools in ICA App

1. Return to your ICA Agentic App
2. Go to **MCP Servers** page
3. Verify the GitHub Workflows MCP server appears
4. Click on the tools count to see all 4 tools listed

### Step 4: Configure Agent Prompt

When creating your agent, include instructions to use the MCP tools:

```
You are a GitHub Workflow Automation Agent with access to:

1. Context Studio (ctx_your_context_id) for workflow knowledge and best practices
2. GitHub Workflows MCP Server with these tools:
   - trigger_github_workflow: Trigger deployments, builds, tests
   - list_github_workflows: List available workflows
   - get_workflow_runs: Check workflow history
   - get_workflow_run_status: Get detailed run status

When a user requests a deployment:
1. Query Context Studio for best practices
2. Verify the request follows guidelines
3. Use trigger_github_workflow to execute
4. Provide the GitHub Actions URL for monitoring

Always follow deployment best practices from Context Studio before triggering workflows.
```

## Testing the Integration

### Test 1: List Workflows

**User Input**: "What workflows are available?"

**Expected**: Agent uses `list_github_workflows` and shows available workflows

### Test 2: Trigger Development Deployment

**User Input**: "Deploy to development"

**Expected**: 
1. Agent queries Context Studio for development deployment procedures
2. Agent uses `trigger_github_workflow` with task="deploy", environment="development"
3. Agent provides GitHub Actions URL
4. Workflow appears in GitHub Actions tab

### Test 3: Check Workflow Status

**User Input**: "Show recent workflow runs"

**Expected**: Agent uses `get_workflow_runs` and displays recent executions

### Test 4: Production Deployment with Confirmation

**User Input**: "Deploy to production"

**Expected**:
1. Agent queries Context Studio for production best practices
2. Agent asks for confirmation
3. After confirmation, triggers workflow
4. Provides monitoring URL

## Troubleshooting

### MCP Server Won't Start

**Problem**: Server fails to start

**Solutions**:
- Check environment variables are set in `.env`
- Verify GitHub token is valid
- Ensure Node.js v18+ is installed
- Check for port conflicts

### ICA Can't Connect to MCP Server

**Problem**: MCP server not accessible from ICA

**Solutions**:
- Verify ngrok is running
- Check ngrok URL is correct in Context Forge
- Ensure Bearer token matches API_KEY
- Test the endpoint manually with curl

### Tools Not Appearing in ICA

**Problem**: MCP tools don't show up in ICA

**Solutions**:
- Verify MCP server is connected in Context Forge
- Check virtual server configuration includes the tools
- Restart the MCP server
- Refresh the ICA app page

### Workflow Trigger Fails

**Problem**: Tool call succeeds but workflow doesn't trigger

**Solutions**:
- Verify GitHub token has `workflow` scope
- Check workflow file exists in repository
- Ensure workflow supports `workflow_dispatch` trigger
- Review GitHub Actions permissions

## Security Best Practices

### Environment Variables
- ✅ Store credentials in `.env` file
- ✅ Never commit `.env` to version control
- ✅ Use different tokens for different environments
- ✅ Rotate tokens every 90 days

### API Key
- ✅ Generate strong random keys
- ✅ Store securely
- ✅ Use HTTPS (ngrok provides this)
- ✅ Monitor access logs

### GitHub Token
- ✅ Minimum required scopes only (`repo`, `workflow`)
- ✅ Use fine-grained tokens when possible
- ✅ Rotate regularly
- ✅ Revoke immediately if compromised

## Production Deployment

For production use, consider:

1. **Deploy MCP Server to Cloud**:
   - AWS Lambda with function URLs
   - Azure Functions with HTTP trigger
   - Google Cloud Run
   - Heroku

2. **Use Permanent URLs**:
   - Replace ngrok with permanent domain
   - Configure SSL certificates
   - Set up load balancing

3. **Implement Monitoring**:
   - Log all tool calls
   - Track success/failure rates
   - Set up alerts for errors
   - Monitor GitHub API rate limits

4. **Add Rate Limiting**:
   - Prevent abuse
   - Protect GitHub API quota
   - Implement backoff strategies

## Comparison: MCP Server vs HTTP API

### MCP Server (This Approach)
✅ Native ICA integration
✅ Automatic tool discovery
✅ Type-safe parameters
✅ Better error handling
✅ Follows ICA architecture
✅ No custom tool configuration needed

### HTTP API (Alternative)
❌ Requires custom tool setup
❌ Manual parameter configuration
❌ Less integrated with ICA
✅ Can be used by non-ICA clients
✅ Simpler for testing

**Recommendation**: Use MCP Server for ICA integration, keep HTTP API for testing and non-ICA clients.

## Additional Resources

- [MCP Protocol Specification](https://modelcontextprotocol.io)
- [GitHub Actions API Documentation](https://docs.github.com/en/rest/actions)
- [ICA Context Studio Documentation](https://servicesessentials.ibm.com/docs/context-studio)
- [ngrok Documentation](https://ngrok.com/docs)

---

**Made with ❤️ by Bob**

Last Updated: 2026-06-09