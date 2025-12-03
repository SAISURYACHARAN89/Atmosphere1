import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus } from "lucide-react";

const stories = [
  {
    id: "1",
    name: "Airbound.co",
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=100&h=100&fit=crop",
    hasNewStory: true,
  },
  {
    id: "2",
    name: "Skyt Air",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=100&h=100&fit=crop",
    hasNewStory: true,
  },
  {
    id: "3",
    name: "NeuralHealth",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=100&h=100&fit=crop",
    hasNewStory: true,
  },
  {
    id: "4",
    name: "GreenCharge",
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=100&h=100&fit=crop",
    hasNewStory: true,
  },
  {
    id: "5",
    name: "FoodFlow",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=100&h=100&fit=crop",
    hasNewStory: true,
  },
  {
    id: "6",
    name: "CodeMentor",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=100&h=100&fit=crop",
    hasNewStory: false,
  },
];

const Stories = () => {
  return (
    <div className="mb-6">
      <div className="flex gap-5 overflow-x-auto pb-2 scrollbar-hide">
        {/* Add Story - User's own story */}
        <div className="flex flex-col items-center gap-2 min-w-[80px] cursor-pointer group">
          <div className="relative">
            <Avatar className="h-20 w-20 border-2 border-border">
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" alt="Your story" />
              <AvatarFallback className="bg-muted text-foreground">You</AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 h-6 w-6 bg-primary rounded-full flex items-center justify-center border-2 border-background group-hover:scale-110 transition-transform">
              <Plus className="h-4 w-4 text-primary-foreground" />
            </div>
          </div>
          <span className="text-xs text-foreground font-medium truncate max-w-[80px]">Add Story</span>
        </div>

        {/* Other stories */}
        {stories.map((story) => (
          <div key={story.id} className="flex flex-col items-center gap-2 min-w-[80px] cursor-pointer">
            <div className={`p-[2.5px] rounded-full ${story.hasNewStory ? 'bg-gradient-to-tr from-primary via-accent to-warning' : 'bg-border'}`}>
              <div className="p-[2.5px] bg-background rounded-full">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={story.image} alt={story.name} />
                  <AvatarFallback className="bg-muted text-foreground">{story.name[0]}</AvatarFallback>
                </Avatar>
              </div>
            </div>
            <span className="text-xs text-muted-foreground truncate max-w-[80px]">{story.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stories;
