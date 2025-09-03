export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
  error?: string;
  data?: any; // For JSON responses from QuickBooks
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  isAuthenticated: boolean;
  realmId?: string;
  hasTokens?: boolean;
}

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

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ChatRequest {
  message: string;
  conversationId?: string;
}

export interface ChatResponse {
  message: string;
  data?: any;
  conversationId: string;
}
