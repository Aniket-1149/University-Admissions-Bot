import { useRef, useEffect } from 'react';

export const Sidebar = ({ 
  isOpen, 
  onClose, 
  onNewChat, 
  recentChats = [], 
  onSelectChat, 
  onClearHistory 
}) => {
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden" />
      )}

      {/* Sidebar Panel */}
      <aside
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transition-transform duration-300 ease-in-out transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static flex flex-col`}
      >
        <div className="p-4 border-b border-border">
          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 px-4 rounded-xl font-medium shadow-sm hover:opacity-90 transition-opacity"
          >
            <span>+</span> New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3 px-2">Navigation</h3>
            <button 
                onClick={onNewChat}
                className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-secondary text-foreground flex items-center gap-3 transition-colors"
            >
                 Home
            </button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3 px-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase">Recent History</h3>
                {recentChats.length > 0 && (
                    <button 
                        onClick={onClearHistory}
                        className="text-[10px] text-destructive hover:underline"
                    >
                        Clear All
                    </button>
                )}
            </div>
            
            {recentChats.length === 0 ? (
                <p className="text-xs text-muted-foreground pl-3 italic">No recent chats</p>
            ) : (
                <div className="space-y-1">
                {recentChats.map((chat) => (
                    <button
                    key={chat.id}
                    onClick={() => onSelectChat(chat.id)}
                    className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-secondary text-foreground/80 hover:text-foreground truncate transition-colors flex items-center gap-2"
                    >
                    <span className="shrink-0 text-xs">💭</span>
                    <span className="truncate">{chat.title}</span>
                    </button>
                ))}
                </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
