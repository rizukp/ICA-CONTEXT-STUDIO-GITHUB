# ICA Context Studio Setup Instructions

## Overview

This guide provides step-by-step instructions for setting up ICA Context Studio with the GitHub Workflows ontology and creating an agentic application that can trigger GitHub Actions workflows using natural language.

## Prerequisites

- ✅ Access to IBM Consulting Advantage (ICA)
- ✅ Context Studio access enabled in your ICA team
- ✅ GitHub repository with workflows configured
- ✅ Local API server running (see API Integration Guide)
- ✅ ngrok tunnel exposing your local server

## Part 1: Import Schema to Context Studio

### Step 1: Access Context Studio

1. Log in to IBM Consulting Advantage
2. Navigate to your team (Personal Team or project team)
3. Open **Context Studio** from the applications menu
4. Familiarize yourself with the interface

### Step 2: Import the GitHub Workflows Ontology

1. Click **"New Schema"** button in Context Studio
2. Select **"Import schema"** option
3. Fill in the import form:
   - **File format**: Select `json-ld` from dropdown
   - **Upload file**: Upload `github-workflows-ontology.jsonld`
   - **Schema Name**: `GitHub Workflows Ontology`
   - **Description**: `Ontology for GitHub Actions workflows, deployments, and CI/CD processes`
   - **Select a Domain**: Choose appropriate domain (e.g., DevOps, Software Engineering)
4. Click **"Save"** to import the schema

### Step 3: Review the Schema

1. Navigate to the schemas list
2. Click on **"GitHub Workflows Ontology"**
3. Review the Schema Builder view:
   - **Entities**: Workflow, WorkflowRun, Job, Step, Environment, Deployment, Repository
   - **Operations**: TriggerWorkflow, DeployToEnvironment, ApproveDeployment, RollbackDeployment
   - **States**: Various workflow and deployment states
4. Verify all entities and relationships are correctly imported

### Step 4: Publish the Schema

1. In the Schema Builder, click **"Publish"** button
2. Confirm the publication
3. Wait for the schema to be published (usually takes a few seconds)
4. Verify the schema status shows as "Published"

## Part 2: Create and Configure Context

### Step 5: Create GitHub Workflows Context

1. Navigate to **"Contexts"** section in Context Studio
2. Click **"New Context"** button
3. Fill in the context creation form:
   - **Context Name**: `GitHub Workflows Knowledge Base`
   - **Description**: `Comprehensive knowledge base for GitHub Actions workflows, deployment procedures, and best practices`
   - **Link Schema**: Select `GitHub Workflows Ontology`
   - **Domain**: Same as schema domain
4. Click **"Create"**

### Step 6: Upload Knowledge Documents

1. Open the created context
2. Navigate to **"Source & Data"** tab
3. Click **"Upload Files"** button
4. Upload the following markdown files:
   - `docs/github-workflows-overview.md`
   - `docs/deployment-procedures.md`
   - `docs/api-integration-guide.md`
   - `docs/ica-setup-instructions.md` (this file)
5. Wait for documents to be processed (status should show "Ready")
6. Verify all documents are successfully uploaded

### Step 7: Review Knowledge Graph

1. Click on **"Knowledge Graph"** tab
2. Explore the visual representation of your knowledge
3. Verify entities and relationships are correctly extracted
4. Use the search function to test queries like:
   - "deployment procedures"
   - "workflow triggers"
   - "production deployment"

### Step 8: Test with AI Assistant

1. Click on **"AI Assistant"** in the context
2. Ask test questions:
   - "What are the deployment best practices?"
   - "How do I trigger a workflow?"
   - "What environments are available?"
   - "What should I check before deploying to production?"
3. Verify the AI provides accurate answers based on your documents

## Part 3: Expose Context as MCP Server

### Step 9: Configure MCP Exposure

1. In your context, go to **"Overview"** tab
2. Scroll down to **"MCP Exposure"** section
3. Click **"Expose as MCP"** button
4. Follow the wizard to configure MCP server

### Step 10: Save MCP Server Details

Copy and save the following information (you'll need it later):

```
MCP Gateway URL: https://servicesessentials.ibm.com/mcp-gateway/service/gateway/servers/[server-id]/mcp
MCP Gateway Token: [your-token-here]
Context ID: ctx_[your-context-id]
```

**Important**: Store these securely - you'll need them for ICA Agentic App configuration.

## Part 4: Create ICA Agentic App

### Step 11: Access Agentic App Studio

1. Navigate to: https://servicesessentials.ibm.com/launchpad/agent-assistant-studio
2. Ensure you're in your **Personal Team** or appropriate project team
3. Click **"Create an Agentic App"**

### Step 12: Configure Agentic App

1. Fill in app details:
   - **App Name**: `GitHub Workflow Automation`
   - **Description**: `Natural language interface for triggering GitHub Actions workflows with Context Studio knowledge`
2. Click **"Create"**

### Step 13: Configure MCP Server Connection

1. In your new app, navigate to **"MCP Servers"** page
2. Click **"Access MCP Gateway"** button (opens Context Forge)
3. In Context Forge, go to **"MCP Servers"** tab
4. Scroll to **"Add New MCP Server or Gateway"**
5. Configure the server:
   - **Server Name**: `GitHub Workflows Context Studio`
   - **Server URL**: [Your MCP Gateway URL from Step 10]
   - **Description**: `Context Studio MCP server for GitHub workflows knowledge`
   - **Tags**: `github`, `workflows`, `deployment`, `context-studio`
   - **Visibility**: `Private` (or `Team` if sharing)
   - **Transport Type**: `Streamable HTTP`
   - **Authentication Type**: `Bearer Token`
   - **Bearer Token**: [Your MCP Gateway Token from Step 10]
6. Click **"Save"**
7. Verify server status shows as "Active"

### Step 14: Configure Virtual Server

1. In Context Forge, navigate to **"Virtual Server"** tab
2. Find the default virtual server
3. Click **"Edit"** button
4. In the server configuration:
   - Locate **Context Studio MCP Server** section
   - Select **all available tools** from the Context Studio server
5. Click **"Save Changes"**
6. Close Context Forge to return to your agentic app

### Step 15: Verify MCP Tools

1. Back in your agentic app, go to **"MCP Servers"** page
2. Look for the **Tools** column
3. Click on the tools count (e.g., "5 tools")
4. Verify Context Studio tools are listed:
   - Vector query tools
   - Knowledge graph tools
   - Context search tools

## Part 5: Create and Configure Agent

### Step 16: Create Agent Orchestration

1. Navigate to **"Agents"** page
2. Click **"Create Agent Orchestration"**
3. The Interactive Assistant will guide you

### Step 17: Configure Agent with Interactive Assistant

Use the following configuration:

- **Platform**: ICA (IBM Consulting Advantage)
- **Framework**: Strands
- **Model**: GPT-5.1 (or latest available)
- **Pattern**: Single (single-agent pattern)

### Step 18: Provide Agent Prompt

Use this comprehensive prompt:

```
You are a GitHub Workflow Automation Agent with expertise in CI/CD, deployments, and DevOps best practices.

CAPABILITIES:
1. Query Context Studio for GitHub workflow knowledge and best practices
2. Trigger GitHub Actions workflows via API
3. Check workflow status and history
4. Provide deployment guidance and recommendations

CONTEXT STUDIO ACCESS:
- Context ID: ctx_[your-context-id-from-step-10]
- Use vector query tools to search workflow knowledge
- Always consult Context Studio before making deployment decisions

WORKFLOW API ACCESS:
- API Endpoint: [your-ngrok-url]/trigger-workflow
- Available endpoints: /trigger-workflow, /workflows, /workflow-runs
- Authentication: API key required

WORKFLOW OPERATIONS:
When user requests a deployment or workflow trigger:
1. Query Context Studio for relevant procedures and best practices
2. Verify the request against deployment guidelines
3. Confirm environment and task details with user
4. Check if approval is needed (especially for production)
5. Trigger the workflow via API
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

**Important**: Replace `ctx_[your-context-id-from-step-10]` and `[your-ngrok-url]` with your actual values.

### Step 19: Review and Adjust Agent YAML

1. Review the generated YAML configuration
2. Verify:
   - Model configuration is correct
   - Context Studio tools are included
   - System prompt includes your Context ID
   - Temperature and parameters are appropriate
3. Make any necessary adjustments
4. Proceed to deployment

### Step 20: Add Custom Tool for GitHub API

1. In the agent configuration, add a custom HTTP tool
2. Configure the tool:

**Tool Name**: `trigger_github_workflow`

**Tool Configuration**:
```json
{
  "type": "http",
  "method": "POST",
  "url": "[your-ngrok-url]/trigger-workflow",
  "headers": {
    "Content-Type": "application/json",
    "x-api-key": "[your-api-key]"
  },
  "body_template": {
    "workflow_id": "main.yml",
    "ref": "main",
    "inputs": {
      "task": "{{task}}",
      "environment": "{{environment}}",
      "message": "{{message}}"
    }
  },
  "description": "Triggers a GitHub Actions workflow with specified task, environment, and message"
}
```

**Important**: Replace `[your-ngrok-url]` and `[your-api-key]` with your actual values.

### Step 21: Deploy the Agent

1. Click **"Deploy"** button
2. Wait for deployment to complete (30-60 seconds)
3. Verify deployment success message
4. Note the agent name for workflow configuration

### Step 22: Test the Agent

1. On the Agents page, find your deployed agent
2. Click **"Invoke"** button
3. Test with sample questions:
   - "What workflows are available?"
   - "What are the deployment best practices?"
   - "How should I deploy to production?"
   - "Deploy to staging environment"
4. Verify the agent:
   - Queries Context Studio for knowledge
   - Provides accurate information
   - Can trigger workflows (if you confirm)

## Part 6: Create Workflow

### Step 23: Build Workflow

1. Navigate to **"Workflow"** page
2. Click **"Create New Workflow"**
3. You'll see the workflow canvas

### Step 24: Add Components

Add the following components in order:

1. **Chat Input Component**:
   - Drag from component palette
   - Position at the start of workflow
   - No configuration needed

2. **ICA Agent Component**:
   - Drag from component palette
   - Position in the middle
   - Configure:
     - **Agentic App ID**: Copy from app header/URL
     - **Agent Name**: Select your deployed agent from dropdown

3. **Chat Output Component**:
   - Drag from component palette
   - Position at the end
   - No configuration needed

### Step 25: Connect Components

1. Connect **Chat Input** output to **ICA Agent** input
2. Connect **ICA Agent** output to **Chat Output** input
3. Verify all connections are properly established
4. Check for any validation errors

### Step 26: Test in Playground

1. Click **"Playground"** button
2. The playground interface will open
3. Test with various commands:

**Knowledge Queries**:
- "What are the available workflows?"
- "What are the deployment best practices?"
- "What should I check before deploying to production?"

**Deployment Commands**:
- "Deploy to development"
- "Deploy version 1.2.3 to staging"
- "I need to deploy to production"

**Status Queries**:
- "Show recent workflow runs"
- "What's the status of the last deployment?"

4. Verify:
   - Agent responds with Context Studio knowledge
   - Agent can trigger workflows when requested
   - Responses are accurate and helpful
   - GitHub Actions URLs are provided

## Part 7: Configure API Access

### Step 27: Set Up API Access

1. In the workflow editor, click **"Share"** button
2. Select **"API Access"** option
3. Review the API configuration:
   - API Endpoint URL
   - Request format
   - Response format
   - Sample cURL command

### Step 28: Create API Key

1. In the API Access dialog, click **"Create an API Key"**
2. Fill in details:
   - **Key Name**: `GitHub Workflow Automation API Key`
   - **Description**: `API key for triggering workflows via ICA`
3. Click **"Create"**
4. **IMPORTANT**: Copy the API key immediately (shown only once)
5. Store it securely (password manager or secure vault)

### Step 29: Save cURL Command

1. Copy the provided cURL command
2. **IMPORTANT**: Change the host in the URL:
   - From: `agentstudio.servicesessentials.ibm.com`
   - To: `langflow.servicesessentials.ibm.com`
3. Replace `YOUR_API_KEY` with your actual API key
4. Save the modified command for testing

Example modified command:
```bash
curl --request POST \
  --url 'https://langflow.servicesessentials.ibm.com/api/v1/run/YOUR_APP_ID?stream=false' \
  --header 'Content-Type: application/json' \
  --header "x-api-key: YOUR_ACTUAL_API_KEY" \
  --data '{
    "output_type": "chat",
    "input_type": "chat",
    "input_value": "Deploy to production",
    "session_id": "test-session-001"
  }'
```

### Step 30: Test API

1. Open PowerShell or terminal
2. Run your saved cURL command
3. Verify response:
   - HTTP 200 status
   - Response contains agent's answer
   - Workflow trigger confirmation (if applicable)

## Part 8: Verification and Testing

### Step 31: End-to-End Testing

Test the complete flow:

1. **Test Knowledge Queries**:
   ```
   Input: "What are the deployment best practices?"
   Expected: Agent provides best practices from Context Studio
   ```

2. **Test Workflow Listing**:
   ```
   Input: "What workflows are available?"
   Expected: Agent lists available workflows
   ```

3. **Test Development Deployment**:
   ```
   Input: "Deploy to development"
   Expected: Agent triggers workflow, provides GitHub URL
   ```

4. **Test Staging Deployment**:
   ```
   Input: "Deploy to staging for testing"
   Expected: Agent triggers workflow with appropriate message
   ```

5. **Test Production Deployment**:
   ```
   Input: "Deploy to production"
   Expected: Agent asks for confirmation, checks best practices, then triggers
   ```

### Step 32: Verify GitHub Actions

1. Go to your GitHub repository
2. Navigate to **Actions** tab
3. Verify workflow runs appear for your test deployments
4. Check workflow run details:
   - Correct inputs were passed
   - Workflow executed successfully
   - Logs show expected behavior

### Step 33: Monitor and Optimize

1. Monitor agent responses for accuracy
2. Check Context Studio query effectiveness
3. Review workflow trigger success rate
4. Optimize agent prompt if needed
5. Add more knowledge documents as needed

## Success Criteria

Your setup is complete and successful when:

- ✅ Schema imported and published in Context Studio
- ✅ Context created with all knowledge documents
- ✅ Context exposed as MCP server
- ✅ MCP server connected in ICA Agentic App
- ✅ Agent deployed and responding
- ✅ Workflow created and tested in playground
- ✅ API access configured with valid key
- ✅ Natural language commands trigger GitHub workflows
- ✅ GitHub Actions runs appear in repository
- ✅ Agent provides accurate knowledge from Context Studio

## Troubleshooting

### Schema Import Issues

**Problem**: Schema graph is empty after import

**Solution**:
1. Delete the problematic schema
2. Verify JSON-LD file is valid JSON
3. Check @context and @graph structure
4. Re-import with corrected file

### MCP Server Connection Issues

**Problem**: MCP server shows as inactive

**Solution**:
1. Verify MCP Gateway URL is correct
2. Check Bearer Token is valid
3. Ensure Context Studio context is published
4. Try reconnecting the server

### Agent Not Querying Context Studio

**Problem**: Agent doesn't use Context Studio knowledge

**Solution**:
1. Verify Context ID in agent prompt
2. Check MCP tools are selected in virtual server
3. Ensure agent prompt mentions Context Studio
4. Test Context Studio directly in AI Assistant

### Workflow Trigger Fails

**Problem**: Agent can't trigger workflows

**Solution**:
1. Verify ngrok is running
2. Check API server is accessible
3. Confirm API key is correct
4. Test API endpoint directly with cURL
5. Review agent logs for errors

### API Access Issues

**Problem**: API calls return 401 Unauthorized

**Solution**:
1. Verify API key is correct
2. Check API key is included in headers
3. Ensure you changed host to langflow.servicesessentials.ibm.com
4. Try regenerating the API key

## Best Practices

### Context Studio
- Keep knowledge documents up to date
- Add new documents as procedures evolve
- Regularly review and refine schema
- Test AI Assistant responses periodically

### Agent Configuration
- Keep agent prompt clear and specific
- Include Context ID in prompt
- Define clear safety rules
- Update prompt as requirements change

### Security
- Rotate API keys regularly (every 90 days)
- Store keys securely (never in code)
- Use different keys for different environments
- Monitor API usage and access logs

### Monitoring
- Check workflow success rates
- Review agent response quality
- Monitor Context Studio query performance
- Track deployment frequency and outcomes

## Next Steps

After successful setup:

1. **Expand Knowledge Base**:
   - Add more workflow documentation
   - Include troubleshooting guides
   - Document common scenarios

2. **Enhance Agent**:
   - Add more custom tools
   - Implement approval workflows
   - Add notification capabilities

3. **Integrate with Other Systems**:
   - Connect to monitoring tools
   - Integrate with ticketing systems
   - Add Slack/Teams notifications

4. **Scale to Team**:
   - Share context with team members
   - Create team-specific workflows
   - Implement role-based access

## Additional Resources

- [Context Studio Documentation](https://servicesessentials.ibm.com/docs/context-studio)
- [ICA Agentic App Studio Guide](https://servicesessentials.ibm.com/docs/agentic-app-studio)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [MCP Protocol Specification](https://modelcontextprotocol.io)

---

**Setup Complete!** 🎉

You now have a fully functional ICA agentic application that can trigger GitHub workflows using natural language, powered by Context Studio knowledge.