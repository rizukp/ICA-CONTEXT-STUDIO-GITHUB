# ICA Context Studio GitHub Integration

> Natural language interface for triggering GitHub Actions workflows using ICA Context Studio and agentic AI

## 🎯 What This Does

This project enables you to trigger GitHub Actions workflows using natural language commands through ICA (IBM Consulting Advantage) agentic applications. Simply ask:

- **"Deploy to production"** → Triggers production deployment workflow
- **"Run tests in staging"** → Executes test suite in staging environment
- **"Build the application"** → Starts build workflow
- **"What are the deployment best practices?"** → Queries Context Studio knowledge base

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     ICA Agentic App (Cloud)                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Agent with Context Studio Knowledge                     │   │
│  │  - Queries deployment best practices                     │   │
│  │  - Validates requests against guidelines                 │   │
│  │  - Triggers workflows via API                            │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS Request
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                    ngrok Tunnel (Bridge)                        │
│  - Exposes local server to internet                            │
│  - Provides HTTPS endpoint                                     │
│  - Handles secure tunneling                                    │
└────────────────────────────┬────────────────────────────────────┘
                             │ Forwarded Request
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│              Local Node.js API Server (Your Machine)            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Express.js Server                                       │   │
│  │  - API key authentication                                │   │
│  │  - Endpoints: /trigger-workflow, /workflows, /runs       │   │
│  │  - Error handling and logging                            │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │ GitHub API Call
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                    GitHub Actions (Cloud)                       │
│  - Receives workflow dispatch events                           │
│  - Executes CI/CD pipelines                                    │
│  - Deploys to environments                                     │
└─────────────────────────────────────────────────────────────────┘
```

## 📋 Prerequisites

- ✅ **IBM Consulting Advantage (ICA)** access
- ✅ **Context Studio** access (part of ICA)
- ✅ **GitHub repository** with Actions enabled
- ✅ **GitHub Personal Access Token** with `repo` and `workflow` scopes
- ✅ **Node.js v18+** installed
- ✅ **ngrok account** (free tier works)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd ICA-CONTEXT-STUDIO-GITHUB
npm install
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your credentials
# - GITHUB_TOKEN: Your GitHub Personal Access Token
# - GITHUB_OWNER: Your GitHub username
# - GITHUB_REPO: Your repository name
# - API_KEY: Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Start the Server

```bash
npm start
```

### 4. Expose with ngrok

In a separate terminal:

```bash
ngrok http 3000
```

Copy the ngrok URL (e.g., `https://abc123.ngrok.io`)

### 5. Setup Context Studio

1. **Import Schema**: Upload `github-workflows-ontology.jsonld` to Context Studio
2. **Create Context**: Create a new context and link the schema
3. **Upload Documents**: Upload all files from `docs/` folder
4. **Expose as MCP**: Enable MCP server exposure and save the details

### 6. Create ICA Agentic App

1. **Create App**: In ICA Agentic App Studio
2. **Connect MCP**: Add Context Studio MCP server
3. **Create Agent**: Use the provided agent prompt (see docs)
4. **Add Custom Tool**: Configure GitHub API tool with your ngrok URL
5. **Create Workflow**: Chat Input → Agent → Chat Output
6. **Test**: Try "Deploy to staging"

## 📁 Project Structure

```
ICA-CONTEXT-STUDIO-GITHUB/
├── server.js                          # Express API server
├── package.json                       # Node.js dependencies
├── .env.example                       # Environment variables template
├── .gitignore                         # Git ignore rules
├── github-workflows-ontology.jsonld   # JSON-LD schema for Context Studio
├── docs/
│   ├── github-workflows-overview.md   # Workflows documentation
│   ├── deployment-procedures.md       # Deployment best practices
│   ├── api-integration-guide.md       # API usage guide
│   └── ica-setup-instructions.md      # Complete ICA setup guide
├── COMPLETE-SETUP-GUIDE.md            # Detailed setup instructions
├── QUICK-START.md                     # Fast setup guide
└── README.md                          # This file
```

## 🔧 API Endpoints

### Health Check
```bash
GET /health
```
Returns server status and configuration.

### Trigger Workflow
```bash
POST /trigger-workflow
Headers: x-api-key: your-api-key
Body: {
  "workflow_id": "main.yml",
  "ref": "main",
  "inputs": {
    "task": "deploy",
    "environment": "production",
    "message": "Deploying v1.2.3"
  }
}
```

### List Workflows
```bash
GET /workflows
Headers: x-api-key: your-api-key
```

### Get Workflow Runs
```bash
GET /workflow-runs?workflow_id=main.yml&per_page=10
Headers: x-api-key: your-api-key
```

## 📚 Documentation

### For Users
- **[QUICK-START.md](QUICK-START.md)** - Get running in 10 minutes
- **[COMPLETE-SETUP-GUIDE.md](COMPLETE-SETUP-GUIDE.md)** - Detailed setup instructions

### For Developers
- **[docs/api-integration-guide.md](docs/api-integration-guide.md)** - API reference and integration
- **[docs/github-workflows-overview.md](docs/github-workflows-overview.md)** - Workflows documentation
- **[docs/deployment-procedures.md](docs/deployment-procedures.md)** - Deployment best practices

### For ICA Setup
- **[docs/ica-setup-instructions.md](docs/ica-setup-instructions.md)** - Complete ICA configuration guide

## 🎓 Context Studio Schema

The `github-workflows-ontology.jsonld` defines:

### Entities
- **Workflow**: GitHub Actions workflow definition
- **WorkflowRun**: Execution instance of a workflow
- **Job**: Set of steps in a workflow
- **Step**: Individual task in a job
- **Environment**: Deployment target (dev, staging, prod)
- **Deployment**: Code deployment to an environment
- **Repository**: GitHub repository

### Operations
- **TriggerWorkflow**: Manually trigger a workflow
- **DeployToEnvironment**: Deploy to specific environment
- **ApproveDeployment**: Approve protected deployments
- **RollbackDeployment**: Rollback to previous version
- **CancelWorkflowRun**: Cancel in-progress workflow

### States
- Workflow states: Active, Disabled
- Run states: Queued, InProgress, Completed
- Deployment states: Pending, InProgress, Success, Failure

## 🔐 Security

### API Key Authentication
- Generate secure keys: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Store in `.env` file (never commit)
- Rotate every 90 days
- Use different keys for different environments

### GitHub Token
- Requires `repo` and `workflow` scopes
- Store securely in `.env`
- Never commit to version control
- Rotate regularly

### ngrok Security
- Free tier provides HTTPS
- Consider ngrok authentication for production
- Monitor access logs
- Use static domains for production (paid feature)

## 🧪 Testing

### Test Health Endpoint
```bash
curl http://localhost:3000/health
```

### Test Workflow Trigger
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

### Test via ICA
In ICA playground, try:
- "What workflows are available?"
- "Deploy to development"
- "Show recent workflow runs"

## 🐛 Troubleshooting

### Server Won't Start
- Check if port 3000 is in use
- Verify environment variables are set
- Ensure GitHub token is valid

### Workflow Trigger Fails
- Verify workflow file exists in repo
- Check GitHub token has `workflow` scope
- Ensure workflow supports `workflow_dispatch`

### ICA Can't Reach API
- Verify ngrok is running
- Check ngrok URL is correct in ICA
- Ensure API key matches

### Context Studio Not Responding
- Verify MCP server is connected
- Check Context ID is correct in agent prompt
- Ensure context is published

## 📊 Monitoring

### Server Logs
The server logs all requests:
```
[INFO] Triggering workflow: main.yml on user/repo@main
[SUCCESS] Workflow triggered successfully
```

### GitHub Actions
Monitor workflows at:
```
https://github.com/YOUR_USERNAME/YOUR_REPO/actions
```

### Recommended Monitoring
- Set up alerts for workflow failures
- Monitor API response times
- Track deployment frequency
- Review error rates

## 🚀 Production Deployment

For production use, consider:

1. **Deploy to Cloud**:
   - AWS Lambda + API Gateway
   - Azure Functions
   - Google Cloud Run
   - Heroku

2. **Security Enhancements**:
   - IP whitelisting
   - Request signing
   - Rate limiting
   - Audit logging

3. **Monitoring**:
   - Application Performance Monitoring (APM)
   - Log aggregation (ELK, Splunk)
   - Alerting (PagerDuty, Opsgenie)

4. **High Availability**:
   - Load balancing
   - Auto-scaling
   - Health checks
   - Failover strategies

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Built with [Express.js](https://expressjs.com/)
- GitHub API via [Octokit](https://octokit.github.io/)
- Powered by [IBM Consulting Advantage](https://www.ibm.com/consulting/advantage)
- Tunneling by [ngrok](https://ngrok.com/)

## 📞 Support

For issues and questions:

1. Check the [troubleshooting section](#-troubleshooting)
2. Review the [documentation](#-documentation)
3. Open an issue on GitHub
4. Contact your ICA administrator

## 🗺️ Roadmap

- [ ] Add support for multiple repositories
- [ ] Implement workflow approval workflows
- [ ] Add Slack/Teams notifications
- [ ] Create web dashboard for monitoring
- [ ] Add support for scheduled workflows
- [ ] Implement rollback automation
- [ ] Add deployment analytics

## 📈 Version History

### v1.0.0 (2026-06-08)
- Initial release
- Basic workflow triggering
- Context Studio integration
- ICA agentic app support
- Complete documentation

---

**Made with ❤️ by Bob**

*Empowering developers to deploy with confidence using natural language and AI*