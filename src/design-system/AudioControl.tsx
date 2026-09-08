import { useState } from "react";

type AudioControlProps = { label: string; onPlay: () => void | Promise<void>; onPlaySlow?: () => void | Promise<void>; disabled?: boolean };

export function AudioControl({ disabled = false, label, onPlay, onPlaySlow }: AudioControlProps) {
  const [playing, setPlaying] = useState(false);
  const handlePlay = async () => {
    setPlaying(true);
    try { await onPlay(); } finally { setPlaying(false); }
  };
  return <span className="v2-audio-group"><button className="v2-audio" type="button" disabled={disabled || playing} onClick={handlePlay} aria-label={label}><span aria-hidden="true">🔊</span> {playing ? "Playing…" : "Play audio"}</button>{onPlaySlow && <button className="v2-audio v2-audio--slow" type="button" disabled={disabled || playing} onClick={() => void onPlaySlow()} aria-label={`${label} slowly`}><span aria-hidden="true">🐢</span> Slow</button>}</span>;
}
