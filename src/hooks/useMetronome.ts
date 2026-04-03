import { useState, useRef, useCallback, useEffect } from "react";

const BEATS = 4;
const SUBDIVISIONS = 4;

export function useMetronome() {
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(-1);
  const [currentSubdivision, setCurrentSubdivision] = useState(-1);

  // Timer state (seconds)
  const [timerMinutes, setTimerMinutes] = useState(5);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [remainingMs, setRemainingMs] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const timerEndRef = useRef<number>(0);

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

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setIsPlaying(false);
    setTimerActive(false);
    setCurrentBeat(-1);
    setCurrentSubdivision(-1);
  }, []);

  const start = useCallback(() => {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume();

    const totalTimerMs = (timerMinutes * 60 + timerSeconds) * 1000;
    if (totalTimerMs <= 0) return;

    setRemainingMs(totalTimerMs);
    timerEndRef.current = Date.now() + totalTimerMs;
    setTimerActive(true);
    setIsPlaying(true);

    let beat = 0;
    let sub = 0;

    const subdivisionInterval = (60000 / bpm) / SUBDIVISIONS;

    // Play first click immediately
    playClick(true, false);
    setCurrentBeat(0);
    setCurrentSubdivision(0);
    sub = 1;

    intervalRef.current = window.setInterval(() => {
      // Check timer
      const remaining = timerEndRef.current - Date.now();
      if (remaining <= 0) {
        stop();
        return;
      }

      const isDownbeat = sub === 0;
      const isAccent = isDownbeat && (beat === 0 || beat === 2);
      playClick(isAccent, !isDownbeat);
      setCurrentBeat(beat);
      setCurrentSubdivision(sub);

      sub++;
      if (sub >= SUBDIVISIONS) {
        sub = 0;
        beat++;
        if (beat >= BEATS) {
          beat = 0;
        }
      }
    }, subdivisionInterval);

    // Timer countdown display
    timerIntervalRef.current = window.setInterval(() => {
      const r = timerEndRef.current - Date.now();
      if (r <= 0) {
        setRemainingMs(0);
      } else {
        setRemainingMs(r);
      }
    }, 100);
  }, [bpm, timerMinutes, timerSeconds, getAudioContext, playClick, stop]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  return {
    bpm, setBpm,
    isPlaying, start, stop,
    currentBeat, currentSubdivision,
    timerMinutes, setTimerMinutes,
    timerSeconds, setTimerSeconds,
    remainingMs, timerActive,
    beats: BEATS,
    subdivisions: SUBDIVISIONS,
  };
}
