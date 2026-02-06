import { BookOpenIcon, CalendarIcon, CheckBadgeIcon, CurrencyIcon, QuestionMarkIcon } from './icons/Icons';

const suggestions = [
  { icon: <BookOpenIcon />, text: "What programs are available?" },
  { icon: <CheckBadgeIcon />, text: "What are the eligibility requirements?" },
  { icon: <CalendarIcon />, text: "When are the application deadlines?" },
  { icon: <CurrencyIcon />, text: "What are the tuition fees?" },
  { icon: <QuestionMarkIcon />, text: "How do I apply?" },
];

export const EmptyState = ({ onSuggestionClick }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 animate-fade-in-up">
      {/* Welcome illustration */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-3xl avatar-ai flex items-center justify-center shadow-xl animate-float">
          <span className="text-5xl">🎓</span>
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center shadow-lg">
          <span className="text-lg">✨</span>
        </div>
      </div>

      {/* Welcome text */}
      <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground text-center mb-2">
        University Admission Assistant
      </h2>
      <p className="text-muted-foreground text-center mb-3 max-w-md">
        Your AI guide for programs, eligibility, deadlines, and applications
      </p>
      
      {/* Welcome message bubble */}
      <div className="chat-bubble-ai max-w-md text-center mb-10">
        <p className="text-sm leading-relaxed">
          Hi 👋 I'm your University Admission Assistant. Ask me about courses, eligibility, fees, deadlines, or how to apply.
        </p>
      </div>

      {/* Suggestion chips */}
      <div className="w-full max-w-lg">
        <p className="text-xs text-muted-foreground text-center mb-4 uppercase tracking-wide font-medium">
          Try asking about
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => onSuggestionClick(suggestion.text)}
              className="feature-card flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-foreground hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="text-primary">{suggestion.icon}</span>
              {suggestion.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
