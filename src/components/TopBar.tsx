import { User, Search, MessageCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const TopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMessagesPage = location.pathname === '/messages';

  return (
    <header className="fixed top-0 left-0 right-0 bg-background border-b border-border z-50">
      <div className="max-w-2xl mx-auto flex items-center justify-between px-4 h-14">
        {/* Profile Icon */}
        <button 
          onClick={() => navigate('/profile')}
          className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80"
        >
          <User className="w-5 h-5 text-foreground" strokeWidth={1.5} />
        </button>

        {/* Right Icons */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <button 
            onClick={() => navigate('/search')}
            className="hover:opacity-70"
          >
            <Search className="w-6 h-6 text-foreground" strokeWidth={1.5} />
          </button>

          {/* Messages with notification badge */}
          <button 
            onClick={() => navigate('/messages')}
            className="relative hover:opacity-70"
          >
            <MessageCircle 
              className={`w-6 h-6 ${isMessagesPage ? 'fill-foreground text-foreground' : 'text-foreground'}`}
              strokeWidth={1.5} 
            />
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-accent rounded-full flex items-center justify-center text-[10px] font-semibold text-white">
              3
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
