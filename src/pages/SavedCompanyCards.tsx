import { useNavigate } from "react-router-dom";
import { ArrowLeft, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

const SavedCompanyCards = () => {
  const navigate = useNavigate();

  // Mock data - replace with actual saved company cards
  const savedCompanies: any[] = [];

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
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-blue-500" />
            <h1 className="text-lg font-semibold text-foreground">Saved Company Cards</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {savedCompanies.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No saved company cards yet</h3>
              <p className="text-sm text-muted-foreground">
                Company cards you save will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Saved company cards will be displayed here */}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SavedCompanyCards;
