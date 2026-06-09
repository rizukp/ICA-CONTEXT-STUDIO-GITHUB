# ICA Context Studio GitHub Integration - Complete Guide

> This guide follows the ICA Context Studio Lab and Agentic App Studio Lab structure

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Part 1: Context Studio Lab](#part-1-context-studio-lab)
4. [Part 2: Agentic App Studio Lab](#part-2-agentic-app-studio-lab)
5. [Part 3: Testing & Verification](#part-3-testing--verification)

---

## Overview

This integration enables you to trigger GitHub Actions workflows using natural language through ICA agentic applications. The system uses:

- **Context Studio**: Stores GitHub workflow knowledge and best practices
- **MCP Server**: Exposes GitHub workflow operations as tools
- **ICA Agent**: Processes natural language and triggers workflows

### Architecture

```
User: "Deploy to production"
    ↓
ICA Agentic App
    ↓
Context Studio MCP (Knowledge Base)
    ↓
GitHub Workflows MCP Server (Your Local Server)
    ↓
GitHub API
    ↓
GitHub Actions Workflow Runs
```

---

## Prerequisites

### Required Access
- ✅ IBM Consulting Advantage (ICA) account
- ✅ Context Studio enabled in your ICA team
- ✅ GitHub repository with Actions enabled
- ✅ GitHub Personal Access Token (`repo` + `workflow` scopes)

### Required Software
- ✅ Node.js v18 or higher
- ✅ Git
- ✅ ngrok account (free tier works)

### Required Files
All files are in this repository:
- ✅ `github-workflows-ontology.jsonld` - Schema for Context Studio
- ✅ `docs/*.md` - Knowledge base documents
- ✅ `.github/workflows/main.yml` - GitHub Actions workflow
- ✅ `mcp-server.js` - MCP server implementation
- ✅ `server.js` - HTTP API server

---

## Part 1: Context Studio Lab

> Following: ICA Context Studio Lab structure

### Step 1: Generate Schema (Already Done ✅)

The schema `github-workflows-ontology.jsonld` has been generated and includes:
- **Entities**: Workflow, WorkflowRun, Job, Step, Environment, Deployment, Repository
- **Operations**: TriggerWorkflow, DeployToEnvironment, ApproveDeployment, RollbackDeployment
- **States**: Various workflow and deployment states

### Step 2: Access Context Studio

1. Log in to IBM Consulting Advantage
2. Switch to your **Personal Team** or appropriate team
3. Navigate to **Context Studio** application
4. Familiarize yourself with the interface

### Step 3: Import Schema into Context Studio

1. In Context Studio, click **"New Schema"**
2. Select **"Import schema"** option
3. Fill in the import form:
   - **File format**: `json-ld`
   - **Upload file**: Upload `github-workflows-ontology.jsonld` from this repo
   - **Schema Name**: `GitHub Workflows Ontology`
   - **Description**: `Ontology for GitHub Actions workflows, deployments, and CI/CD processes`
   - **Select a Domain**: Choose `DevOps` or `Software Engineering`
4. Click **"Save"** to import

### Step 4: Review and Publish Schema

1. Navigate to schemas list
2. Click on **"GitHub Workflows Ontology"**
3. Review the Schema Builder:
   - Verify all entities are present
   - Check properties and relationships
   - Confirm data types and constraints
4. Click **"Publish"** button
5. Wait for publication to complete
6. Verify status shows "Published"

### Step 5: Create Context

1. Navigate to **"Contexts"** section
2. Click **"New Context"**
3. Fill in the form:
   - **Context Name**: `GitHub Workflows Knowledge Base`
   - **Description**: `Knowledge base for GitHub Actions workflows, deployment procedures, and best practices`
   - **Link Schema**: Select `GitHub Workflows Ontology`
   - **Domain**: Same as schema domain
4. Click **"Create"**

### Step 6: Upload Knowledge Documents

1. Open the created context
2. Go to **"Source & Data"** tab
3. Click **"Upload Files"**
4. Upload these markdown files from the `docs/` folder:
   - ✅ `github-workflows-overview.md` - Workflows documentation
   - ✅ `deployment-procedures.md` - Deployment best practices
   - ✅ `api-integration-guide.md` - API reference
   - ✅ `mcp-server-setup.md` - MCP server guide
   - ✅ `ica-setup-instructions.md` - Setup instructions
5. Wait for documents to be processed (status: "Ready")
6. Verify all documents uploaded successfully

### Step 7: Review Knowledge Graph

1. Click **"Knowledge Graph"** tab
2. Explore the visual representation
3. Verify entities and relationships
4. Test queries:
   - "deployment procedures"
   - "workflow triggers"
   - "production deployment"

### Step 8: Test with AI Assistant

1. Click **"AI Assistant"** in the context
2. Ask test questions:
   - "What are the deployment best practices?"
   - "How do I trigger a workflow?"
   - "What environments are available?"
   - "What should I check before deploying to production?"
3. Verify accurate answers based on uploaded documents

### Step 9: Expose Context as MCP Server

1. In your context, go to **"Overview"** tab
2. Scroll to **"MCP Exposure"** section
3. Click **"Expose as MCP"**
4. Follow the wizard
5. **SAVE THESE DETAILS** (you'll need them later):
   ```
   MCP Gateway URL: https://servicesessentials.ibm.com/mcp-gateway/service/gateway/servers/[server-id]/mcp
   MCP Gateway Token: [your-token]
   Context ID: ctx_[your-context-id]
   ```

---

## Part 2: Agentic App Studio Lab

> Following: ICA Agentic App Studio Lab structure

### Step 1: Setup Local Environment

1. **Install dependencies**:
   ```bash
   cd ICA-CONTEXT-STUDIO-GITHUB
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   ```

3. **Edit `.env` file** with your credentials:
   ```env
   GITHUB_TOKEN=your_new_github_token_here
   GITHUB_OWNER=your-github-username
   GITHUB_REPO=your-repository-name
   PORT=3000
   API_KEY=generate_with_crypto_command
   ```

4. **Generate API key**:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

### Step 2: Start Local Servers

1. **Start HTTP server** (Terminal 1):
   ```bash
   npm start
   ```
   
   You should see:
   ```
   🚀 ICA Context Studio GitHub Integration Server Started
   📡 Server running on port 3000
   ```

2. **Start MCP server** (Terminal 2):
   ```bash
   npm run mcp
   ```
   
   You should see:
   ```
   🚀 GitHub Workflows MCP Server Started
   📦 Repository: your-username/your-repo
   ```

3. **Start ngrok** (Terminal 3):
   ```bash
   ngrok http 3000
   ```
   
   Copy the ngrok URL (e.g., `https://abc123.ngrok.io`)

### Step 3: Access Agentic App Studio

1. Navigate to: https://servicesessentials.ibm.com/launchpad/agent-assistant-studio
2. Ensure you're in your **Personal Team**
3. Click **"Create an Agentic App"**
4. Fill in:
   - **App Name**: `GitHub Workflow Automation`
   - **Description**: `Natural language interface for triggering GitHub Actions workflows`
5. Click **"Create"**

### Step 4: Configure MCP Servers

#### 4.1: Access MCP Gateway

1. In your app, go to **"MCP Servers"** page
2. Click **"Access MCP Gateway"** (opens Context Forge)

#### 4.2: Add Context Studio MCP Server

1. In Context Forge, go to **"MCP Servers"** tab
2. Verify your Context Studio MCP server appears
3. If not, add it:
   - **Server Name**: `GitHub Workflows Context Studio`
   - **Server URL**: [Your Context Studio MCP Gateway URL from Part 1, Step 9]
   - **Description**: `Context Studio knowledge base for GitHub workflows`
   - **Transport Type**: `Streamable HTTP`
   - **Authentication Type**: `Bearer Token`
   - **Bearer Token**: [Your MCP Gateway Token from Part 1, Step 9]
4. Click **"Save"**

#### 4.3: Add GitHub Workflows MCP Server

1. Still in Context Forge, **"MCP Servers"** tab
2. Click **"Add New MCP Server"**
3. Configure:
   - **Server Name**: `GitHub Workflows MCP`
   - **Server URL**: `https://your-ngrok-url.ngrok.io/mcp` (your ngrok URL + /mcp)
   - **Description**: `MCP server for triggering GitHub Actions workflows`
   - **Tags**: `github`, `workflows`, `deployment`
   - **Visibility**: `Private`
   - **Transport Type**: `Streamable HTTP`
   - **Authentication Type**: `Bearer Token`
   - **Bearer Token**: [Your API_KEY from .env file]
4. Click **"Save"**
5. Verify status shows "Active"

#### 4.4: Configure Virtual Server

1. In Context Forge, go to **"Virtual Server"** tab
2. Find the default virtual server
3. Click **"Edit"**
4. Select **ALL tools** from:
   - ✅ Context Studio MCP Server (vector query tools)
   - ✅ GitHub Workflows MCP Server (4 tools):
     - trigger_github_workflow
     - list_github_workflows
     - get_workflow_runs
     - get_workflow_run_status
5. Click **"Save Changes"**
6. Close Context Forge

### Step 5: Verify MCP Tools

1. Back in your Agentic App, go to **"MCP Servers"** page
2. Look for the **Tools** column
3. Click on the tools count
4. Verify you see:
   - Context Studio tools (vector query, etc.)
   - GitHub Workflows tools (4 tools listed above)

### Step 6: Create Agent Orchestration

1. Navigate to **"Agents"** page
2. Click **"Create Agent Orchestration"**
3. Interactive Assistant will guide you

### Step 7: Configure Agent

Use the Interactive Assistant with these settings:

- **Platform**: ICA (IBM Consulting Advantage)
- **Framework**: Strands
- **Model**: GPT-5.1 (or latest available)
- **Pattern**: Single

### Step 8: Provide Agent Prompt

Use this prompt (replace placeholders with your actual values):

```
You are a GitHub Workflow Automation Agent with expertise in CI/CD, deployments, and DevOps best practices.

CAPABILITIES:
1. Query Context Studio (ctx_YOUR_CONTEXT_ID) for workflow knowledge and best practices
2. Trigger GitHub Actions workflows using MCP tools
3. Check workflow status and history
4. Provide deployment guidance based on best practices

CONTEXT STUDIO ACCESS:
- Context ID: ctx_YOUR_CONTEXT_ID
- Use vector query tools to search workflow knowledge
- Always consult Context Studio before making deployment decisions

MCP TOOLS AVAILABLE:
- trigger_github_workflow: Trigger deployments, builds, tests
- list_github_workflows: List available workflows
- get_workflow_runs: Check workflow history
- get_workflow_run_status: Get detailed run status

WORKFLOW OPERATIONS:
When user requests a deployment or workflow trigger:
1. Query Context Studio for relevant procedures and best practices
2. Verify the request against deployment guidelines
3. Confirm environment and task details with user
4. Check if approval is needed (especially for production)
5. Use trigger_github_workflow MCP tool to execute
6. Provide GitHub Actions URL for monitoring
7. Offer to check workflow status

AVAILABLE WORKFLOWS:
- main.yml: Handles deploy, build, and test tasks

ENVIRONMENTS:
- development: For testing and development
- staging: For pre-production validation
- production: For live deployments (requires extra caution)

TASKS:
- deploy: Deploy application to environment
- build: Build application artifacts
- test: Run test suite

SAFETY RULES:
- Always query Context Studio before production deployments
- Confirm production deployments with user
- Follow deployment best practices from Context Studio
- Warn about deployment windows and timing
- Suggest staging deployment before production
- Recommend rollback plan for production changes

RESPONSE STYLE:
- Be professional and concise
- Provide actionable information
- Include relevant URLs and references
- Explain what you're doing and why
- Offer next steps and recommendations
```

**Important**: Replace `ctx_YOUR_CONTEXT_ID` with your actual Context ID from Part 1, Step 9.

### Step 9: Review and Deploy Agent

1. Review the generated YAML configuration
2. Verify:
   - Model configuration is correct
   - MCP tools are included
   - System prompt includes your Context ID
3. Click **"Deploy"**
4. Wait for deployment (30-60 seconds)
5. Verify success message
6. Note the agent name

### Step 10: Test the Agent

1. On Agents page, find your deployed agent
2. Click **"Invoke"**
3. Test with questions:
   - "What workflows are available?"
   - "What are the deployment best practices?"
   - "Deploy to development"
4. Verify:
   - Agent queries Context Studio
   - Agent can trigger workflows
   - Responses are accurate

### Step 11: Create Workflow

1. Navigate to **"Workflow"** page
2. Click **"Create New Workflow"**
3. Add components in order:
   - **Chat Input** component
   - **ICA Agent** component
   - **Chat Output** component

### Step 12: Configure Workflow Components

1. **Configure ICA Agent**:
   - **Agentic App ID**: Copy from app header/URL
   - **Agent Name**: Select your deployed agent
2. **Connect components**:
   - Chat Input → ICA Agent
   - ICA Agent → Chat Output
3. Verify all connections

### Step 13: Test in Playground

1. Click **"Playground"** button
2. Test commands:
   - "What workflows are available?"
   - "What are the deployment best practices?"
   - "Deploy to development"
   - "Show recent workflow runs"
3. Verify:
   - Agent uses Context Studio knowledge
   - Agent triggers workflows
   - Responses are helpful

### Step 14: Configure API Access

1. Click **"Share"** button
2. Select **"API Access"**
3. Review API configuration
4. Click **"Create an API Key"**:
   - **Key Name**: `GitHub Workflow Automation API Key`
   - **Description**: `API key for workflow automation`
5. **IMPORTANT**: Copy the API key immediately
6. Save the cURL command
7. **Change the host** in URL:
   - From: `agentstudio.servicesessentials.ibm.com`
   - To: `langflow.servicesessentials.ibm.com`

### Step 15: Test API

1. Open terminal
2. Run your modified cURL command:
   ```bash
   curl --request POST \
     --url 'https://langflow.servicesessentials.ibm.com/api/v1/run/YOUR_APP_ID?stream=false' \
     --header 'Content-Type: application/json' \
     --header "x-api-key: YOUR_API_KEY" \
     --data '{
       "output_type": "chat",
       "input_type": "chat",
       "input_value": "Deploy to development",
       "session_id": "test-001"
     }'
   ```
3. Verify response contains workflow trigger confirmation

---

## Part 3: Testing & Verification

### End-to-End Test Scenarios

#### Test 1: Knowledge Query
```
Input: "What are the deployment best practices?"
Expected: Agent provides best practices from Context Studio
```

#### Test 2: List Workflows
```
Input: "What workflows are available?"
Expected: Agent uses list_github_workflows tool and shows workflows
```

#### Test 3: Development Deployment
```
Input: "Deploy to development"
Expected: 
- Agent queries Context Studio
- Agent triggers workflow
- Provides GitHub Actions URL
- Workflow appears in GitHub
```

#### Test 4: Production Deployment with Confirmation
```
Input: "Deploy to production"
Expected:
- Agent queries best practices
- Agent asks for confirmation
- After confirmation, triggers workflow
- Provides monitoring URL
```

### Verify GitHub Actions

1. Go to your GitHub repository
2. Navigate to **Actions** tab
3. Verify workflow runs appear
4. Check run details:
   - Correct inputs passed
   - Workflow executed successfully
   - Logs show expected behavior

### Success Criteria

Your integration is successful when:

- ✅ Schema imported and published in Context Studio
- ✅ Context created with all knowledge documents
- ✅ Context exposed as MCP server
- ✅ Both MCP servers connected in ICA
- ✅ Agent deployed and responding
- ✅ Workflow tested in playground
- ✅ API access configured
- ✅ Natural language commands trigger GitHub workflows
- ✅ GitHub Actions runs appear in repository
- ✅ Agent provides accurate Context Studio knowledge

---

## Troubleshooting

### Context Studio Issues

**Problem**: Schema graph is empty after import

**Solution**:
1. Delete the schema
2. Verify JSON-LD file is valid
3. Check @context and @graph structure
4. Re-import

**Problem**: Documents not processing

**Solution**:
1. Check file format (must be .md, .pdf, or .docx)
2. Verify file size (< 10MB)
3. Wait a few minutes for processing
4. Refresh the page

### MCP Server Issues

**Problem**: MCP server shows as inactive

**Solution**:
1. Verify ngrok is running
2. Check Bearer token is correct
3. Test endpoint with curl
4. Review server logs

**Problem**: Tools not appearing

**Solution**:
1. Verify virtual server configuration
2. Check both MCP servers are connected
3. Refresh ICA app page
4. Restart MCP server

### Agent Issues

**Problem**: Agent doesn't query Context Studio

**Solution**:
1. Verify Context ID in agent prompt
2. Check MCP tools selected in virtual server
3. Test Context Studio directly
4. Review agent logs

**Problem**: Workflow trigger fails

**Solution**:
1. Verify GitHub token has workflow scope
2. Check workflow file exists
3. Ensure workflow supports workflow_dispatch
4. Test API endpoint directly

---

## Additional Resources

- [Context Studio Documentation](https://servicesessentials.ibm.com/docs/context-studio)
- [ICA Agentic App Studio Guide](https://servicesessentials.ibm.com/docs/agentic-app-studio)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [MCP Protocol Specification](https://modelcontextprotocol.io)

---

**Made with ❤️ by Bob**

Last Updated: 2026-06-09