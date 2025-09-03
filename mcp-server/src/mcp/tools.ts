import { z } from 'zod';

export const getCustomersTool = {
  name: 'getCustomers',
  description: 'Fetch customers from QuickBooks with optional filtering and pagination',
  inputSchema: {
    type: 'object',
    properties: {
      limit: {
        type: 'number',
        description: 'Maximum number of customers to return (default: 100)',
        minimum: 1,
        maximum: 1000,
      },
      offset: {
        type: 'number',
        description: 'Number of customers to skip for pagination (default: 0)',
        minimum: 0,
      },
      nameFilter: {
        type: 'string',
        description: 'Filter customers by name (partial match)',
      },
    },
    required: [],
  },
};

export const getInvoicesTool = {
  name: 'getInvoices',
  description: 'Fetch invoices from QuickBooks within a date range with optional filtering',
  inputSchema: {
    type: 'object',
    properties: {
      startDate: {
        type: 'string',
        format: 'date',
        description: 'Start date for invoice filtering (YYYY-MM-DD)',
      },
      endDate: {
        type: 'string',
        format: 'date',
        description: 'End date for invoice filtering (YYYY-MM-DD)',
      },
      limit: {
        type: 'number',
        description: 'Maximum number of invoices to return (default: 100)',
        minimum: 1,
        maximum: 1000,
      },
      offset: {
        type: 'number',
        description: 'Number of invoices to skip for pagination (default: 0)',
        minimum: 0,
      },
      customerId: {
        type: 'string',
        description: 'Filter invoices by specific customer ID',
      },
    },
    required: [],
  },
};

export const getAccountsTool = {
  name: 'getAccounts',
  description: 'Fetch chart of accounts from QuickBooks with optional filtering',
  inputSchema: {
    type: 'object',
    properties: {
      accountType: {
        type: 'string',
        description: 'Filter accounts by type (e.g., "Bank", "Income", "Expense")',
        enum: [
          'Bank',
          'Accounts Receivable',
          'Other Current Asset',
          'Fixed Asset',
          'Other Asset',
          'Accounts Payable',
          'Credit Card',
          'Other Current Liability',
          'Long Term Liability',
          'Equity',
          'Income',
          'Other Income',
          'Cost of Goods Sold',
          'Expense',
          'Other Expense'
        ],
      },
      active: {
        type: 'boolean',
        description: 'Filter accounts by active status',
      },
      limit: {
        type: 'number',
        description: 'Maximum number of accounts to return (default: 100)',
        minimum: 1,
        maximum: 1000,
      },
      offset: {
        type: 'number',
        description: 'Number of accounts to skip for pagination (default: 0)',
        minimum: 0,
      },
    },
    required: [],
  },
};

export const getProfitAndLossTool = {
  name: 'getProfitAndLoss',
  description: 'Fetch Profit and Loss report from QuickBooks for a specific date range',
  inputSchema: {
    type: 'object',
    properties: {
      startDate: {
        type: 'string',
        format: 'date',
        description: 'Start date for the report period (YYYY-MM-DD)',
      },
      endDate: {
        type: 'string',
        format: 'date',
        description: 'End date for the report period (YYYY-MM-DD)',
      },
      accountingMethod: {
        type: 'string',
        description: 'Accounting method for the report',
        enum: ['Accrual', 'Cash'],
        default: 'Accrual',
      },
    },
    required: ['startDate', 'endDate'],
  },
};

export const getBalanceSheetTool = {
  name: 'getBalanceSheet',
  description: 'Fetch Balance Sheet report from QuickBooks as of a specific date',
  inputSchema: {
    type: 'object',
    properties: {
      asOfDate: {
        type: 'string',
        format: 'date',
        description: 'Date as of which to generate the balance sheet (YYYY-MM-DD)',
      },
      accountingMethod: {
        type: 'string',
        description: 'Accounting method for the report',
        enum: ['Accrual', 'Cash'],
        default: 'Accrual',
      },
    },
    required: ['asOfDate'],
  },
};

export const getAuthStatusTool = {
  name: 'getAuthStatus',
  description: 'Check the current authentication status with QuickBooks',
  inputSchema: {
    type: 'object',
    properties: {},
    required: [],
  },
};

export const initiateAuthTool = {
  name: 'initiateAuth',
  description: 'Initiate OAuth2 authentication flow with QuickBooks',
  inputSchema: {
    type: 'object',
    properties: {},
    required: [],
  },
};

export const allTools = [
  getCustomersTool,
  getInvoicesTool,
  getAccountsTool,
  getProfitAndLossTool,
  getBalanceSheetTool,
  getAuthStatusTool,
  initiateAuthTool,
];
