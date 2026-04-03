import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Music } from "lucide-react";

const exercises = [
  {
    id: "2-blocos-x-8",
    name: "2 blocos x 8",
    description: "2 blocos de 8 rodadas de 1 minuto, com descanso entre rodadas e blocos",
  },
];

const Exercises = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Exercícios</h1>
          <div className="w-10" />
        </div>

        <div className="space-y-3">
          {exercises.map((ex) => (
            <button
              key={ex.id}
              onClick={() => navigate(`/exercicio/${ex.id}`)}
              className="w-full bg-card rounded-xl p-5 border border-border text-left hover:border-primary/50 hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Music className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">{ex.name}</h2>
                  <p className="text-sm text-muted-foreground">{ex.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Exercises;
