import { useMetronome } from "@/hooks/useMetronome";
import BeatIndicator from "./BeatIndicator";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Square, Timer } from "lucide-react";

const formatTime = (ms: number) => {
  const totalSec = Math.ceil(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

const Metronome = () => {
  const {
    bpm, setBpm,
    isPlaying, start, stop,
    currentBeat, currentSubdivision,
    timerMinutes, setTimerMinutes,
    timerSeconds, setTimerSeconds,
    remainingMs, timerActive,
    beats, subdivisions,
  } = useMetronome();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Metrônomo</h1>
          <p className="text-muted-foreground text-sm mt-1">4 tempos × 4 subdivisões</p>
        </div>

        {/* Beat indicators */}
        <div className="flex justify-center gap-6">
          {Array.from({ length: beats }).map((_, i) => (
            <BeatIndicator
              key={i}
              beatIndex={i}
              currentBeat={currentBeat}
              currentSubdivision={currentSubdivision}
              subdivisions={subdivisions}
              isPlaying={isPlaying}
            />
          ))}
        </div>

        {/* BPM */}
        <div className="bg-card rounded-xl p-6 space-y-4 border border-border">
          <div className="text-center">
            <span className="text-5xl font-bold text-primary tabular-nums">{bpm}</span>
            <span className="text-muted-foreground ml-2 text-lg">BPM</span>
          </div>
          <Slider
            value={[bpm]}
            onValueChange={([v]) => setBpm(v)}
            min={40}
            max={240}
            step={1}
            disabled={isPlaying}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>40</span>
            <span>240</span>
          </div>
        </div>

        {/* Timer */}
        <div className="bg-card rounded-xl p-6 space-y-4 border border-border">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Timer className="w-4 h-4" />
            <span className="text-sm font-medium">Temporizador</span>
          </div>

          {timerActive ? (
            <div className="text-center">
              <span className="text-4xl font-bold text-primary tabular-nums">
                {formatTime(remainingMs)}
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <div className="flex flex-col items-center">
                <label className="text-xs text-muted-foreground mb-1">Min</label>
                <input
                  type="number"
                  min={0}
                  max={59}
                  value={timerMinutes}
                  onChange={(e) => setTimerMinutes(Math.max(0, Math.min(59, Number(e.target.value))))}
                  className="w-16 h-12 text-center text-2xl font-bold bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring tabular-nums"
                />
              </div>
              <span className="text-2xl font-bold text-muted-foreground mt-5">:</span>
              <div className="flex flex-col items-center">
                <label className="text-xs text-muted-foreground mb-1">Seg</label>
                <input
                  type="number"
                  min={0}
                  max={59}
                  value={timerSeconds}
                  onChange={(e) => setTimerSeconds(Math.max(0, Math.min(59, Number(e.target.value))))}
                  className="w-16 h-12 text-center text-2xl font-bold bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring tabular-nums"
                />
              </div>
            </div>
          )}
        </div>

        {/* Play/Stop */}
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={isPlaying ? stop : start}
            className="w-full h-14 text-lg font-semibold rounded-xl"
            variant={isPlaying ? "destructive" : "default"}
          >
            {isPlaying ? (
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

export default Metronome;
