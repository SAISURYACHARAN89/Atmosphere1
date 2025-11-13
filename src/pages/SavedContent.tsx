import { useNavigate } from "react-router-dom";
import { ArrowLeft, Play, ShoppingBag, FileText, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

const SavedContent = () => {
  const navigate = useNavigate();

  const categories = [
    {
      title: "Sell Ads",
      count: 0,
      icon: ShoppingBag,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
      path: "/saved/sell-ads",
    },
    {
      title: "Company Cards",
      count: 0,
      icon: Briefcase,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
      path: "/saved/company-cards",
    },
    {
      title: "Reels",
      count: 0,
      icon: Play,
      iconBg: "bg-pink-500/10",
      iconColor: "text-pink-500",
      path: "/saved/reels",
    },
    {
      title: "Posts",
      count: 0,
      icon: FileText,
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-500",
      path: "/saved/posts",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="flex items-center gap-4 px-4 py-3 max-w-2xl mx-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="hover:bg-muted/80"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Saved Content</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-4">
          <p className="text-sm text-muted-foreground px-2">
            Access your saved items by category
          </p>

          {/* Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <button
                  key={index}
                  onClick={() => navigate(category.path)}
                  className="bg-card rounded-xl border border-border/50 p-6 text-left space-y-4 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-lg ${category.iconBg} flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 ${category.iconColor}`} />
                  </div>

                  {/* Title and Count */}
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground">{category.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {category.count} {category.count === 1 ? 'item' : 'items'} saved
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SavedContent;
