import { useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";

interface BpmControlProps {
  bpm: number;
  setBpm: (v: number) => void;
  disabled?: boolean;
}

const BpmControl = ({ bpm, setBpm, disabled = false }: BpmControlProps) => {
  const [bpmInput, setBpmInput] = useState(() => bpm.toString());

  useEffect(() => {
    setBpmInput(bpm.toString());
  }, [bpm]);

  const commitBpmInput = () => {
    const parsed = Number(bpmInput);
    if (Number.isNaN(parsed) || bpmInput === "") {
      setBpmInput(bpm.toString());
      return;
    }
    const next = Math.max(30, Math.min(240, parsed));
    setBpm(next);
    setBpmInput(next.toString());
  };

  return (
    <div className="bg-card rounded-xl p-6 space-y-4 border border-border">
      <div className="flex items-end justify-center gap-2">
        <input
          type="number"
          min={30}
          max={240}
          value={bpmInput}
          onChange={(e) => {
            setBpmInput(e.target.value);
            if (e.target.value === "") return;
            const parsed = Number(e.target.value);
            if (!Number.isNaN(parsed)) setBpm(parsed);
          }}
          onBlur={commitBpmInput}
          disabled={disabled}
          className="w-28 h-16 text-center text-5xl font-bold bg-secondary text-primary rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none disabled:opacity-50"
        />
        <span className="text-muted-foreground text-lg pb-3">BPM</span>
      </div>
      <p className="text-xs text-muted-foreground text-center">Digite o valor ou mova o slider</p>
      <Slider
        value={[Math.max(30, Math.min(240, bpm))]}
        onValueChange={([v]) => setBpm(v)}
        min={30}
        max={240}
        step={1}
        disabled={disabled}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>30</span>
        <span>240</span>
      </div>
    </div>
  );
};

export default BpmControl;
