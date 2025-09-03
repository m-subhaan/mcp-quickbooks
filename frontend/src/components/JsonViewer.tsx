import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ChevronDown, ChevronRight, Copy, Check } from 'lucide-react';
import { cn } from '../utils/cn';

interface JsonViewerProps {
  data: any;
  title?: string;
  className?: string;
}

export const JsonViewer: React.FC<JsonViewerProps> = ({ data, title, className }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const jsonString = JSON.stringify(data, null, 2);

  return (
    <div className={cn('border rounded-lg bg-card', className)}>
      <div className="flex items-center justify-between p-3 border-b bg-muted/50">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-muted rounded"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          <span className="font-medium text-sm">
            {title || 'JSON Data'} ({Array.isArray(data) ? data.length : '1'} item{Array.isArray(data) && data.length !== 1 ? 's' : ''})
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
          title="Copy JSON"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      </div>
      {isExpanded && (
        <div className="max-h-96 overflow-auto">
          <SyntaxHighlighter
            language="json"
            style={tomorrow}
            customStyle={{
              margin: 0,
              borderRadius: 0,
              fontSize: '12px',
              lineHeight: '1.4',
            }}
          >
            {jsonString}
          </SyntaxHighlighter>
        </div>
      )}
    </div>
  );
};
