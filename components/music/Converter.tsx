"use client";

import { useMemo, useRef, useState } from "react";
import { parseJianpuWithErrors } from "@/lib/music-engine/parser/parser";
import { ScoreAST } from "@/lib/music-engine/ast/types";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import JianpuRenderer, { JianpuRendererRef } from "./JianpuRenderer";
import StaffRenderer, { StaffRendererRef } from "./StaffRenderer";
import ExportToolbar from "./ExportToolbar";
import Link from "next/link";

const KEYS = ["C", "G", "D", "F", "Bb"] as const;
const TIMES = ["4/4", "3/4", "2/4", "6/8"] as const;

export interface ConverterLocale {
  title: string;
  subtitle: string;
  keyLabel: string;
  timeLabel: string;
  tempoLabel: string;
  notationPlaceholder: string;
  lyricsPlaceholder: string;
  syntaxHint: string;
  resetExample: string;
  compareLibrary: string;
  tabNumbered: string;
  tabStaff: string;
  tabCompare: string;
  staffLabel: string;
  errorsTitle?: string;
}

const EN_LOCALE: ConverterLocale = {
  title: "Enter Numbered Notation",
  subtitle: "Type your music numbers below to generate staff notation instantly.",
  keyLabel: "Key",
  timeLabel: "Time",
  tempoLabel: "Tempo",
  notationPlaceholder: "Enter notation here...\nExample: 1 2 3 4 | 5 6 7 1' | 1, 2, 3, 4 | 5 - - -",
  lyricsPlaceholder: "Enter lyrics (optional)...",
  syntaxHint: "Use _ for shorter notes: 1_ = eighth note, 1__ = sixteenth note, 1- = half note, 1-- = whole note. 1' = high 1 (dot above), 1, = low 1 (dot below).",
  resetExample: "Reset Example",
  compareLibrary: "Compare Library",
  tabNumbered: "Numbered",
  tabStaff: "Staff",
  tabCompare: "Compare",
  staffLabel: "Staff Notation",
};

export const ZH_LOCALE: ConverterLocale = {
  title: "输入简谱",
  subtitle: "在下方输入数字简谱，即可自动生成五线谱。",
  keyLabel: "调号",
  timeLabel: "拍号",
  tempoLabel: "速度",
  notationPlaceholder: "在此输入简谱...\n例如：1 2 3 4 | 5 6 7 1' | 1, 2, 3, 4 | 5 - - -",
  lyricsPlaceholder: "输入歌词（可选）...",
  syntaxHint: "节奏标记：1_ = 八分音符，1__ = 十六分音符，1- = 二分音符，1-- = 全音符。1' = 高音 1（上方加点），1, = 低音 1（下方加点）。",
  resetExample: "重置示例",
  compareLibrary: "谱例库",
  tabNumbered: "简谱",
  tabStaff: "五线谱",
  tabCompare: "对照",
  staffLabel: "五线谱",
};

interface ConverterProps {
  locale?: "en" | "zh";
}

export default function Converter({ locale = "en" }: ConverterProps) {
  const t = locale === "zh" ? ZH_LOCALE : EN_LOCALE;
  const [source, setSource] = useState(locale === "zh" ? "1 1 5 5 | 6 6 5 -" : "1 1 5 5 | 6 6 5 -");
  const [lyrics, setLyrics] = useState(locale === "zh" ? "小 小 星 星 | 亮 亮 星 -" : "小 小 星 星 | 亮 亮 星 -");
  const [key, setKey] = useState<string>("C");
  const [time, setTime] = useState<string>("4/4");
  const [tempo, setTempo] = useState(120);
  const [view, setView] = useState<"numbered" | "staff" | "compare">("numbered");
  const [errors, setErrors] = useState<string[]>([]);

  const jianpuRef = useRef<JianpuRendererRef | null>(null);
  const staffRef = useRef<StaffRendererRef | null>(null);

  const score: ScoreAST = useMemo(() => {
    const [numerator, denominator] = time.split("/").map(Number);
    const result = parseJianpuWithErrors(source, {
      metadata: { title: "Untitled" },
      keySignature: { tonic: key, mode: "major" },
      timeSignature: { numerator, denominator },
      tempo,
      lyrics,
    });
    if (result.success) {
      setErrors([]);
      return result.score;
    }
    setErrors(result.errors);
    return {
      metadata: { title: "Untitled" },
      keySignature: { tonic: key, mode: "major" },
      timeSignature: { numerator, denominator },
      tempo,
      measures: [],
    };
  }, [source, lyrics, key, time, tempo]);

  const tabs: { key: "numbered" | "staff" | "compare"; label: string }[] = [
    { key: "numbered", label: t.tabNumbered },
    { key: "staff", label: t.tabStaff },
    { key: "compare", label: t.tabCompare },
  ];

  return (
    <>
      <Header />
      <main className="flex-grow max-w-[1280px] mx-auto w-full px-4 md:px-16 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/50 p-6 flex flex-col gap-6 h-full">
            <header>
              <h1 className="text-2xl font-semibold text-on-surface">{t.title}</h1>
              <p className="text-base text-on-surface-variant mt-2">{t.subtitle}</p>
            </header>

            <div className="flex flex-wrap gap-4 bg-surface p-3 rounded-lg border border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-on-surface-variant">{t.keyLabel}</span>
                <select
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="bg-surface-container-lowest border border-outline-variant rounded p-1 text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                >
                  {KEYS.map((k) => (
                    <option key={k} value={k}>
                      {k} Major
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-on-surface-variant">{t.timeLabel}</span>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="bg-surface-container-lowest border border-outline-variant rounded p-1 text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                >
                  {TIMES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-on-surface-variant">{t.tempoLabel}</span>
                <input
                  type="number"
                  value={tempo}
                  onChange={(e) => setTempo(Number(e.target.value))}
                  className="bg-surface-container-lowest border border-outline-variant rounded p-1 text-base w-20 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
            </div>

            <div className="flex-grow flex flex-col gap-2">
              <textarea
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="flex-grow min-h-[160px] w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-4 font-mono text-lg resize-none focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                placeholder={t.notationPlaceholder}
              />
              <textarea
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
                className="min-h-[80px] w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-4 font-mono text-base resize-none focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                placeholder={t.lyricsPlaceholder}
              />
              <p className="text-xs text-on-surface-variant">{t.syntaxHint}</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  setSource("1 1 5 5 | 6 6 5 -");
                  setLyrics("小 小 星 星 | 亮 亮 星 -");
                }}
                className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors underline"
              >
                {t.resetExample}
              </button>
              <Link
                href={locale === "zh" ? "/zh/compare" : "/compare"}
                className="text-sm font-medium text-primary border border-primary rounded-lg px-4 py-2 hover:bg-primary/5 transition-colors"
              >
                {t.compareLibrary}
              </Link>
            </div>
          </section>

          {/* Preview Panel */}
          <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/50 p-6 flex flex-col gap-6 h-full">
            <div className="flex border-b border-outline-variant/30">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setView(tab.key)}
                  className={`text-sm font-medium px-4 py-2 capitalize ${
                    view === tab.key
                      ? "text-primary border-b-2 border-primary font-bold"
                      : "text-on-surface-variant hover:text-primary transition-colors"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex-grow bg-[#FAF7F2] rounded-lg border border-outline-variant/20 p-4 flex flex-col gap-4 min-h-[300px] overflow-auto">
              {errors.length > 0 && (
                <div className="bg-error-container text-error rounded-lg p-3 text-sm space-y-1">
                  {errors.map((err, i) => (
                    <div key={i}>• {err}</div>
                  ))}
                </div>
              )}
              <div className="flex justify-end">
                <ExportToolbar
                  jianpuRef={view === "numbered" || view === "compare" ? jianpuRef : undefined}
                  staffRef={view === "staff" || view === "compare" ? staffRef : undefined}
                />
              </div>
              <div className="flex items-center justify-center">
                {view === "numbered" && <JianpuRenderer ref={jianpuRef} score={score} />}
                {view === "staff" && <StaffRenderer ref={staffRef} score={score} />}
                {view === "compare" && (
                  <div className="grid grid-cols-1 gap-6 w-full">
                    <JianpuRenderer ref={jianpuRef} score={score} />
                    <StaffRenderer ref={staffRef} score={score} />
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
