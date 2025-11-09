import { Search, MessageCircle, ChevronLeft, Briefcase } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import GrantsSheet from "./GrantsSheet";

const TopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMessagesPage = location.pathname === '/messages';
  const isCompanyProfile = location.pathname.startsWith('/company/');
  const fromPath = location.state?.from;
  const [grantsOpen, setGrantsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down and past 50px
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header className={`fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-b border-border/50 z-50 shadow-sm transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="max-w-2xl mx-auto flex items-center justify-between px-4 h-14">
        {/* Left side - Back Button */}
        <div className="flex items-center gap-3">
          {isCompanyProfile && fromPath && (
            <button 
              onClick={() => navigate(fromPath)}
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted/80 transition-all duration-300 active:scale-95"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" strokeWidth={2} />
            </button>
          )}
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <button 
            onClick={() => navigate('/search')}
            className="p-2 rounded-lg hover:bg-muted/80 transition-all duration-300 active:scale-95"
          >
            <Search className="w-5 h-5 text-foreground" strokeWidth={2} />
          </button>

          {/* Grants Button */}
          <button 
            onClick={() => setGrantsOpen(true)}
            className="transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <Briefcase className="w-5 h-5 text-foreground" strokeWidth={2} />
          </button>

          {/* Messages with notification badge */}
          <button 
            onClick={() => navigate('/messages')}
            className="p-2 rounded-lg hover:bg-muted/80 transition-all duration-300 active:scale-95 relative"
          >
            <MessageCircle 
              className={`w-5 h-5 ${isMessagesPage ? 'fill-primary text-primary' : 'text-foreground'}`}
              strokeWidth={2} 
            />
            <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-gradient-to-br from-destructive to-warning rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-md animate-pulse-glow">
              3
            </span>
          </button>
        </div>
      </div>
      
      <GrantsSheet open={grantsOpen} onOpenChange={setGrantsOpen} />
    </header>
  );
};

export default TopBar;
