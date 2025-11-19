import { useNavigate } from "react-router-dom";
import { ArrowLeft, Info } from "lucide-react";

const FollowersInsight = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">

      <header className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border z-50">
        <div className="max-w-2xl mx-auto flex items-center justify-between px-4 h-14">
          <button className="p-2 hover:bg-muted/50 rounded-lg" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </button>

          <h1 className="text-base font-semibold">Followers</h1>

          <button className="p-2">
            <Info className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </header>

      <main className="pt-16 pb-10 px-4 max-w-2xl mx-auto">
        
        

        <div className="mt-6">
          <p className="text-5xl font-bold">834</p>
          <p className="text-sm text-muted-foreground">Followers</p>
          <p className="text-xs text-red-500 mt-1">-1.1% vs Oct 17</p>
        </div>

        <div className="border-t mt-6 pt-4 space-y-3">
          <p className="font-semibold text-sm">Growth</p>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall</span>
            <span>-10</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Follows</span>
            <span className="text-green-500">20</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Unfollows</span>
            <span className="text-red-500">30</span>
          </div>
        </div>

      </main>
    </div>
  );
};

export default FollowersInsight;
