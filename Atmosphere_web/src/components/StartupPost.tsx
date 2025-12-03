import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Heart,
  Crown,
  MessageCircle,
  Bookmark,
  Send,
  ShieldCheck,
  Plus,
  MoreHorizontal,
} from "lucide-react";

import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";

interface StartupPostProps {
  company: {
    id: string;
    name: string;
    tagline: string;
    brief: string;
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
  const [showBigHeart, setShowBigHeart] = useState(false);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [crowned, setCrowned] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likes, setLikes] = useState(349);
  const [crowns, setCrowns] = useState(19);
  const [comments] = useState(32);
  const [sends] = useState(12);
  const [following, setFollowing] = useState(false);

  // COMMENT HOOKS
  const commentFileRef = useRef<HTMLInputElement>(null);
  const [commentImage, setCommentImage] = useState<string | null>(null);

  const handleCommentImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setCommentImage(url);
  };

  // COMMENT LIST
  const [commentList, setCommentList] = useState([
    {
      id: 1,
      name: "Priya Sharma",
      verified: true,
      time: "2h",
      avatar: "/avatars/p1.jpg",
      text: "Amazing progress! Keep building 🔥",
    },
    {
      id: 2,
      name: "Ravi Kumar",
      verified: false,
      time: "1h",
      avatar: "/avatars/p2.jpg",
      text: "Super excited for this startup!",
      image: company.images[0],
    },
    {
      id: 3,
      name: "Ananya Desai",
      verified: true,
      time: "30m",
      avatar: "/avatars/p3.jpg",
      text: "Love the product vision 🚀",
    },
  ]);

  const [newComment, setNewComment] = useState("");
  const commentsTopRef = useRef<HTMLDivElement>(null);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  const handleCrown = () => {
    setCrowned(!crowned);
    setCrowns(crowned ? crowns - 1 : crowns + 1);
  };

  const addComment = () => {
    if (!newComment.trim() && !commentImage) return;

    setCommentList(prev => [
      {
        id: Date.now(),
        name: "You",
        verified: false,
        time: "now",
        avatar: "",
        text: newComment,
        image: commentImage || null,
      },
      ...prev,
    ]);

    setNewComment("");
    setCommentImage(null);

    // 🔥 Auto scroll to top
    setTimeout(() => {
      commentsTopRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }, 50);
  };
  let tapTimeout: NodeJS.Timeout | null = null;

  const handleDoubleTap = () => {
    // Like the post
    if (!liked) {
      handleLike();
    }

    // Show animated big heart
    setShowBigHeart(true);

    setTimeout(() => {
      setShowBigHeart(false);
    }, 700);
  };

  const handleImageTap = () => {
    if (tapTimeout) {
      clearTimeout(tapTimeout);
      tapTimeout = null;
      handleDoubleTap();
    } else {
      tapTimeout = setTimeout(() => {
        tapTimeout = null;
      }, 250); // Instagram uses ~250ms double-tap window
    }
  };


  return (
    <Card className="overflow-hidden border-0 bg-background shadow-none">
      {/* HEADER */}
      <div className="flex items-center justify-between p-2.5">
        <div
          className="flex items-center gap-3 cursor-pointer flex-1"
          onClick={() =>
            navigate(`/company/${company.id}`, { state: { from: "/" } })
          }
        >
          <Avatar className="h-9 w-9 border-2 border-border">
            <AvatarImage src={company.logo} alt={company.name} />
            <AvatarFallback className="bg-muted text-foreground">
              {company.name[0]}
            </AvatarFallback>
          </Avatar>

          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-semibold text-sm">{company.name.toLowerCase().replace('.', '')}</h3>
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Verified startup
            </p>

          </div>
        </div>

        {/* Follow Button and Menu */}
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="h-7 px-2.5 rounded-[6px] bg-muted hover:bg-muted/80"
            onClick={(e) => {
              e.stopPropagation();
              setFollowing(!following);
            }}
          >
            <span className="text-xs font-medium">{following ? "Following" : "Follow"}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-5 w-5 p-0"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* IMAGES */}
      {/* IMAGES */}
      <div className="pb-1">
        <div
          className="relative bg-muted overflow-hidden select-none"
          onClick={handleImageTap}
        >
          {showBigHeart && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Heart
                className="h-24 w-24 text-white animate-[pop_0.7s_ease-out_forwards]"
                fill="white"
              />
            </div>
          )}

          <img
            src={company.images[currentImageIndex]}
            className="w-full aspect-[16/9] object-cover"
          />
        </div>

        {/* SLIDE INDICATORS BELOW IMAGE (outside container) */}
        {/* {company.images.length > 1 && (
          <div className="flex justify-center mt-2  gap-1.5">
            {company.images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${index === currentImageIndex ? "bg-cyan-400" : "bg-muted-foreground/40"
                  }`}
              />
            ))}
          </div>
        )} */}
      </div>

      {/* ACTIONS */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-5">

          {/* LIKE */}
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 flex items-center justify-center rounded-full hover:bg-muted transition"
            onClick={(e) => {
              e.stopPropagation();
              handleLike();
            }}
          >
            <Heart
              className={`!h-6 !w-6 transition-all ${liked
                  ? "fill-current text-red-500"
                  : "text-foreground hover:text-red-500"
                }`}
            />


            <span className="text-[17px] font-medium">{likes}</span>
          </Button>

          {/* CROWN */}
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 flex items-center gap-1.5"
            onClick={(e) => {
              e.stopPropagation();
              handleCrown();
            }}
          >
            <Crown
              className={`!h-6 !w-6 transition-all ${crowned
                  ? "fill-current text-yellow-500"
                  : "text-foreground hover:text-yellow-500"
                }`}
            />


            <span className="text-[17px] font-medium">{crowns}</span>
          </Button>

          {/* COMMENT DRAWER */}
          <Drawer>
            <DrawerTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 flex items-center gap-1.5"
                onClick={(e) => e.stopPropagation()}
              >
                <MessageCircle
                  className="!h-6 !w-6 text-foreground hover:text-accent transition-colors"
                />
                <span className="text-[17px] font-medium">{comments}</span>
              </Button>

            </DrawerTrigger>

            <DrawerContent
              className="
              p-0 
              w-full 
              max-w-full 
              mx-auto 
              rounded-t-xl
              lg:max-w-[560px]
            "
            >

              <DrawerHeader className="px-4 py-3">
                <DrawerTitle>Comments</DrawerTitle>
              </DrawerHeader>

              {/* Comment List */}
              <div ref={commentsTopRef} className="max-h-[70vh] overflow-y-auto px-4 pb-6 space-y-6">
                {commentList.map((c) => (
                  <div key={c.id} className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={c.avatar} />
                      <AvatarFallback>{c.name[0]}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="font-semibold text-sm">{c.name}</p>
                        {c.verified && (
                          <ShieldCheck className="w-4 h-4 text-primary" />
                        )}
                        <span className="text-[12px] text-muted-foreground">
                          {c.time}
                        </span>
                      </div>

                      {c.text && (
                        <p className="text-sm text-foreground/90 mt-0.5 leading-relaxed">
                          {c.text}
                        </p>
                      )}

                      {c.image && (
                        <img
                          src={c.image}
                          className="rounded-lg mt-2 max-w-[80%]"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {commentImage && (
                <div className="px-4 pb-2">
                  <div className="relative inline-block">
                    <img
                      src={commentImage}
                      className="w-24 h-24 object-cover rounded-lg border"
                    />

                    {/* Remove image button */}
                    <button
                      onClick={() => setCommentImage(null)}
                      className="absolute -top-2 -right-2 bg-black/60 text-white rounded-full p-1"
                    >
                      <span className="text-xs">✕</span>
                    </button>
                  </div>
                </div>
              )}

              {/* COMMENT INPUT */}
              <DrawerFooter className="bg-background border-t p-3">

                <div className="w-full flex items-center gap-2">

                  {/* + icon */}
                  <button
                    onClick={() => commentFileRef.current?.click()}
                    className="p-2 rounded-full hover:bg-muted transition"
                  >
                    <Plus className="w-5 h-5 text-muted-foreground" />
                  </button>

                  {/* hidden input */}
                  <input
                    type="file"
                    accept="image/*"
                    ref={commentFileRef}
                    className="hidden"
                    onChange={handleCommentImageUpload}
                  />

                  {/* input field */}
                  <Input
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1 rounded-full"
                  />

                  {/* send icon */}
                  <button
                    onClick={addComment}
                    disabled={!newComment.trim() && !commentImage}
                    className="p-2 rounded-full hover:bg-primary/10 disabled:opacity-30 transition"
                  >
                    <Send className="w-5 h-5 text-primary" />
                  </button>

                </div>

              </DrawerFooter>


            </DrawerContent>
          </Drawer>

          {/* SEND */}
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 flex items-center gap-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            <Send
              className="!h-6 !w-6 text-foreground hover:text-accent transition-colors"
            />
            <span className="text-[17px] font-medium">{sends}</span>
          </Button>


          <div className="flex-1" />

          {/* SAVE */}
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0"
            onClick={(e) => {
              e.stopPropagation();
              setSaved(!saved);
            }}
          >
            <Bookmark
              className={`!h-6 !w-6 transition-all ${saved ? "fill-foreground" : "text-foreground"
                }`}
            />
          </Button>


        </div>
      </div>

      {/* COMPANY INFO */}
      <div className="px-4 pb-3">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-1.5">
          WHAT'S {company.name.toUpperCase()}
        </h4>
        <p className="text-sm text-foreground/90 leading-relaxed line-clamp-2">
          {company.brief}
        </p>
      </div>

      {/* STAGE */}
      <div className="px-4 pb-3">
        <h4 className="text-xs font-semibold uppercase mb-1.5">
          <span className="text-muted-foreground">STAGE :</span>{" "}
          <span className="text-foreground font-semibold">MVP launched</span>
        </h4>
      </div>


      {/* SMALL INFO BOXES */}
      <div className="px-4 pb-3">
        <div className="flex justify-between gap-2">
          <div className="px-4 py-2 rounded-[6px] border border-border bg-card">
            <p className="text-xs font-medium text-foreground">
              {company.revenueGenerating ? "Rvnu generating" : "Pre-rvnu"}
            </p>
          </div>

          <div className="px-4 py-2 rounded-[6px] border border-border bg-card">
            <p className="text-xs font-medium text-foreground">Rounds : 2</p>
          </div>
          <div className="px-4 py-2 rounded-[6px] border border-border bg-card">
            <p className="text-xs font-medium text-foreground">Age : 2 yr</p>
          </div>
        </div>
      </div>



      {/* ROUND STATUS */}
      {company.lookingToDilute && company.dilutionAmount ? (
        <div className="px-4 pb-4">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-xs text-muted-foreground">Current round :</span>
            <span className="text-sm font-semibold text-foreground">
              Series A
            </span>
          </div>

          <div className="relative">
            <div className="h-8 rounded-[6px] bg-card border border-border overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-muted-foreground/80 to-muted-foreground/80 transition-all"
                style={{ width: "15%" }}
              />
            </div>

            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-foreground">180,000$ Filled</span>
              <span className="text-xs font text-foreground">
                {company.dilutionAmount}
              </span>
                </div>
            {/* <div className="flex justify-center relative">
              <span className="text-xs font-semibold text-muted-foreground translate-y-3">
                Know more
              </span>
            </div> */}


          </div>
        </div>
      ) : (
        <div className="px-4 pb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-muted-foreground">Current round :</span>
            <span className="text-sm font-medium text-foreground">
              Not raising
            </span>
          </div>
        </div>
      )}
    </Card>
  );
};

export default StartupPost;
