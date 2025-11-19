import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import BottomNav from "@/components/BottomNav";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  ChevronLeft,
  BadgeCheck,
  Crown,
  Plus,
  Send,
} from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";

/**
 * Reels component — updated to enforce "Instagram-style" replies:
 * - Max depth = 1 (top-level comment -> replies)
 * - Replies to replies are flattened into the top-level comment's replies list
 *   and show as "@username message..."
 * - Only top-level comments show "Show replies / Hide replies"
 * - Replies never have their own "Show replies" toggle
 *
 * Drop into your app replacing the previous Reels file.
 */

/* ----------------------------- Types ----------------------------- */

type CommentItem = {
  id: string;
  name: string;
  avatar?: string;
  verified?: boolean;
  time?: string; // short label like "2h", "now"
  text?: string;
  image?: string | null;
  likes?: number;
  isLiked?: boolean;
  children?: CommentItem[]; // replies (only one-level deep)
  showChildren?: boolean; // toggle for top-level comments only
};

const uid = (prefix = "") => `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

/* --------------------------- Mock Data --------------------------- */

const mockReels = [
  {
    id: "1",
    companyId: "airbound-co",
    companyName: "Airbound.co",
    companyLogo:
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=100&h=100&fit=crop",
    description: "Revolutionary drone delivery for urban logistics 🚁",
    videoUrl:
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=800&fit=crop",
    likes: 1249,
    crowns: 300,
    comments: 124,
    shares: 89,
    isLiked: false,
    isCrowned: false,
    isSaved: false,
    isVerified: true,
  },
] as const;

/* ------------------------ Initial Comments ------------------------ */

/**
 * Original sample data included nested children (grandchildren).
 * For the "Instagram-style" behavior we normalize to ensure:
 *  - top-level comments may have children (replies)
 *  - replies do NOT have their own children — any deeper replies are flattened
 *    into the top-level replies array, and their text is prefixed with "@parentName "
 */
const initialCommentsRaw: CommentItem[] = [
  {
    id: uid("c"),
    name: "Priya Sharma",
    avatar: "/avatars/p1.jpg",
    verified: true,
    time: "2h",
    text: "Amazing progress! Keep building 🔥",
    likes: 12,
    isLiked: false,
    children: [
      {
        id: uid("c"),
        name: "Ramesh",
        avatar: "/avatars/p4.jpg",
        verified: false,
        time: "1h",
        text: "Agreed! The team is amazing.",
        likes: 2,
        isLiked: false,
        children: [
          {
            id: uid("c"),
            name: "Sia",
            time: "40m",
            text: "When's the next demo?",
            likes: 0,
            isLiked: false,
          },
        ],
      },
    ],
    showChildren: true,
  },
  {
    id: uid("c"),
    name: "Ravi Kumar",
    avatar: "/avatars/p2.jpg",
    verified: false,
    time: "1h",
    text: "Super excited for this startup!",
    image: "/placeholders/sample1.jpg",
    likes: 3,
    isLiked: false,
  },
];

/* ------------------------- Helper functions ----------------------- */

/**
 * Normalize comments so that nesting depth is at most 1.
 * Any grandchildren are promoted into top-level.children with text prefixed:
 *   "@{immediateParentName} {grandchild.text}"
 */
const normalizeComments = (list: CommentItem[]): CommentItem[] => {
  return list.map((top) => {
    const replies: CommentItem[] = [];

    if (top.children && top.children.length > 0) {
      for (const child of top.children) {
        // push the direct child (without its children)
        const childCopy: CommentItem = {
          ...child,
          // ensure grandchildren won't be carried over as children of childCopy
          children: [],
          showChildren: undefined,
        };
        replies.push(childCopy);

        // if the child has deeper children, flatten them into replies
        if (child.children && child.children.length > 0) {
          for (const grand of child.children) {
            const grandCopy: CommentItem = {
              ...grand,
              // prefix text with @child.name if text exists
              text: grand.text ? `@${child.name} ${grand.text}` : `@${child.name}`,
              children: [],
              showChildren: undefined,
            };
            replies.push(grandCopy);
          }
        }
      }
    }

    return {
      ...top,
      // ensure replies array exists
      children: replies,
      // only top-level comments should control showChildren
      showChildren: top.showChildren ?? false,
    };
  });
};

/**
 * Find the top-level comment id for any given id.
 * Returns the id itself if it's top-level, or the parent's id if it's a reply id.
 */
const findTopLevelId = (list: CommentItem[], id: string): string | null => {
  for (const top of list) {
    if (top.id === id) return top.id;
    if (top.children && top.children.some((c) => c.id === id)) return top.id;
  }
  return null;
};

/* ------------------------ Main Component ------------------------- */

const Reels: React.FC = () => {
  const navigate = useNavigate();

  const [reels, setReels] = useState(mockReels);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [activeReelIndex, setActiveReelIndex] = useState<number | null>(null);

  // comments state is per-reel; for demo we'll keep it generic and reset when opening a reel
  const [commentList, setCommentList] = useState<CommentItem[]>(() => normalizeComments(initialCommentsRaw));

  // shared input state
  const [newComment, setNewComment] = useState("");
  const [commentImage, setCommentImage] = useState<string | null>(null);
  const commentFileRef = useRef<HTMLInputElement | null>(null);

  /**
   * replyTarget:
   * - targetTopId: id of the top-level comment where the reply should be added
   * - originalId: id of the comment (could be top-level or a reply) the user clicked "Reply" on
   * - originalName: display name to prefix when replying to a reply
   *
   * Example:
   *  - Replying to top-level comment: targetTopId === originalId, originalName is top-level name
   *  - Replying to a reply: targetTopId = top-level id, originalId = reply id, originalName = reply's name
   */
  const [replyTarget, setReplyTarget] = useState<{
    targetTopId: string;
    originalId: string;
    originalName: string;
  } | null>(null);

  // ref to scroll container inside drawer
  const commentsTopRef = useRef<HTMLDivElement | null>(null);

  /* ---------------------- Comment Manipulation ---------------------- */

  // add a reply to a top-level comment (prepend)
  const addReplyToTopLevel = (list: CommentItem[], topId: string, reply: CommentItem): CommentItem[] => {
    return list.map((top) => {
      if (top.id === topId) {
        const children = top.children ? [reply, ...top.children] : [reply];
        return { ...top, children, showChildren: true };
      }
      return top;
    });
  };

  // recursively toggle like by id (works for top-level and replies)
  const toggleLikeRecursive = (list: CommentItem[], targetId: string): CommentItem[] =>
    list.map((item) => {
      if (item.id === targetId) {
        const liked = !item.isLiked;
        const likes = (item.likes ?? 0) + (liked ? 1 : -1);
        return { ...item, isLiked: liked, likes: likes < 0 ? 0 : likes };
      }
      if (item.children && item.children.length > 0) {
        return { ...item, children: toggleLikeRecursive(item.children, targetId) };
      }
      return item;
    });

  // toggle showChildren only for top-level comments (no replies)
  const toggleChildrenForTop = (list: CommentItem[], targetTopId: string): CommentItem[] =>
    list.map((item) => {
      if (item.id === targetTopId) {
        return { ...item, showChildren: !item.showChildren };
      }
      return item;
    });

  /* ------------------------- Add comment/reply ------------------------ */

  const handleAdd = () => {
    if (!newComment.trim() && !commentImage) return;

    // new comment payload
    const baseText = newComment.trim();
    let composedText = baseText || undefined;

    // if replying to a reply (originalId != targetTopId) we prefix with @originalName
    if (replyTarget && replyTarget.originalId !== replyTarget.targetTopId) {
      const prefix = `@${replyTarget.originalName}`;
      composedText = baseText ? `${prefix} ${baseText}` : `${prefix}`;
    }

    const newItem: CommentItem = {
      id: uid("c"),
      name: "You",
      avatar: "", // replace with real user avatar if available
      verified: false,
      time: "now",
      text: composedText,
      image: commentImage || null,
      likes: 0,
      isLiked: false,
      children: [],
      showChildren: undefined,
    };

    if (!replyTarget) {
      // new top-level comment -> prepend
      setCommentList((prev) => [newItem, ...prev]);
    } else {
      // add as reply to targetTopId (flattened behavior)
      setCommentList((prev) => addReplyToTopLevel(prev, replyTarget.targetTopId, newItem));
    }

    // reset input & image & reply target
    setNewComment("");
    setCommentImage(null);
    setReplyTarget(null);

    // scroll to top of comments (smooth)
    setTimeout(() => {
      commentsTopRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }, 30);
  };

  /* ------------------------- Helpers for UI -------------------------- */

  const handleLike = (id: string) => {
    setCommentList((prev) => toggleLikeRecursive(prev, id));
  };

  /**
   * When user clicks Reply on any comment or reply:
   * - find the top-level comment id
   * - set replyTarget with top-level id and the original clicked comment's name/id
   * - focus the input and keep placeholder indicating who the user is replying to
   */
  const handleReplyClick = (id: string, name: string) => {
    const topId = findTopLevelId(commentList, id);
    if (!topId) return;
    setReplyTarget({ targetTopId: topId, originalId: id, originalName: name });

    const inputEl = document.getElementById("reel-comment-input") as HTMLInputElement | null;
    inputEl?.focus();
  };

  const handleToggleReplies = (id: string) => {
    setCommentList((prev) => toggleChildrenForTop(prev, id));
  };

  /* --------------------------- UI Render ----------------------------- */

  // render a single comment (and its children replies — one level)
  const renderComment = (c: CommentItem, level = 0) => {
    return (
      <div key={c.id} className="flex gap-3">
        {/* avatar (indent for replies) */}
        <div className={`flex-shrink-0 ${level > 0 ? "mt-1" : ""}`}>
          <Avatar className={`h-10 w-10 ${level > 0 ? "opacity-90" : ""}`}>
            {c.avatar ? <AvatarImage src={c.avatar} /> : <AvatarFallback>{c.name?.[0]}</AvatarFallback>}
          </Avatar>
        </div>

        <div className="flex-1">
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm">{c.name}</p>
                {c.verified && <BadgeCheck className="w-4 h-4 text-primary" />}
                <span className="text-[12px] text-muted-foreground">{c.time}</span>
              </div>

              {c.text && <p className="text-sm text-foreground/90 mt-1 leading-relaxed">{c.text}</p>}

              {c.image && <img src={c.image} className="rounded-lg mt-2 max-w-[80%]" />}

              {/* actions row: Reply / show replies count */}
              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                <button onClick={() => handleReplyClick(c.id, c.name)} className="hover:underline">
                  Reply
                </button>

                {/* Only top-level comments (level === 0) show the show/hide replies toggle */}
                {level === 0 && c.children && c.children.length > 0 && (
                  <button onClick={() => handleToggleReplies(c.id)} className="hover:underline">
                    {c.showChildren ? `Hide replies (${c.children.length})` : `Show replies (${c.children.length})`}
                  </button>
                )}
              </div>
            </div>

            {/* Like button to the right */}
            <div className="flex flex-col items-center gap-1 ml-2">
              <button
                onClick={() => handleLike(c.id)}
                className={`p-1 rounded-full transition ${c.isLiked ? "" : ""}`}
                aria-label="like"
              >
                <Heart
                  size={18}
                  className={`${c.isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
                />
              </button>
              <span className="text-[12px] text-muted-foreground">{c.likes ?? 0}</span>
            </div>
          </div>

          {/* render children replies if visible (only one level) */}
          {level === 0 && c.children && c.children.length > 0 && c.showChildren && (
            <div className="mt-3 space-y-3 pl-4 border-l border-muted/40">
              {c.children.map((child) => (
                <div key={child.id} className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <Avatar className="h-9 w-9 opacity-90">
                      {child.avatar ? <AvatarImage src={child.avatar} /> : <AvatarFallback>{child.name?.[0]}</AvatarFallback>}
                    </Avatar>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm">{child.name}</p>
                          {child.verified && <BadgeCheck className="w-3.5 h-3.5 text-primary" />}
                          <span className="text-[12px] text-muted-foreground">{child.time}</span>
                        </div>

                        {child.text && <p className="text-sm text-foreground/90 mt-1 leading-relaxed">{child.text}</p>}
                        {child.image && <img src={child.image} className="rounded-lg mt-2 max-w-[80%]" />}

                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <button onClick={() => handleReplyClick(child.id, child.name)} className="hover:underline">
                            Reply
                          </button>
                          {/* replies DO NOT show "Show replies" — flattened behaviour */}
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-1 ml-2">
                        <button
                          onClick={() => handleLike(child.id)}
                          className={`p-1 rounded-full transition ${child.isLiked ? "" : ""}`}
                          aria-label="like"
                        >
                          <Heart
                            size={16}
                            className={`${child.isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
                          />
                        </button>
                        <span className="text-[12px] text-muted-foreground">{child.likes ?? 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  /* ---------------------------- Render ------------------------------ */

  const openCommentsForReel = (index: number) => {
    setActiveReelIndex(index);
    setIsCommentsOpen(true);

    // optionally, load comments for that reel from server here
    setTimeout(() => commentsTopRef.current?.scrollTo({ top: 0, behavior: "smooth" }), 20);
  };

  // ensure normalization on mount in case any code mutated the structure
  useEffect(() => {
    setCommentList((prev) => normalizeComments(prev));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 bg-black pb-16">
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 z-50 text-white drop-shadow-lg"
      >
        <ChevronLeft size={32} strokeWidth={2} />
      </button>

      <div className="h-full w-full overflow-y-scroll snap-y snap-mandatory pb-16">
        {reels.map((reel, index) => (
          <div
            key={reel.id}
            className="relative h-screen w-full snap-start snap-always flex-shrink-0 flex items-center justify-center"
          >
            <div className="relative w-full h-full md:w-auto md:aspect-[9/16] md:max-h-screen">
              <img src={reel.videoUrl} alt={reel.companyName} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

              <div className="absolute right-3 bottom-24 flex flex-col gap-6 z-10">
                <button
                  className="flex flex-col items-center gap-1"
                  onClick={() => {
                    setReels((prev) =>
                      prev.map((r, i) =>
                        i === index ? { ...r, isLiked: !r.isLiked, likes: r.isLiked ? r.likes - 1 : r.likes + 1 } : r
                      )
                    );
                  }}
                >
                  <Heart size={32} className={`${reel.isLiked ? "fill-red-500 text-red-500" : "text-white"} drop-shadow-lg transition-all`} strokeWidth={1.5} />
                  <span className="text-white text-xs font-medium drop-shadow-lg">{reel.likes}</span>
                </button>

                <button
                  className="flex flex-col items-center gap-1"
                  onClick={() =>
                    setReels((prev) =>
                      prev.map((r, i) =>
                        i === index ? { ...r, isCrowned: !r.isCrowned, crowns: r.isCrowned ? r.crowns - 1 : r.crowns + 1 } : r
                      )
                    )
                  }
                >
                  <Crown size={32} className={`${reel.isCrowned ? "fill-yellow-500 text-yellow-500" : "text-white"} drop-shadow-lg transition-all`} strokeWidth={1.5} />
                  <span className="text-white text-xs font-medium drop-shadow-lg">{reel.crowns}</span>
                </button>

                <button
                  className="flex flex-col items-center gap-1"
                  onClick={() => {
                    setActiveReelIndex(index);
                    setIsCommentsOpen(true);
                  }}
                >
                  <MessageCircle size={32} className="text-white drop-shadow-lg" strokeWidth={1.5} />
                  <span className="text-white text-xs font-medium drop-shadow-lg">{reel.comments}</span>
                </button>

                <button className="flex flex-col items-center gap-1">
                  <Share2 size={32} className="text-white drop-shadow-lg" strokeWidth={1.5} />
                  <span className="text-white text-xs font-medium drop-shadow-lg">{reel.shares}</span>
                </button>

                <button onClick={() => setReels((prev) => prev.map((r, i) => (i === index ? { ...r, isSaved: !r.isSaved } : r)))}>
                  <Bookmark size={32} className={`${reel.isSaved ? "fill-white text-white" : "text-white"} drop-shadow-lg transition-all`} strokeWidth={1.5} />
                </button>
              </div>

              <div className="absolute bottom-24 left-4 right-20 z-10">
                <button onClick={() => navigate(`/company/${reel.companyId}`)} className="flex items-center gap-3 mb-3 hover:opacity-80 transition-opacity">
                  <Avatar className="w-10 h-10 border-2 border-white">
                    <AvatarImage src={reel.companyLogo} alt={reel.companyName} />
                    <AvatarFallback className="bg-primary text-primary-foreground">{reel.companyName[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex items-center gap-1">
                    <span className="text-white font-semibold drop-shadow-lg">{reel.companyName}</span>
                    {reel.isVerified && <BadgeCheck size={16} className="text-blue-500 fill-blue-500 drop-shadow-lg" />}
                  </div>
                </button>

                <p className="text-white text-sm drop-shadow-lg line-clamp-2">{reel.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comments Drawer (single shared input) */}
      <Drawer open={isCommentsOpen} onOpenChange={setIsCommentsOpen}>
        <DrawerContent
          className={`
            p-0 w-full max-w-full mx-auto rounded-t-xl
            h-2/3
            lg:max-w-[720px] lg:right-0 lg:left-0
          `}
        >
          <DrawerHeader className="px-4 py-3">
            <div className="flex items-center justify-between">
              {/* <DrawerTitle>Comments</DrawerTitle> */}
              <div className="text-sm text-muted-foreground">{activeReelIndex !== null ? "" : ""}</div>
            </div>
          </DrawerHeader>

          {/* Comment List */}
          <div ref={commentsTopRef} className="max-h-[55vh] overflow-y-auto px-4 pb-4 space-y-6">
            {commentList.length === 0 && <p className="text-sm text-muted-foreground">No comments yet — be the first!</p>}
            {commentList.map((c) => (
              <div key={c.id}>{renderComment(c, 0)}</div>
            ))}
          </div>

          {/* Preview selected image */}
          {commentImage && (
            <div className="px-4 pb-2">
              <div className="relative inline-block">
                <img src={commentImage} className="w-24 h-24 object-cover rounded-lg border" />
                <button onClick={() => setCommentImage(null)} className="absolute -top-2 -right-2 bg-black/60 text-white rounded-full p-1">
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Input Footer */}
          <DrawerFooter className="bg-background border-t p-3">
            <div className="w-full flex items-center gap-2">
              {/* + image button */}
              <button onClick={() => commentFileRef.current?.click()} className="p-2 rounded-full hover:bg-muted transition">
                <Plus className="w-5 h-5 text-muted-foreground" />
              </button>

              <input
                ref={commentFileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setCommentImage(URL.createObjectURL(file));
                }}
              />

              {/* input field (shows replying to if set) */}
              <div className="flex-1">
                {replyTarget ? (
                  <div className="text-xs text-muted-foreground mb-1">
                    Replying to <span className="font-semibold text-foreground">@{replyTarget.originalName}</span>
                    <button onClick={() => setReplyTarget(null)} className="ml-3 text-xs text-muted-foreground hover:underline">Cancel</button>
                  </div>
                ) : null}

                <input
                  id="reel-comment-input"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={replyTarget ? `Reply to @${replyTarget.originalName}` : "Add a comment..."}
                  className="w-full rounded-full px-3 py-2 bg-muted text-sm"
                />
              </div>

              <button
                onClick={handleAdd}
                disabled={!newComment.trim() && !commentImage}
                className="p-2 rounded-full hover:bg-primary/10 disabled:opacity-40 transition"
                aria-label="send"
              >
                <Send className="w-5 h-5 text-primary" />
              </button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <BottomNav />
    </div>
  );
};

export default Reels;
