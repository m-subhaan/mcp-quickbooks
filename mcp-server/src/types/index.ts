import { z } from 'zod';

// QuickBooks API Types
export interface QuickBooksCustomer {
  Id: string;
  Name: string;
  CompanyName?: string;
  Email?: string;
  Phone?: string;
  BillAddr?: {
    Line1?: string;
    City?: string;
    Country?: string;
  };
  CreateTime: string;
  LastUpdatedTime: string;
}

export interface QuickBooksInvoice {
  Id: string;
  DocNumber: string;
  CustomerRef: {
    value: string;
    name: string;
  };
  Line: Array<{
    Amount: number;
    DetailType: string;
    SalesItemLineDetail?: {
      ItemRef: {
        value: string;
        name: string;
      };
      Qty: number;
      UnitPrice: number;
    };
  }>;
  TotalAmt: number;
  Balance: number;
  DueDate: string;
  TxnDate: string;
  CreateTime: string;
  LastUpdatedTime: string;
}

export interface QuickBooksAccount {
  Id: string;
  Name: string;
  AccountType: string;
  AccountSubType: string;
  CurrentBalance: number;
  CurrentBalanceWithSubAccounts: number;
  Active: boolean;
  MetaData: {
    CreateTime: string;
    LastUpdatedTime: string;
  };
}

export interface QuickBooksReport {
  Header: {
    ReportName: string;
    ReportBasis: string;
    StartPeriod: string;
    EndPeriod: string;
    Currency: string;
    Option: Array<{
      Name: string;
      Value: string;
    }>;
  };
  Columns: {
    Column: Array<{
      ColTitle: string;
      ColType: string;
      MetaData: Array<{
        Name: string;
        Value: string;
      }>;
    }>;
  };
  Rows: {
    Row: Array<{
      type: string;
      ColData: Array<{
        value: string;
        id?: string;
      }>;
    }>;
  };
}

// MCP Tool Schemas
export const GetCustomersSchema = z.object({
  limit: z.number().optional().default(100),
  offset: z.number().optional().default(0),
  nameFilter: z.string().optional(),
});

export const GetInvoicesSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  limit: z.number().optional().default(100),
  offset: z.number().optional().default(0),
  customerId: z.string().optional(),
});

export const GetAccountsSchema = z.object({
  accountType: z.string().optional(),
  active: z.boolean().optional(),
  limit: z.number().optional().default(100),
  offset: z.number().optional().default(0),
});

export const GetProfitAndLossSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
  accountingMethod: z.enum(['Accrual', 'Cash']).optional().default('Accrual'),
});

export const GetBalanceSheetSchema = z.object({
  asOfDate: z.string(),
  accountingMethod: z.enum(['Accrual', 'Cash']).optional().default('Accrual'),
});

// Auth Types
export interface QuickBooksTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  expires_at: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  tokens?: QuickBooksTokens;
  realmId?: string;
}

// Error Types
export interface QuickBooksError {
  Fault: {
    Error: Array<{
      Message: string;
      Detail: string;
      code: string;
    }>;
    type: string;
  };
}

export class QuickBooksAPIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public quickbooksError?: QuickBooksError
  ) {
    super(message);
    this.name = 'QuickBooksAPIError';
  }
}
