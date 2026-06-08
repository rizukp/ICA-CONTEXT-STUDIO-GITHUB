# GitHub Workflows API Integration Guide

## Overview

This guide explains how to integrate with GitHub Actions workflows through the API, specifically for use with ICA Context Studio and agentic applications.

## API Architecture

```
ICA Agentic App
    ↓ (HTTPS Request)
Local Node.js Server (via ngrok)
    ↓ (GitHub API Call)
GitHub Actions
    ↓ (Workflow Execution)
Deployment/Build/Test
```

## API Endpoints

### 1. Health Check

**Endpoint**: `GET /health`

**Purpose**: Verify API server is running and configured correctly

**Authentication**: None required

**Request**:
```bash
curl http://localhost:3000/health
```

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2026-06-08T10:00:00.000Z",
  "service": "ICA Context Studio GitHub Integration",
  "repository": "username/repo-name",
  "github_token_configured": true,
  "api_key_configured": true
}
```

**Use Cases**:
- Verify server is running
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
  "workflow_id": "main.yml",
  "ref": "main",
  "inputs": {
    "task": "deploy",
    "environment": "production",
    "message": "Deploying version 1.2.3"
  }
}
```

**Parameters**:
- `workflow_id` (optional): Workflow file name (default: "main.yml")
- `ref` (optional): Git branch/tag/commit (default: "main")
- `inputs` (optional): Workflow input parameters (default: {})

**Response (Success)**:
```json
{
  "success": true,
  "message": "Workflow triggered successfully",
  "status": 204,
  "workflow": "main.yml",
  "ref": "main",
  "repository": "username/repo-name",
  "github_url": "https://github.com/username/repo-name/actions",
  "timestamp": "2026-06-08T10:00:00.000Z"
}
```

**Response (Error)**:
```json
{
  "success": false,
  "error": "Workflow not found",
  "details": "No workflow found with ID: invalid.yml"
}
```

**Example Usage**:

Deploy to Production:
```bash
curl -X POST http://localhost:3000/trigger-workflow \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key" \
  -d '{
    "workflow_id": "main.yml",
    "ref": "main",
    "inputs": {
      "task": "deploy",
      "environment": "production",
      "message": "Production deployment v1.2.3"
    }
  }'
```

Run Tests:
```bash
curl -X POST http://localhost:3000/trigger-workflow \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key" \
  -d '{
    "workflow_id": "main.yml",
    "ref": "main",
    "inputs": {
      "task": "test",
      "environment": "development",
      "message": "Running test suite"
    }
  }'
```

Build Application:
```bash
curl -X POST http://localhost:3000/trigger-workflow \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key" \
  -d '{
    "workflow_id": "main.yml",
    "ref": "main",
    "inputs": {
      "task": "build",
      "environment": "staging",
      "message": "Building release candidate"
    }
  }'
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
curl http://localhost:3000/workflows \
  -H "x-api-key: your-api-key"
```

**Response**:
```json
{
  "success": true,
  "repository": "username/repo-name",
  "workflows": [
    {
      "id": 12345678,
      "name": "ICA Triggered Workflow",
      "path": ".github/workflows/main.yml",
      "state": "active",
      "url": "https://github.com/username/repo-name/actions/workflows/main.yml"
    },
    {
      "id": 87654321,
      "name": "CI Pipeline",
      "path": ".github/workflows/ci.yml",
      "state": "active",
      "url": "https://github.com/username/repo-name/actions/workflows/ci.yml"
    }
  ],
  "total": 2
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
curl "http://localhost:3000/workflow-runs?workflow_id=main.yml&per_page=5" \
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
      "html_url": "https://github.com/username/repo-name/actions/runs/9876543210",
      "actor": "username"
    },
    {
      "id": 9876543209,
      "name": "ICA Triggered Workflow",
      "status": "completed",
      "conclusion": "failure",
      "created_at": "2026-06-08T08:00:00Z",
      "updated_at": "2026-06-08T08:03:00Z",
      "html_url": "https://github.com/username/repo-name/actions/runs/9876543209",
      "actor": "username"
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

### Configuring ICA Agentic App

1. **Create Custom Tool in ICA**:
   - Tool Name: `trigger_github_workflow`
   - Type: HTTP Request
   - Method: POST
   - URL: `https://your-ngrok-url.ngrok.io/trigger-workflow`

2. **Configure Headers**:
   ```json
   {
     "Content-Type": "application/json",
     "x-api-key": "${API_KEY}"
   }
   ```

3. **Configure Body Template**:
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

### Agent Prompt Example

```
You are a GitHub workflow automation agent. You can trigger workflows, check their status, and provide deployment guidance.

Available tools:
- trigger_github_workflow: Trigger a GitHub Actions workflow
- list_workflows: Get available workflows
- get_workflow_runs: Check workflow execution history

When a user requests a deployment:
1. Query Context Studio for deployment best practices
2. Verify the environment is appropriate
3. Confirm with the user
4. Trigger the workflow
5. Provide the GitHub Actions URL for monitoring

Always follow deployment best practices from Context Studio.
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