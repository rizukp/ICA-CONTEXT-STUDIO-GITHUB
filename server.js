import express from 'express';
import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';
import cors from 'cors';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Key authentication middleware
const authenticateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');
  
  if (!process.env.API_KEY) {
    console.warn('[WARNING] API_KEY not set in environment variables. Authentication disabled.');
    return next();
  }
  
  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ 
      success: false, 
      error: 'Unauthorized: Invalid API key' 
    });
  }
  
  next();
};

// Initialize Octokit with GitHub token
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

// GitHub repository configuration
const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;

// Validate configuration
if (!process.env.GITHUB_TOKEN) {
  console.error('[ERROR] GITHUB_TOKEN is not set in environment variables!');
  process.exit(1);
}

if (!GITHUB_OWNER || !GITHUB_REPO) {
  console.error('[ERROR] GITHUB_OWNER and GITHUB_REPO must be set in environment variables!');
  process.exit(1);
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'ICA Context Studio GitHub Integration',
    repository: `${GITHUB_OWNER}/${GITHUB_REPO}`,
    github_token_configured: !!process.env.GITHUB_TOKEN,
    api_key_configured: !!process.env.API_KEY
  });
});

// Endpoint to trigger GitHub Actions workflow
app.post('/trigger-workflow', authenticateApiKey, async (req, res) => {
  try {
    const { 
      workflow_id = 'main.yml', 
      ref = 'main', 
      inputs = {} 
    } = req.body;

    console.log(`[INFO] Triggering workflow: ${workflow_id} on ${GITHUB_OWNER}/${GITHUB_REPO}@${ref}`);
    console.log('[INFO] Inputs:', JSON.stringify(inputs, null, 2));

    // Trigger the workflow
    const response = await octokit.actions.createWorkflowDispatch({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      workflow_id: workflow_id,
      ref: ref,
      inputs: inputs
    });

    console.log('[SUCCESS] Workflow triggered successfully');

    res.json({
      success: true,
      message: 'Workflow triggered successfully',
      status: response.status,
      workflow: workflow_id,
      ref: ref,
      repository: `${GITHUB_OWNER}/${GITHUB_REPO}`,
      github_url: `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/actions`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[ERROR] Failed to trigger workflow:', error.message);
    
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.response?.data || 'No additional details available'
    });
  }
});

// Endpoint to list available workflows
app.get('/workflows', authenticateApiKey, async (req, res) => {
  try {
    const response = await octokit.actions.listRepoWorkflows({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO
    });

    const workflows = response.data.workflows.map(workflow => ({
      id: workflow.id,
      name: workflow.name,
      path: workflow.path,
      state: workflow.state,
      url: workflow.html_url
    }));

    res.json({
      success: true,
      repository: `${GITHUB_OWNER}/${GITHUB_REPO}`,
      workflows: workflows,
      total: workflows.length
    });

  } catch (error) {
    console.error('[ERROR] Failed to fetch workflows:', error.message);
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Endpoint to get recent workflow runs
app.get('/workflow-runs', authenticateApiKey, async (req, res) => {
  try {
    const { workflow_id = 'main.yml', per_page = 10 } = req.query;

    const response = await octokit.actions.listWorkflowRuns({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      workflow_id: workflow_id,
      per_page: parseInt(per_page)
    });

    const runs = response.data.workflow_runs.map(run => ({
      id: run.id,
      name: run.name,
      status: run.status,
      conclusion: run.conclusion,
      created_at: run.created_at,
      updated_at: run.updated_at,
      html_url: run.html_url,
      actor: run.actor?.login
    }));

    res.json({
      success: true,
      workflow: workflow_id,
      runs: runs,
      total: runs.length
    });

  } catch (error) {
    console.error('[ERROR] Failed to fetch workflow runs:', error.message);
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[ERROR] Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('='.repeat(70));
  console.log('🚀 ICA Context Studio GitHub Integration Server Started');
  console.log('='.repeat(70));
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🔗 Local URL: http://localhost:${PORT}`);
  console.log(`📦 Repository: ${GITHUB_OWNER}/${GITHUB_REPO}`);
  console.log(`🔐 API Key Auth: ${process.env.API_KEY ? 'Enabled ✅' : 'Disabled ⚠️'}`);
  console.log(`🔑 GitHub Token: ${process.env.GITHUB_TOKEN ? 'Configured ✅' : 'Missing ❌'}`);
  console.log('='.repeat(70));
  console.log('\n📋 Available endpoints:');
  console.log(`  GET  /health           - Health check`);
  console.log(`  POST /trigger-workflow - Trigger a workflow`);
  console.log(`  GET  /workflows        - List all workflows`);
  console.log(`  GET  /workflow-runs    - Get recent workflow runs`);
  console.log('='.repeat(70));
  console.log('\n💡 Next steps:');
  console.log('  1. Create a context in Context Studio with GitHub workflow knowledge');
  console.log('  2. Expose the context as an MCP server');
  console.log('  3. Create an ICA Agentic App');
  console.log('  4. Configure the agent to use Context Studio and this API');
  console.log('  5. Test: Ask ICA "Deploy to production"');
  console.log('='.repeat(70));
});

export default app;

// Made with Bob
