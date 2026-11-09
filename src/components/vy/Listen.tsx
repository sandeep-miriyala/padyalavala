"use client";

import { SpeakerIcon, StopIcon } from "@yuktishaalaa/yuktai/icons";

type Props = {
  text: string | string[];
  id?: string;
  label?: string;
  speaking: string | null;
  speak: (text: string | string[], id?: string) => void;
  small?: boolean;
};

/** 🔊 వినండి / ⏹ ఆపండి బటన్. */
export default function Listen({ text, id, label = "వినండి", speaking, speak, small }: Props) {
  const key = id ?? (Array.isArray(text) ? text.join(" ") : text);
  const on = speaking === key;
  const name = Array.isArray(text) ? label : `${text}: ${on ? "ఆపండి" : label}`;
  return (
    <button
      type="button"
      className={`btn listen${small ? " icon-only" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        speak(text, key);
      }}
      aria-pressed={on}
      aria-label={small ? name : undefined}
      title={small ? name : undefined}
    >
      {on ? <StopIcon size={18} aria-hidden="true" /> : <SpeakerIcon size={18} aria-hidden="true" />}
      {!small && <span>{on ? "ఆపండి" : label}</span>}
    </button>
  );
}
