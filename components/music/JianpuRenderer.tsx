"use client";

import { useRef, useImperativeHandle, forwardRef } from "react";
import { ScoreAST } from "@/lib/music-engine/ast/types";
import {
  computeScoreLayout,
  ROW_HEIGHT,
  TOP_MARGIN,
  LEFT_MARGIN,
  RIGHT_MARGIN,
  HEADER_INFO_HEIGHT,
  FONT_SIZE,
  LYRIC_FONT_SIZE,
  NoteSlot,
  STAFF_SCALE,
} from "@/lib/music-engine/render/layout";
import { isNote } from "@/lib/music-engine/ast/types";
import { degreeToMidi } from "@/lib/music-engine/parser/parser";

export interface JianpuRendererRef {
  exportPng: () => Promise<string | null>;
  getSvgElement: () => SVGSVGElement | null;
}

export interface JianpuRendererProps {
  score: ScoreAST;
  width?: number;
  measuresPerRow?: number;
  hoveredNoteId?: string | null;
  onHover?: (id: string | null) => void;
}

const DOT_SIZE = 4 * STAFF_SCALE;

function noteId(slot: NoteSlot): string | null {
  const item = slot.item;
  if (!isNote(item)) return null;
  return `${item.degree}:${item.octave}:${item.accidental || ""}:${item.duration.type}:${item.duration.dotted ? 1 : 0}`;
}

const JianpuRenderer = forwardRef<JianpuRendererRef, JianpuRendererProps>(function JianpuRendererInner(
  { score, width = 720, measuresPerRow, hoveredNoteId, onHover },
  ref
) {
  const svgRef = useRef<SVGSVGElement>(null);

  useImperativeHandle(ref, () => ({
    getSvgElement: () => svgRef.current,
    exportPng: async () => {
      const svg = svgRef.current;
      if (!svg) return null;
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svg);
      const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);

      const img = new Image();
      const rect = svg.getBoundingClientRect();
      const scale = 2;

      return new Promise<string | null>((resolve) => {
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.floor(rect.width * scale));
          canvas.height = Math.max(1, Math.floor(rect.height * scale));
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(null);
            return;
          }
          ctx.fillStyle = "#FAF7F2";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          URL.revokeObjectURL(url);
          resolve(canvas.toDataURL("image/png"));
        };
        img.onerror = () => resolve(null);
        img.src = url;
      });
    },
  }));

  const layout = computeScoreLayout(score, width, false, measuresPerRow);
  const centerY = ROW_HEIGHT / 2 - 6;
  const lyricY = centerY + 30 * STAFF_SCALE;
  const lowerDotY = centerY + 20 * STAFF_SCALE;

  return (
    <svg
      ref={svgRef}
      width={width}
      height={layout.height}
      viewBox={`0 0 ${width} ${layout.height}`}
      className="bg-[#FAF7F2] rounded-lg border border-outline-variant/20 w-full h-auto"
      preserveAspectRatio="xMidYMin meet"
    >
      {/* Key / Time / Tempo info */}
      <text
        x={LEFT_MARGIN}
        y={16}
        className="fill-secondary"
        style={{ fontSize: 12 }}
      >
        {score.keySignature.tonic} Major · {score.timeSignature.numerator}/{score.timeSignature.denominator} · q={score.tempo}
      </text>

      {layout.rows.map((row, rowIndex) => (
        <g
          key={rowIndex}
          transform={`translate(${LEFT_MARGIN}, ${HEADER_INFO_HEIGHT + rowIndex * ROW_HEIGHT})`}
        >
          {/* Baseline running the full width of the row */}
          <line
            x1={0}
            y1={centerY + 14}
            x2={row.width}
            y2={centerY + 14}
            stroke="#E5E7EB"
            strokeWidth={1}
          />

          {/* Starting barline */}
          <Barline x={0} isFinal={false} />

          {row.measures.map((measure, mIdx) => (
            <g key={mIdx} transform={`translate(${measure.offsetX}, 0)`}>
              {measure.notes.map((slot, index) => (
                <NoteElement
                  key={`note-${index}-${slot.x}`}
                  slot={slot}
                  beatWidth={layout.beatWidth}
                  centerY={centerY}
                  lyricY={lyricY}
                  lowerDotY={lowerDotY}
                  isHovered={noteId(slot) !== null && noteId(slot) === hoveredNoteId}
                  onHover={onHover}
                />
              ))}
              <SlurArcs slots={measure.notes} centerY={centerY} beatWidth={layout.beatWidth} />
              <Barline x={measure.width} isFinal={mIdx === row.measures.length - 1 && rowIndex === layout.rows.length - 1} />
            </g>
          ))}
        </g>
      ))}
    </svg>
  );
});

interface NoteElementProps {
  slot: NoteSlot;
  beatWidth: number;
  centerY: number;
  lyricY: number;
  lowerDotY: number;
  isHovered?: boolean;
  onHover?: (id: string | null) => void;
}

function NoteElement({ slot, beatWidth, centerY, lyricY, lowerDotY, isHovered, onHover }: NoteElementProps) {
  const { item, x, duration } = slot;
  const id = noteId(slot);
  const handleEnter = () => id && onHover?.(id);
  const handleLeave = () => onHover?.(null);

  // For longer notes, shift the number to the left so the whole symbol occupies
  // its full rhythmic width like standard Jianpu: 3 -, 1 - - -.
  // Do not shift for durations <= 1 quarter note.
  const noteX = duration > 1 ? x - ((duration - 1) * beatWidth) / 2 : x;

  if (!isNote(item)) {
    return (
      <g key={`rest-${x}`}>
        <text
          x={noteX}
          y={centerY + 6}
          textAnchor="middle"
          className="fill-on-surface"
          style={{ fontSize: FONT_SIZE * STAFF_SCALE, fontWeight: 500 }}
        >
          0
        </text>
      </g>
    );
  }

  const note = item;
  const accidental = note.accidental === "#" ? "#" : note.accidental === "b" ? "b" : "";
  const upperDots = Math.max(0, note.octave);
  const lowerDots = Math.max(0, -note.octave);

  const hasEighth = note.duration.type === "eighth";
  const hasSixteenth = note.duration.type === "sixteenth";
  const hasHalf = note.duration.type === "half";
  const hasWhole = note.duration.type === "whole";
  const fillClass = isHovered ? "fill-primary" : "fill-on-surface";

  // Horizontal dash for half/whole notes: each "-" occupies one beat width.
  const dashCount = Math.max(0, Math.round((duration - 1) / 1)); // quarter units

  return (
    <g
      key={`note-${x}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={onHover ? "cursor-pointer" : undefined}
    >
      {isHovered && (
        <circle
          cx={noteX}
          cy={centerY + 6}
          r={22}
          className="fill-primary/10"
          pointerEvents="none"
        />
      )}
      {/* Upper octave dots */}
      {Array.from({ length: upperDots }).map((_, i) => (
        <circle
          key={`u-${i}`}
          cx={noteX}
          cy={centerY - 22 * STAFF_SCALE - i * 8 * STAFF_SCALE}
          r={DOT_SIZE / 2}
          className={fillClass}
        />
      ))}

      {/* Lower octave dots */}
      {Array.from({ length: lowerDots }).map((_, i) => (
        <circle
          key={`l-${i}`}
          cx={noteX}
          cy={lowerDotY + 8 * STAFF_SCALE + i * 8 * STAFF_SCALE}
          r={DOT_SIZE / 2}
          className={fillClass}
        />
      ))}

      {/* Accidental + Degree number */}
      <text
        x={noteX}
        y={centerY + 6}
        textAnchor="middle"
        className={fillClass}
        style={{ fontSize: FONT_SIZE * STAFF_SCALE, fontWeight: 500 }}
      >
        {accidental}{note.degree}
      </text>

      {/* Duration underline for eighth / sixteenth */}
      {(hasEighth || hasSixteenth) && (
        <>
          <line
            x1={noteX - 10 * STAFF_SCALE}
            y1={centerY + 14}
            x2={noteX + 10 * STAFF_SCALE}
            y2={centerY + 14}
            stroke={isHovered ? "#2563EB" : "#1F2937"}
            strokeWidth={1.5}
          />
          {hasSixteenth && (
            <line
              x1={noteX - 10 * STAFF_SCALE}
              y1={centerY + 19}
              x2={noteX + 10 * STAFF_SCALE}
              y2={centerY + 19}
              stroke={isHovered ? "#2563EB" : "#1F2937"}
              strokeWidth={1.5}
            />
          )}
        </>
      )}

      {/* Dotted */}
      {note.duration.dotted && (
        <circle cx={noteX + 14 * STAFF_SCALE} cy={centerY + 4} r={2 * STAFF_SCALE} className={fillClass} />
      )}

      {/* Sustain dashes for half / whole notes */}
      {(hasHalf || hasWhole) &&
        Array.from({ length: dashCount }).map((_, i) => {
          const dashX = noteX + (i + 1) * beatWidth;
          return (
            <line
              key={`dash-${i}`}
              x1={dashX - 8 * STAFF_SCALE}
              y1={centerY - 6}
              x2={dashX + 8 * STAFF_SCALE}
              y2={centerY - 6}
              stroke={isHovered ? "#2563EB" : "#1F2937"}
              strokeWidth={1.5}
            />
          );
        })}

      {/* Lyric */}
      {note.lyric && (
        <text
          x={noteX}
          y={lyricY}
          textAnchor="middle"
          className="fill-secondary"
          style={{ fontSize: LYRIC_FONT_SIZE }}
        >
          {note.lyric}
        </text>
      )}
    </g>
  );
}

const STAFF_LINE_OFFSET = 6;
const BARLINE_TOP = STAFF_LINE_OFFSET;
const BARLINE_BOTTOM = ROW_HEIGHT - STAFF_LINE_OFFSET;

function SlurArcs({ slots, centerY, beatWidth }: { slots: NoteSlot[]; centerY: number; beatWidth: number }) {
  const arcs: { x1: number; x2: number }[] = [];
  for (let i = 0; i < slots.length - 1; i++) {
    const item = slots[i].item;
    if (isNote(item) && item.slur) {
      const d1 = slots[i].duration;
      const d2 = slots[i + 1].duration;
      // Use the same visual center as the rendered notehead.
      const x1 = d1 > 1 ? slots[i].x - ((d1 - 1) * beatWidth) / 2 : slots[i].x;
      const x2 = d2 > 1 ? slots[i + 1].x - ((d2 - 1) * beatWidth) / 2 : slots[i + 1].x;
      arcs.push({ x1, x2 });
    }
  }
  if (arcs.length === 0) return null;
  return (
    <g>
      {arcs.map(({ x1, x2 }, i) => {
        const midX = (x1 + x2) / 2;
        const span = Math.abs(x2 - x1);
        const height = Math.min(10, Math.max(5, span * 0.15));
        // Slur above the numbers, clear of any octave dots.
        const y = centerY - 30 * STAFF_SCALE;
        const d = `M ${x1} ${y} Q ${midX} ${y - height} ${x2} ${y}`;
        return (
          <path
            key={`slur-${i}`}
            d={d}
            fill="none"
            stroke="#1F2937"
            strokeWidth={1.3}
            strokeLinecap="round"
          />
        );
      })}
    </g>
  );
}

function Barline({ x, isFinal }: { x: number; isFinal: boolean }) {
  return (
    <g>
      <line x1={x} y1={BARLINE_TOP} x2={x} y2={BARLINE_BOTTOM} stroke="#1F2937" strokeWidth={2.5} />
      {isFinal && (
        <line x1={x + 5} y1={BARLINE_TOP} x2={x + 5} y2={BARLINE_BOTTOM} stroke="#1F2937" strokeWidth={4.5} />
      )}
    </g>
  );
}

export default JianpuRenderer;
