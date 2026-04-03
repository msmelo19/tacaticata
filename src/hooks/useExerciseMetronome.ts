import { useState, useRef, useCallback, useEffect } from "react";

const BEATS = 4;
const SUBDIVISIONS = 4;

type Phase = "idle" | "countdown" | "playing" | "rest" | "block-rest" | "finished";

interface ExerciseConfig {
  blocks: number;
  roundsPerBlock: number;
  roundDurationMs: number;
  restBetweenRoundsMs: number;
  restBetweenBlocksMs: number;
}

export function useExerciseMetronome(config: ExerciseConfig) {
  const [bpm, setBpm] = useState(120);
  const [phase, setPhase] = useState<Phase>("idle");
  const [currentBeat, setCurrentBeat] = useState(-1);
  const [currentSubdivision, setCurrentSubdivision] = useState(-1);
  const [countdownValue, setCountdownValue] = useState(3);
  const [currentBlock, setCurrentBlock] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [remainingMs, setRemainingMs] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const phaseEndRef = useRef<number>(0);
  const beatRef = useRef(0);
  const subRef = useRef(0);
  const blockRef = useRef(0);
  const roundRef = useRef(0);
  const bpmRef = useRef(bpm);

  useEffect(() => { bpmRef.current = bpm; }, [bpm]);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    return audioContextRef.current;
  }, []);

  const playClick = useCallback((isAccent: boolean, isSubdivision: boolean) => {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (isAccent) {
      osc.frequency.value = 1200;
      gain.gain.value = 0.8;
    } else if (!isSubdivision) {
      osc.frequency.value = 800;
      gain.gain.value = 0.5;
    } else {
      osc.frequency.value = 600;
      gain.gain.value = 0.2;
    }

    osc.start(ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.stop(ctx.currentTime + 0.05);
  }, [getAudioContext]);

  const playBeep = useCallback(() => {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.value = 0.6;
    osc.start(ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.stop(ctx.currentTime + 0.15);
  }, [getAudioContext]);

  const clearAllIntervals = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  const startMetronome = useCallback(() => {
    clearAllIntervals();
    const subdivisionInterval = (60000 / bpmRef.current) / SUBDIVISIONS;
    beatRef.current = 0;
    subRef.current = 0;

    playClick(true, false);
    setCurrentBeat(0);
    setCurrentSubdivision(0);
    subRef.current = 1;

    intervalRef.current = window.setInterval(() => {
      const remaining = phaseEndRef.current - Date.now();
      if (remaining <= 0) {
        advancePhase();
        return;
      }

      const isDownbeat = subRef.current === 0;
      const isAccent = isDownbeat && (beatRef.current === 0 || beatRef.current === 2);
      playClick(isAccent, !isDownbeat);
      setCurrentBeat(beatRef.current);
      setCurrentSubdivision(subRef.current);

      subRef.current++;
      if (subRef.current >= SUBDIVISIONS) {
        subRef.current = 0;
        beatRef.current++;
        if (beatRef.current >= BEATS) {
          beatRef.current = 0;
        }
      }
    }, subdivisionInterval);
  }, [playClick, clearAllIntervals]);

  const startRestTimer = useCallback((durationMs: number, nextPhase: Phase) => {
    clearAllIntervals();
    setCurrentBeat(-1);
    setCurrentSubdivision(-1);
    phaseEndRef.current = Date.now() + durationMs;
    setRemainingMs(durationMs);

    timerRef.current = window.setInterval(() => {
      const r = phaseEndRef.current - Date.now();
      if (r <= 0) {
        setRemainingMs(0);
        clearAllIntervals();
        if (nextPhase === "playing") {
          startPlayingPhase();
        } else {
          setPhase(nextPhase);
        }
      } else {
        setRemainingMs(r);
      }
    }, 100);
  }, [clearAllIntervals]);

  const advancePhase = useCallback(() => {
    clearAllIntervals();
    roundRef.current++;

    if (roundRef.current >= config.roundsPerBlock) {
      // End of block
      blockRef.current++;
      if (blockRef.current >= config.blocks) {
        // Finished
        setPhase("finished");
        setCurrentBeat(-1);
        setCurrentSubdivision(-1);
        return;
      }
      // Block rest
      roundRef.current = 0;
      setCurrentBlock(blockRef.current);
      setCurrentRound(0);
      setPhase("block-rest");
      startRestTimer(config.restBetweenBlocksMs, "playing");
    } else {
      // Round rest
      setCurrentRound(roundRef.current);
      setPhase("rest");
      startRestTimer(config.restBetweenRoundsMs, "playing");
    }
  }, [clearAllIntervals, config, startRestTimer]);

  const startPlayingPhase = useCallback(() => {
    setPhase("playing");
    phaseEndRef.current = Date.now() + config.roundDurationMs;
    setRemainingMs(config.roundDurationMs);
    startMetronome();

    timerRef.current = window.setInterval(() => {
      const r = phaseEndRef.current - Date.now();
      if (r <= 0) {
        setRemainingMs(0);
      } else {
        setRemainingMs(r);
      }
    }, 100);
  }, [config.roundDurationMs, startMetronome]);

  const start = useCallback(() => {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume();

    blockRef.current = 0;
    roundRef.current = 0;
    setCurrentBlock(0);
    setCurrentRound(0);
    setPhase("countdown");
    setCountdownValue(3);

    let count = 3;
    playBeep();

    const countdownInterval = window.setInterval(() => {
      count--;
      if (count <= 0) {
        clearInterval(countdownInterval);
        startPlayingPhase();
      } else {
        setCountdownValue(count);
        playBeep();
      }
    }, 1000);

    intervalRef.current = countdownInterval;
  }, [getAudioContext, playBeep, startPlayingPhase]);

  const stop = useCallback(() => {
    clearAllIntervals();
    setPhase("idle");
    setCurrentBeat(-1);
    setCurrentSubdivision(-1);
    setCurrentBlock(0);
    setCurrentRound(0);
  }, [clearAllIntervals]);

  useEffect(() => {
    return () => clearAllIntervals();
  }, [clearAllIntervals]);

  return {
    bpm, setBpm,
    phase, start, stop,
    currentBeat, currentSubdivision,
    countdownValue,
    currentBlock, currentRound,
    remainingMs,
    beats: BEATS,
    subdivisions: SUBDIVISIONS,
  };
}
