import { useNavigate } from "react-router-dom";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Settings, Eye, Bookmark, Users, UserPlus } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();

  // Mock investor data
  const investorData = {
    name: "John Anderson",
    username: "@johnanderson",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    bio: "Angel investor | Early stage startup enthusiast | Focus on AI & SaaS",
    location: "San Francisco, CA",
    stats: {
      followers: 2847,
      following: 342,
      postsSaved: 156,
      profileViews: 1893
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      
      <main className="pt-14 pb-20">
        <div className="max-w-2xl mx-auto">
          {/* Profile Header */}
          <div className="relative bg-gradient-to-br from-primary/5 via-background to-background">
            <div className="p-6 space-y-6">
              {/* Avatar and Basic Info */}
              <div className="flex items-start gap-4">
                <Avatar className="h-24 w-24 ring-4 ring-background shadow-xl">
                  <AvatarImage src={investorData.avatar} alt={investorData.name} />
                  <AvatarFallback className="text-2xl">{investorData.name[0]}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-bold text-foreground truncate">
                    {investorData.name}
                  </h1>
                  <p className="text-muted-foreground text-sm">
                    {investorData.username}
                  </p>
                  <p className="text-muted-foreground text-sm mt-1">
                    {investorData.location}
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                  onClick={() => {/* Navigate to settings */}}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>

              {/* Bio */}
              <p className="text-sm text-foreground leading-relaxed">
                {investorData.bio}
              </p>

              {/* Edit Profile Button */}
              <Button variant="default" className="w-full">
                Edit Profile
              </Button>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Stats Grid */}
          <div className="px-4 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Profile Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              {/* Followers Card */}
              <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {formatNumber(investorData.stats.followers)}
                      </p>
                      <p className="text-sm text-muted-foreground">Followers</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Following Card */}
              <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-primary/10">
                      <UserPlus className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {formatNumber(investorData.stats.following)}
                      </p>
                      <p className="text-sm text-muted-foreground">Following</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Posts Saved Card */}
              <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Bookmark className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {formatNumber(investorData.stats.postsSaved)}
                      </p>
                      <p className="text-sm text-muted-foreground">Posts Saved</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Views Card */}
              <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Eye className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {formatNumber(investorData.stats.profileViews)}
                      </p>
                      <p className="text-sm text-muted-foreground">Profile Views</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Investment Preferences Section */}
          <div className="px-4 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Investment Focus</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Industries</p>
                  <div className="flex flex-wrap gap-2">
                    {["AI & ML", "SaaS", "FinTech", "HealthTech"].map(tag => (
                      <span 
                        key={tag}
                        className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Investment Range</p>
                  <p className="text-sm text-muted-foreground">$50K - $500K per startup</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Stage Preference</p>
                  <p className="text-sm text-muted-foreground">Pre-seed, Seed, Series A</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;
