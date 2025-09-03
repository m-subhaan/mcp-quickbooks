# QuickBooks MCP Chat Assistant

A powerful chat interface that connects to QuickBooks data using Claude AI and the Model Context Protocol (MCP). This application allows you to ask natural language questions about your QuickBooks data and get intelligent responses powered by Claude.

## Features

- 🔐 **OAuth 2.0 Authentication** with QuickBooks Online
- 🤖 **Claude AI Integration** for intelligent data analysis
- 💬 **Real-time Chat Interface** with message history
- 📊 **QuickBooks Data Access**: Customers, Invoices, Accounts, Reports
- 🎨 **Modern UI** built with React, TypeScript, and Tailwind CSS
- 🔄 **Token Management** with automatic refresh
- 📱 **Responsive Design** for all devices

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   External      │
│   (React)       │◄──►│   (Express +    │◄──►│   APIs          │
│                 │    │    MCP Server)   │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   Claude AI     │
                       │   (Anthropic)   │
                       └─────────────────┘
```

## Prerequisites

- Node.js 18+ and npm
- QuickBooks Developer Account
- Anthropic API Key
- Git

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/m-subhaan/mcp-quickbooks.git
cd mcp-quickbooks
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../mcp-server
npm install
```

### 3. Configure Environment Variables

#### QuickBooks Setup

1. Go to [Intuit Developer](https://developer.intuit.com/)
2. Create a new app or use existing one
3. Configure OAuth settings:
   - **Redirect URI**: `http://localhost:3001/api/auth/callback`
   - **Scopes**: `com.intuit.quickbooks.accounting`

#### Environment Configuration

Copy the example environment file and configure it:

```bash
cd mcp-server
cp env.example .env
```

Edit `.env` file with your credentials:

```env
# QuickBooks API Configuration
QUICKBOOKS_CLIENT_ID=your_quickbooks_client_id
QUICKBOOKS_CLIENT_SECRET=your_quickbooks_client_secret
QUICKBOOKS_REDIRECT_URI=http://localhost:3001/api/auth/callback
QUICKBOOKS_ENVIRONMENT=sandbox

# Anthropic API Configuration
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Logging
LOG_LEVEL=info

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

### 4. Start the Application

#### Option A: Using Setup Scripts

**Windows:**
```bash
setup.bat
```

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

#### Option B: Manual Start

**Terminal 1 - Backend:**
```bash
cd mcp-server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## Usage

### 1. Connect to QuickBooks

1. Open the application in your browser
2. Click "Connect to QuickBooks"
3. Complete the OAuth flow
4. You'll be redirected back with a success message

### 2. Start Chatting

Once connected, you can ask questions like:

- **"List all customers"**
- **"Show me invoices from last month"**
- **"What's my profit and loss for this year?"**
- **"Show me my balance sheet as of today"**
- **"Find customer named John Smith"**
- **"Show me the top 10 invoices by amount"**

### 3. Understanding Responses

The AI will:
- Analyze your QuickBooks data
- Provide insights and observations
- Format numbers and currency appropriately
- Suggest actionable insights
- Display the raw data in a collapsible JSON viewer

## API Endpoints

### Authentication
- `GET /api/auth/status` - Check authentication status
- `GET /api/auth/initiate` - Start OAuth flow
- `GET /api/auth/callback` - OAuth callback handler

### Chat
- `POST /api/chat` - Send message to Claude AI

### QuickBooks Data (via MCP)
- `GET /api/tools/customers` - Get customers
- `GET /api/tools/invoices` - Get invoices
- `GET /api/tools/accounts` - Get accounts
- `POST /api/tools/profit-and-loss` - Get P&L report
- `POST /api/tools/balance-sheet` - Get balance sheet

## Development

### Project Structure

```
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── utils/           # Utility functions
│   │   └── types/           # TypeScript types
│   └── package.json
├── mcp-server/              # Backend server
│   ├── src/
│   │   ├── mcp/             # MCP server implementation
│   │   ├── services/        # Business logic
│   │   └── utils/           # Utilities
│   └── package.json
└── mcp.json                 # MCP configuration
```

### Key Technologies

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, TypeScript
- **AI**: Claude 3 Sonnet (Anthropic)
- **Protocol**: Model Context Protocol (MCP)
- **Database**: QuickBooks Online API
- **Authentication**: OAuth 2.0

### Adding New Features

1. **New QuickBooks Data**: Add methods to `QuickBooksService`
2. **New Chat Intents**: Extend `ClaudeService.extractIntent()`
3. **UI Components**: Add to `frontend/src/components/`
4. **API Endpoints**: Add to `express-server.ts`

## Troubleshooting

### Common Issues

1. **OAuth Redirect Error**
   - Ensure redirect URI matches exactly in Intuit Developer Console
   - Check that `.env` has correct `QUICKBOOKS_REDIRECT_URI`

2. **Claude API Errors**
   - Verify `ANTHROPIC_API_KEY` is set correctly
   - Check API key has sufficient credits

3. **Connection Refused**
   - Ensure both frontend and backend are running
   - Check ports 3000 and 3001 are available

4. **Authentication Issues**
   - Clear browser cache and cookies
   - Restart both servers
   - Check QuickBooks app is in correct environment (sandbox/production)

### Debug Mode

Enable debug logging by setting `LOG_LEVEL=debug` in `.env`:

```env
LOG_LEVEL=debug
```

## Security Considerations

- Never commit `.env` files to version control
- Use environment variables for all sensitive data
- Implement proper CORS policies for production
- Use HTTPS in production environments
- Regularly rotate API keys

## Production Deployment

### Environment Variables

```env
NODE_ENV=production
QUICKBOOKS_ENVIRONMENT=production
FRONTEND_URL=https://yourdomain.com
ALLOWED_ORIGINS=https://yourdomain.com
```

### Build Commands

```bash
# Build frontend
cd frontend
npm run build

# Build backend
cd ../mcp-server
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review the logs for error details

## Roadmap

- [ ] Multi-company support
- [ ] Advanced reporting features
- [ ] Data export capabilities
- [ ] Mobile app
- [ ] Real-time notifications
- [ ] Advanced AI features (predictions, insights)
- [ ] Integration with other accounting platforms
