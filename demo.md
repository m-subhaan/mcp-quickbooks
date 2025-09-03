# QuickBooks MCP Chat Assistant Demo

This document shows example conversations and how the MCP tools work with Claude Desktop.

## Example Conversations

### 1. Authentication Flow

**User:** "I need to connect to my QuickBooks account"

**Claude Desktop Response:**
```
I'll help you connect to your QuickBooks account. Let me check the current authentication status and initiate the connection if needed.

[Using MCP Tool: getAuthStatus]
Status: Not authenticated with QuickBooks

[Using MCP Tool: initiateAuth]
Please visit the following URL to authenticate with QuickBooks:
https://appcenter.intuit.com/connect/oauth2?client_id=ABVJ1VQRUP8oilJBXD3UsnOPrGxD9Qjug7ioqBhUYm1gMZmmS1&response_type=code&scope=com.intuit.quickbooks.accounting&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2Fauth%2Fcallback&state=test

After authentication, you will be redirected to the callback URL. Copy the authorization code from the URL and use it to complete the authentication.
```

### 2. Fetching Invoices

**User:** "Show me invoices from last week"

**Claude Desktop Response:**
```
I'll fetch the invoices from last week for you.

[Using MCP Tool: getInvoices]
Parameters: {
  "startDate": "2024-01-15",
  "endDate": "2024-01-21"
}

Found 3 invoices

**Invoice Summary:**
- Invoice #1001: $1,250.00 (Customer: ABC Company)
- Invoice #1002: $850.00 (Customer: XYZ Corp)
- Invoice #1003: $2,100.00 (Customer: Tech Solutions)

Total invoices: 3
Total amount: $4,200.00
```

### 3. Customer List

**User:** "List all my customers"

**Claude Desktop Response:**
```
I'll fetch your customer list from QuickBooks.

[Using MCP Tool: getCustomers]
Parameters: {
  "limit": 100,
  "offset": 0
}

Found 15 customers

**Customer List:**
1. ABC Company
   - Email: contact@abc.com
   - Phone: (555) 123-4567
   - Address: 123 Main St, City, State

2. XYZ Corporation
   - Email: info@xyz.com
   - Phone: (555) 987-6543
   - Address: 456 Business Ave, City, State

3. Tech Solutions Inc
   - Email: hello@techsolutions.com
   - Phone: (555) 456-7890
   - Address: 789 Innovation Dr, City, State

... (12 more customers)
```

### 4. Financial Reports

**User:** "Get my profit and loss report for this month"

**Claude Desktop Response:**
```
I'll generate a Profit and Loss report for this month.

[Using MCP Tool: getProfitAndLoss]
Parameters: {
  "startDate": "2024-01-01",
  "endDate": "2024-01-31",
  "accountingMethod": "Accrual"
}

**Profit and Loss Report - January 2024**

**Revenue:**
- Service Revenue: $25,000.00
- Product Sales: $15,000.00
- Other Income: $2,500.00
**Total Revenue: $42,500.00**

**Expenses:**
- Cost of Goods Sold: $12,000.00
- Salaries and Wages: $18,000.00
- Rent Expense: $3,000.00
- Utilities: $800.00
- Office Supplies: $500.00
- Marketing: $2,000.00
**Total Expenses: $36,300.00**

**Net Income: $6,200.00**
```

### 5. Account Balances

**User:** "Show me my account balances"

**Claude Desktop Response:**
```
I'll fetch your chart of accounts with current balances.

[Using MCP Tool: getAccounts]
Parameters: {
  "active": true,
  "limit": 100
}

Found 25 active accounts

**Account Balances:**

**Assets:**
- Checking Account: $15,250.00
- Savings Account: $45,000.00
- Accounts Receivable: $8,500.00
- Inventory: $12,000.00

**Liabilities:**
- Accounts Payable: $3,200.00
- Credit Card: $1,500.00
- Loan Payable: $25,000.00

**Equity:**
- Owner's Equity: $50,050.00
- Retained Earnings: $35,000.00

**Revenue:**
- Service Revenue: $0.00 (YTD: $125,000.00)
- Product Sales: $0.00 (YTD: $75,000.00)

**Expenses:**
- Cost of Goods Sold: $0.00 (YTD: $60,000.00)
- Salaries and Wages: $0.00 (YTD: $90,000.00)
```

## MCP Tool Schemas

### getCustomers
```json
{
  "name": "getCustomers",
  "description": "Fetch customers from QuickBooks with optional filtering and pagination",
  "inputSchema": {
    "type": "object",
    "properties": {
      "limit": {
        "type": "number",
        "description": "Maximum number of customers to return (default: 100)",
        "minimum": 1,
        "maximum": 1000
      },
      "offset": {
        "type": "number",
        "description": "Number of customers to skip for pagination (default: 0)",
        "minimum": 0
      },
      "nameFilter": {
        "type": "string",
        "description": "Filter customers by name (partial match)"
      }
    },
    "required": []
  }
}
```

### getInvoices
```json
{
  "name": "getInvoices",
  "description": "Fetch invoices from QuickBooks within a date range with optional filtering",
  "inputSchema": {
    "type": "object",
    "properties": {
      "startDate": {
        "type": "string",
        "format": "date",
        "description": "Start date for invoice filtering (YYYY-MM-DD)"
      },
      "endDate": {
        "type": "string",
        "format": "date",
        "description": "End date for invoice filtering (YYYY-MM-DD)"
      },
      "limit": {
        "type": "number",
        "description": "Maximum number of invoices to return (default: 100)",
        "minimum": 1,
        "maximum": 1000
      },
      "offset": {
        "type": "number",
        "description": "Number of invoices to skip for pagination (default: 0)",
        "minimum": 0
      },
      "customerId": {
        "type": "string",
        "description": "Filter invoices by specific customer ID"
      }
    },
    "required": []
  }
}
```

### getProfitAndLoss
```json
{
  "name": "getProfitAndLoss",
  "description": "Fetch Profit and Loss report from QuickBooks for a specific date range",
  "inputSchema": {
    "type": "object",
    "properties": {
      "startDate": {
        "type": "string",
        "format": "date",
        "description": "Start date for the report period (YYYY-MM-DD)"
      },
      "endDate": {
        "type": "string",
        "format": "date",
        "description": "End date for the report period (YYYY-MM-DD)"
      },
      "accountingMethod": {
        "type": "string",
        "description": "Accounting method for the report",
        "enum": ["Accrual", "Cash"],
        "default": "Accrual"
      }
    },
    "required": ["startDate", "endDate"]
  }
}
```

## Natural Language Processing

The system can understand various ways to express the same request:

- "Show me invoices from last week" → `getInvoices` with date range
- "List all customers" → `getCustomers` with default parameters
- "What's my P&L for this month?" → `getProfitAndLoss` with current month
- "Get account balances" → `getAccounts` with active filter
- "Find invoices over $1000" → `getInvoices` with amount filtering

## Error Handling Examples

### Authentication Required
```
❌ Error: Not authenticated with QuickBooks
Please connect your QuickBooks account first using the authentication flow.
```

### Invalid Date Range
```
❌ Error: Invalid date range provided
Please provide valid start and end dates in YYYY-MM-DD format.
```

### API Rate Limiting
```
⚠️ Warning: QuickBooks API rate limit reached
Please wait a moment before making additional requests.
```

### No Data Found
```
ℹ️ Information: No invoices found for the specified date range
Try adjusting your search criteria or date range.
```

## Integration with Claude Desktop

The MCP server runs as a background process that Claude Desktop can communicate with using the Model Context Protocol. This enables:

1. **Natural Language Understanding**: Claude interprets user intent and maps to appropriate tools
2. **Structured Data Access**: QuickBooks API responses are formatted and presented clearly
3. **Contextual Responses**: Claude can provide insights and analysis based on the data
4. **Error Handling**: Graceful handling of API errors and user feedback
5. **Extensibility**: Easy to add new tools and capabilities

This creates a powerful conversational interface for QuickBooks data that feels natural and intuitive to use.
