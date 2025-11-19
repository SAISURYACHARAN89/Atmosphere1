import { useNavigate } from "react-router-dom";
import { ArrowLeft, Info } from "lucide-react";

const ProfileVisitsInsight = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">

      <header className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border z-50">
        <div className="max-w-2xl mx-auto flex items-center justify-between px-4 h-14">
          <button className="p-2 hover:bg-muted/50 rounded-lg" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </button>

          <h1 className="text-base font-semibold">Profile visits</h1>

          <button className="p-2"> 
           
        </button> 
        </div>
      </header>

      <main className="pt-16 pb-10 px-4 max-w-2xl mx-auto">
       

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Change the date range or create new content to view<br />
          your engagement insights
        </p>

        <div className="flex items-center justify-center mt-10">
          <div className="h-52 w-52 rounded-full border-[10px] border-muted/40 flex flex-col items-center justify-center">
            <span className="text-sm text-muted-foreground">Profile visits</span>
            <span className="text-3xl font-bold">0</span>
          </div>
        </div>

        <div className="border-t mt-10 pt-4 flex items-center justify-between text-sm">
          <span>Accounts reached</span>
          <span>0</span>
        </div>
        <div className="border-t mt-10 pt-4 flex items-center justify-between text-sm">
          <span>Startups</span>
          <span>0</span>
        </div>
        <div className="border-t mt-10 pt-4 flex items-center justify-between text-sm">
          <span>Investors</span>
          <span>0</span>
        </div>
      </main>

    </div>
  );
};

export default ProfileVisitsInsight;
