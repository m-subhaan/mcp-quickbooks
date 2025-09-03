import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { QuickBooksService } from './services/quickbooks';
import { safeLog } from './utils/logger';

const app = express();

// Middleware
app.use(helmet());
app.use(express.json());
app.use(cors({
  origin: process.env['ALLOWED_ORIGINS']?.split(',') || ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
}));

const quickbooksService = new QuickBooksService();

// OAuth callback handler
app.get('/api/auth/callback', async (req, res) => {
  const { code, state, realmId } = req.query;
  
  try {
    if (!code) {
      throw new Error('No authorization code received');
    }

    safeLog('info', 'OAuth callback received', { code: (code as string).substring(0, 10) + '...', state, realmId });
    
    const result = await quickbooksService.authenticate(code as string, realmId as string);
    
    safeLog('info', 'OAuth authentication successful', { realmId: result.realmId });
    
    res.redirect(`${process.env['FRONTEND_URL'] || 'http://localhost:3000'}?auth=success&realmId=${result.realmId}`);
  } catch (error) {
    safeLog('error', 'OAuth callback failed', error);
    res.redirect(`${process.env['FRONTEND_URL'] || 'http://localhost:3000'}?auth=error`);
  }
});

// API Endpoints for Frontend
app.get('/api/auth/status', (_req, res) => {
  try {
    const authState = quickbooksService.getAuthState();
    safeLog('info', 'Auth status requested', authState);
    res.json({
      success: true,
      data: authState,
    });
  } catch (error) {
    safeLog('error', 'Failed to get auth status', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get auth status',
    });
  }
});

app.get('/api/auth/initiate', (_req, res) => {
  try {
    const authUrl = `https://appcenter.intuit.com/connect/oauth2?client_id=${process.env['QUICKBOOKS_CLIENT_ID']}&response_type=code&scope=com.intuit.quickbooks.accounting&redirect_uri=${encodeURIComponent('http://localhost:3001/api/auth/callback')}&state=test`;
    
    res.json({
      success: true,
      data: {
        authUrl,
        message: 'Visit this URL to authenticate with QuickBooks',
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate auth URL',
    });
  }
});

// Chat endpoint (placeholder for now)
app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  
  res.json({
    success: true,
    data: {
      response: `This is a placeholder response. In production, this would connect to Claude Desktop MCP client. You said: "${message}"`,
      timestamp: new Date().toISOString(),
    },
  });
});

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  safeLog('error', 'Express error', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
});

const PORT = process.env['PORT'] || 3001;

app.listen(PORT, () => {
  safeLog('info', `Express server running on port ${PORT}`);
  safeLog('info', `Health check: http://localhost:${PORT}/health`);
  safeLog('info', `API endpoints: http://localhost:${PORT}/api`);
});
