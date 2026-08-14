"use client";

import { useState } from "react";

interface SyntaxGuideProps {
  locale?: "en" | "zh";
}

const EN_ROWS = [
  { symbol: "1 - 7", desc: "Notes" },
  { symbol: "1_", desc: "Eighth note" },
  { symbol: "1__", desc: "Sixteenth note" },
  { symbol: "1-", desc: "Half note" },
  { symbol: "1--", desc: "Whole note" },
  { symbol: "0", desc: "Rest" },
  { symbol: "1'", desc: "High octave" },
  { symbol: "1,", desc: "Low octave" },
  { symbol: "1.", desc: "Dotted note" },
  { symbol: "|", desc: "Bar line" },
];

const ZH_ROWS = [
  { symbol: "1 - 7", desc: "音符" },
  { symbol: "1_", desc: "八分音符" },
  { symbol: "1__", desc: "十六分音符" },
  { symbol: "1-", desc: "二分音符" },
  { symbol: "1--", desc: "全音符" },
  { symbol: "0", desc: "休止符" },
  { symbol: "1'", desc: "高音" },
  { symbol: "1,", desc: "低音" },
  { symbol: "1.", desc: "附点音符" },
  { symbol: "|", desc: "小节线" },
];

export default function SyntaxGuide({ locale = "en" }: SyntaxGuideProps) {
  const [open, setOpen] = useState(false);
  const rows = locale === "zh" ? ZH_ROWS : EN_ROWS;
  const title = locale === "zh" ? "语法速查" : "Syntax Guide";

  return (
    <div className="border border-outline-variant/50 rounded-lg bg-surface overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-on-surface hover:bg-surface-container-high transition-colors"
      >
        <span className="inline-flex items-center gap-2">
          <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          {title}
        </span>
        <svg
          className={`w-4 h-4 text-on-surface-variant transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-4 pb-3 pt-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
            {rows.map((row) => (
              <div
                key={row.symbol}
                className="flex items-center justify-between bg-surface-container-lowest rounded px-3 py-2 border border-outline-variant/30"
              >
                <code className="font-mono text-on-surface font-semibold">{row.symbol}</code>
                <span className="text-on-surface-variant text-xs">{row.desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
