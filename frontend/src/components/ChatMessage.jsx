import ReactMarkdown from 'react-markdown';
import { SparklesIcon, UserIcon, TypingIndicator } from './icons/Icons';
import { StructuredDataDisplay } from './StructuredDataDisplay';

export const ChatMessage = ({ message }) => {
  const isUser = message.type === 'user';
  
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center shadow-md ${
        isUser 
          ? 'bg-secondary text-secondary-foreground' 
          : 'avatar-ai text-white'
      }`}>
        {isUser ? <UserIcon /> : <SparklesIcon />}
      </div>
      
      {/* Message bubble */}
      <div className={`max-w-[80%] ${isUser ? 'chat-bubble-user' : 'chat-bubble-ai'} ${
        message.isError ? 'border-destructive/50 bg-destructive/10' : ''
      }`}>
        {message.attachedFile && (
          <div className="flex items-center gap-2 mb-3 p-2 bg-background/50 rounded-lg border border-border/50">
            <div className="bg-background rounded p-1.5 shadow-sm">
              <span className="text-lg">📄</span>
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-medium truncate max-w-37.5">{message.attachedFile.name}</span>
              <span className="text-[10px] opacity-70">Document</span>
            </div>
          </div>
        )}

        {message.isStructured ? (
          <StructuredDataDisplay data={message.content} />
        ) : (
          <div className="text-sm leading-relaxed markdown-content">
            {isUser ? (
              <p className="whitespace-pre-wrap">{message.content}</p> 
            ) : (
              <ReactMarkdown 
                components={{
                  ul: ({node, ...props}) => <ul className="list-disc pl-4 space-y-1 my-2" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal pl-4 space-y-1 my-2" {...props} />,
                  li: ({node, ...props}) => <li className="pl-1" {...props} />,
                  h1: ({node, ...props}) => <h1 className="text-lg font-bold mt-3 mb-2" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-base font-bold mt-3 mb-2" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-sm font-bold mt-2 mb-1" {...props} />,
                  p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                  strong: ({node, ...props}) => <span className="font-semibold text-primary" {...props} />,
                }}
              >
                {message.content}
              </ReactMarkdown>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const LoadingMessage = () => (
  <div className="flex gap-3">
    <div className="shrink-0 w-9 h-9 rounded-xl avatar-ai flex items-center justify-center shadow-md text-white">
      <SparklesIcon />
    </div>
    <div className="chat-bubble-ai">
      <div className="flex items-center gap-2">
        <TypingIndicator />
        <span className="text-xs text-muted-foreground">Assistant is typing…</span>
      </div>
    </div>
  </div>
);
