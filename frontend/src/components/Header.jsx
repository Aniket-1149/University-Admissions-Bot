import { ThemeToggle } from './ThemeToggle';
import { GraduationCapIcon } from './icons/Icons';

export const Header = ({ onMenuClick }) => {
  return (
    <header className="sticky top-0 z-20 backdrop-blur-lg bg-card/70 border-b border-border/50">
      <div className="max-w-180 mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
          <div className="avatar-ai w-10 h-10 flex items-center justify-center text-white">
            <GraduationCapIcon />
          </div>
          <div>
            <h1 className="font-display font-semibold text-foreground">
              University Admission Assistant
            </h1>
            <p className="text-xs text-muted-foreground">
              Helping students choose the right university
            </p>
          </div>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
};
