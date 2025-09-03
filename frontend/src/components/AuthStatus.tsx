import React from 'react';
import { Button } from './ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { AuthState } from '../types';
import { authAPI } from '../utils/api';
import { CheckCircle, XCircle, ExternalLink, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

interface AuthStatusProps {
  authState: AuthState;
  onAuthStateChange: (state: AuthState) => void;
}

export const AuthStatus: React.FC<AuthStatusProps> = ({ authState, onAuthStateChange }) => {
  const handleInitiateAuth = async () => {
    try {
      const { authUrl } = await authAPI.initiateAuth();
      window.open(authUrl, '_blank');
      toast.success('Authentication window opened. Please complete the process.');
    } catch (error) {
      toast.error('Failed to initiate authentication');
      console.error('Auth error:', error);
    }
  };

  const handleLogout = () => {
    // In a real implementation, this would call the backend to clear tokens
    onAuthStateChange({
      isAuthenticated: false,
      realmId: undefined,
      hasTokens: false,
    });
    toast.success('Logged out successfully');
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          QuickBooks Connection
          {authState.isAuthenticated ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <XCircle className="w-5 h-5 text-red-600" />
          )}
        </CardTitle>
        <CardDescription>
          {authState.isAuthenticated 
            ? 'Connected to QuickBooks Online' 
            : 'Connect your QuickBooks account to get started'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {authState.isAuthenticated ? (
          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-medium">Status:</span> Connected
            </div>
            {authState.realmId && (
              <div className="text-sm">
                <span className="font-medium">Company ID:</span> {authState.realmId}
              </div>
            )}
            <Button 
              onClick={handleLogout} 
              variant="outline" 
              size="sm"
              className="w-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Disconnect
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              You need to authenticate with QuickBooks to access your data.
            </div>
            <Button 
              onClick={handleInitiateAuth} 
              className="w-full"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Connect QuickBooks
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
