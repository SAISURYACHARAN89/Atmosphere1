import { useNavigate } from "react-router-dom";
import { ArrowLeft, Play, ShoppingBag, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

const SavedContent = () => {
  const navigate = useNavigate();

  // ---------------------------
  // Mock data from web (Unsplash)
  // ---------------------------

  const savedAds = [
    "https://images.unsplash.com/photo-1516116216624-53e697fedbea",
    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f",
    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=800",
    "https://images.unsplash.com/photo-1553456558-aff63285bdd1",
  ];

  const savedMedia = [
    "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d",
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
    "https://images.unsplash.com/photo-1538150940599-1f2f3e69e9f7",
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80",
  ];

  const savedCompanyCards = [
    "https://images.unsplash.com/photo-1485217988980-11786ced9454",
    "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
    "https://images.unsplash.com/photo-1521790945508-bf2a36314e85",
  ];

  const categories = [
    {
      title: "Ads",
      icon: ShoppingBag,
      path: "/saved/ads",
      preview: savedAds,
    },
    {
      title: "Media",
      icon: Play,
      path: "/saved/media",
      preview: savedMedia,
    },
    {
      title: "Company Cards",
      icon: Briefcase,
      path: "/saved/company-cards",
      preview: savedCompanyCards,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-3 max-w-2xl mx-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="hover:bg-muted/80"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <h1 className="text-lg font-semibold">Saved</h1>

          <Button variant="ghost" size="icon">
            <span className="text-3xl">+</span>
          </Button>
        </div>
      </header>

      {/* Main */}
      <main className="px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">

          {/* Grid */}
          <div className="grid grid-cols-2 gap-5">
            {categories.map((cat, index) => {
              const Icon = cat.icon;
              return (
                <div
                  key={index}
                  onClick={() => navigate(cat.path)}
                  className="cursor-pointer"
                >
                  {/* Preview Box */}
                  <div className="grid grid-cols-2 grid-rows-2 gap-0.5 rounded-xl overflow-hidden bg-muted mb-3">
                    {cat.preview.slice(0, 4).map((img, i) => (
                      <div
                        key={i}
                        className="w-full h-20 bg-muted"
                        style={{
                          backgroundImage: `url(${img})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />
                    ))}
                  </div>

                  {/* Title */}
                  <h3 className="text-sm text-foreground font-medium flex items-center gap-1.5">
                    <Icon className="h-4 w-4 opacity-70" />
                    {cat.title}
                  </h3>
                </div>
              );
            })}
          </div>

        </div>
      </main>
    </div>
  );
};

export default SavedContent;
