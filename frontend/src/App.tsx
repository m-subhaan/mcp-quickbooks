import React, { useState, useEffect } from 'react';
import { AuthStatus } from './components/AuthStatus';
import { ChatContainer } from './components/ChatContainer';
import { Message, AuthState } from './types';
import { authAPI } from './utils/api';
import toast from 'react-hot-toast';

function App() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Check for auth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authStatus = urlParams.get('auth');
    const realmId = urlParams.get('realmId');

    if (authStatus === 'success' && realmId) {
      toast.success('Successfully connected to QuickBooks!');
      setAuthState({
        isAuthenticated: true,
        realmId,
        hasTokens: true,
      });
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      // Re-check auth status from backend
      checkAuthStatus();
    } else if (authStatus === 'error') {
      toast.error('Failed to connect to QuickBooks. Please try again.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      const status = await authAPI.getStatus();
      console.log('Auth status from backend:', status);
      setAuthState(status);
    } catch (error) {
      console.error('Failed to check auth status:', error);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!authState.isAuthenticated) {
      toast.error('Please connect to QuickBooks first');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // For now, we'll simulate a response since we need to integrate with Claude Desktop
      // In a real implementation, this would connect to Claude Desktop MCP client
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `I understand you want to know about "${content}". This is a simulated response. In the full implementation, this would connect to Claude Desktop which would use the MCP server to fetch data from QuickBooks.`,
          timestamp: new Date(),
          data: {
            message: content,
            timestamp: new Date().toISOString(),
            note: "This is simulated data. The real implementation would show actual QuickBooks data here."
          }
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request.',
        timestamp: new Date(),
        error: 'Failed to process request',
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
      toast.error('Failed to process your request');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              QuickBooks MCP Chat Assistant
            </h1>
            <p className="text-sm text-muted-foreground">
              Chat with your QuickBooks data using Claude Desktop
            </p>
          </div>
          <AuthStatus 
            authState={authState} 
            onAuthStateChange={setAuthState} 
          />
        </header>

        {/* Main Content */}
        <main className="flex-1 flex gap-4">
          {/* Chat Area */}
          <div className="flex-1 bg-card rounded-lg border overflow-hidden">
            <ChatContainer
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              disabled={!authState.isAuthenticated}
            />
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-4 text-center text-sm text-muted-foreground">
          <p>
            Powered by Claude Desktop MCP • QuickBooks Online API
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
