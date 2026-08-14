"use client";

const KEY_MAP: Record<string, { solfege: string[]; pitch: string[] }> = {
  C: {
    solfege: ["do", "re", "mi", "fa", "sol", "la", "ti"],
    pitch: ["C", "D", "E", "F", "G", "A", "B"],
  },
  G: {
    solfege: ["do", "re", "mi", "fa", "sol", "la", "ti"],
    pitch: ["G", "A", "B", "C", "D", "E", "F#"],
  },
  D: {
    solfege: ["do", "re", "mi", "fa", "sol", "la", "ti"],
    pitch: ["D", "E", "F#", "G", "A", "B", "C#"],
  },
  F: {
    solfege: ["do", "re", "mi", "fa", "sol", "la", "ti"],
    pitch: ["F", "G", "A", "Bb", "C", "D", "E"],
  },
  Bb: {
    solfege: ["do", "re", "mi", "fa", "sol", "la", "ti"],
    pitch: ["Bb", "C", "D", "Eb", "F", "G", "A"],
  },
};

interface KeyHintProps {
  keyTonic: string;
  locale?: "en" | "zh";
}

export default function KeyHint({ keyTonic, locale = "en" }: KeyHintProps) {
  const data = KEY_MAP[keyTonic];
  if (!data) return null;

  const label = locale === "zh" ? `当前调号：${keyTonic} 大调` : `Current key: ${keyTonic} Major`;

  return (
    <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 text-sm">
      <div className="font-medium text-on-surface mb-2">{label}</div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {data.pitch.map((pitch, i) => (
          <div
            key={i}
            className="bg-surface rounded border border-outline-variant/30 py-1.5 px-1 flex flex-col items-center gap-0.5"
          >
            <span className="text-base font-semibold text-primary">{i + 1}</span>
            <span className="text-[10px] text-on-surface-variant uppercase">{pitch}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
