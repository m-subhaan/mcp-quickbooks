# QuickBooks MCP Chat Assistant

A complete application that connects Claude Desktop to QuickBooks Online through a custom MCP (Model Context Protocol) server, enabling natural language queries about your financial data.

## 🚀 Features

- **Modern Chat UI**: React + TypeScript frontend with iMessage-style chat interface
- **MCP Integration**: Custom MCP server that wraps QuickBooks Online REST API
- **OAuth2 Authentication**: Secure QuickBooks authentication flow
- **Real-time Data**: Fetch customers, invoices, accounts, and financial reports
- **JSON Visualization**: Expandable JSON cards for data inspection
- **Error Handling**: Graceful error handling and user feedback
- **Responsive Design**: Works on desktop and mobile devices

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend│    │  Claude Desktop │    │  QuickBooks API │
│   (Port 3000)   │◄──►│   (MCP Client)  │◄──►│   (Sandbox)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│ Express Server  │    │   MCP Server    │
│ (Port 3001)     │    │ (QuickBooks)    │
└─────────────────┘    └─────────────────┘
```

## 📋 Prerequisites

- Node.js 18+ and npm
- Claude Desktop installed and configured
- QuickBooks Online Developer Account (Sandbox)
- Your QuickBooks API credentials (already included)

## 🛠️ Installation & Setup

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd my-quickbook-gpt
npm run install:all
```

### 2. Environment Setup

Copy the environment template and update with your values:

```bash
cp mcp-server/env.example mcp-server/.env
```

The file already includes your QuickBooks credentials:
- Client ID: `ABVJ1VQRUP8oilJBXD3UsnOPrGxD9Qjug7ioqBhUYm1gMZmmS1`
- Client Secret: `MKWbMl9vhbmBKI10H0UpfZe4EbhGohRsO17Oc0s5`

### 3. Build the MCP Server

```bash
cd mcp-server
npm run build
cd ..
```

### 4. Configure Claude Desktop

Copy the `mcp.json` file to your Claude Desktop configuration directory:

**Windows:**
```bash
copy mcp.json "%APPDATA%\Claude\mcp.json"
```

**macOS:**
```bash
cp mcp.json ~/Library/Application\ Support/Claude/mcp.json
```

**Linux:**
```bash
cp mcp.json ~/.config/Claude/mcp.json
```

### 5. Start the Application

```bash
# Start both frontend and backend servers
npm run dev

# Or start them separately:
npm run dev:frontend  # Frontend on http://localhost:3000
npm run dev:server    # Backend on http://localhost:3001
```

## 🔧 Development

### Project Structure

```
├── frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Utility functions
│   │   └── App.tsx          # Main app component
│   └── package.json
├── mcp-server/              # MCP server implementation
│   ├── src/
│   │   ├── mcp/             # MCP protocol implementation
│   │   ├── services/        # QuickBooks API service
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Utilities and logging
│   └── package.json
├── mcp.json                 # Claude Desktop MCP config
└── README.md
```

### Available Scripts

```bash
# Root level
npm run dev              # Start both frontend and backend
npm run build            # Build both applications
npm run install:all      # Install all dependencies

# Frontend
cd frontend
npm run dev              # Start Vite dev server
npm run build            # Build for production
npm run preview          # Preview production build

# MCP Server
cd mcp-server
npm run dev              # Start with tsx watch
npm run build            # Build TypeScript
npm run start            # Start production server
```

## 🔌 MCP Tools Available

The MCP server exposes the following tools to Claude Desktop:

### Authentication
- `getAuthStatus` - Check current authentication status
- `initiateAuth` - Start OAuth2 authentication flow

### Data Retrieval
- `getCustomers` - Fetch customers with optional filtering
- `getInvoices` - Fetch invoices within date ranges
- `getAccounts` - Fetch chart of accounts
- `getProfitAndLoss` - Generate P&L reports
- `getBalanceSheet` - Generate balance sheet reports

### Example Tool Usage

```json
{
  "name": "getInvoices",
  "description": "Fetch invoices from QuickBooks within a date range",
  "parameters": {
    "type": "object",
    "properties": {
      "startDate": { "type": "string", "format": "date" },
      "endDate": { "type": "string", "format": "date" }
    },
    "required": ["startDate", "endDate"]
  }
}
```

## 🔐 Security Features

- **OAuth2 Flow**: Secure QuickBooks authentication
- **Token Management**: Automatic refresh of access tokens
- **Environment Variables**: Sensitive data stored in .env files
- **Input Validation**: Zod schema validation for all inputs
- **Error Sanitization**: Sensitive data removed from logs
- **CORS Protection**: Configured CORS for frontend-backend communication

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface using Tailwind CSS
- **Responsive Layout**: Works on desktop and mobile devices
- **Real-time Updates**: Live chat interface with loading states
- **JSON Visualization**: Collapsible JSON cards with syntax highlighting
- **Error Handling**: User-friendly error messages and toast notifications
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 🚀 Usage Examples

### Natural Language Queries

Users can ask questions like:
- "Show me invoices from last week"
- "List all customers"
- "Get my profit and loss report for this month"
- "Show me account balances"
- "Find invoices over $1000"

### Authentication Flow

1. User clicks "Connect QuickBooks" in the frontend
2. OAuth2 flow opens in new window
3. User authenticates with QuickBooks
4. Callback redirects to frontend with success status
5. Frontend updates authentication status
6. User can now send chat messages

## 🔧 Troubleshooting

### Common Issues

**MCP Server Won't Start**
- Check that all environment variables are set
- Ensure Node.js version is 18+
- Verify TypeScript compilation: `npm run build`

**Authentication Fails**
- Verify QuickBooks credentials in .env
- Check redirect URI matches QuickBooks app settings
- Ensure sandbox environment is selected

**Frontend Can't Connect**
- Check that backend server is running on port 3001
- Verify CORS settings in backend
- Check browser console for errors

**Claude Desktop Integration**
- Verify mcp.json is in correct location
- Restart Claude Desktop after configuration changes
- Check Claude Desktop logs for MCP errors

### Debug Mode

Enable debug logging by setting:
```bash
LOG_LEVEL=debug
```

## 📝 API Endpoints

### Authentication
- `GET /api/auth/status` - Get authentication status
- `GET /api/auth/initiate` - Start OAuth flow
- `GET /auth/callback` - OAuth callback handler

### Health
- `GET /health` - Health check endpoint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- QuickBooks Online API for financial data access
- Claude Desktop for MCP client implementation
- Model Context Protocol for standardized tool integration
- React and Vite for modern frontend development
- Tailwind CSS for styling

---

**Note**: This is a development/sandbox implementation. For production use, ensure proper security measures, error handling, and compliance with QuickBooks API terms of service.
