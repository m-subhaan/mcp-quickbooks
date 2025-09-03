# Quick Setup Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies

```bash
# Install backend dependencies
cd mcp-server
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment

```bash
# Copy environment file
cd ../mcp-server
cp env.example .env
```

**Edit `.env` file and add your Anthropic API key:**

```env
# Add this line to your .env file
ANTHROPIC_API_KEY=your_actual_anthropic_api_key_here
```

### 3. Start the Application

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

### 4. Connect to QuickBooks

1. Open http://localhost:3000
2. Click "Connect to QuickBooks"
3. Complete OAuth flow
4. You're ready to chat!

## 🎯 What You Can Ask

Once connected, try these questions:

- **"List all customers"**
- **"Show me invoices from last month"**
- **"What's my profit and loss for this year?"**
- **"Show me my balance sheet"**
- **"Find customer named John"**

## 🔧 Troubleshooting

### If you get "Not authenticated" errors:
- Make sure you've completed the QuickBooks OAuth flow
- Check that the green success message appeared
- Try refreshing the page

### If Claude API errors occur:
- Verify your `ANTHROPIC_API_KEY` is correct in `.env`
- Check that your API key has credits
- Restart the backend server

### If connection refused:
- Ensure both servers are running (ports 3000 and 3001)
- Check terminal output for any errors
- Kill any existing Node processes and restart

## 🎉 You're All Set!

Your QuickBooks MCP Chat Assistant is now fully functional with:
- ✅ Real Claude AI integration
- ✅ QuickBooks data access
- ✅ Intelligent responses
- ✅ Modern chat interface

The AI will now provide actual insights about your QuickBooks data instead of simulated responses!
