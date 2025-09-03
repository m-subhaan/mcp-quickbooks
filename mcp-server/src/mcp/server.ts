import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { QuickBooksService } from '../services/quickbooks';
import { allTools } from './tools';
import { safeLog } from '../utils/logger';
import { 
  GetCustomersSchema, 
  GetInvoicesSchema, 
  GetAccountsSchema, 
  GetProfitAndLossSchema, 
  GetBalanceSheetSchema 
} from '../types';

// Create the request schemas
const ToolsListRequestSchema = z.object({
  method: z.literal('tools/list'),
  params: z.object({}).optional(),
});

const ToolsCallRequestSchema = z.object({
  method: z.literal('tools/call'),
  params: z.object({
    name: z.string(),
    arguments: z.any(),
  }),
});

class QuickBooksMCPServer {
  private server: Server;
  private quickbooksService: QuickBooksService;

  constructor() {
    this.quickbooksService = new QuickBooksService();
    this.server = new Server({
      name: 'quickbooks-mcp-server',
      version: '1.0.0',
      capabilities: {
        tools: {},
      },
    });

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  private setupToolHandlers(): void {
    // Register all tools
    this.server.setRequestHandler(ToolsListRequestSchema, async () => {
      safeLog('info', 'Listing available tools');
      return {
        tools: allTools,
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(ToolsCallRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      safeLog('info', `Tool call: ${name}`, args);

      try {
        switch (name) {
          case 'getCustomers':
            return await this.handleGetCustomers(args);
          case 'getInvoices':
            return await this.handleGetInvoices(args);
          case 'getAccounts':
            return await this.handleGetAccounts(args);
          case 'getProfitAndLoss':
            return await this.handleGetProfitAndLoss(args);
          case 'getBalanceSheet':
            return await this.handleGetBalanceSheet(args);
          case 'getAuthStatus':
            return await this.handleGetAuthStatus();
          case 'initiateAuth':
            return await this.handleInitiateAuth();
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        safeLog('error', `Tool call failed: ${name}`, error);
        throw error;
      }
    });
  }

  private async handleGetCustomers(args: any) {
    const validatedArgs = GetCustomersSchema.parse(args);
    const customers = await this.quickbooksService.getCustomers(validatedArgs as any);
    
    return {
      content: [
        {
          type: 'text',
          text: `Found ${customers.length} customers:\n\n${JSON.stringify(customers, null, 2)}`,
        },
      ],
    };
  }

  private async handleGetInvoices(args: any) {
    const validatedArgs = GetInvoicesSchema.parse(args);
    const invoices = await this.quickbooksService.getInvoices(validatedArgs as any);
    
    return {
      content: [
        {
          type: 'text',
          text: `Found ${invoices.length} invoices:\n\n${JSON.stringify(invoices, null, 2)}`,
        },
      ],
    };
  }

  private async handleGetAccounts(args: any) {
    const validatedArgs = GetAccountsSchema.parse(args);
    const accounts = await this.quickbooksService.getAccounts(validatedArgs as any);
    
    return {
      content: [
        {
          type: 'text',
          text: `Found ${accounts.length} accounts:\n\n${JSON.stringify(accounts, null, 2)}`,
        },
      ],
    };
  }

  private async handleGetProfitAndLoss(args: any) {
    const validatedArgs = GetProfitAndLossSchema.parse(args);
    const report = await this.quickbooksService.getProfitAndLossReport(
      validatedArgs.startDate,
      validatedArgs.endDate,
      validatedArgs.accountingMethod
    );
    
    return {
      content: [
        {
          type: 'text',
          text: `Profit and Loss report for ${validatedArgs.startDate} to ${validatedArgs.endDate}:\n\n${JSON.stringify(report, null, 2)}`,
        },
      ],
    };
  }

  private async handleGetBalanceSheet(args: any) {
    const validatedArgs = GetBalanceSheetSchema.parse(args);
    const report = await this.quickbooksService.getBalanceSheetReport(
      validatedArgs.asOfDate,
      validatedArgs.accountingMethod
    );
    
    return {
      content: [
        {
          type: 'text',
          text: `Balance Sheet report as of ${validatedArgs.asOfDate}:\n\n${JSON.stringify(report, null, 2)}`,
        },
      ],
    };
  }

  private async handleGetAuthStatus() {
    const authState = this.quickbooksService.getAuthState();
    
    return {
      content: [
        {
          type: 'text',
          text: authState.isAuthenticated 
            ? `Authenticated with QuickBooks\n\nStatus: ${JSON.stringify({
                isAuthenticated: authState.isAuthenticated,
                realmId: authState.realmId,
                hasTokens: authState.hasTokens,
              }, null, 2)}`
            : `Not authenticated with QuickBooks\n\nStatus: ${JSON.stringify({
                isAuthenticated: authState.isAuthenticated,
                realmId: authState.realmId,
                hasTokens: authState.hasTokens,
              }, null, 2)}`,
        },
      ],
    };
  }

  private async handleInitiateAuth() {
    const authUrl = `https://appcenter.intuit.com/connect/oauth2?client_id=${process.env['QUICKBOOKS_CLIENT_ID']}&response_type=code&scope=com.intuit.quickbooks.accounting&redirect_uri=${encodeURIComponent('http://localhost:3001/api/auth/callback')}&state=test`;
    
    return {
      content: [
        {
          type: 'text',
          text: `Please visit the following URL to authenticate with QuickBooks:\n\n${authUrl}\n\nAfter authentication, you will be redirected to the callback URL. Copy the authorization code from the URL and use it to complete the authentication.`,
        },
      ],
    };
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => {
      safeLog('error', 'MCP Server error', error);
    };
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    safeLog('info', 'QuickBooks MCP Server started');
  }
}

// Start the server
const server = new QuickBooksMCPServer();
server.run().catch((error) => {
  safeLog('error', 'Failed to start MCP server', error);
  process.exit(1);
});

export { QuickBooksMCPServer };
