import React, { useRef, useEffect } from 'react';
import { Message } from './Message';
import { ChatInput } from './ChatInput';
import { Message as MessageType } from '../types';
import { Loader2 } from 'lucide-react';

interface ChatContainerProps {
  messages: MessageType[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  onSendMessage,
  isLoading = false,
  disabled = false,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Welcome to QuickBooks Chat</h3>
              <p className="text-sm">
                Start by asking about your QuickBooks data. Try questions like:
              </p>
              <ul className="text-sm mt-2 space-y-1">
                <li>• "Show me invoices from last week"</li>
                <li>• "List all customers"</li>
                <li>• "Get my profit and loss report for this month"</li>
                <li>• "Show me account balances"</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((message) => (
              <Message key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex items-center gap-3 p-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-primary-foreground animate-spin" />
                </div>
                <div className="bg-muted rounded-lg px-4 py-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing your request...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <ChatInput
        onSendMessage={onSendMessage}
        isLoading={isLoading}
        disabled={disabled}
      />
    </div>
  );
};
