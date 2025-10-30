import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, Bookmark, MoreVertical } from "lucide-react";

interface Reel {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  description: string;
  videoUrl: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isSaved: boolean;
}

const mockReels: Reel[] = [
  {
    id: "1",
    companyId: "airbound-co",
    companyName: "Airbound.co",
    companyLogo: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=100&h=100&fit=crop",
    description: "Revolutionary drone delivery for urban logistics 🚁",
    videoUrl: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=800&fit=crop",
    likes: 1249,
    comments: 124,
    shares: 89,
    isLiked: false,
    isSaved: false,
  },
  {
    id: "2",
    companyId: "skyt-air",
    companyName: "Skyt Air",
    companyLogo: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=100&h=100&fit=crop",
    description: "AI-powered air traffic management system ✈️",
    videoUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=800&fit=crop",
    likes: 823,
    comments: 67,
    shares: 45,
    isLiked: true,
    isSaved: false,
  },
  {
    id: "3",
    companyId: "neuralhealth",
    companyName: "NeuralHealth",
    companyLogo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=100&h=100&fit=crop",
    description: "AI diagnostics for early disease detection 🧬",
    videoUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=800&fit=crop",
    likes: 2154,
    comments: 234,
    shares: 156,
    isLiked: false,
    isSaved: true,
  },
  {
    id: "4",
    companyId: "greencharge",
    companyName: "GreenCharge",
    companyLogo: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=100&h=100&fit=crop",
    description: "Solar-powered EV charging network ⚡",
    videoUrl: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&h=800&fit=crop",
    likes: 1567,
    comments: 189,
    shares: 112,
    isLiked: true,
    isSaved: false,
  },
  {
    id: "5",
    companyId: "foodflow",
    companyName: "FoodFlow",
    companyLogo: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=100&h=100&fit=crop",
    description: "B2B food supply chain automation platform 🍽️",
    videoUrl: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=800&fit=crop",
    likes: 934,
    comments: 98,
    shares: 67,
    isLiked: false,
    isSaved: false,
  },
];

const Reels = () => {
  const navigate = useNavigate();
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [reels, setReels] = useState(mockReels);

  const currentReel = reels[currentReelIndex];

  const handleLike = () => {
    setReels(prev => prev.map((reel, idx) => 
      idx === currentReelIndex 
        ? { 
            ...reel, 
            isLiked: !reel.isLiked,
            likes: reel.isLiked ? reel.likes - 1 : reel.likes + 1
          }
        : reel
    ));
  };

  const handleSave = () => {
    setReels(prev => prev.map((reel, idx) => 
      idx === currentReelIndex 
        ? { ...reel, isSaved: !reel.isSaved }
        : reel
    ));
  };

  const handleProfileClick = () => {
    navigate(`/company/${currentReel.companyId}`);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="fixed inset-0 bg-background">
      {/* Full-screen vertical reel */}
      <div className="relative w-full h-full">
        {/* Video/Image background */}
        <div className="absolute inset-0">
          <img
            src={currentReel.videoUrl}
            alt={currentReel.companyName}
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
        </div>

        {/* Right side action buttons */}
        <div className="absolute right-3 bottom-24 flex flex-col gap-6 z-10">
          {/* Like button */}
          <button 
            onClick={handleLike}
            className="flex flex-col items-center gap-1"
          >
            <Heart
              size={32}
              className={`${currentReel.isLiked ? 'fill-red-500 text-red-500' : 'text-white'} drop-shadow-lg`}
              strokeWidth={1.5}
            />
            <span className="text-white text-xs font-medium drop-shadow-lg">
              {formatNumber(currentReel.likes)}
            </span>
          </button>

          {/* Comment button */}
          <button className="flex flex-col items-center gap-1">
            <MessageCircle
              size={32}
              className="text-white drop-shadow-lg"
              strokeWidth={1.5}
            />
            <span className="text-white text-xs font-medium drop-shadow-lg">
              {formatNumber(currentReel.comments)}
            </span>
          </button>

          {/* Share button */}
          <button className="flex flex-col items-center gap-1">
            <Share2
              size={32}
              className="text-white drop-shadow-lg"
              strokeWidth={1.5}
            />
            <span className="text-white text-xs font-medium drop-shadow-lg">
              {formatNumber(currentReel.shares)}
            </span>
          </button>

          {/* Save button */}
          <button onClick={handleSave}>
            <Bookmark
              size={32}
              className={`${currentReel.isSaved ? 'fill-white text-white' : 'text-white'} drop-shadow-lg`}
              strokeWidth={1.5}
            />
          </button>

          {/* More options */}
          <button>
            <MoreVertical
              size={32}
              className="text-white drop-shadow-lg"
              strokeWidth={1.5}
            />
          </button>
        </div>

        {/* Bottom company info */}
        <div className="absolute bottom-24 left-4 right-20 z-10">
          {/* Company profile */}
          <button 
            onClick={handleProfileClick}
            className="flex items-center gap-3 mb-3"
          >
            <Avatar className="w-10 h-10 border-2 border-white">
              <AvatarImage src={currentReel.companyLogo} alt={currentReel.companyName} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {currentReel.companyName[0]}
              </AvatarFallback>
            </Avatar>
            <span className="text-white font-semibold drop-shadow-lg">
              {currentReel.companyName}
            </span>
          </button>

          {/* Description */}
          <p className="text-white text-sm drop-shadow-lg line-clamp-2">
            {currentReel.description}
          </p>
        </div>

        {/* Top back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-10 text-white drop-shadow-lg"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Reel indicator */}
        <div className="absolute top-4 right-4 z-10 text-white text-sm font-medium drop-shadow-lg">
          {currentReelIndex + 1} / {reels.length}
        </div>

        {/* Swipe areas for navigation */}
        <div className="absolute inset-0 flex">
          {/* Previous reel */}
          {currentReelIndex > 0 && (
            <div 
              className="w-1/3 h-full cursor-pointer"
              onClick={() => setCurrentReelIndex(prev => Math.max(0, prev - 1))}
            />
          )}
          
          {/* Center area */}
          <div className="flex-1 h-full" />
          
          {/* Next reel */}
          {currentReelIndex < reels.length - 1 && (
            <div 
              className="w-1/3 h-full cursor-pointer"
              onClick={() => setCurrentReelIndex(prev => Math.min(reels.length - 1, prev + 1))}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Reels;
