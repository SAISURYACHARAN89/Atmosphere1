import { Send, ChevronLeft, Menu, Heart } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"; // <-- make sure this path is correct

const TopBar = ({ sends = 0 }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMessagesPage = location.pathname === '/messages';
  const isSearchPage = location.pathname === '/search';
  const isCompanyProfile = location.pathname.startsWith('/company/');
  const isTradePage = location.pathname === '/trade';
  const isProfilePage = location.pathname === '/profile';
  const fromPath = location.state?.from;
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  if (isSearchPage) return null;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY && lastScrollY - currentScrollY > 5) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-lg z-50 transition-transform duration-500 ease-out ${isVisible || isTradePage ? 'translate-y-0' : '-translate-y-full'
        }`}
    >
      <div className="max-w-2xl mx-auto flex items-center justify-between px-4 h-14">

        {/* LEFT SIDE */}
        <div className="flex items-center gap-2 lg:hidden">
          {isCompanyProfile && fromPath ? (
            <button
              onClick={() => navigate(fromPath)}
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted/80 transition-all duration-300 active:scale-95"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" strokeWidth={2} />
            </button>
          ) : isProfilePage ? (
            <button
              onClick={() => navigate('/settings')}
              className="p-2 rounded-lg hover:bg-muted/80 transition-all duration-300 active:scale-95"
            >
              <Menu className="w-5 h-5 text-foreground" strokeWidth={2} />
            </button>
          ) : (
                <button
                  onClick={() => {
                    const currentMode = localStorage.getItem('navMode') || 'left';
                    localStorage.setItem('notificationsPreviousMode', currentMode);
                    navigate('/notifications');
                  }}
                  className="p-2 rounded-lg hover:bg-muted/80 transition-all duration-300 active:scale-95 relative"
                >
                  <Heart className="w-!5 h-!5 text-foreground" strokeWidth={2} />

                  {/* Badge */}
                  <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
                </button>

          )}
        </div>

        {/* CENTER LOGO */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <h1 className="font-cursive text-2xl text-foreground">Atmosphere</h1>
        </div>

        {/* RIGHT SIDE — SEND BUTTON */}
        <div className="flex items-center gap-2 lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            className="h-10 w-10 p-0 flex items-center justify-center relative rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              const currentMode = localStorage.getItem('navMode') || 'left';
              localStorage.setItem('messagesPreviousMode', currentMode);
              navigate('/messages');
            }}
          >
            <Send className="!h-6 !w-6 text-foreground hover:text-accent transition-colors" />

            {/* Badge */}
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-[2px]
    bg-gradient-to-br from-destructive to-warning rounded-full
    flex items-center justify-center text-[10px] font-bold text-white shadow-md">
              3
            </span>
          </Button>

        </div>
      </div>
    </header>
  );
};

export default TopBar;
