"use client";

import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { Song } from "@/lib/songs";
import { parseJianpu } from "@/lib/music-engine/parser/parser";
import JianpuRenderer from "@/components/music/JianpuRenderer";
import StaffRenderer from "@/components/music/StaffRenderer";

interface SongComparisonProps {
  song: Song;
  locale?: "en" | "zh";
}

export default function SongComparison({ song, locale = "en" }: SongComparisonProps) {
  const isZh = locale === "zh";
  const activeLyrics = isZh ? song.lyrics : (song.lyricsEn ?? song.lyrics);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(720);
  const [hoveredNoteId, setHoveredNoteId] = useState<string | null>(null);

  useEffect(() => {
    if (!wrapperRef.current) return;
    const el = wrapperRef.current;
    const update = () => {
      const rect = el.getBoundingClientRect();
      setWidth(Math.max(320, Math.floor(rect.width)));
    };
    update();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    if (ro) ro.observe(el);
    return () => {
      if (ro) ro.disconnect();
    };
  }, []);

  const score = useMemo(() => {
    const [numerator, denominator] = song.time.split("/").map(Number);
    return parseJianpu(song.notation, {
      metadata: { title: song.title },
      keySignature: { tonic: song.key, mode: "major" },
      timeSignature: { numerator, denominator },
      tempo: song.tempo,
      lyrics: activeLyrics,
    });
  }, [song, activeLyrics]);

  const handleHover = useCallback((id: string | null) => {
    setHoveredNoteId(id);
  }, []);

  return (
    <div ref={wrapperRef} className="flex flex-col gap-8">
      <section className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-on-surface mb-4">
          {isZh ? "简谱" : "Numbered Notation"}
        </h2>
        <JianpuRenderer score={score} width={width} measuresPerRow={song.measuresPerRow} hoveredNoteId={hoveredNoteId} onHover={handleHover} />
      </section>

      <section className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-on-surface mb-4">
          {isZh ? "五线谱" : "Staff Notation"}
        </h2>
        <StaffRenderer score={score} width={width} measuresPerRow={song.measuresPerRow} hoveredNoteId={hoveredNoteId} onHover={handleHover} />
      </section>

      <p className="text-xs text-on-surface-variant text-center">
        {isZh ? "提示：鼠标悬停在音符上可查看简谱与五线谱的对应关系。" : "Tip: hover over a note to see its match in the other notation."}
      </p>

      <section className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-on-surface mb-4">
          {isZh ? "完整歌词" : "Full Lyrics"}
        </h2>
        <div className="text-on-surface-variant whitespace-pre-wrap leading-relaxed">
          {activeLyrics || (isZh ? "（暂无歌词）" : "(No lyrics provided)")}
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-on-surface mb-4">
          {isZh ? "节奏与音域说明" : "Rhythm & Range Guide"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-on-surface-variant">
          <div>
            <h3 className="font-semibold text-on-surface mb-2">
              {isZh ? "简谱节奏标记" : "Jianpu rhythm marks"}
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>{isZh ? "数字下方的下划线 " : "Underlines below a number "}<code className="bg-surface-container px-1 rounded">1_</code>{isZh ? " = 八分音符，双下划线 " : " = eighth note; double underline "}<code className="bg-surface-container px-1 rounded">1__</code>{isZh ? " = 十六分音符" : " = sixteenth note"}</li>
              <li>{isZh ? "数字后的短横线 " : "A dash after a number "}<code className="bg-surface-container px-1 rounded">1-</code>{isZh ? " = 二分音符，双横线 " : " = half note; double dash "}<code className="bg-surface-container px-1 rounded">1--</code>{isZh ? " = 全音符" : " = whole note"}</li>
              <li>{isZh ? "数字右上角的小点 " : "A dot in the upper right "}<code className="bg-surface-container px-1 rounded">1.</code>{isZh ? " = 附点音符" : " = dotted note"}</li>
              <li>{isZh ? "数字上方/下方加点 " : "Dots above/below a number "}<code className="bg-surface-container px-1 rounded">1'</code> / <code className="bg-surface-container px-1 rounded">1,</code>{isZh ? " = 高/低八度" : " = upper/lower octave"}</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-on-surface mb-2">
              {isZh ? "五线谱对应符号" : "Staff notation equivalents"}
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>{isZh ? "实心椭圆符头 + 符干 = 四分音符" : "Solid notehead + stem = quarter note"}</li>
              <li>{isZh ? "空心椭圆符头 + 符干 = 二分音符" : "Open notehead + stem = half note"}</li>
              <li>{isZh ? "空心椭圆符头（无符干） = 全音符" : "Open notehead without stem = whole note"}</li>
              <li>{isZh ? "符干末端带旗帜 = 八分/十六分音符" : "Flag on the stem = eighth/sixteenth note"}</li>
              <li>{isZh ? "符头右侧小圆点 = 附点音符" : "Dot to the right of a notehead = dotted note"}</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
