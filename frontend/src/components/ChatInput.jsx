import { useRef, useEffect } from 'react';
import { SendIcon, AttachmentIcon } from './icons/Icons';

export const ChatInput = ({
  value,
  onChange,
  onSend,
  onFileUpload,
  attachedFile,
  onRemoveFile,
  placeholder = "Ask about admissions, programs, eligibility, fees…",
  disabled = false,
  showAttachment = true,
}) => {
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
    }
  }, [value]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled) {
        onSend();
      }
    }
  };

  return (
    <div className="sticky bottom-0 z-20 pb-4 pt-2 px-4 bg-linear-to-t from-background via-background to-transparent">
      <div className="max-w-180 mx-auto">
        <div className="input-pill px-4 py-3">
          {attachedFile && (
            <div className="flex items-center gap-2 mb-2 p-2 bg-secondary/80 rounded-lg w-fit animate-in fade-in slide-in-from-bottom-2">
              <div className="bg-background rounded p-1">
                <span className="text-xl">📄</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium max-w-37.5 truncate">{attachedFile.name}</span>
                <span className="text-[10px] text-muted-foreground">Document attached</span>
              </div>
              <button 
                onClick={onRemoveFile}
                className="ml-2 p-1 hover:bg-background/50 rounded-full transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
          )}
          
          <div className="flex items-end gap-2">
            {/* Attachment button */}
            {showAttachment && onFileUpload && (
              <>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 -ml-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
                  aria-label="Attach file"
                >
                  <AttachmentIcon />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.pdf,.doc,.docx"
                  onChange={onFileUpload}
                  className="hidden"
                />
              </>
            )}
            
            {/* Text input */}
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              rows={1}
              className="flex-1 bg-transparent text-sm resize-none focus:outline-none placeholder-muted-foreground max-h-36 py-2"
            />
            
            {/* Send button */}
            <button
              onClick={onSend}
              disabled={disabled || (!value.trim() && !attachedFile)}
              className="btn-send"
              aria-label="Send message"
            >
              <SendIcon />
            </button>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground text-center mt-3 h-5">
           {value.includes('Please analyze these admission guidelines') 
             ? "Click send to generate summary" 
             : "Press Enter to send • Shift+Enter for new line"}
        </p>
      </div>
    </div>
  );
};
