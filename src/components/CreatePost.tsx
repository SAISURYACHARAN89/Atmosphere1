import { useState } from "react";
import { X, ChevronLeft, Image, Video, FileText, Music, Type, Crop, MapPin, UserPlus, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type PostType = "post" | "reel" | "thought";
type UploadStep = "select" | "edit" | "share";

interface CreatePostProps {
  onClose: () => void;
}

const CreatePost = ({ onClose }: CreatePostProps) => {
  const [step, setStep] = useState<UploadStep>("select");
  const [postType, setPostType] = useState<PostType>("post");
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [taggedPeople, setTaggedPeople] = useState("");
  const [allowComments, setAllowComments] = useState(true);

  // Mock media gallery
  const mockMedia = [
    "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba",
    "https://images.unsplash.com/photo-1682687221038-404cb8830901",
    "https://images.unsplash.com/photo-1682687220063-4742bd7fd538",
    "https://images.unsplash.com/photo-1682687220801-eef408f95d71",
    "https://images.unsplash.com/photo-1682687221080-5cb261c645cb",
    "https://images.unsplash.com/photo-1682687220067-dced9a881b56",
    "https://images.unsplash.com/photo-1682687220923-c58b9a4592ae",
    "https://images.unsplash.com/photo-1682687218904-de46ed992b58",
  ];

  const handleMediaSelect = (media: string) => {
    setSelectedMedia(media);
  };

  const handleNext = () => {
    if (step === "select") setStep("edit");
    else if (step === "edit") setStep("share");
  };

  const handleBack = () => {
    if (step === "edit") setStep("select");
    else if (step === "share") setStep("edit");
  };

  const handleShare = () => {
    // Handle post creation logic here
    console.log({ postType, caption, location, taggedPeople, allowComments });
    onClose();
  };

  const getTitle = () => {
    if (postType === "post") return "New Post";
    if (postType === "reel") return "New Reel";
    return "New Thought";
  };

  return (
    <>
      {/* Backdrop for desktop/tablet */}
      <div className="hidden md:block fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      
      {/* Modal container */}
      <div className="fixed inset-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:h-[90vh] md:rounded-lg bg-background z-50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <button onClick={step === "share" ? handleBack : onClose} className="p-2">
          {step === "share" ? <ChevronLeft className="h-6 w-6" /> : <X className="h-6 w-6" />}
        </button>
        
        <h2 className="text-lg font-semibold">{getTitle()}</h2>
        
        {step !== "share" && (
          <Button 
            onClick={handleNext}
            variant="ghost"
            className="text-primary font-semibold"
            disabled={!selectedMedia && postType !== "thought"}
          >
            Next
          </Button>
        )}
        {step === "share" && <div className="w-12" />}
      </div>

      {/* Content based on step */}
      {step === "select" && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Type selector */}
          <div className="flex border-b border-border shrink-0">
            <button
              onClick={() => setPostType("post")}
              className={`flex-1 py-3 flex items-center justify-center gap-2 transition-colors ${
                postType === "post" ? "bg-primary/10 text-primary border-b-2 border-primary" : "text-muted-foreground"
              }`}
            >
              <Image className="h-5 w-5" />
              <span className="text-sm font-medium">Post</span>
            </button>
            <button
              onClick={() => setPostType("reel")}
              className={`flex-1 py-3 flex items-center justify-center gap-2 transition-colors ${
                postType === "reel" ? "bg-primary/10 text-primary border-b-2 border-primary" : "text-muted-foreground"
              }`}
            >
              <Video className="h-5 w-5" />
              <span className="text-sm font-medium">Reel</span>
            </button>
            <button
              onClick={() => setPostType("thought")}
              className={`flex-1 py-3 flex items-center justify-center gap-2 transition-colors ${
                postType === "thought" ? "bg-primary/10 text-primary border-b-2 border-primary" : "text-muted-foreground"
              }`}
            >
              <FileText className="h-5 w-5" />
              <span className="text-sm font-medium">Thought</span>
            </button>
          </div>

          {postType !== "thought" ? (
            <>
              {/* Selected media preview */}
              <div className="h-64 md:h-80 bg-muted flex items-center justify-center border-b border-border shrink-0">
                {selectedMedia ? (
                  <img 
                    src={selectedMedia} 
                    alt="Selected" 
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Image className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Select a photo or video</p>
                  </div>
                )}
              </div>

              {/* Media gallery */}
              <div className="flex-1 overflow-y-auto bg-background p-2 min-h-0">
                <div className="grid grid-cols-3 gap-1 pb-2">
                  {mockMedia.map((media, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleMediaSelect(media)}
                      className={`aspect-square rounded overflow-hidden ${
                        selectedMedia === media ? "ring-2 ring-primary" : ""
                      }`}
                    >
                      <img 
                        src={media} 
                        alt={`Media ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 p-4 overflow-y-auto">
              <Textarea
                placeholder="Share your thoughts..."
                className="min-h-[300px] text-lg border-none focus-visible:ring-0 resize-none"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </div>
          )}
        </div>
      )}

      {step === "edit" && (
        <div className="flex-1 flex flex-col">
          {/* Media preview */}
          <div className="flex-1 bg-muted flex items-center justify-center">
            {selectedMedia && (
              <img 
                src={selectedMedia} 
                alt="Preview" 
                className="max-h-full max-w-full object-contain"
              />
            )}
          </div>

          {/* Editing tools */}
          <div className="bg-background border-t border-border p-4">
            <div className="flex gap-3 justify-center">
              <Button variant="outline" size="sm" className="gap-2">
                <Crop className="h-4 w-4" />
                Crop
              </Button>
              {postType === "reel" && (
                <Button variant="outline" size="sm" className="gap-2">
                  <Music className="h-4 w-4" />
                  Music
                </Button>
              )}
              <Button variant="outline" size="sm" className="gap-2">
                <Type className="h-4 w-4" />
                Text
              </Button>
            </div>
          </div>
        </div>
      )}

      {step === "share" && (
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Media preview */}
            {selectedMedia && postType !== "thought" && (
              <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                <img 
                  src={selectedMedia} 
                  alt="Final preview" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Caption */}
            <div className="space-y-2">
              <Label>Caption</Label>
              <Textarea
                placeholder="Write a caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            {/* Tag people */}
            <button className="w-full flex items-center justify-between py-3 border-b border-border">
              <div className="flex items-center gap-3">
                <UserPlus className="h-5 w-5 text-muted-foreground" />
                <span>Tag People</span>
              </div>
              <span className="text-sm text-muted-foreground">{taggedPeople || "None"}</span>
            </button>

            {/* Add location */}
            <button className="w-full flex items-center justify-between py-3 border-b border-border">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span>Add Location</span>
              </div>
              <span className="text-sm text-muted-foreground">{location || "None"}</span>
            </button>

            {/* Allow comments */}
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                <span>Allow Comments</span>
              </div>
              <Switch checked={allowComments} onCheckedChange={setAllowComments} />
            </div>
          </div>

          {/* Share button */}
          <div className="p-4 border-t border-border sticky bottom-0 bg-background">
            <Button 
              onClick={handleShare}
              className="w-full"
              size="lg"
            >
              Share
            </Button>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default CreatePost;
