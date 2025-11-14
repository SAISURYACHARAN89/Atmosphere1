import { useNavigate } from "react-router-dom";
import { ChevronLeft, Heart, UserPlus, MessageCircle, Share2, TrendingUp, Calendar, Award, Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import BottomNav from "@/components/BottomNav";

interface Notification {
  id: number;
  type: 'like' | 'connection' | 'comment' | 'share' | 'investment' | 'meeting' | 'milestone';
  user: {
    name: string;
    avatar: string;
  };
  action: string;
  target?: string;
  timestamp: string;
  read: boolean;
}

const notifications: Notification[] = [
  {
    id: 1,
    type: 'like',
    user: { name: 'Sarah Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
    action: 'liked your post',
    target: 'SaaS Growth Strategies',
    timestamp: '2m ago',
    read: false
  },
  {
    id: 2,
    type: 'connection',
    user: { name: 'Rahul Mehta', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul' },
    action: 'accepted your connection request',
    timestamp: '5m ago',
    read: false
  },
  {
    id: 3,
    type: 'comment',
    user: { name: 'Priya Sharma', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya' },
    action: 'commented on your post',
    target: 'HealthTech Innovation',
    timestamp: '15m ago',
    read: false
  },
  {
    id: 4,
    type: 'investment',
    user: { name: 'Arjun Patel', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun' },
    action: 'invested in your startup',
    target: '$50,000',
    timestamp: '1h ago',
    read: true
  },
  {
    id: 5,
    type: 'share',
    user: { name: 'Neha Singh', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Neha' },
    action: 'shared your post',
    timestamp: '2h ago',
    read: true
  },
  {
    id: 6,
    type: 'meeting',
    user: { name: 'David Kim', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' },
    action: 'invited you to a meeting',
    target: 'EV Market Discussion',
    timestamp: '3h ago',
    read: true
  },
  {
    id: 7,
    type: 'milestone',
    user: { name: 'Emma Thompson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma' },
    action: 'celebrated your milestone',
    target: '1000 followers',
    timestamp: '5h ago',
    read: true
  },
  {
    id: 8,
    type: 'like',
    user: { name: 'Michael Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael' },
    action: 'liked your reel',
    target: 'Startup Journey',
    timestamp: '1d ago',
    read: true
  },
  {
    id: 9,
    type: 'connection',
    user: { name: 'Lisa Anderson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa' },
    action: 'wants to connect with you',
    timestamp: '1d ago',
    read: true
  },
  {
    id: 10,
    type: 'comment',
    user: { name: 'James Wilson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James' },
    action: 'mentioned you in a comment',
    timestamp: '2d ago',
    read: true
  },
];

const getNotificationIcon = (type: Notification['type']) => {
  const iconClass = "w-4 h-4";
  switch (type) {
    case 'like':
      return <Heart className={`${iconClass} text-red-500`} fill="currentColor" />;
    case 'connection':
      return <UserPlus className={`${iconClass} text-blue-500`} />;
    case 'comment':
      return <MessageCircle className={`${iconClass} text-green-500`} />;
    case 'share':
      return <Share2 className={`${iconClass} text-purple-500`} />;
    case 'investment':
      return <TrendingUp className={`${iconClass} text-emerald-500`} />;
    case 'meeting':
      return <Calendar className={`${iconClass} text-orange-500`} />;
    case 'milestone':
      return <Award className={`${iconClass} text-yellow-500`} />;
    default:
      return <Bell className={`${iconClass} text-muted-foreground`} />;
  }
};

const Notifications = () => {
  const navigate = useNavigate();
  
  const handleBackClick = () => {
    const appMode = localStorage.getItem('appMode') || 'left';
    if (appMode === 'right') {
      navigate('/launch');
    } else {
      navigate('/');
    }
  };
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 bg-background/95 backdrop-blur-lg z-50">
        <div className="max-w-2xl mx-auto flex items-center justify-between px-4 h-14">
          <button
            onClick={handleBackClick}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          
          <div className="flex items-center gap-1.5">
            <h1 className="text-lg font-semibold text-foreground">johns</h1>
            <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
              <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          
          <div className="w-9" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto">
        {/* Notifications List */}
        <div>
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`px-4 py-3 flex gap-3 transition-colors hover:bg-muted/50 ${
                !notification.read ? 'bg-primary/5' : ''
              }`}
            >
              {/* Avatar with Icon Badge */}
              <div className="relative flex-shrink-0">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={notification.user.avatar} />
                  <AvatarFallback>{notification.user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 bg-background rounded-full flex items-center justify-center border-2 border-background">
                  {getNotificationIcon(notification.type)}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">
                      <span className="font-semibold">{notification.user.name}</span>
                      {' '}
                      <span className="text-muted-foreground">{notification.action}</span>
                      {notification.target && (
                        <>
                          {' '}
                          <span className="font-medium text-foreground">"{notification.target}"</span>
                        </>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {notification.timestamp}
                    </p>
                  </div>
                  
                  {/* Unread Indicator */}
                  {!notification.read && (
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5" />
                  )}
                </div>

                {/* Action Buttons for specific types */}
                {notification.type === 'connection' && !notification.action.includes('accepted') && (
                  <div className="flex gap-2 mt-2">
                    <button className="px-4 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-md hover:bg-primary/90 transition-colors">
                      Accept
                    </button>
                    <button className="px-4 py-1.5 bg-muted text-muted-foreground text-xs font-medium rounded-md hover:bg-muted/80 transition-colors">
                      Ignore
                    </button>
                  </div>
                )}

                {notification.type === 'meeting' && (
                  <div className="flex gap-2 mt-2">
                    <button className="px-4 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-md hover:bg-primary/90 transition-colors">
                      View Meeting
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {notifications.length === 0 && (
          <div className="text-center py-20">
            <Bell className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-1">No notifications yet</h3>
            <p className="text-sm text-muted-foreground">
              When you get notifications, they'll show up here
            </p>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
};

export default Notifications;
