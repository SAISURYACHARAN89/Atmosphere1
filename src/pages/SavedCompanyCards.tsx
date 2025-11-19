import { useNavigate } from "react-router-dom";
import { ArrowLeft, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

const SavedCompanyCards = () => {
  const navigate = useNavigate();

  const savedCompanies: any[] = [];

  return (
    <div className="min-h-screen bg-background">

      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center gap-4 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <h1 className="text-lg font-semibold flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-blue-500" />
            Company Cards
          </h1>
        </div>
      </header>

      <main className="px-4 py-6">
        {savedCompanies.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
              <Briefcase className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold">No saved company cards</h3>
            <p className="text-sm text-muted-foreground">
              Saved company profiles will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">{/* map cards here */}</div>
        )}
      </main>

    </div>
  );
};

export default SavedCompanyCards;
