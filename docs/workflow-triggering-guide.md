# GitHub Workflow Triggering Guide

## Overview
This guide explains how to trigger GitHub Actions workflows for the ICA-CONTEXT-STUDIO-GITHUB repository using natural language commands through the ICA agent.

## Repository Information
- **Repository**: rizukp/ICA-CONTEXT-STUDIO-GITHUB
- **Workflow File**: `.github/workflows/main.yml`
- **Workflow Name**: ICA Triggered Workflow
- **Branch**: main
- **Trigger Type**: workflow_dispatch (manual/API trigger)
- **Railway API**: https://ica-context-studio-github-production.up.railway.app

## Available Workflows

### ICA Triggered Workflow (main.yml)
**Purpose**: Handles deployment, build, and test operations across different environments.

**Trigger Method**: 
- Via ICA agent using natural language
- Via Railway API endpoint
- Via github-trigger MCP tool

**Inputs**:
- `task` (required): The operation to perform
  - `deploy`: Deploy the application to specified environment
  - `build`: Build the application and run compilation
  - `test`: Run automated test suite
  
- `environment` (required): The target environment
  - `development`: Development environment (safe for testing)
  - `staging`: Staging environment (pre-production testing)
  - `production`: Production environment (live system)
  
- `message` (optional): Custom message for the workflow run
  - Default: Auto-generated based on task and environment
  - Example: "Production deployment via ICA agent"

## Workflow Tasks

### Deploy Task
**Purpose**: Deploy the application to the specified environment

**What it does**:
1. Checks out the code from the main branch
2. Sets up the deployment environment
3. Runs deployment scripts
4. Verifies deployment success
5. Reports completion status

**Typical Duration**: 2-5 minutes

**Environments**:
- Development: Deploys to dev server, no approval needed
- Staging: Deploys to staging server, simple confirmation
- Production: Deploys to live server, requires explicit "CONFIRM"

**Example Commands**:
- "Deploy to development"
- "Deploy to staging"
- "Deploy to production" (requires CONFIRM)

### Build Task
**Purpose**: Build the application and verify compilation

**What it does**:
1. Checks out the code
2. Installs dependencies
3. Runs build process
4. Generates build artifacts
5. Reports build status

**Typical Duration**: 1-3 minutes

**Environments**: All (development, staging, production)

**Example Commands**:
- "Build the project"
- "Build in development"
- "Create a production build"

### Test Task
**Purpose**: Run automated test suite

**What it does**:
1. Checks out the code
2. Sets up test environment
3. Runs unit tests
4. Runs integration tests
5. Generates test reports

**Typical Duration**: 2-4 minutes

**Environments**: Typically development or staging

**Example Commands**:
- "Run tests"
- "Run all tests"
- "Execute test suite in development"

## Safety Guidelines

### Production Deployments
**CRITICAL**: Production deployments affect the live system and require special care.

**Before triggering production deployment**:
1. ✅ Verify the code has been tested in staging
2. ✅ Ensure all tests pass
3. ✅ Check for any ongoing incidents
4. ✅ Have a rollback plan ready
5. ✅ Notify relevant stakeholders

**Confirmation Required**: User must type exactly "CONFIRM" (case-sensitive)

**Monitoring**: Always monitor the deployment at:
https://github.com/rizukp/ICA-CONTEXT-STUDIO-GITHUB/actions

### Non-Production Deployments
**Development and Staging**: Lower risk, simpler confirmation process

**Best Practices**:
- Test in development first
- Validate in staging before production
- Use descriptive messages for workflow runs

## Triggering Workflows

### Via ICA Agent (Recommended)
Use natural language commands with the ICA agent:

**Query Available Workflows**:
```
"What workflows are available?"
"Show me the available workflows"
"List all workflows"
```

**Development Commands**:
```
"Build the project in development"
"Deploy to development"
"Run tests in development"
```

**Staging Commands**:
```
"Deploy to staging"
"Build for staging"
"Test in staging environment"
```

**Production Commands** (requires CONFIRM):
```
"Deploy to production"
"Build for production"
```

### Via Railway API (Direct)
**Endpoint**: `https://ica-context-studio-github-production.up.railway.app/trigger-workflow`

**Method**: POST

**Headers**:
```json
{
  "Content-Type": "application/json",
  "x-api-key": "YOUR_API_KEY"
}
```

**Body**:
```json
{
  "task": "deploy",
  "environment": "production",
  "message": "Production deployment"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Workflow triggered successfully",
  "workflow": "main.yml",
  "run_url": "https://github.com/rizukp/ICA-CONTEXT-STUDIO-GITHUB/actions/runs/12345",
  "github_url": "https://github.com/rizukp/ICA-CONTEXT-STUDIO-GITHUB/actions"
}
```

### Via github-trigger MCP Tool
The ICA agent uses the `github-trigger` MCP tool configured in Context Forge:

**Tool Configuration**:
- Tool ID: github-trigger
- Endpoint: Railway API
- Authentication: Bearer Token + x-api-key header
- Method: POST

**Input Parameters**:
```json
{
  "task": "deploy|build|test",
  "environment": "development|staging|production",
  "message": "optional message"
}
```

## Monitoring Workflows

### GitHub Actions Dashboard
**URL**: https://github.com/rizukp/ICA-CONTEXT-STUDIO-GITHUB/actions

**What you can see**:
- All workflow runs (current and historical)
- Run status (queued, in progress, completed, failed)
- Run duration and logs
- Triggered by information
- Input parameters used

### Workflow Run Details
Click on any workflow run to see:
- Step-by-step execution logs
- Environment variables
- Artifacts generated
- Error messages (if failed)

### Real-time Monitoring
The ICA agent provides monitoring URLs after triggering workflows:
```
✅ Workflow triggered successfully!

Monitor at: https://github.com/rizukp/ICA-CONTEXT-STUDIO-GITHUB/actions/runs/12345

The deployment will complete in approximately 2-5 minutes.
```

## Troubleshooting

### Workflow Fails to Trigger
**Possible Causes**:
1. Invalid API key
2. GitHub token expired
3. Repository permissions issue
4. Railway server down
5. Incorrect workflow parameters

**Solutions**:
1. Verify API key is correct
2. Check Railway server health: `https://ica-context-studio-github-production.up.railway.app/health`
3. Verify GitHub token has `repo` and `workflow` scopes
4. Check Railway logs for errors
5. Validate input parameters (task, environment)

### Workflow Fails During Execution
**Possible Causes**:
1. Code compilation errors
2. Test failures
3. Deployment script errors
4. Environment configuration issues
5. Resource constraints

**Solutions**:
1. Check workflow logs in GitHub Actions
2. Review recent code changes
3. Verify environment configuration
4. Test locally before deploying
5. Check for dependency issues

### Production Deployment Blocked
**Possible Causes**:
1. Missing "CONFIRM" keyword
2. Insufficient permissions
3. Environment protection rules
4. Ongoing incidents

**Solutions**:
1. Type exactly "CONFIRM" when prompted (case-sensitive)
2. Verify user has deployment permissions
3. Check GitHub environment protection settings
4. Resolve any ongoing incidents first

### Agent Cannot Find Workflow
**Possible Causes**:
1. Context Studio context ID incorrect
2. Workflow documentation not loaded
3. MCP tool misconfigured

**Solutions**:
1. Verify Context Studio context ID: ctx_58f67b2a31da
2. Re-upload workflow documentation to Context Studio
3. Check github-trigger tool configuration in Context Forge

## Best Practices

### 1. Test Before Production
Always test changes in development and staging before deploying to production.

**Recommended Flow**:
```
Development → Staging → Production
```

### 2. Use Descriptive Messages
Provide clear messages when triggering workflows:
- ✅ Good: "Deploy user authentication feature to production"
- ❌ Bad: "deploy"

### 3. Monitor Deployments
Always watch the workflow execution in GitHub Actions, especially for production.

### 4. Have a Rollback Plan
Before production deployments, know how to rollback if something goes wrong.

### 5. Communicate
Notify team members before and after production deployments.

### 6. Follow Confirmation Protocol
For production deployments:
- Agent will explain what will be deployed
- Agent will ask for "CONFIRM"
- Only type "CONFIRM" if you're ready
- Never skip the confirmation step

## Agent Interaction Examples

### Example 1: Development Build

**User**: "Build the project in development"

**Agent**:
```
I'll trigger a build in the development environment.

Workflow Details:
- Task: build
- Environment: development
- Repository: rizukp/ICA-CONTEXT-STUDIO-GITHUB
- Branch: main

This will compile the code and generate build artifacts.
Estimated duration: 1-3 minutes.

Proceed? (yes/no)
```

**User**: "yes"

**Agent**:
```
✅ Build triggered successfully!

Monitor the build at:
https://github.com/rizukp/ICA-CONTEXT-STUDIO-GITHUB/actions

The build will complete in approximately 1-3 minutes.
```

### Example 2: Production Deployment

**User**: "Deploy to production"

**Agent**:
```
⚠️ PRODUCTION DEPLOYMENT

This will deploy to the LIVE production environment.

Workflow Details:
- Task: deploy
- Environment: production
- Repository: rizukp/ICA-CONTEXT-STUDIO-GITHUB
- Branch: main

Impact:
- Affects live users
- Changes will be immediately visible
- Requires careful monitoring

Before proceeding, ensure:
✓ Code has been tested in staging
✓ All tests pass
✓ Team has been notified
✓ Rollback plan is ready

To proceed with this production deployment, type: CONFIRM
```

**User**: "CONFIRM"

**Agent**:
```
✅ Production deployment triggered successfully!

Workflow: ICA Triggered Workflow (main.yml)
Task: deploy
Environment: production
Message: Production deployment

Monitor the deployment at:
https://github.com/rizukp/ICA-CONTEXT-STUDIO-GITHUB/actions

The deployment will complete in approximately 2-5 minutes.

Please monitor the deployment closely and verify:
- Application starts successfully
- No errors in logs
- Core functionality works
- Performance is acceptable

If issues occur, be ready to rollback immediately.
```

### Example 3: Querying Available Workflows

**User**: "What workflows are available?"

**Agent**:
```
Based on the workflow documentation, here are the available workflows:

**ICA Triggered Workflow** (main.yml)
- Purpose: Handles deployment, build, and test operations
- Branch: main
- Trigger: Manual/API

Available Tasks:
1. **deploy** - Deploy the application
   - Environments: development, staging, production
   - Duration: 2-5 minutes

2. **build** - Build the application
   - Environments: development, staging, production
   - Duration: 1-3 minutes

3. **test** - Run automated tests
   - Environments: development, staging
   - Duration: 2-4 minutes

You can trigger these workflows by saying:
- "Build in development"
- "Deploy to staging"
- "Run tests"
- "Deploy to production" (requires CONFIRM)

Monitor all workflows at:
https://github.com/rizukp/ICA-CONTEXT-STUDIO-GITHUB/actions
```

## Quick Reference

### Common Commands
```
"What workflows are available?" - List available workflows
"Build in development" - Build in dev environment
"Deploy to staging" - Deploy to staging
"Run tests" - Run test suite
"Deploy to production" - Deploy to prod (requires CONFIRM)
```

### Workflow URLs
- **Actions Dashboard**: https://github.com/rizukp/ICA-CONTEXT-STUDIO-GITHUB/actions
- **Workflow File**: https://github.com/rizukp/ICA-CONTEXT-STUDIO-GITHUB/blob/main/.github/workflows/main.yml
- **Railway API**: https://ica-context-studio-github-production.up.railway.app
- **Railway Health**: https://ica-context-studio-github-production.up.railway.app/health

### Context Studio
- **Context ID**: ctx_58f67b2a31da
- **Purpose**: Stores workflow documentation and best practices
- **Usage**: Agent queries this context for workflow information

### Support
For issues or questions:
1. Check workflow logs in GitHub Actions
2. Review Railway server logs
3. Verify github-trigger tool configuration in Context Forge
4. Consult this documentation
5. Contact repository maintainers

## Security Considerations

### API Key Protection
- Never share API keys publicly
- Store in environment variables
- Rotate keys regularly
- Revoke compromised keys immediately

### GitHub Token Security
- Use tokens with minimal required scopes
- Rotate tokens every 90 days
- Never commit tokens to repository
- Use GitHub Secrets for storage

### Production Access
- Limit production deployment permissions
- Require explicit confirmation
- Log all production deployments
- Monitor for unauthorized access

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax Reference](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [Railway Documentation](https://docs.railway.app/)
- [ICA Context Studio Guide](./ica-setup-instructions.md)
- [Deployment Procedures](./deployment-procedures.md)