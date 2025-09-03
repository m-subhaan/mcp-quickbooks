import 'dotenv/config';
import { QuickBooksMCPServer } from './mcp/server';
import { logger } from './utils/logger';

// Validate required environment variables
const requiredEnvVars = [
  'QUICKBOOKS_CLIENT_ID',
  'QUICKBOOKS_CLIENT_SECRET',
  'QUICKBOOKS_REDIRECT_URI',
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    logger.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

// Start the MCP server
const mcpServer = new QuickBooksMCPServer();
mcpServer.run().catch((error) => {
  logger.error('Failed to start MCP server', error);
  process.exit(1);
});

// Start the Express server for frontend API
import('./express-server').then(() => {
  logger.info('Express server started for frontend API');
}).catch((error) => {
  logger.error('Failed to start Express server', error);
  // Don't exit process, MCP server is more important
});
