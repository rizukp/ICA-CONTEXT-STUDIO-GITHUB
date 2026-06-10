# GitHub Workflows API Integration Guide

## Overview

This guide explains how to integrate with GitHub Actions workflows through the API, specifically for use with ICA Context Studio and agentic applications.

## API Architecture

```
ICA Agentic App
    ↓ (Natural Language)
ICA Agent (LangGraph)
    ↓ (MCP Tool Call)
github-trigger Tool (Context Forge)
    ↓ (HTTPS Request)
Railway Node.js Server
    ↓ (GitHub API Call)
GitHub Actions
    ↓ (Workflow Execution)
Deployment/Build/Test
```

### Alternative Architecture (Direct API)

```
External Client
    ↓ (HTTPS Request)
Railway Node.js Server
    ↓ (GitHub API Call)
GitHub Actions
    ↓ (Workflow Execution)
Deployment/Build/Test
```

## GitHub Trigger MCP Tool

### Overview
The `github-trigger` tool is configured in ICA Context Forge to trigger GitHub Actions workflows through the Railway API.

### Tool Configuration

**Tool ID**: `github-trigger`

**Type**: REST API Integration

**Endpoint**: `https://ica-context-studio-github-production.up.railway.app/trigger-workflow`

**Method**: POST

**Authentication**: Bearer Token + x-api-key header

**Headers**:
```json
{
  "Content-Type": "application/json",
  "x-api-key": "YOUR_API_KEY"
}
```

### Input Schema

```json
{
  "type": "object",
  "properties": {
    "task": {
      "type": "string",
      "enum": ["deploy", "build", "test"],
      "description": "The task to perform (deploy, build, or test)"
    },
    "environment": {
      "type": "string",
      "enum": ["development", "staging", "production"],
      "description": "The target environment"
    },
    "message": {
      "type": "string",
      "description": "Optional message for the workflow run"
    }
  },
  "required": ["task", "environment"]
}
```

### Output Schema

```json
{
  "type": "object",
  "properties": {
    "success": {
      "type": "boolean",
      "description": "Whether the workflow was triggered successfully"
    },
    "message": {
      "type": "string",
      "description": "Success or error message"
    },
    "workflow": {
      "type": "string",
      "description": "The workflow file name"
    },
    "run_url": {
      "type": "string",
      "description": "URL to monitor the workflow run"
    },
    "github_url": {
      "type": "string",
      "description": "GitHub Actions page URL"
    }
  }
}
```

### Usage in ICA Agent

The ICA agent uses this tool to trigger workflows after:
1. Querying Context Studio for workflow documentation
2. Explaining the action to the user
3. Receiving confirmation (especially for production)

**Example Agent Flow**:
```
User: "Deploy to production"
  ↓
Agent queries Context Studio (ctx_58f67b2a31da)
  ↓
Agent explains deployment details
  ↓
Agent asks for "CONFIRM"
  ↓
User types "CONFIRM"
  ↓
Agent calls github-trigger tool
  ↓
Tool calls Railway API
  ↓
Railway triggers GitHub Actions
  ↓
Agent reports success with monitoring URL
```

---

## Railway API Endpoints

### Base URL
`https://ica-context-studio-github-production.up.railway.app`

### 1. Health Check

**Endpoint**: `GET /health`

**Purpose**: Verify Railway API server is running and configured correctly

**Authentication**: None required

**Request**:
```bash
curl https://ica-context-studio-github-production.up.railway.app/health
```

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2026-06-08T10:00:00.000Z",
  "service": "ICA Context Studio GitHub Integration",
  "repository": "rizukp/ICA-CONTEXT-STUDIO-GITHUB",
  "github_token_configured": true,
  "api_key_configured": true
}
```

**Use Cases**:
- Verify Railway server is running
- Check configuration status
- Monitor service health
- Troubleshoot connectivity issues

---

### 2. Trigger Workflow

**Endpoint**: `POST /trigger-workflow`

**Purpose**: Manually trigger a GitHub Actions workflow

**Authentication**: Required (API Key)

**Headers**:
```
Content-Type: application/json
x-api-key: your-api-key-here
```

**Request Body**:
```json
{
  "task": "deploy",
  "environment": "production",
  "message": "Deploying version 1.2.3"
}
```

**Parameters**:
- `task` (required): The operation to perform
  - Options: `deploy`, `build`, `test`
- `environment` (required): The target environment
  - Options: `development`, `staging`, `production`
- `message` (optional): Custom message for the workflow run

**Response (Success)**:
```json
{
  "success": true,
  "message": "Workflow triggered successfully",
  "status": 204,
  "workflow": "main.yml",
  "ref": "main",
  "repository": "rizukp/ICA-CONTEXT-STUDIO-GITHUB",
  "github_url": "https://github.com/rizukp/ICA-CONTEXT-STUDIO-GITHUB/actions",
  "timestamp": "2026-06-08T10:00:00.000Z"
}
```

**Response (Error)**:
```json
{
  "success": false,
  "error": "Invalid task parameter",
  "details": "Task must be one of: deploy, build, test"
}
```

**Example Usage**:

Deploy to Production:
```bash
curl -X POST https://ica-context-studio-github-production.up.railway.app/trigger-workflow \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key" \
  -d '{
    "task": "deploy",
    "environment": "production",
    "message": "Production deployment v1.2.3"
  }'
```

Run Tests:
```bash
curl -X POST https://ica-context-studio-github-production.up.railway.app/trigger-workflow \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key" \
  -d '{
    "task": "test",
    "environment": "development",
    "message": "Running test suite"
  }'
```

Build Application:
```bash
curl -X POST https://ica-context-studio-github-production.up.railway.app/trigger-workflow \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key" \
  -d '{
    "task": "build",
    "environment": "staging",
    "message": "Building release candidate"
  }'
```

**PowerShell Example**:
```powershell
$headers = @{
    "Content-Type" = "application/json"
    "x-api-key" = "your-api-key"
}

$body = @{
    task = "deploy"
    environment = "production"
    message = "Production deployment"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://ica-context-studio-github-production.up.railway.app/trigger-workflow" -Method POST -Headers $headers -Body $body
```

---

### 3. List Workflows

**Endpoint**: `GET /workflows`

**Purpose**: Get list of all available workflows in the repository

**Authentication**: Required (API Key)

**Headers**:
```
x-api-key: your-api-key-here
```

**Request**:
```bash
curl https://ica-context-studio-github-production.up.railway.app/workflows \
  -H "x-api-key: your-api-key"
```

**Response**:
```json
{
  "success": true,
  "repository": "rizukp/ICA-CONTEXT-STUDIO-GITHUB",
  "workflows": [
    {
      "id": 12345678,
      "name": "ICA Triggered Workflow",
      "path": ".github/workflows/main.yml",
      "state": "active",
      "url": "https://github.com/rizukp/ICA-CONTEXT-STUDIO-GITHUB/actions/workflows/main.yml"
    }
  ],
  "total": 1
}
```

**Use Cases**:
- Discover available workflows
- Verify workflow configuration
- Get workflow IDs for triggering
- Audit workflow inventory

---

### 4. Get Workflow Runs

**Endpoint**: `GET /workflow-runs`

**Purpose**: Get recent execution history for a workflow

**Authentication**: Required (API Key)

**Headers**:
```
x-api-key: your-api-key-here
```

**Query Parameters**:
- `workflow_id` (optional): Workflow file name (default: "main.yml")
- `per_page` (optional): Results per page (default: 10, max: 100)

**Request**:
```bash
curl "https://ica-context-studio-github-production.up.railway.app/workflow-runs?workflow_id=main.yml&per_page=5" \
  -H "x-api-key: your-api-key"
```

**Response**:
```json
{
  "success": true,
  "workflow": "main.yml",
  "runs": [
    {
      "id": 9876543210,
      "name": "ICA Triggered Workflow",
      "status": "completed",
      "conclusion": "success",
      "created_at": "2026-06-08T09:00:00Z",
      "updated_at": "2026-06-08T09:05:00Z",
      "html_url": "https://github.com/rizukp/ICA-CONTEXT-STUDIO-GITHUB/actions/runs/9876543210",
      "actor": "rizukp"
    },
    {
      "id": 9876543209,
      "name": "ICA Triggered Workflow",
      "status": "completed",
      "conclusion": "failure",
      "created_at": "2026-06-08T08:00:00Z",
      "updated_at": "2026-06-08T08:03:00Z",
      "html_url": "https://github.com/rizukp/ICA-CONTEXT-STUDIO-GITHUB/actions/runs/9876543209",
      "actor": "rizukp"
    }
  ],
  "total": 5
}
```

**Use Cases**:
- Monitor workflow execution history
- Check deployment status
- Troubleshoot failures
- Audit workflow activity

---

## Authentication

### API Key Authentication

The API uses API key authentication for security. The key can be provided in two ways:

**Method 1: x-api-key Header** (Recommended)
```bash
curl -H "x-api-key: your-api-key-here" http://localhost:3000/workflows
```

**Method 2: Authorization Bearer Token**
```bash
curl -H "Authorization: Bearer your-api-key-here" http://localhost:3000/workflows
```

### Generating API Keys

Generate a secure API key using Node.js crypto:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Example output:
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

### Security Best Practices

1. **Store Securely**: Keep API keys in environment variables, never in code
2. **Rotate Regularly**: Change API keys every 90 days
3. **Use HTTPS**: Always use HTTPS in production (ngrok provides this)
4. **Limit Scope**: Use different keys for different environments
5. **Monitor Usage**: Log all API requests for audit trails
6. **Revoke Compromised Keys**: Immediately revoke if exposed

---

## Error Handling

### HTTP Status Codes

- `200 OK`: Request successful
- `204 No Content`: Workflow triggered successfully (GitHub API response)
- `401 Unauthorized`: Invalid or missing API key
- `404 Not Found`: Workflow or resource not found
- `500 Internal Server Error`: Server or GitHub API error

### Error Response Format

```json
{
  "success": false,
  "error": "Error message",
  "details": "Additional error details"
}
```

### Common Errors

**Invalid API Key**:
```json
{
  "success": false,
  "error": "Unauthorized: Invalid API key"
}
```

**Workflow Not Found**:
```json
{
  "success": false,
  "error": "HttpError: Not Found",
  "details": {
    "message": "Not Found",
    "documentation_url": "https://docs.github.com/rest/actions/workflows"
  }
}
```

**Invalid Workflow Input**:
```json
{
  "success": false,
  "error": "Workflow does not accept input 'invalid_param'",
  "details": "Check workflow file for valid inputs"
}
```

---

## ICA Integration

### Context Studio Setup

**Context ID**: `ctx_58f67b2a31da`

**Purpose**: Stores workflow documentation, deployment procedures, and best practices

**Documents Loaded**:
- Workflow Triggering Guide
- Deployment Procedures
- API Integration Guide
- Agent Usage Examples
- GitHub Workflows Overview

### github-trigger Tool Configuration

The `github-trigger` tool is configured in ICA Context Forge:

**Tool Settings**:
- **Name**: github-trigger
- **Display Name**: github-trigger
- **URL**: https://ica-context-studio-github-production.up.railway.app/trigger-workflow
- **Integration Type**: REST
- **Request Type**: POST
- **Authentication**: Bearer Token + Custom Headers

**Headers**:
```json
{
  "Content-Type": "application/json",
  "x-api-key": "YOUR_API_KEY"
}
```

**Input Schema**: See "GitHub Trigger MCP Tool" section above

**Output Schema**: See "GitHub Trigger MCP Tool" section above

### Agent Configuration

**Platform**: ICA

**Framework**: LangGraph

**Pattern**: ReAct (Reason-Act-Observe)

**Model**: GPT-5.2

**Tools**:
- `context-hybrid-query`: Query Context Studio for documentation
- `github-trigger`: Trigger GitHub Actions workflows

### Agent Prompt Template

```
Create a GitHub workflow assistant for rizukp/ICA-CONTEXT-STUDIO-GITHUB that:

1. Queries Context Studio (ctx_58f67b2a31da) for workflow documentation
2. Uses github-trigger tool to trigger workflows
3. Supports deploy/build/test tasks in dev/staging/prod environments
4. Requires "CONFIRM" for production deployments
5. Provides clear explanations and monitoring URLs

The agent should:
- Always query Context Studio first for workflow information
- Explain actions clearly before executing
- For production: require explicit "CONFIRM" (case-sensitive)
- For non-production: ask for simple yes/no confirmation
- Provide GitHub Actions monitoring URLs
- Handle errors gracefully with helpful suggestions

Repository: rizukp/ICA-CONTEXT-STUDIO-GITHUB
Workflow: main.yml (ICA Triggered Workflow)
Branch: main

Available tasks:
- deploy: Deploy to environment
- build: Build the application
- test: Run test suite

Available environments:
- development: Safe for testing
- staging: Pre-production
- production: Live system (requires CONFIRM)
```

### Natural Language Commands

Users can ask ICA:

**Deployment Commands**:
- "Deploy to production"
- "Deploy version 1.2.3 to staging"
- "Push the latest changes to development"

**Build Commands**:
- "Build the application"
- "Create a production build"
- "Build for staging environment"

**Test Commands**:
- "Run all tests"
- "Execute the test suite"
- "Run tests in development"

**Status Commands**:
- "What workflows are available?"
- "Show recent workflow runs"
- "Check the status of the last deployment"

---

## Rate Limiting

### GitHub API Limits

- **Authenticated requests**: 5,000 per hour
- **Workflow triggers**: No specific limit, but subject to overall API limit
- **Best practice**: Implement exponential backoff for retries

### Local API Limits

No rate limiting implemented by default. Consider adding rate limiting for production:

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/trigger-workflow', limiter);
```

---

## Monitoring and Logging

### Server Logs

The API server logs all requests:

```
[INFO] Triggering workflow: main.yml on username/repo@main
[INFO] Inputs: {
  "task": "deploy",
  "environment": "production",
  "message": "Production deployment"
}
[SUCCESS] Workflow triggered successfully
```

### Error Logs

```
[ERROR] Failed to trigger workflow: Workflow not found
[ERROR] Failed to fetch workflows: Invalid authentication token
```

### Monitoring Recommendations

1. **Log Aggregation**: Use tools like ELK stack or Splunk
2. **Metrics**: Track request counts, response times, error rates
3. **Alerts**: Set up alerts for high error rates or failures
4. **Dashboards**: Create dashboards for workflow activity

---

## Testing

### Manual Testing

Test health endpoint:
```bash
curl http://localhost:3000/health
```

Test workflow trigger (with valid API key):
```bash
curl -X POST http://localhost:3000/trigger-workflow \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key" \
  -d '{
    "workflow_id": "main.yml",
    "inputs": {
      "task": "test",
      "environment": "development"
    }
  }'
```

### Automated Testing

Create a test script:

```javascript
// test-api.js
import fetch from 'node-fetch';

const API_URL = 'http://localhost:3000';
const API_KEY = process.env.API_KEY;

async function testHealth() {
  const response = await fetch(`${API_URL}/health`);
  const data = await response.json();
  console.log('Health check:', data.status);
}

async function testTriggerWorkflow() {
  const response = await fetch(`${API_URL}/trigger-workflow`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY
    },
    body: JSON.stringify({
      workflow_id: 'main.yml',
      inputs: {
        task: 'test',
        environment: 'development'
      }
    })
  });
  const data = await response.json();
  console.log('Trigger result:', data.success);
}

testHealth();
testTriggerWorkflow();
```

---

## Troubleshooting

### API Server Won't Start

**Problem**: Server fails to start

**Solutions**:
- Check if port 3000 is already in use
- Verify environment variables are set
- Check GitHub token is valid
- Review server logs for errors

### Workflow Trigger Fails

**Problem**: API returns error when triggering workflow

**Solutions**:
- Verify workflow file exists in repository
- Check GitHub token has `workflow` scope
- Ensure workflow supports `workflow_dispatch` trigger
- Validate input parameters match workflow definition

### Authentication Errors

**Problem**: 401 Unauthorized responses

**Solutions**:
- Verify API key is correct
- Check API key is included in request headers
- Ensure API_KEY environment variable is set
- Try regenerating the API key

### ngrok Connection Issues

**Problem**: ICA cannot reach the API

**Solutions**:
- Verify ngrok is running
- Check ngrok URL is correct in ICA
- Ensure ngrok tunnel is not expired
- Restart ngrok if needed

---

## Production Deployment

### Deploying to Cloud

For production use, deploy the Node.js server to a cloud platform:

**AWS Lambda**:
- Use serverless framework
- Configure API Gateway
- Set environment variables in Lambda

**Azure Functions**:
- Deploy as HTTP-triggered function
- Configure application settings
- Use Azure Key Vault for secrets

**Google Cloud Run**:
- Containerize the application
- Deploy to Cloud Run
- Configure environment variables

**Heroku**:
- Create Heroku app
- Set config vars
- Deploy via Git

### Security Enhancements

1. **HTTPS Only**: Enforce HTTPS in production
2. **IP Whitelisting**: Restrict access to known IPs
3. **Request Signing**: Implement request signature verification
4. **Audit Logging**: Log all API requests with timestamps
5. **Secret Rotation**: Automate API key rotation

---

## Additional Resources

- [GitHub Actions API Documentation](https://docs.github.com/en/rest/actions)
- [Octokit.js Documentation](https://octokit.github.io/rest.js/)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [ngrok Documentation](https://ngrok.com/docs)