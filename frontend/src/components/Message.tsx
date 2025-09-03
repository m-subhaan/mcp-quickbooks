import React from 'react';
import { Message as MessageType } from '../types';
import { JsonViewer } from './JsonViewer';
import { cn } from '../utils/cn';
import { format } from 'date-fns';
import { User, Bot, AlertCircle } from 'lucide-react';

interface MessageProps {
  message: MessageType;
}

export const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const hasError = !!message.error;
  const hasData = !!message.data;

  return (
    <div className={cn(
      'message-enter flex gap-3 p-4',
      isUser ? 'justify-end' : 'justify-start'
    )}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <Bot className="w-5 h-5 text-primary-foreground" />
        </div>
      )}
      
      <div className={cn(
        'flex flex-col gap-2 max-w-[80%]',
        isUser ? 'items-end' : 'items-start'
      )}>
        <div className={cn(
          'rounded-lg px-4 py-2 text-sm',
          isUser 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted text-foreground'
        )}>
          {hasError ? (
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-4 h-4" />
              <span>{message.error}</span>
            </div>
          ) : (
            <div className="whitespace-pre-wrap">{message.content}</div>
          )}
        </div>
        
        {hasData && !hasError && (
          <JsonViewer 
            data={message.data} 
            title="QuickBooks Data"
            className="w-full"
          />
        )}
        
        <div className="text-xs text-muted-foreground">
          {format(message.timestamp, 'HH:mm')}
        </div>
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
          <User className="w-5 h-5 text-secondary-foreground" />
        </div>
      )}
    </div>
  );
};
