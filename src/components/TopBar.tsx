import { MessageCircle, ChevronLeft, Heart, ChevronDown } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const TopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMessagesPage = location.pathname === '/messages';
  const isSearchPage = location.pathname === '/search';
  const isCompanyProfile = location.pathname.startsWith('/company/');
  const isTradePage = location.pathname === '/trade';
  const fromPath = location.state?.from;
  
  // Check if we're in second mode (professional mode)
  const isSecondMode = ['/launch', '/trade', '/opportunities', '/meetings'].includes(location.pathname);
  
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [manuallyHidden, setManuallyHidden] = useState(false);

  // Don't render the top bar on search page
  if (isSearchPage) {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (isSecondMode) {
        // In second mode, only hide on scroll up, don't auto-show
        if (currentScrollY < lastScrollY && lastScrollY - currentScrollY > 5) {
          // Scrolling up
          setIsVisible(false);
          setManuallyHidden(true);
        }
      } else {
        // Normal mode behavior
        if (currentScrollY < lastScrollY && lastScrollY - currentScrollY > 5) {
          // Scrolling up with threshold
          setIsVisible(true);
        } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
          // Scrolling down and past 50px
          setIsVisible(false);
        }
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isSecondMode]);

  const handleToggleVisibility = () => {
    setIsVisible(!isVisible);
    setManuallyHidden(!isVisible);
  };

  return (
    <>
      {/* Toggle button for second mode */}
      {isSecondMode && !isVisible && (
        <button
          onClick={handleToggleVisibility}
          className="fixed top-2 left-1/2 transform -translate-x-1/2 z-[60] bg-background/90 backdrop-blur-sm border border-border/50 rounded-full p-1.5 shadow-lg hover:bg-background transition-all duration-300 active:scale-95"
        >
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </button>
      )}
      
      <header className={`fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-lg z-50 transition-transform duration-500 ease-out ${isVisible || (isTradePage && !isSecondMode) ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-2xl mx-auto flex items-center justify-between px-4 h-14">
        {/* Left side - Likes or Back Button (mobile and iPad) */}
        <div className="flex items-center gap-2 lg:hidden">
          {isCompanyProfile && fromPath ? (
            <button 
              onClick={() => navigate(fromPath)}
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted/80 transition-all duration-300 active:scale-95"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" strokeWidth={2} />
            </button>
          ) : (
            <button 
              onClick={() => navigate('/notifications')}
              className="p-2 rounded-lg hover:bg-muted/80 transition-all duration-300 active:scale-95 relative"
            >
              <Heart className="w-5 h-5 text-foreground" strokeWidth={2} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
            </button>
          )}
        </div>

        {/* Center - App Name */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <h1 className="font-cursive text-2xl text-foreground">
            Atmosphere
          </h1>
        </div>

        {/* Right Icons - Messages (mobile and iPad) */}
        <div className="flex items-center gap-2 lg:hidden">
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
    </header>
    </>
  );
};

export default TopBar;
