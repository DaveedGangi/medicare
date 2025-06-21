
import { useState,useEffect } from "react";
import Onboarding from "@/components/Onboarding";
import PatientDashboard from "@/components/PatientDashboard";
import CaretakerDashboard from "@/components/CaretakerDashboard";
import { Button } from "@/components/ui/button";
import { Users, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

type UserType = "patient" | "caretaker" | null;

const Index = () => {
  const [userType, setUserType] = useState<UserType>(null);
  const [isOnboarded, setIsOnboarded] = useState(false);


  const navigate = useNavigate();

useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/signin"); // 🚨 Redirect to login if no token
  }
    try {
    const decoded: any = jwtDecode(token);
    const exp = decoded.exp * 1000;

    console.log(decoded.role);
    if (Date.now() > exp) {
      localStorage.removeItem("token");
      navigate("/signin");
    }
      // ✅ Set role from token
    if (decoded.role === "patient" || decoded.role === "caretaker") {
      setUserType(decoded.role);
      setIsOnboarded(true); // ✅ skip onboarding if role is known
    }
  } catch (err) {
    localStorage.removeItem("token");
    navigate("/signin");
  }
}, []);


  const handleOnboardingComplete = (type: UserType) => {
    setUserType(type);
    setIsOnboarded(true);
  };

  const switchUserType = () => {
    const newType = userType === "patient" ? "caretaker" : "patient";
    setUserType(newType);
  };

  if (!isOnboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-border/20 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">MediCare Companion</h1>
              <p className="text-sm text-muted-foreground">
                {userType === "patient" ? "Patient View" : "Caretaker View"}
              </p>
            </div>
          </div>
          
          <div>
          <Button 
            variant="outline" 
            onClick={switchUserType}
            className="flex items-center gap-2 hover:bg-accent transition-colors"
          >
            {userType === "patient" ? <Users className="w-4 h-4" /> : <User className="w-4 h-4" />}
            Switch to {userType === "patient" ? "Caretaker" : "Patient"}
          </Button>
            
              
          </div>
        </div>
    

      </header>
    

      <main className="max-w-6xl mx-auto p-6">
        <div className="text-right">
          <Button
  variant="destructive"
  onClick={() => {
    localStorage.removeItem("token");
    navigate("/signin");
  }}
>
  Logout
          </Button>
        </div>


        
          <br/> 

        {userType === "patient" ? <PatientDashboard /> : <CaretakerDashboard />}
      </main>
    </div>
  );
};

export default Index;
