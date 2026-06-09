import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

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

// Create MCP server
const server = new Server(
  {
    name: 'github-workflows-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'trigger_github_workflow',
        description: `Triggers a GitHub Actions workflow in ${GITHUB_OWNER}/${GITHUB_REPO}. Use this to deploy, build, or run tests.`,
        inputSchema: {
          type: 'object',
          properties: {
            workflow_id: {
              type: 'string',
              description: 'Workflow file name (e.g., main.yml)',
              default: 'main.yml'
            },
            ref: {
              type: 'string',
              description: 'Git branch, tag, or commit SHA',
              default: 'main'
            },
            task: {
              type: 'string',
              description: 'Task to execute: deploy, build, or test',
              enum: ['deploy', 'build', 'test']
            },
            environment: {
              type: 'string',
              description: 'Target environment',
              enum: ['development', 'staging', 'production']
            },
            message: {
              type: 'string',
              description: 'Custom message for the workflow run'
            }
          },
          required: ['task', 'environment']
        }
      },
      {
        name: 'list_github_workflows',
        description: `Lists all available workflows in ${GITHUB_OWNER}/${GITHUB_REPO}`,
        inputSchema: {
          type: 'object',
          properties: {}
        }
      },
      {
        name: 'get_workflow_runs',
        description: `Gets recent workflow runs for a specific workflow in ${GITHUB_OWNER}/${GITHUB_REPO}`,
        inputSchema: {
          type: 'object',
          properties: {
            workflow_id: {
              type: 'string',
              description: 'Workflow file name (e.g., main.yml)',
              default: 'main.yml'
            },
            per_page: {
              type: 'number',
              description: 'Number of results to return (max 100)',
              default: 10
            }
          }
        }
      },
      {
        name: 'get_workflow_run_status',
        description: `Gets the status of a specific workflow run in ${GITHUB_OWNER}/${GITHUB_REPO}`,
        inputSchema: {
          type: 'object',
          properties: {
            run_id: {
              type: 'string',
              description: 'Workflow run ID',
              required: true
            }
          },
          required: ['run_id']
        }
      }
    ]
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'trigger_github_workflow': {
        const {
          workflow_id = 'main.yml',
          ref = 'main',
          task,
          environment,
          message = `${task} to ${environment}`
        } = args;

        console.error(`[INFO] Triggering workflow: ${workflow_id} on ${GITHUB_OWNER}/${GITHUB_REPO}@${ref}`);
        console.error(`[INFO] Task: ${task}, Environment: ${environment}`);

        // Trigger the workflow
        await octokit.actions.createWorkflowDispatch({
          owner: GITHUB_OWNER,
          repo: GITHUB_REPO,
          workflow_id: workflow_id,
          ref: ref,
          inputs: {
            task: task,
            environment: environment,
            message: message
          }
        });

        console.error('[SUCCESS] Workflow triggered successfully');

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                message: 'Workflow triggered successfully',
                workflow: workflow_id,
                ref: ref,
                task: task,
                environment: environment,
                repository: `${GITHUB_OWNER}/${GITHUB_REPO}`,
                github_url: `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/actions`,
                instructions: 'Check the GitHub Actions tab to monitor the workflow run'
              }, null, 2)
            }
          ]
        };
      }

      case 'list_github_workflows': {
        console.error('[INFO] Listing workflows');

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

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                repository: `${GITHUB_OWNER}/${GITHUB_REPO}`,
                workflows: workflows,
                total: workflows.length
              }, null, 2)
            }
          ]
        };
      }

      case 'get_workflow_runs': {
        const { workflow_id = 'main.yml', per_page = 10 } = args;

        console.error(`[INFO] Getting workflow runs for ${workflow_id}`);

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

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                workflow: workflow_id,
                runs: runs,
                total: runs.length
              }, null, 2)
            }
          ]
        };
      }

      case 'get_workflow_run_status': {
        const { run_id } = args;

        console.error(`[INFO] Getting status for run ${run_id}`);

        const response = await octokit.actions.getWorkflowRun({
          owner: GITHUB_OWNER,
          repo: GITHUB_REPO,
          run_id: parseInt(run_id)
        });

        const run = response.data;

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                run: {
                  id: run.id,
                  name: run.name,
                  status: run.status,
                  conclusion: run.conclusion,
                  created_at: run.created_at,
                  updated_at: run.updated_at,
                  html_url: run.html_url,
                  actor: run.actor?.login,
                  event: run.event,
                  head_branch: run.head_branch,
                  head_sha: run.head_sha
                }
              }, null, 2)
            }
          ]
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    console.error(`[ERROR] Tool execution failed:`, error.message);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: error.message,
            details: error.response?.data || 'No additional details available'
          }, null, 2)
        }
      ],
      isError: true
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error('='.repeat(70));
  console.error('🚀 GitHub Workflows MCP Server Started');
  console.error('='.repeat(70));
  console.error(`📦 Repository: ${GITHUB_OWNER}/${GITHUB_REPO}`);
  console.error(`🔑 GitHub Token: ${process.env.GITHUB_TOKEN ? 'Configured ✅' : 'Missing ❌'}`);
  console.error('='.repeat(70));
  console.error('\n📋 Available tools:');
  console.error('  - trigger_github_workflow: Trigger a workflow');
  console.error('  - list_github_workflows: List all workflows');
  console.error('  - get_workflow_runs: Get recent workflow runs');
  console.error('  - get_workflow_run_status: Get specific run status');
  console.error('='.repeat(70));
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

// Made with Bob