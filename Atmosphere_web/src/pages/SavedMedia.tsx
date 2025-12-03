import { useNavigate } from "react-router-dom";
import { ArrowLeft, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const SavedMedia = () => {
  const navigate = useNavigate();

  const savedMedia = []; // actual media goes here

  return (
    <div className="min-h-screen bg-background">
      
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center gap-4 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <h1 className="text-lg font-semibold flex items-center gap-2">
            <Play className="h-5 w-5 text-pink-500" />
            Media
          </h1>
        </div>
      </header>

      <main className="px-4 py-6">
        {savedMedia.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-pink-500/10 flex items-center justify-center mx-auto mb-4">
              <Play className="h-8 w-8 text-pink-500" />
            </div>
            <h3 className="text-lg font-semibold">No saved media</h3>
            <p className="text-sm text-muted-foreground">
              Posts & reels you save will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1">
            {/* thumbnails here */}
          </div>
        )}
      </main>
    </div>
  );
};

export default SavedMedia;
