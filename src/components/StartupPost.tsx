import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Crown, MessageCircle, Bookmark, Share2, ShieldCheck } from "lucide-react";

interface StartupPostProps {
  company: {
    id: string;
    name: string;
    logo: string;
    tagline: string;
    preValuation: string;
    postValuation: string;
    fundsRaised: string;
    currentInvestors: string[];
    lookingToDilute: boolean;
    dilutionAmount?: string;
    fundingGoal?: string;
    images: string[];
    postedTime: string;
  };
}

const StartupPost = ({ company }: StartupPostProps) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [crowned, setCrowned] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likes, setLikes] = useState(349);
  const [crowns, setCrowns] = useState(19);
  const [comments] = useState(32);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  const handleCrown = () => {
    setCrowned(!crowned);
    setCrowns(crowned ? crowns - 1 : crowns + 1);
  };

  return (
    <Card className="mb-4 overflow-hidden border-border">
      {/* Header - Clickable */}
      <div 
        className="flex items-center gap-3 p-4 cursor-pointer"
        onClick={() => navigate(`/company/${company.id}`, { state: { from: '/' } })}
      >
        <Avatar className="h-10 w-10">
          <AvatarImage src={company.logo} alt={company.name} />
          <AvatarFallback>{company.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-1">
            <h3 className="font-semibold text-sm">{company.name}</h3>
            <ShieldCheck className="w-3.5 h-3.5 text-primary flex-shrink-0" />
          </div>
          <p className="text-xs text-muted-foreground">{company.postedTime}</p>
        </div>
      </div>

      {/* Company Details - Clickable */}
      <div 
        className="px-4 pb-3 space-y-2 cursor-pointer"
        onClick={() => navigate(`/company/${company.id}`, { state: { from: '/' } })}
      >
        <p className="text-sm font-medium">{company.tagline}</p>
        
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-muted-foreground">Pre-Valuation:</span>
            <p className="font-semibold">{company.preValuation}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Post-Valuation:</span>
            <p className="font-semibold">{company.postValuation}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Funds Raised:</span>
            <p className="font-semibold">{company.fundsRaised}</p>
          </div>
          {company.fundingGoal && (
            <div>
              <span className="text-muted-foreground">Funding Goal:</span>
              <p className="font-semibold">{company.fundingGoal}</p>
            </div>
          )}
        </div>

        <div className="text-xs">
          <span className="text-muted-foreground">Current Investors:</span>
          <p className="font-medium">{company.currentInvestors.join(", ")}</p>
        </div>

        {company.lookingToDilute && company.dilutionAmount && (
          <div className="text-xs bg-accent/10 text-accent p-2 rounded">
            <span className="font-semibold">Seeking Investment: </span>
            {company.dilutionAmount}
          </div>
        )}
      </div>

      {/* Image Carousel - NOT clickable for profile navigation */}
      <div className="relative bg-muted">
        <img
          src={company.images[currentImageIndex]}
          alt={`${company.name} ${currentImageIndex + 1}`}
          className="w-full aspect-[4/3] object-cover"
        />
        
        {/* Image Indicators */}
        {company.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {company.images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentImageIndex
                    ? "w-6 bg-white"
                    : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons - NOT clickable for profile navigation */}
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 hover:bg-transparent"
            onClick={(e) => {
              e.stopPropagation();
              handleLike();
            }}
          >
            <Heart
              className={`h-6 w-6 ${
                liked ? "fill-accent text-accent" : "text-foreground"
              }`}
            />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 hover:bg-transparent"
            onClick={(e) => {
              e.stopPropagation();
              handleCrown();
            }}
          >
            <Crown
              className={`h-6 w-6 ${
                crowned ? "fill-yellow-500 text-yellow-500" : "text-foreground"
              }`}
            />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 hover:bg-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            <MessageCircle className="h-6 w-6" />
          </Button>

          <div className="flex-1" />

          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 hover:bg-transparent"
            onClick={(e) => {
              e.stopPropagation();
              setSaved(!saved);
            }}
          >
            <Bookmark
              className={`h-6 w-6 ${
                saved ? "fill-foreground" : ""
              }`}
            />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 hover:bg-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            <Share2 className="h-6 w-6" />
          </Button>
        </div>

        {/* Counts */}
        <div className="flex items-center gap-4 text-sm">
          <span className="font-semibold">{likes} likes</span>
          <span className="font-semibold text-yellow-600">{crowns} crowns</span>
          <span className="text-muted-foreground">{comments} comments</span>
        </div>
      </div>
    </Card>
  );
};

export default StartupPost;
