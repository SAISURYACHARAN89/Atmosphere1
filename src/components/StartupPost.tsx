import { useEffect, useRef, useState } from "react";
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
  Loader2,
} from "lucide-react";

import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { ZComment, ZStartup } from "@/types/startups";
import { useLikeStartup } from "@/hooks/posts/useLikeStartup";
import { getStartupComments } from "@/lib/api/startup";
import { getTimeAgo } from "@/utils/misc";
import { useFollowUser } from "@/hooks/posts/useFollow";
import { useSavePost } from "@/hooks/posts/useSavePost";
import { useStartupComment } from "@/hooks/posts/useStartupComment";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

const StartupPost = ({ company }: { company: ZStartup }) => {
  const navigate = useNavigate();
  const [showBigHeart, setShowBigHeart] = useState(false);
  const { toggleLike } = useLikeStartup(company.id);
  const { toggleSave } = useSavePost(company.id, company.savedId);
  const { toggleFollow } = useFollowUser(company.userId);
  const { submitComment, isPending: isCommentPending } = useStartupComment(company.id);

  const [liked, setLiked] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState(0);
  const [sends, setSends] = useState(0);
  const [replyToCommentId, setReplyToCommentId] = useState("");
  const [following, setFollowing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // const [crowns, setCrowns] = useState(19);
  // const [crowned, setCrowned] = useState(false);

  const { data:commentData, isLoading: isCommentsLoading } = useQuery({
    queryKey: ["startupComments", company.id],
    queryFn: () => getStartupComments(company.id),
    enabled: isCommentsOpen, // ✅ only fetch when open
  });

  const commentList = commentData?.comments || [];

  // COMMENT HOOKS
  const commentFileRef = useRef<HTMLInputElement>(null);
  const [commentImage, setCommentImage] = useState<string | null>(null);

  const handleCommentImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setCommentImage(url);
  };

  const [newComment, setNewComment] = useState("");
  const commentsTopRef = useRef<HTMLDivElement>(null);

  const handleLike = async () => {
    const prevLiked = liked;
    const prevLikes = likes;

    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);

    try {
      await toggleLike(liked);
    } catch {
      setLiked(prevLiked);
      setLikes(prevLikes);
    }
  };

  const handleFollow = async () => {
    const currentFollowing = following;

    setFollowing(!following);

    try {
      await toggleFollow(currentFollowing);
    } catch {
      setFollowing(currentFollowing);
    }
  };

  const handleSave = async () => {
    const prev = saved;

    setSaved(!saved);

    try {
      await toggleSave(saved);
    } catch {
      setSaved(prev);
    }
  };
  // const handleCrown = () => {
  //   setCrowned(!crowned);
  //   setCrowns(crowned ? crowns - 1 : crowns + 1);
  // };

  const addComment = async () => {
    if (!newComment.trim()) return;

    try {
      await submitComment({
        text: newComment,
        ...(replyToCommentId && { parent: replyToCommentId }),
      });
      setNewComment("");
      setCommentImage(null);
    } catch (err) {
      toast.error(`${err?.message || "Failed to add comment"}`);
    }
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

  useEffect(() => {
    // setCrowns(company.stats?.crowns);
    // setCrowned(company?.crownedByCurrentUser);
    setLikes(company?.stats?.likes);
    setLiked(company?.likedByCurrentUser);
    setComments(company?.stats?.comments || 0);
    setSaved(company?.isSaved);
    setFollowing(company?.isFollowing);
    setSends(company?.stats?.shares || 0);
  }, [company]);

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
            <AvatarImage src={company?.profileImage} alt={company.name} />
            <AvatarFallback className="bg-muted text-foreground">
              {company.name[0]}
            </AvatarFallback>
          </Avatar>

          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-semibold text-sm">
                {company.name.toLowerCase().replace(".", "")}
              </h3>
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
              handleFollow();
            }}
          >
            <span className="text-xs font-medium">
              {following ? "Following" : "Follow"}
            </span>
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

          {company.video ? (
            <video
              src={company.video}
              className="w-full aspect-[16/9] object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          ) : (
            <img
              src={
                // company.images?.[currentImageIndex] ||
                company?.profileImage || ""
              }
              className="w-full aspect-[16/9] object-cover"
            />
          )}
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
              className={`!h-6 !w-6 transition-all ${
                liked
                  ? "fill-current text-red-500"
                  : "text-foreground hover:text-red-500"
              }`}
            />

            <span className="text-[17px] font-medium">{likes}</span>
          </Button>

          {/* CROWN */}
          {/* <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 flex items-center gap-1.5"
            onClick={(e) => {
              e.stopPropagation();
              handleCrown();
            }}
          >
            <Crown
              className={`!h-6 !w-6 transition-all ${
                crowned
                  ? "fill-current text-yellow-500"
                  : "text-foreground hover:text-yellow-500"
              }`}
            />

            <span className="text-[17px] font-medium">{crowns}</span>
          </Button> */}

          {/* COMMENT DRAWER */}
          <Drawer open={isCommentsOpen} onOpenChange={setIsCommentsOpen}>
            <DrawerTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 flex items-center gap-1.5"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCommentsOpen(true);
                }}
              >
                <MessageCircle className="!h-6 !w-6 text-foreground hover:text-accent transition-colors" />
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
              <div
                ref={commentsTopRef}
                className="max-h-[70vh] overflow-y-auto px-4 pb-6 space-y-6"
              >
                {isCommentsLoading ? (
                  <div className="h-20 w-full justify-center items-center">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto mt-10" />
                  </div>
                ) : (
                  <>
                    {commentList?.map((c) => (
                      <div key={c._id} className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={c.author.avatarUrl} />
                          <AvatarFallback>
                            {c.author.username[0]}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center gap-1.5">
                            <p className="font-semibold text-sm">
                              {c.author.username}
                            </p>
                            {c?.verified && (
                              <ShieldCheck className="w-4 h-4 text-primary" />
                            )}
                            <span className="text-[12px] text-muted-foreground">
                              {getTimeAgo(c.createdAt)}
                            </span>
                          </div>

                          {c.text && (
                            <p className="text-sm text-foreground/90 mt-0.5 leading-relaxed">
                              {c.text}
                            </p>
                          )}

                          {c?.image && (
                            <img
                              src={c?.image}
                              className="rounded-lg mt-2 max-w-[80%]"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </>
                )}
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
                  {/* <button
                    onClick={() => commentFileRef.current?.click()}
                    className="p-2 rounded-full hover:bg-muted transition"
                  >
                    <Plus className="w-5 h-5 text-muted-foreground" />
                  </button> */}

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
                    {isCommentPending ? (
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    ) : (
                      <Send className="w-5 h-5 text-primary" />
                    )}
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
            <Send className="!h-6 !w-6 text-foreground hover:text-accent transition-colors" />
            <span className="text-[17px] font-medium">{sends}</span>
          </Button>

          <div className="flex-1" />

          {/* SAVE */}
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0"
            onClick={handleSave}
          >
            <Bookmark
              className={`!h-6 !w-6 transition-all ${
                saved ? "fill-foreground" : "text-foreground"
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
          {company.description}
        </p>
      </div>

      {/* STAGE */}
      <div className="px-4 pb-3">
        <h4 className="text-xs font-semibold uppercase mb-1.5">
          <span className="text-muted-foreground">STAGE :</span>{" "}
          <span className="text-foreground font-semibold">{company.stage}</span>
        </h4>
      </div>

      {/* SMALL INFO BOXES */}
      <div className="px-4 pb-3">
        <div className="flex gap-2">
          <div className="px-4 py-2 rounded-[6px] border border-border bg-card">
            <p className="text-xs font-medium text-foreground">
              {company.revenueType}
            </p>
          </div>

          <div className="px-4 py-2 rounded-[6px] border border-border bg-card">
            <p className="text-xs font-medium text-foreground">
              Rounds : {company?.rounds || 0}
            </p>
          </div>
          <div className="px-4 py-2 rounded-[6px] border border-border bg-card">
            <p className="text-xs font-medium text-foreground">
              Age : {company?.age || 0} yr{company?.age === 1 ? "" : "s"}
            </p>
          </div>
        </div>
      </div>

      {/* ROUND STATUS */}
      {company.lookingToDilute && company.dilutionAmount ? (
        <div className="px-4 pb-4">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-xs text-muted-foreground">
              Current round :
            </span>
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
            <span className="text-xs text-muted-foreground">
              Current round :
            </span>
            <span className="text-sm font-medium text-foreground">
              {company?.currentRound}
            </span>
          </div>
        </div>
      )}
    </Card>
  );
};;;

  export default StartupPost;
