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
  { score, width = 720, hoveredNoteId, onHover },
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

  const layout = computeScoreLayout(score, width, false);
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
          <Barline x={0} rowHeight={ROW_HEIGHT} isFinal={false} />

          {row.measures.map((measure, mIdx) => (
            <g key={mIdx} transform={`translate(${measure.offsetX}, 0)`}>
              {measure.notes.map((slot, index) => (
                <NoteElement
                  key={`note-${index}-${slot.x}`}
                  slot={slot}
                  centerY={centerY}
                  lyricY={lyricY}
                  lowerDotY={lowerDotY}
                  isHovered={noteId(slot) !== null && noteId(slot) === hoveredNoteId}
                  onHover={onHover}
                />
              ))}
              <Barline x={measure.width} rowHeight={ROW_HEIGHT} isFinal={mIdx === row.measures.length - 1 && rowIndex === layout.rows.length - 1} />
            </g>
          ))}
        </g>
      ))}
    </svg>
  );
});

interface NoteElementProps {
  slot: NoteSlot;
  centerY: number;
  lyricY: number;
  lowerDotY: number;
  isHovered?: boolean;
  onHover?: (id: string | null) => void;
}

function NoteElement({ slot, centerY, lyricY, lowerDotY, isHovered, onHover }: NoteElementProps) {
  const { item, x } = slot;
  const id = noteId(slot);
  const handleEnter = () => id && onHover?.(id);
  const handleLeave = () => onHover?.(null);

  if (!isNote(item)) {
    return (
      <g key={`rest-${x}`}>
        <text
          x={x}
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

  return (
    <g
      key={`note-${x}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={onHover ? "cursor-pointer" : undefined}
    >
      {isHovered && (
        <circle
          cx={x}
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
          cx={x}
          cy={centerY - 22 * STAFF_SCALE - i * 8 * STAFF_SCALE}
          r={DOT_SIZE / 2}
          className={fillClass}
        />
      ))}

      {/* Lower octave dots */}
      {Array.from({ length: lowerDots }).map((_, i) => (
        <circle
          key={`l-${i}`}
          cx={x}
          cy={lowerDotY + 8 * STAFF_SCALE + i * 8 * STAFF_SCALE}
          r={DOT_SIZE / 2}
          className={fillClass}
        />
      ))}

      {/* Accidental + Degree number */}
      <text
        x={x}
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
            x1={x - 10 * STAFF_SCALE}
            y1={centerY + 14}
            x2={x + 10 * STAFF_SCALE}
            y2={centerY + 14}
            stroke={isHovered ? "#2563EB" : "#1F2937"}
            strokeWidth={1.5}
          />
          {hasSixteenth && (
            <line
              x1={x - 10 * STAFF_SCALE}
              y1={centerY + 19}
              x2={x + 10 * STAFF_SCALE}
              y2={centerY + 19}
              stroke={isHovered ? "#2563EB" : "#1F2937"}
              strokeWidth={1.5}
            />
          )}
        </>
      )}

      {/* Dotted */}
      {note.duration.dotted && (
        <circle cx={x + 14 * STAFF_SCALE} cy={centerY + 4} r={2 * STAFF_SCALE} className={fillClass} />
      )}

      {/* Tie / sustain line for half / whole */}
      {(hasHalf || hasWhole) && (
        <line
          x1={x - 8 * STAFF_SCALE}
          y1={centerY + 16}
          x2={x + 8 * STAFF_SCALE}
          y2={centerY + 16}
          stroke={isHovered ? "#2563EB" : "#1F2937"}
          strokeWidth={1}
        />
      )}

      {hasWhole && (
        <line
          x1={x - 8 * STAFF_SCALE}
          y1={centerY + 21}
          x2={x + 8 * STAFF_SCALE}
          y2={centerY + 21}
          stroke={isHovered ? "#2563EB" : "#1F2937"}
          strokeWidth={1}
        />
      )}

      {/* Lyric */}
      {note.lyric && (
        <text
          x={x}
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

function Barline({ x, rowHeight, isFinal }: { x: number; rowHeight: number; isFinal: boolean }) {
  return (
    <g>
      <line x1={x} y1={0} x2={x} y2={rowHeight} stroke="#1F2937" strokeWidth={2.5} />
      {isFinal && (
        <line x1={x + 5} y1={0} x2={x + 5} y2={rowHeight} stroke="#1F2937" strokeWidth={4.5} />
      )}
    </g>
  );
}

export default JianpuRenderer;
