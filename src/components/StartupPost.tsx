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
    tagline: string;
    logo: string;
    revenueGenerating: boolean;
    fundsRaised: string;
    currentInvestors: string[];
    lookingToDilute: boolean;
    dilutionAmount?: string;
    images: string[];
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
    <Card className="overflow-hidden border-0 bg-background shadow-none">
      {/* Header - Clickable */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-card-hover transition-colors"
        onClick={() => navigate(`/company/${company.id}`, { state: { from: '/' } })}
      >
        <div className="flex items-center gap-3">
          <Avatar className="h-11 w-11 border-2 border-border">
            <AvatarImage src={company.logo} alt={company.name} />
            <AvatarFallback className="bg-muted text-foreground">{company.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-semibold text-base">{company.name}</h3>
              <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0" />
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{company.tagline}</p>
          </div>
        </div>
      </div>

      {/* Image Carousel with Rounded Edges */}
      <div className="px-3 pb-3">
        <div className="relative bg-muted rounded-xl overflow-hidden">
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
      </div>

      {/* Action Buttons */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-5">
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 hover:bg-transparent group flex items-center gap-1.5"
            onClick={(e) => {
              e.stopPropagation();
              handleLike();
            }}
          >
            <Heart
              className={`h-6 w-6 transition-all ${
                liked ? "fill-accent text-accent" : "text-foreground group-hover:text-accent"
              }`}
            />
            <span className="text-sm font-medium">{likes}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 hover:bg-transparent group flex items-center gap-1.5"
            onClick={(e) => {
              e.stopPropagation();
              handleCrown();
            }}
          >
            <Crown
              className={`h-6 w-6 transition-all ${
                crowned ? "fill-primary text-primary" : "text-foreground group-hover:text-primary"
              }`}
            />
            <span className="text-sm font-medium">{crowns}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 hover:bg-transparent group flex items-center gap-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            <MessageCircle className="h-6 w-6 text-foreground group-hover:text-accent transition-colors" />
            <span className="text-sm font-medium">{comments}</span>
          </Button>

          <div className="flex-1" />

          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 hover:bg-transparent group"
            onClick={(e) => {
              e.stopPropagation();
              setSaved(!saved);
            }}
          >
            <Bookmark
              className={`h-6 w-6 transition-all ${
                saved ? "fill-foreground" : "text-foreground group-hover:fill-muted-foreground"
              }`}
            />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 hover:bg-transparent group"
            onClick={(e) => e.stopPropagation()}
          >
            <Share2 className="h-6 w-6 text-foreground group-hover:text-accent transition-colors" />
          </Button>
        </div>
      </div>

      {/* Company Info - Bottom Section */}
      <div className="px-4 pb-4 space-y-2.5 pt-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
            company.revenueGenerating 
              ? 'bg-success/10 text-success border border-success/20' 
              : 'bg-muted text-muted-foreground border border-border'
          }`}>
            {company.revenueGenerating ? 'Revenue Generating' : 'Pre-Revenue'}
          </span>
          {company.lookingToDilute && company.dilutionAmount && (
            <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-primary/10 text-primary border border-primary/20">
              Seeking: {company.dilutionAmount}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="text-xs text-muted-foreground">Funds Raised</span>
            <p className="font-semibold text-sm mt-0.5">{company.fundsRaised}</p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Investors</span>
            <p className="font-semibold text-sm mt-0.5">{company.currentInvestors.length}</p>
          </div>
        </div>

        <div>
          <span className="text-xs text-muted-foreground">Current Investors</span>
          <p className="text-sm mt-0.5 text-foreground/90">{company.currentInvestors.join(", ")}</p>
        </div>
      </div>
    </Card>
  );
};

export default StartupPost;
