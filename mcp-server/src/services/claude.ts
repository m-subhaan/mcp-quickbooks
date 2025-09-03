import Anthropic from '@anthropic-ai/sdk';
import { QuickBooksService } from './quickbooks';
import { logger } from '../utils/logger';

export class ClaudeService {
  private client: Anthropic;
  private quickbooksService: QuickBooksService;

  constructor(quickbooksService: QuickBooksService) {
    const apiKey = process.env['ANTHROPIC_API_KEY'];
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY environment variable is required');
    }

    this.client = new Anthropic({
      apiKey,
    });

    this.quickbooksService = quickbooksService;
  }

  async processMessage(userMessage: string): Promise<{
    response: string;
    data?: any;
    error?: string;
  }> {
    try {
      // Check if user is authenticated
      if (!this.quickbooksService.isAuthenticated()) {
        return {
          response: "I'm sorry, but you need to connect to QuickBooks first before I can help you with your financial data. Please use the 'Connect to QuickBooks' button to authenticate.",
          error: 'Not authenticated'
        };
      }

      // Extract intent from user message
      const intent = this.extractIntent(userMessage);
      
      // Get relevant data based on intent
      let quickbooksData: any = null;
      let dataDescription = '';

      switch (intent.type) {
        case 'customers':
          quickbooksData = await this.quickbooksService.getCustomers(intent.params);
          dataDescription = `Customer data: ${quickbooksData?.length || 0} customers found`;
          break;
        case 'invoices':
          quickbooksData = await this.quickbooksService.getInvoices(intent.params);
          dataDescription = `Invoice data: ${quickbooksData?.length || 0} invoices found`;
          break;
        case 'accounts':
          quickbooksData = await this.quickbooksService.getAccounts(intent.params);
          dataDescription = `Account data: ${quickbooksData?.length || 0} accounts found`;
          break;
        case 'profit_loss':
          quickbooksData = await this.quickbooksService.getProfitAndLossReport(
            intent.params.startDate || '2024-01-01',
            intent.params.endDate || new Date().toISOString().split('T')[0]
          );
          dataDescription = 'Profit and Loss report data';
          break;
        case 'balance_sheet':
          quickbooksData = await this.quickbooksService.getBalanceSheetReport(
            intent.params.asOfDate || new Date().toISOString().split('T')[0]
          );
          dataDescription = 'Balance Sheet report data';
          break;
        default:
          return {
            response: "I can help you with QuickBooks data including customers, invoices, accounts, profit and loss reports, and balance sheets. Please be more specific about what you'd like to know.",
            error: 'Unknown intent'
          };
      }

      // Create the prompt for Claude
      const systemPrompt = `You are a helpful AI assistant that specializes in analyzing QuickBooks financial data. You have access to real QuickBooks data and should provide insightful analysis.

When analyzing data:
1. Be conversational and helpful
2. Provide clear insights and observations
3. Highlight important trends or patterns
4. Suggest actionable insights when appropriate
5. Format numbers and currency appropriately
6. Be concise but thorough

Available data types:
- Customers: Customer information and details
- Invoices: Invoice data with amounts, dates, and customer information
- Accounts: Chart of accounts and account balances
- Profit and Loss: Revenue, expenses, and profitability data
- Balance Sheet: Assets, liabilities, and equity information`;

      const userPrompt = `User Question: "${userMessage}"

${dataDescription}

Here is the QuickBooks data:
${JSON.stringify(quickbooksData, null, 2)}

Please provide a helpful analysis and answer to the user's question based on this data.`;

      // Call Claude API
      const message = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
        ],
      });

      return {
        response: message.content[0].text,
        data: quickbooksData,
      };

    } catch (error) {
      logger.error('Error processing message with Claude:', error);
      return {
        response: "I'm sorry, I encountered an error while processing your request. Please try again or contact support if the issue persists.",
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private extractIntent(message: string): {
    type: string;
    params: any;
  } {
    const lowerMessage = message.toLowerCase();
    
    // Extract customer-related intents
    if (lowerMessage.includes('customer') || lowerMessage.includes('client')) {
      const params: any = {};
      
      // Extract name filter
      const nameMatch = message.match(/(?:customer|client)\s+(?:named|called|with name)\s+["']?([^"']+)["']?/i);
      if (nameMatch) {
        params.nameFilter = nameMatch[1];
      }
      
      // Extract limit
      const limitMatch = message.match(/(\d+)\s+(?:customers|clients)/i);
      if (limitMatch) {
        params.limit = parseInt(limitMatch[1]);
      }
      
      return { type: 'customers', params };
    }
    
    // Extract invoice-related intents
    if (lowerMessage.includes('invoice') || lowerMessage.includes('bill')) {
      const params: any = {};
      
      // Extract date ranges
      const dateMatch = message.match(/(?:from|since|after)\s+(\d{4}-\d{2}-\d{2})/i);
      if (dateMatch) {
        params.startDate = dateMatch[1];
      }
      
      const endDateMatch = message.match(/(?:to|until|before)\s+(\d{4}-\d{2}-\d{2})/i);
      if (endDateMatch) {
        params.endDate = endDateMatch[1];
      }
      
      // Extract limit
      const limitMatch = message.match(/(\d+)\s+invoices/i);
      if (limitMatch) {
        params.limit = parseInt(limitMatch[1]);
      }
      
      return { type: 'invoices', params };
    }
    
    // Extract account-related intents
    if (lowerMessage.includes('account') || lowerMessage.includes('chart of accounts')) {
      const params: any = {};
      
      // Extract account type
      const typeMatch = message.match(/(?:account type|type)\s+["']?([^"']+)["']?/i);
      if (typeMatch) {
        params.accountType = typeMatch[1];
      }
      
      return { type: 'accounts', params };
    }
    
    // Extract profit and loss intents
    if (lowerMessage.includes('profit') || lowerMessage.includes('loss') || lowerMessage.includes('p&l') || lowerMessage.includes('income statement')) {
      const params: any = {};
      
      // Extract date ranges
      const startMatch = message.match(/(?:from|since|after)\s+(\d{4}-\d{2}-\d{2})/i);
      if (startMatch) {
        params.startDate = startMatch[1];
      }
      
      const endMatch = message.match(/(?:to|until|before)\s+(\d{4}-\d{2}-\d{2})/i);
      if (endMatch) {
        params.endDate = endMatch[1];
      }
      
      return { type: 'profit_loss', params };
    }
    
    // Extract balance sheet intents
    if (lowerMessage.includes('balance sheet') || lowerMessage.includes('balance') || lowerMessage.includes('assets') || lowerMessage.includes('liabilities')) {
      const params: any = {};
      
      // Extract as-of date
      const dateMatch = message.match(/(?:as of|at|on)\s+(\d{4}-\d{2}-\d{2})/i);
      if (dateMatch) {
        params.asOfDate = dateMatch[1];
      }
      
      return { type: 'balance_sheet', params };
    }
    
    // Default to customers if no specific intent is found
    return { type: 'customers', params: {} };
  }
}
