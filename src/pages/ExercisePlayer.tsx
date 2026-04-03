import { useNavigate, useParams } from "react-router-dom";
import { useExerciseMetronome } from "@/hooks/useExerciseMetronome";
import BeatIndicator from "@/components/BeatIndicator";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Play, Square } from "lucide-react";

const EXERCISE_CONFIG = {
  blocks: 2,
  roundsPerBlock: 8,
  roundDurationMs: 60_000,
  restBetweenRoundsMs: 15_000,
  restBetweenBlocksMs: 4 * 60_000,
};

const formatTime = (ms: number) => {
  const totalSec = Math.ceil(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

const ExercisePlayer = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    bpm, setBpm,
    phase, start, stop,
    currentBeat, currentSubdivision,
    countdownValue,
    currentBlock, currentRound,
    remainingMs,
    beats, subdivisions,
  } = useExerciseMetronome(EXERCISE_CONFIG);

  const isActive = phase !== "idle" && phase !== "finished";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => { stop(); navigate("/exercicios"); }}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">2 blocos x 8</h1>
          <div className="w-10" />
        </div>

        {/* Progress info */}
        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Bloco <span className="text-foreground font-semibold">{currentBlock + 1}</span> / {EXERCISE_CONFIG.blocks}</span>
            <span>Rodada <span className="text-foreground font-semibold">{currentRound + 1}</span> / {EXERCISE_CONFIG.roundsPerBlock}</span>
          </div>
        </div>

        {/* Countdown overlay */}
        {phase === "countdown" && (
          <div className="flex justify-center">
            <div className="w-32 h-32 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
              <span className="text-6xl font-bold text-primary tabular-nums">{countdownValue}</span>
            </div>
          </div>
        )}

        {/* Rest phase */}
        {(phase === "rest" || phase === "block-rest") && (
          <div className="bg-card rounded-xl p-6 border border-border text-center space-y-3">
            <p className="text-lg font-semibold text-muted-foreground">
              {phase === "block-rest" ? "Descanso entre blocos" : "Descanso"}
            </p>
            <span className="text-5xl font-bold text-primary tabular-nums">
              {formatTime(remainingMs)}
            </span>
          </div>
        )}

        {/* Finished */}
        {phase === "finished" && (
          <div className="bg-card rounded-xl p-6 border border-border text-center space-y-4">
            <p className="text-2xl font-bold text-primary">Exercício concluído! 🎉</p>
            <Button onClick={() => { stop(); }} variant="secondary" className="w-full">
              Reiniciar
            </Button>
          </div>
        )}

        {/* Beat indicators */}
        {phase === "playing" && (
          <>
            <div className="flex justify-center gap-6">
              {Array.from({ length: beats }).map((_, i) => (
                <BeatIndicator
                  key={i}
                  beatIndex={i}
                  currentBeat={currentBeat}
                  currentSubdivision={currentSubdivision}
                  subdivisions={subdivisions}
                  isPlaying={true}
                />
              ))}
            </div>

            <div className="bg-card rounded-xl p-4 border border-border text-center">
              <span className="text-4xl font-bold text-primary tabular-nums">{formatTime(remainingMs)}</span>
            </div>
          </>
        )}

        {/* BPM control */}
        <div className="bg-card rounded-xl p-6 space-y-4 border border-border">
          <div className="text-center">
            <span className="text-5xl font-bold text-primary tabular-nums">{bpm}</span>
            <span className="text-muted-foreground ml-2 text-lg">BPM</span>
          </div>
          <Slider
            value={[bpm]}
            onValueChange={([v]) => setBpm(v)}
            min={30}
            max={240}
            step={1}
            disabled={isActive}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>30</span>
            <span>240</span>
          </div>
        </div>

        {/* Play/Stop */}
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={isActive ? stop : start}
            className="w-full h-14 text-lg font-semibold rounded-xl"
            variant={isActive ? "destructive" : "default"}
          >
            {isActive ? (
              <><Square className="w-5 h-5 mr-2" /> Parar</>
            ) : (
              <><Play className="w-5 h-5 mr-2" /> Iniciar</>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExercisePlayer;
