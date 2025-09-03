import axios, { AxiosInstance } from 'axios';
import { QuickBooksTokens, QuickBooksAPIError, QuickBooksError } from '../types';
import { logger } from '../utils/logger';

export class QuickBooksService {
  private client: AxiosInstance;
  private tokens: QuickBooksTokens | null = null;
  private realmId: string | null = null;
  private refreshTimeout: NodeJS.Timeout | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: `https://sandbox-quickbooks.api.intuit.com`,
      timeout: 30000,
    });

    // Add request interceptor for authentication
    this.client.interceptors.request.use(
      (config) => {
        if (this.tokens?.access_token) {
          config.headers.Authorization = `Bearer ${this.tokens.access_token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401 && this.tokens?.refresh_token) {
          try {
            await this.refreshAccessToken();
            // Retry the original request
            const originalRequest = error.config;
            originalRequest.headers.Authorization = `Bearer ${this.tokens!.access_token}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            logger.error('Failed to refresh token:', refreshError);
            this.clearTokens();
            throw new QuickBooksAPIError('Authentication failed', 401);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  async authenticate(code: string, realmId: string): Promise<{ tokens: QuickBooksTokens; realmId: string }> {
    try {
      const formData = new URLSearchParams();
      formData.append('grant_type', 'authorization_code');
      formData.append('code', code);
      formData.append('redirect_uri', 'http://localhost:3001/api/auth/callback');

      const response = await axios.post('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', formData, {
        auth: {
          username: process.env['QUICKBOOKS_CLIENT_ID']!,
          password: process.env['QUICKBOOKS_CLIENT_SECRET']!,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const tokens: QuickBooksTokens = {
        ...response.data,
        expires_at: Date.now() + (response.data.expires_in * 1000),
      };

      this.tokens = tokens;
      this.realmId = realmId;
      this.scheduleTokenRefresh();

      logger.info('Successfully authenticated with QuickBooks');
      return { tokens, realmId };
    } catch (error) {
      logger.error('Authentication failed:', error);
      throw new QuickBooksAPIError('Authentication failed', 401);
    }
  }

  private async refreshAccessToken(): Promise<void> {
    if (!this.tokens?.refresh_token) {
      throw new Error('No refresh token available');
    }

    try {
      const formData = new URLSearchParams();
      formData.append('grant_type', 'refresh_token');
      formData.append('refresh_token', this.tokens.refresh_token);

      const response = await axios.post('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', formData, {
        auth: {
          username: process.env['QUICKBOOKS_CLIENT_ID']!,
          password: process.env['QUICKBOOKS_CLIENT_SECRET']!,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      this.tokens = {
        ...response.data,
        expires_at: Date.now() + (response.data.expires_in * 1000),
      };

      this.scheduleTokenRefresh();
      logger.info('Successfully refreshed QuickBooks access token');
    } catch (error) {
      logger.error('Token refresh failed:', error);
      throw new QuickBooksAPIError('Token refresh failed', 401);
    }
  }

  private scheduleTokenRefresh(): void {
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
    }

    if (this.tokens?.expires_at) {
      const refreshTime = this.tokens.expires_at - Date.now() - (5 * 60 * 1000); // Refresh 5 minutes before expiry
      if (refreshTime > 0) {
        this.refreshTimeout = setTimeout(() => {
          this.refreshAccessToken().catch(logger.error);
        }, refreshTime);
      }
    }
  }

  private clearTokens(): void {
    this.tokens = null;
    this.realmId = null;
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
      this.refreshTimeout = null;
    }
  }

  async getCustomers(params: { limit?: number; offset?: number; nameFilter?: string } = {}) {
    if (!this.realmId) {
      throw new QuickBooksAPIError('Not authenticated', 401);
    }

    try {
      // Use a simpler query that works with QuickBooks sandbox
      const query = 'SELECT * FROM Customer ORDER BY Name';

      const response = await this.client.get(`/v3/company/${this.realmId}/query`, {
        params: { 
          query,
          minorversion: '65',
          ...(params.limit && { maxresults: params.limit.toString() }),
          ...(params.offset && { startposition: params.offset.toString() }),
        },
      });

      return response.data.QueryResponse.Customer || [];
    } catch (error) {
      this.handleAPIError(error, 'Failed to fetch customers');
    }
  }

  async getInvoices(params: { startDate?: string; endDate?: string; limit?: number; offset?: number; customerId?: string } = {}) {
    if (!this.realmId) {
      throw new QuickBooksAPIError('Not authenticated', 401);
    }

    try {
      let query = 'SELECT * FROM Invoice';
      const conditions: string[] = [];

      if (params.startDate) {
        conditions.push(`TxnDate >= '${params.startDate}'`);
      }
      if (params.endDate) {
        conditions.push(`TxnDate <= '${params.endDate}'`);
      }
      if (params.customerId) {
        conditions.push(`CustomerRef = '${params.customerId}'`);
      }

      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`;
      }

      query += ' ORDER BY TxnDate DESC';

      const response = await this.client.get(`/v3/company/${this.realmId}/query`, {
        params: { 
          query,
          minorversion: '65',
          ...(params.limit && { maxresults: params.limit.toString() }),
          ...(params.offset && { startposition: params.offset.toString() }),
        },
      });

      return response.data.QueryResponse.Invoice || [];
    } catch (error) {
      this.handleAPIError(error, 'Failed to fetch invoices');
    }
  }

  async getAccounts(params: { accountType?: string; active?: boolean; limit?: number; offset?: number } = {}) {
    if (!this.realmId) {
      throw new QuickBooksAPIError('Not authenticated', 401);
    }

    try {
      let query = 'SELECT * FROM Account';
      const conditions: string[] = [];

      if (params.accountType) {
        conditions.push(`AccountType = '${params.accountType}'`);
      }
      if (params.active !== undefined) {
        conditions.push(`Active = ${params.active}`);
      }

      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`;
      }

      query += ' ORDER BY Name';

      const response = await this.client.get(`/v3/company/${this.realmId}/query`, {
        params: { 
          query,
          minorversion: '65',
          ...(params.limit && { maxresults: params.limit.toString() }),
          ...(params.offset && { startposition: params.offset.toString() }),
        },
      });

      return response.data.QueryResponse.Account || [];
    } catch (error) {
      this.handleAPIError(error, 'Failed to fetch accounts');
    }
  }

  async getProfitAndLossReport(startDate: string, endDate: string, accountingMethod: 'Accrual' | 'Cash' = 'Accrual') {
    if (!this.realmId) {
      throw new QuickBooksAPIError('Not authenticated', 401);
    }

    try {
      const response = await this.client.get(`/v3/company/${this.realmId}/reports/ProfitAndLoss`, {
        params: {
          start_date: startDate,
          end_date: endDate,
          accounting_method: accountingMethod,
          minorversion: '65',
        },
      });

      return response.data;
    } catch (error) {
      this.handleAPIError(error, 'Failed to fetch Profit and Loss report');
    }
  }

  async getBalanceSheetReport(asOfDate: string, accountingMethod: 'Accrual' | 'Cash' = 'Accrual') {
    if (!this.realmId) {
      throw new QuickBooksAPIError('Not authenticated', 401);
    }

    try {
      const response = await this.client.get(`/v3/company/${this.realmId}/reports/BalanceSheet`, {
        params: {
          as_of_date: asOfDate,
          accounting_method: accountingMethod,
          minorversion: '65',
        },
      });

      return response.data;
    } catch (error) {
      this.handleAPIError(error, 'Failed to fetch Balance Sheet report');
    }
  }

  private handleAPIError(error: any, defaultMessage: string): never {
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status || 500;
      const quickbooksError = error.response?.data as QuickBooksError;
      
      if (quickbooksError?.Fault?.Error) {
        const qbError = quickbooksError.Fault.Error[0];
        if (qbError) {
          throw new QuickBooksAPIError(qbError.Message, statusCode, quickbooksError);
        }
      }
      
      throw new QuickBooksAPIError(error.message || defaultMessage, statusCode);
    }
    
    throw new QuickBooksAPIError(defaultMessage, 500);
  }

  isAuthenticated(): boolean {
    return !!this.tokens;
  }

  getAuthState() {
    return {
      isAuthenticated: this.isAuthenticated(),
      realmId: this.realmId || undefined,
      hasTokens: !!this.tokens,
    };
  }
}
