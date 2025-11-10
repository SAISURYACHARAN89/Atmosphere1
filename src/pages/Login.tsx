import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, User, CheckCircle2 } from "lucide-react";

const users = [
  {
    id: "john",
    name: "John",
    type: "investor" as const,
    verified: true,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
  },
  {
    id: "ramesh",
    name: "Ramesh",
    type: "investor" as const,
    verified: false,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
  },
  {
    id: "airbound",
    name: "Airbound",
    type: "startup" as const,
    verified: true,
    avatar: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=400&fit=crop",
  },
  {
    id: "zlyft",
    name: "Zlyft",
    type: "startup" as const,
    verified: false,
    avatar: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop",
  },
];

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (user: typeof users[0]) => {
    localStorage.setItem("userId", user.id);
    localStorage.setItem("userName", user.name);
    localStorage.setItem("userMode", user.type);
    localStorage.setItem("isVerified", user.verified.toString());
    
    if (user.type === "investor") {
      navigate("/profile");
    } else {
      navigate("/startup-profile");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Select Your Profile</h1>
          <p className="text-muted-foreground">Choose an account to continue</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {users.map((user) => (
            <Card 
              key={user.id}
              className="cursor-pointer hover:border-primary transition-all hover:shadow-lg"
              onClick={() => handleLogin(user)}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      {user.type === "investor" && (
                        <User className="absolute -bottom-1 -right-1 h-5 w-5 bg-primary text-primary-foreground rounded-full p-1" />
                      )}
                      {user.type === "startup" && (
                        <Building2 className="absolute -bottom-1 -right-1 h-5 w-5 bg-primary text-primary-foreground rounded-full p-1" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{user.name}</span>
                        {user.verified && (
                          <CheckCircle2 className="h-5 w-5 text-blue-500" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground capitalize">
                        {user.type}
                      </p>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge 
                  variant={user.verified ? "default" : "secondary"}
                  className={user.verified ? "bg-green-600" : ""}
                >
                  {user.verified ? "Verified" : "Unverified"}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Login;
