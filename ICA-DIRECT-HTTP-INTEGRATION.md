# ICA Direct HTTP Integration Guide

> **Continue from here**: You've completed Context Studio setup and are at section 4.3 of the ICA Integration Guide.

## 🎯 Overview

Instead of adding Railway as an MCP server (which had compatibility issues), we'll use **Direct HTTP Integration**:

- ✅ **Context Studio MCP**: For knowledge and documentation
- ✅ **Railway HTTP API**: For workflow triggering (direct calls)

---

## 📋 Current Status

### ✅ What You've Completed:
1. Created Context Studio context with GitHub workflow documentation
2. Exposed Context Studio as MCP server
3. Deployed Railway server with working API
4. Tested workflow triggering successfully

### ⏭️ What's Next:
Configure ICA agent to use both Context Studio (MCP) and Railway (HTTP)

---

## Part 2: ICA Agentic App Setup (Continued)

### Step 4: Configure MCP Server (Modified Approach)

#### 4.1: Access MCP Gateway

1. In your ICA Agentic App, navigate to **"MCP Servers"** page
2. Click **"Access MCP Gateway"** button
3. This opens **Context Forge**

#### 4.2: Add Context Studio MCP Server ONLY

1. In Context Forge, go to **"MCP Servers"** tab
2. Scroll to **"Add New MCP Server or Gateway"**
3. Configure Context Studio MCP:

**Configuration:**
- **Server Name**: `GitHub Workflows Context Studio`
- **Server URL**: `https://servicesessentials.ibm.com/mcp-gateway/service/gateway/servers/YOUR_SERVER_ID/mcp`
- **Description**: `Context Studio with GitHub workflow documentation and best practices`
- **Tags**: `github`, `workflows`, `documentation`
- **Visibility**: `Private`
- **Transport Type**: `Streamable HTTP`
- **Authentication Type**: `Bearer Token`
- **Bearer Token**: `[Your MCP Gateway Token from Context Studio]`
- **Additional Headers**:
  - Key: `x-api-key`
  - Value: `[Your Context Studio Key]`

4. Click **"Save"**
5. Verify status shows **"Active"** ✅

#### 4.3: ~~Add GitHub Workflows MCP Server~~ SKIP THIS STEP

**❌ Do NOT add Railway as MCP server**

Instead, we'll configure the ICA agent to call Railway HTTP API directly (see Step 5).

#### 4.4: Configure Virtual Server

1. In Context Forge, go to **"Virtual Server"** tab
2. Find the default virtual server
3. Click **"Edit"**
4. Add tools from **Context Studio MCP only**:
   - Select all available Context Studio tools
5. Click **"Save Changes"**

---

### Step 5: Create Agent with Direct HTTP Integration

#### 5.1: Navigate to Agents

1. In your Agentic App, go to **"Agents"** page
2. Click **"Create Agent Orchestration"** button

#### 5.2: Configure Agent with Interactive Assistant

Use the interactive assistant:

**Select Platform**: `ICA`

**Select Framework**: `Strands`

**Select Model**: `GPT-5.1`

**Select Pattern**: `Single`

**Provide Agent Prompt**:

```
You are a GitHub workflow assistant that helps users trigger and manage GitHub Actions workflows.

You have access to two systems:

1. CONTEXT STUDIO (ctx_58f67b2a31da)
   - Contains GitHub workflow documentation and best practices
   - Use this to understand workflows, deployment processes, and best practices
   - Query this for workflow information before taking actions

2. GITHUB WORKFLOWS API (Direct HTTP calls)
   - Base URL: https://ica-context-studio-github-production.up.railway.app
   - Repository: rizukp/ICA-CONTEXT-STUDIO-GITHUB
   - Authentication: Include header "Authorization: Bearer de8fb1937ee6b198b35d09046d777d2c6f55812a5404b68786b8709aa6be3058"
   
   Available endpoints:
   
   a) POST /trigger-workflow
      Triggers a GitHub Actions workflow
      Headers:
        Content-Type: application/json
        Authorization: Bearer de8fb1937ee6b198b35d09046d777d2c6f55812a5404b68786b8709aa6be3058
      Body:
      {
        "workflow_id": "main.yml",
        "ref": "main",
        "inputs": {
          "task": "deploy|build|test",
          "environment": "development|staging|production",
          "message": "your custom message"
        }
      }
      
   b) GET /workflows
      Lists all available workflows
      Headers:
        Authorization: Bearer de8fb1937ee6b198b35d09046d777d2c6f55812a5404b68786b8709aa6be3058
      
   c) GET /workflow-runs?workflow_id=main.yml&per_page=10
      Gets recent workflow runs
      Headers:
        Authorization: Bearer de8fb1937ee6b198b35d09046d777d2c6f55812a5404b68786b8709aa6be3058

WORKFLOW PROCESS:

When a user asks to deploy, build, or run workflows:

1. UNDERSTAND: Query Context Studio to understand the workflow requirements and best practices
2. CONFIRM: Confirm the action with the user, showing what will be triggered
3. EXECUTE: Make HTTP POST request to /trigger-workflow endpoint
4. RESPOND: Provide clear feedback including:
   - Success/failure status
   - Task and environment
   - GitHub Actions URL: https://github.com/rizukp/ICA-CONTEXT-STUDIO-GITHUB/actions
   - Instructions to monitor the run

EXAMPLE INTERACTIONS:

User: "Deploy to production"
You:
1. Query Context Studio for production deployment best practices
2. Confirm: "I'll trigger a production deployment. This will run the main.yml workflow with task=deploy and environment=production. Proceed?"
3. If confirmed, make HTTP POST to /trigger-workflow
4. Respond: "✅ Production deployment triggered successfully! Monitor the workflow at: https://github.com/rizukp/ICA-CONTEXT-STUDIO-GITHUB/actions"

User: "What workflows are available?"
You:
1. Make HTTP GET to /workflows
2. List the workflows with their names and purposes

User: "Show me recent workflow runs"
You:
1. Make HTTP GET to /workflow-runs
2. Display the runs with status, time, and links

IMPORTANT RULES:
- Always query Context Studio first for context and best practices
- Always confirm before triggering production deployments
- Always provide the GitHub Actions URL for monitoring
- Handle errors gracefully and suggest solutions
- Be clear about what task and environment will be used
```

**IMPORTANT**: Replace `ctx_YOUR_CONTEXT_ID_HERE` with your actual Context Studio context ID!

#### 5.3: Review Agent YAML

1. Review the generated YAML
2. Verify:
   - Model is GPT-5.1
   - Context Studio tools are included
   - System prompt includes both Context Studio ID and Railway API details
3. Make adjustments if needed

#### 5.4: Deploy the Agent

1. Click **"Deploy"** button
2. Wait for deployment (30-60 seconds)
3. Note the **Agent Name** for the workflow

#### 5.5: Test the Agent (Optional)

1. Click **"Invoke"** button
2. Test queries:
   - `"What workflows are available?"`
   - `"What's the recommended deployment process?"`
   - `"Show me recent workflow runs"`

---

### Step 6: Create Workflow

#### 6.1: Navigate to Workflow

1. Go to **"Workflow"** page
2. Click **"Create New Workflow"**

#### 6.2: Add Components

**Component 1: Chat Input**
1. Add "Chat Input" component
2. Position at start

**Component 2: ICA Agent**
1. Add "ICA Agent" component
2. Configure:
   - **Agentic App ID**: [Copy from top of page]
   - **Agent Name**: [Select your deployed agent]
3. Connect: Chat Input → ICA Agent

**Component 3: Chat Output**
1. Add "Chat Output" component
2. Position at end
3. Connect: ICA Agent → Chat Output

#### 6.3: Verify Workflow

- Flow: Chat Input → ICA Agent → Chat Output
- All connections valid
- No errors

---

### Step 7: Test Workflow in Playground

#### 7.1: Open Playground

Click **"Playground"** or **"Test"** button

#### 7.2: Test Queries

**Test 1: Query Documentation**
```
What's the recommended process for deploying to production?
```
**Expected**: Agent queries Context Studio and explains the process

**Test 2: List Workflows**
```
What workflows are available in this repository?
```
**Expected**: Agent calls Railway API and lists workflows

**Test 3: Check Status**
```
Show me the recent workflow runs
```
**Expected**: Agent calls Railway API and shows recent runs

**Test 4: Trigger Workflow (Careful!)**
```
Trigger a test build in development environment
```
**Expected**: 
1. Agent confirms the action
2. You confirm
3. Agent triggers workflow
4. Agent provides GitHub Actions URL

#### 7.3: Verify Results

- ✅ Agent uses Context Studio for knowledge
- ✅ Agent makes HTTP calls to Railway API
- ✅ Responses are accurate
- ✅ GitHub Actions URLs are provided

---

### Step 8: Configure API Access

#### 8.1: Open API Access

1. In workflow editor, click **"Share"**
2. Select **"API Access"**

#### 8.2: Create API Key

1. Click **"Create an API Key"**
2. Fill in:
   - **Key Name**: `GitHub Workflows API Key`
   - **Description**: `API key for GitHub workflow automation`
3. Click **"Create"**
4. **IMPORTANT**: Copy the API key immediately
5. Store securely

#### 8.3: Save cURL Command

1. Copy the cURL command
2. **Important**: Change host from `agentstudio.servicesessentials.ibm.com` to `langflow.servicesessentials.ibm.com`
3. Replace `YOUR_API_KEY` with actual key
4. Save for future use

---

### Step 9: Test API

#### 9.1: Test with PowerShell

```powershell
Invoke-RestMethod -Uri "https://langflow.servicesessentials.ibm.com/api/v1/run/YOUR_APP_ID?stream=false" -Method Post -Headers @{"Content-Type"="application/json";"x-api-key"="YOUR_API_KEY"} -Body '{"output_type":"chat","input_type":"chat","input_value":"What workflows are available?","session_id":"test-session-1"}'
```

Replace:
- `YOUR_APP_ID` with your app ID
- `YOUR_API_KEY` with your API key

#### 9.2: Verify Response

Expected:
```json
{
  "status": "success",
  "output": "The repository has the following workflows: ...",
  "metadata": {...}
}
```

---

## Part 3: Testing & Verification

### ✅ Complete Testing Checklist

#### Context Studio Integration
- [ ] Context Studio MCP server added and active
- [ ] Virtual server configured with Context Studio tools
- [ ] Agent can query Context Studio for documentation

#### Railway API Integration
- [ ] Railway server deployed and healthy
- [ ] API endpoints tested and working
- [ ] Authentication configured correctly

#### ICA Agent
- [ ] Agent deployed successfully
- [ ] Agent uses Context Studio for knowledge
- [ ] Agent makes HTTP calls to Railway API
- [ ] Agent provides clear responses with GitHub URLs

#### Workflow
- [ ] Workflow created with all components
- [ ] Tested in playground successfully
- [ ] API access configured
- [ ] API key generated and tested

#### End-to-End
- [ ] Can query documentation via agent
- [ ] Can list workflows via agent
- [ ] Can check workflow status via agent
- [ ] Can trigger workflows via agent
- [ ] Workflow runs appear in GitHub Actions

---

## 🎯 Example User Interactions

### Query Documentation
**User**: `"What's the best practice for production deployments?"`

**Agent**:
1. Queries Context Studio
2. Returns: "Based on our documentation, production deployments should..."

### List Workflows
**User**: `"What workflows are available?"`

**Agent**:
1. Calls `GET /workflows`
2. Returns: "The repository has 1 workflow: ICA Triggered Workflow (main.yml)..."

### Trigger Deployment
**User**: `"Deploy to production"`

**Agent**:
1. Queries Context Studio for best practices
2. Confirms: "I'll trigger a production deployment. Proceed?"
3. User confirms
4. Calls `POST /trigger-workflow`
5. Returns: "✅ Production deployment triggered! Monitor at: https://github.com/rizukp/ICA-CONTEXT-STUDIO-GITHUB/actions"

### Check Status
**User**: `"What's the status of the latest deployment?"`

**Agent**:
1. Calls `GET /workflow-runs`
2. Returns: "Latest run: Status=completed, Conclusion=success, Started 5 minutes ago..."

---

## 🔧 Troubleshooting

### Agent Not Querying Context Studio
**Problem**: Agent doesn't use Context Studio

**Solution**:
- Verify Context Studio MCP is active in Context Forge
- Check virtual server has Context Studio tools enabled
- Verify Context ID in agent prompt is correct

### Agent Not Calling Railway API
**Problem**: Agent doesn't make HTTP calls

**Solution**:
- Verify Railway URL in agent prompt is correct
- Check API key in agent prompt is correct
- Test Railway endpoints manually first

### Workflow Trigger Fails
**Problem**: Workflow doesn't trigger

**Solution**:
- Check GitHub token on Railway is valid
- Verify token has `workflow` scope
- Test Railway API directly with PowerShell

### Agent Gives Generic Responses
**Problem**: Agent doesn't use tools

**Solution**:
- Make prompts more specific
- Explicitly ask to "check the workflows" or "trigger a deployment"
- Review agent logs for errors

---

## 📊 Architecture Summary

```
User Question
    ↓
ICA Agentic App (Chat Interface)
    ↓
ICA Agent (GPT-5.1)
    ↓
├─→ Context Studio MCP (Cloud)
│   └─→ Returns: Documentation, best practices
│
└─→ Railway HTTP API (Cloud)
    └─→ POST /trigger-workflow
        └─→ GitHub API
            └─→ GitHub Actions Workflow Runs
```

---

## 🎉 Success Criteria

You've successfully completed the integration when:

✅ **Context Studio**:
- MCP server active
- Agent can query documentation
- Returns relevant information

✅ **Railway API**:
- Server deployed and healthy
- All endpoints working
- Authentication configured

✅ **ICA Agent**:
- Deployed and responding
- Uses Context Studio for knowledge
- Makes HTTP calls to Railway
- Provides clear, helpful responses

✅ **End-to-End**:
- Can trigger workflows via natural language
- Workflows run in GitHub Actions
- Can monitor workflow status
- Complete automation working

---

## 🚀 Next Steps

### Enhance Your Integration

1. **Add More Workflows**:
   - Create additional workflow files
   - Update Context Studio documentation
   - Test with agent

2. **Improve Documentation**:
   - Add more detailed workflow guides
   - Include troubleshooting steps
   - Add deployment checklists

3. **Expand Functionality**:
   - Add workflow cancellation
   - Add deployment approvals
   - Add rollback capabilities

4. **Monitor and Optimize**:
   - Track workflow success rates
   - Monitor API usage
   - Optimize agent prompts

---

## 📝 Summary

**What You Built**:
- ✅ Context Studio with GitHub workflow knowledge
- ✅ Railway API server for workflow triggering
- ✅ ICA agent with dual integration (MCP + HTTP)
- ✅ Natural language workflow automation

**What You Can Do**:
- ✅ Query documentation via natural language
- ✅ List and check workflows
- ✅ Trigger deployments with confirmation
- ✅ Monitor workflow status
- ✅ Full GitHub Actions automation

**Key Benefits**:
- ✅ Simple, reliable architecture
- ✅ Easy to debug and maintain
- ✅ Flexible and extensible
- ✅ Production-ready

**Congratulations! Your ICA GitHub Workflows integration is complete!** 🎉