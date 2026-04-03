interface BeatIndicatorProps {
  beatIndex: number;
  currentBeat: number;
  currentSubdivision: number;
  subdivisions: number;
  isPlaying: boolean;
}

const BeatIndicator = ({ beatIndex, currentBeat, currentSubdivision, subdivisions, isPlaying }: BeatIndicatorProps) => {
  const isActiveBeat = isPlaying && currentBeat === beatIndex;
  const isAccent = beatIndex === 0 || beatIndex === 2;

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`w-14 h-14 rounded-full border-2 transition-all duration-75 flex items-center justify-center text-lg font-bold ${
          isActiveBeat
            ? isAccent
              ? "bg-beat-accent border-beat-accent scale-110 text-foreground"
              : "bg-beat-active border-beat-active scale-110 text-primary-foreground"
            : "bg-beat-inactive border-border text-muted-foreground"
        }`}
      >
        {beatIndex + 1}
      </div>
      <div className="flex gap-1">
        {Array.from({ length: subdivisions }).map((_, subIdx) => (
          <div
            key={subIdx}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-75 ${
              isActiveBeat && currentSubdivision === subIdx
                ? subIdx === 0
                  ? "bg-beat-active scale-125"
                  : "bg-subdivision-active scale-125"
                : "bg-beat-inactive"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default BeatIndicator;
