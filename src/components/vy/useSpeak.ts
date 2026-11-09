"use client";

import { useCallback, useEffect, useState } from "react";
import { useBrowser } from "./client";

/**
 * తెలుగులో చదివి వినిపించడం: బ్రౌజర్‌లోని స్వరం (speechSynthesis), te-IN. సర్వర్ లేదు.
 * ఒకసారి ఒక్కటే వినిపిస్తుంది; అదే బటన్ మళ్ళీ నొక్కితే ఆగుతుంది.
 */
export function useSpeak() {
  const [speaking, setSpeaking] = useState<string | null>(null);
  const supported = useBrowser(() => "speechSynthesis" in window);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  const stop = useCallback(() => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setSpeaking(null);
  }, []);

  /** Speaks one text, or a list one after another. `id` marks which button is playing. */
  const speak = useCallback(
    (text: string | string[], id: string = Array.isArray(text) ? text.join(" ") : text) => {
      if (!("speechSynthesis" in window)) return;
      const synth = window.speechSynthesis;
      synth.cancel();
      if (speaking === id) {
        setSpeaking(null);
        return;
      }
      const parts = Array.isArray(text) ? text : [text];
      const voice = synth.getVoices().find((v) => v.lang.toLowerCase().startsWith("te"));
      setSpeaking(id);
      parts.forEach((p, i) => {
        const u = new SpeechSynthesisUtterance(p);
        u.lang = "te-IN";
        if (voice) u.voice = voice;
        u.rate = 0.85;
        if (i === parts.length - 1) {
          u.onend = () => setSpeaking((cur) => (cur === id ? null : cur));
          u.onerror = () => setSpeaking((cur) => (cur === id ? null : cur));
        }
        synth.speak(u);
      });
    },
    [speaking],
  );

  return { speak, stop, speaking, supported };
}
