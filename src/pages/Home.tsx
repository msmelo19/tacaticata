import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-bold text-foreground tracking-tight">Tacaticatá</h1>
          <p className="text-muted-foreground mt-2">Seu metrônomo de prática</p>
        </div>

        <div className="space-y-4">
          <Button
            size="lg"
            onClick={() => navigate("/livre")}
            className="w-full h-16 text-xl font-semibold rounded-xl"
          >
            <Play className="w-6 h-6 mr-3" />
            Livre
          </Button>

          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate("/exercicios")}
            className="w-full h-16 text-xl font-semibold rounded-xl"
          >
            Exercícios
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
