import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  BadgeCheck,
  Plus,
  Send,
  Loader2,
} from "lucide-react";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Drawer, DrawerContent, DrawerFooter } from "@/components/ui/drawer";
import { ZReel } from "@/types/reels";
import { useLikeReel } from "@/hooks/reels/useLikeReel";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { addReelComment, getReelComments } from "@/lib/api/reels";
import { toast } from "./sonner";

/* ------------------ Types ------------------ */

type ReelCardProps = {
  reel: ZReel;
  index: number;
};

type CommentItem = {
  id: string;
  name: string;
  text?: string;
  likes?: number;
  isLiked?: boolean;
  children?: CommentItem[];
};

/* ------------------ Component ------------------ */

const ReelCard: React.FC<ReelCardProps> = ({ reel }) => {
  const navigate = useNavigate();
    const queryClient = useQueryClient();

  const [liked, setLiked] = useState(reel.isLiked);
  const [likesCount, setLikesCount] = useState(reel.likesCount);

  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [commentId, setCommentId] = useState<string | null>(null);

  const [comments, setComments] = useState<CommentItem[]>([]);
  const [newComment, setNewComment] = useState("");

  const commentsRef = useRef<HTMLDivElement | null>(null);

  const { toggleLike } = useLikeReel(reel._id);
  const { data: commentData, isLoading: isCommentsLoading } = useQuery({
    queryKey: ["reelsComments", reel._id],
    queryFn: () => getReelComments(reel._id),
    enabled: isCommentsOpen,
  });
  const commentList = commentData?.comments || [];

  /* ---------------- Like Reel ---------------- */

  const handleLike = async () => {
    const prevLiked = liked;
    const prevLikes = likesCount;

    // optimistic update
    setLiked((prev) => !prev);
    setLikesCount((prev) => (prevLiked ? prev - 1 : prev + 1));

    try {
      await toggleLike(prevLiked);
    } catch {
      // rollback
      setLiked(prevLiked);
      setLikesCount(prevLikes);
    }
  };

  /* ---------------- Add Comment ---------------- */
    const handleAddComment = async () => {
      if (!newComment.trim()) return;
  
      try {
        await addReelComment(
          reel?._id,
          newComment,
          commentId || undefined,
        );
        setNewComment("");
        setCommentId(null);
        queryClient.invalidateQueries({ queryKey: ["reelsComments", reel._id] });
      } catch (err) {
        toast.error(`${err?.message || "Failed to add comment"}`);
      }
    };

  /* ---------------- Comment Like ---------------- */

  const toggleCommentLike = (id: string) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              isLiked: !c.isLiked,
              likes: (c.likes ?? 0) + (c.isLiked ? -1 : 1),
            }
          : c,
      ),
    );
  };

  /* ---------------- Render ---------------- */

  return (
    <div className="relative h-screen w-full snap-start flex items-center justify-center">
      <div className="relative w-full h-full md:aspect-[9/16]">
        <video
          src={reel.videoUrl}
          autoPlay
          loop
          playsInline
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

        {/* Right Controls */}
        <div className="absolute right-3 bottom-20 flex flex-col gap-6 z-10">
          <button className="flex flex-col items-center" onClick={handleLike}>
            <Heart
              size={32}
              className={liked ? "fill-red-500 text-red-500" : "text-white"}
            />
            <span className="text-white text-xs">{likesCount}</span>
          </button>

          <button
            className="flex flex-col items-center"
            onClick={() => setIsCommentsOpen(true)}
          >
            <MessageCircle size={32} className="text-white" />
            <span className="text-white text-xs">{reel.commentsCount}</span>
          </button>

          <Share2 size={32} className="text-white" />

          <Bookmark size={32} className="text-white" />
        </div>

        {/* Author Info */}
        <div className="absolute bottom-24 left-4 right-20 z-10">
          <button
            onClick={() => navigate(`/company/${reel.author._id}`)}
            className="flex items-center gap-3 mb-3"
          >
            <Avatar className="w-10 h-10 border-2 border-white">
              <AvatarImage src={reel.author.avatarUrl} />
              <AvatarFallback>{reel.author.displayName?.[0]}</AvatarFallback>
            </Avatar>

            <div className="flex items-center gap-1">
              <span className="text-white font-semibold">
                {reel.author.displayName}
              </span>
              {reel.author.verified && (
                <BadgeCheck className="text-blue-500 fill-blue-500" />
              )}
            </div>
          </button>

          <p className="text-white text-sm">{reel.caption}</p>
        </div>
      </div>

      {/* -------- Comments Drawer -------- */}
      <Drawer open={isCommentsOpen} onOpenChange={setIsCommentsOpen}>
        <DrawerContent className="h-2/3 p-0">
          <div
            ref={commentsRef}
            className="flex-1 overflow-y-auto px-4 py-3 space-y-4"
          >
            {isCommentsLoading ? (
              <div className="h-20 w-full justify-center items-center">
                <Loader2 className="h-5 w-5 animate-spin mx-auto mt-10" />
              </div>
            ) : (
              <>
                {commentList.map((c) => (
                  <div key={c._id} className="flex gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={c.author?.avatarUrl} alt={c.author?.username} />
                      <AvatarFallback>{c.author.username?.[0]}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <p className="font-semibold text-sm">{c?.author?.username}</p>
                      <p className="text-sm">{c.text}</p>

                      <button
                        onClick={() => toggleCommentLike(c._id)}
                        className="text-xs mt-1"
                      >
                        ❤️ {c.likesCount || 0}
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          <DrawerFooter>
            <div className="flex gap-2">
              <input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add comment..."
                className="flex-1 px-3 py-2 rounded-full bg-muted text-sm"
              />

              <button onClick={handleAddComment}>
                <Send className="w-5 h-5 text-primary" />
              </button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default ReelCard;
