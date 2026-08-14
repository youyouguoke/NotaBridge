"use client";

import { useRef, useImperativeHandle, forwardRef } from "react";
import { ScoreAST, isNote, NoteOrRest } from "@/lib/music-engine/ast/types";
import { degreeToMidi } from "@/lib/music-engine/parser/parser";
import {
  computeScoreLayout,
  ROW_HEIGHT,
  LEFT_MARGIN,
  RIGHT_MARGIN,
  HEADER_INFO_HEIGHT,
  LYRIC_FONT_SIZE,
  NoteSlot,
  MeasureLayout,
  STAFF_LINE_SPACE,
  STAFF_SCALE,
  CLEF_WIDTH,
} from "@/lib/music-engine/render/layout";

export interface StaffRendererRef {
  exportPng: () => Promise<string | null>;
}

export interface StaffRendererProps {
  score: ScoreAST;
  width?: number;
  hoveredNoteId?: string | null;
  onHover?: (id: string | null) => void;
}

const LINE_SPACE = STAFF_LINE_SPACE * STAFF_SCALE;
const STAFF_TOP = (ROW_HEIGHT - 4 * LINE_SPACE) / 2 - 12;
const STAFF_BOTTOM = STAFF_TOP + 4 * LINE_SPACE;
const MIDDLE_LINE = STAFF_TOP + 2 * LINE_SPACE;

const NOTEHEAD_RX = 6.6 * STAFF_SCALE;
const NOTEHEAD_RY = 4.6 * STAFF_SCALE;
const NOTEHEAD_ROTATE = -16;
const STEM_ATTACHMENT_OFFSET = 8.2 * STAFF_SCALE;
const STEM_LENGTH = 30 * STAFF_SCALE;
const STROKE_WIDTH = 2.5 * STAFF_SCALE;
const THIN_STROKE_WIDTH = 1.5 * STAFF_SCALE;
const CLEF_X = 16 * STAFF_SCALE;

function noteId(slot: NoteSlot): string | null {
  const item = slot.item;
  if (!isNote(item)) return null;
  return `${item.degree}:${item.octave}:${item.accidental || ""}:${item.duration.type}:${item.duration.dotted ? 1 : 0}`;
}

const StaffRenderer = forwardRef<StaffRendererRef, StaffRendererProps>(function StaffRendererInner(
  { score, width = 720, hoveredNoteId, onHover },
  ref
) {
  const svgRef = useRef<SVGSVGElement>(null);

  useImperativeHandle(ref, () => ({
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
          ctx.fillStyle = "#ffffff";
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

  const layout = computeScoreLayout(score, width, true);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={layout.height}
      viewBox={`0 0 ${width} ${layout.height}`}
      className="bg-white rounded-lg border border-outline-variant/20 w-full h-auto"
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
          <StaffRow row={row} score={score} hoveredNoteId={hoveredNoteId} onHover={onHover} />
        </g>
      ))}
    </svg>
  );
});

interface StaffRowProps {
  row: {
    measures: MeasureLayout[];
    width: number;
  };
  score: ScoreAST;
  hoveredNoteId?: string | null;
  onHover?: (id: string | null) => void;
}

function StaffRow({ row, score, hoveredNoteId, onHover }: StaffRowProps) {
  return (
    <g>
      {/* Staff lines */}
      {Array.from({ length: 5 }).map((_, i) => (
        <line
          key={i}
          x1={0}
          y1={STAFF_TOP + i * LINE_SPACE}
          x2={row.width}
          y2={STAFF_TOP + i * LINE_SPACE}
          stroke="#1F2937"
          strokeWidth={STROKE_WIDTH}
        />
      ))}

      {/* Treble clef */}
      <TrebleClef x={CLEF_X} y={MIDDLE_LINE} />

      {/* Starting barline */}
      <Barline x={CLEF_WIDTH - 14} />

      {row.measures.map((measure, mIdx) => (
        <g key={mIdx} transform={`translate(${measure.offsetX + CLEF_WIDTH}, 0)`}>
          {measure.notes.map((slot, index) => (
            <StaffNote
              key={`note-${index}-${slot.x}`}
              slot={slot}
              score={score}
              isHovered={noteId(slot) !== null && noteId(slot) === hoveredNoteId}
              onHover={onHover}
            />
          ))}
          <Barline x={measure.width} isFinal={mIdx === row.measures.length - 1} />
        </g>
      ))}
    </g>
  );
}

const PITCH_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const PITCH_TO_STAFF_INDEX: Record<string, number> = {
  C: 0,
  D: 1,
  E: 2,
  F: 3,
  G: 4,
  A: 5,
  B: 6,
};

function midiToPitchName(midi: number): string {
  return PITCH_NAMES[((midi % 12) + 12) % 12];
}

function midiToStaffY(midi: number): number {
  const octave = Math.floor(midi / 12) - 1;
  const pitchName = midiToPitchName(midi)[0];
  const stepIndex = (octave - 4) * 7 + PITCH_TO_STAFF_INDEX[pitchName];
  const c4Y = STAFF_BOTTOM + LINE_SPACE;
  return c4Y - stepIndex * (LINE_SPACE / 2);
}

function needsLedgerLine(midi: number): boolean {
  const y = midiToStaffY(midi);
  return y < STAFF_TOP - 0.5 * LINE_SPACE || y > STAFF_BOTTOM + 0.5 * LINE_SPACE;
}

function ledgerLineY(midi: number): number | null {
  const y = midiToStaffY(midi);
  if (y > STAFF_BOTTOM + 0.5 * LINE_SPACE) {
    return STAFF_BOTTOM + LINE_SPACE;
  }
  if (y < STAFF_TOP - 0.5 * LINE_SPACE) {
    return STAFF_TOP - LINE_SPACE;
  }
  return null;
}

function TrebleClef({ x, y }: { x: number; y: number }) {
  const glyph = "M1.43,-6.88C1.36,-7.31 1.43,-7.34 1.64,-7.56C2.21,-8.09 2.95,-8.83 3.62,-9.57C6.58,-12.82 8.35,-17.02 8.35,-21.01C8.35,-24.08 7.50,-27.12 6.06,-29.23C5.53,-30.01 4.61,-31.00 4.22,-31.00C3.72,-31.00 2.63,-30.08 1.92,-29.31C-0.69,-26.41 -1.54,-22.00 -1.54,-18.32C-1.54,-16.28 -1.29,-13.98 -1.04,-12.53C-0.97,-12.11 -0.94,-12.04 -1.36,-11.69C-3.62,-9.82 -6.06,-7.66 -7.89,-5.40C-10.33,-2.37 -11.85,0.92 -11.85,4.70C-11.85,10.84 -7.64,16.67 1.01,16.67C1.82,16.67 2.74,16.59 3.44,16.45C3.83,16.38 3.90,16.35 3.97,16.77C4.40,19.14 4.93,22.21 4.93,23.87C4.93,29.09 1.39,29.73 -0.69,29.73C-2.60,29.73 -3.51,29.16 -3.51,28.71C-3.51,28.46 -3.20,28.35 -2.38,28.10C-1.29,27.79 -0.02,26.83 -0.02,24.79C-0.02,22.84 -1.25,21.18 -3.41,21.18C-5.77,21.18 -7.19,23.06 -7.19,25.24C-7.19,27.54 -5.81,31.00 -0.48,31.00C1.89,31.00 6.48,29.94 6.48,23.94C6.48,21.93 5.84,18.57 5.46,16.38C5.38,15.96 5.42,15.99 5.91,15.78C9.48,14.37 11.85,11.37 11.85,7.38C11.85,2.86 8.53,-1.13 3.34,-1.13C2.42,-1.13 2.42,-1.13 2.31,-1.77ZM4.75,-25.53C5.91,-25.53 6.87,-24.57 6.87,-22.63C6.87,-20.20 5.70,-17.94 2.95,-15.18C2.38,-14.62 1.54,-13.81 0.72,-13.10C0.48,-12.89 0.34,-12.92 0.26,-13.38C0.12,-14.30 0.05,-15.50 0.05,-16.63C0.05,-22.14 2.60,-25.53 4.75,-25.53ZM0.90,-1.48C1.01,-0.81 1.01,-0.85 0.37,-0.64C-2.74,0.42 -4.75,3.21 -4.75,6.21C-4.75,9.39 -3.09,11.65 -0.69,12.46C-0.41,12.57 0.02,12.68 0.26,12.68C0.55,12.68 0.69,12.50 0.69,12.29C0.69,12.04 0.41,11.93 0.16,11.83C-1.32,11.19 -2.38,9.67 -2.38,8.05C-2.38,6.04 -1.01,4.52 1.15,3.92C1.71,3.78 1.78,3.81 1.85,4.20L3.62,14.72C3.69,15.11 3.65,15.11 3.12,15.22C2.56,15.32 1.85,15.39 1.15,15.39C-5.03,15.39 -9.02,11.97 -9.02,7.06C-9.02,4.98 -8.67,2.19 -5.74,-1.13C-3.62,-3.50 -1.99,-4.80 -0.34,-6.14C0.02,-6.43 0.09,-6.39 0.16,-6.00ZM3.34,4.13C3.27,3.71 3.30,3.60 3.72,3.64C6.58,3.88 8.95,6.28 8.95,9.39C8.95,11.62 7.61,13.42 5.63,14.41C5.21,14.62 5.14,14.62 5.07,14.19Z";
  return (
    <g transform={`translate(${x}, ${y})`}>
      <path d={glyph} fill="#1F2937" stroke="none" />
    </g>
  );
}

interface StaffNoteProps {
  slot: NoteSlot;
  score: ScoreAST;
  isHovered?: boolean;
  onHover?: (id: string | null) => void;
}

function StaffNote({ slot, score, isHovered, onHover }: StaffNoteProps) {
  const { item, x } = slot;
  const id = noteId(slot);
  const handleEnter = () => id && onHover?.(id);
  const handleLeave = () => onHover?.(null);

  if (!isNote(item)) {
    return <Rest x={x} duration={item.duration.type} />;
  }

  const note = item;
  const midi = degreeToMidi(note.degree, note.octave, score.keySignature);
  const y = midiToStaffY(midi);
  const stemUp = y > MIDDLE_LINE;
  const stemEndY = stemUp ? y - STEM_LENGTH : y + STEM_LENGTH;
  const stemX = x + (stemUp ? STEM_ATTACHMENT_OFFSET : -STEM_ATTACHMENT_OFFSET);
  const durationType = note.duration.type;

  const accidental = note.accidental === "#" ? "#" : note.accidental === "b" ? "b" : "";
  const fillClass = isHovered ? "fill-primary" : "fill-on-surface";
  const strokeColor = isHovered ? "#2563EB" : "#1F2937";

  return (
    <g
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={onHover ? "cursor-pointer" : undefined}
    >
      {isHovered && (
        <circle
          cx={x}
          cy={y}
          r={22}
          className="fill-primary/10"
          pointerEvents="none"
        />
      )}
      {needsLedgerLine(midi) && (
        <line
          x1={x - NOTEHEAD_RX - 1}
          y1={ledgerLineY(midi) ?? y}
          x2={x + NOTEHEAD_RX + 1}
          y2={ledgerLineY(midi) ?? y}
          stroke={strokeColor}
          strokeWidth={THIN_STROKE_WIDTH}
        />
      )}

      {accidental && (
        <text
          x={x - NOTEHEAD_RX - 10}
          y={y + 5 * STAFF_SCALE}
          textAnchor="middle"
          className={fillClass}
          style={{ fontSize: 20 * STAFF_SCALE }}
        >
          {accidental}
        </text>
      )}

      <NoteHead x={x} y={y} durationType={durationType} isHovered={isHovered} />

      {durationType !== "whole" && <Stem x={stemX} y1={y} y2={stemEndY} isHovered={isHovered} />}

      {(durationType === "eighth" || durationType === "sixteenth") && (
        <Flag x={stemX} y={stemEndY} stemUp={stemUp} double={durationType === "sixteenth"} isHovered={isHovered} />
      )}

      {note.duration.dotted && (
        <circle cx={x + 10 * STAFF_SCALE} cy={y} r={2 * STAFF_SCALE} className={fillClass} />
      )}

      {note.lyric && (
        <text
          x={x}
          y={STAFF_BOTTOM + 30 * STAFF_SCALE}
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

function NoteHead({ x, y, durationType, isHovered }: { x: number; y: number; durationType: string; isHovered?: boolean }) {
  const common = {
    cx: x,
    cy: y,
    rx: NOTEHEAD_RX,
    ry: NOTEHEAD_RY,
    transform: `rotate(${NOTEHEAD_ROTATE} ${x} ${y})`,
    stroke: isHovered ? "#2563EB" : "#1F2937",
  };

  if (durationType === "whole" || durationType === "half") {
    return (
      <ellipse
        {...common}
        className="fill-white"
        strokeWidth={THIN_STROKE_WIDTH}
      />
    );
  }

  return <ellipse {...common} className={isHovered ? "fill-primary" : "fill-on-surface"} strokeWidth={0} />;
}

function Stem({ x, y1, y2, isHovered }: { x: number; y1: number; y2: number; isHovered?: boolean }) {
  return <line x1={x} y1={y1} x2={x} y2={y2} stroke={isHovered ? "#2563EB" : "#1F2937"} strokeWidth={STROKE_WIDTH} strokeLinecap="round" />;
}

function Flag({ x, y, stemUp, double, isHovered }: { x: number; y: number; stemUp: boolean; double: boolean; isHovered?: boolean }) {
  const s = 10 * STAFF_SCALE;
  const d = stemUp
    ? `M ${x} ${y} Q ${x + s} ${y + 0.6 * s} ${x + 0.6 * s} ${y + 1.4 * s}`
    : `M ${x} ${y} Q ${x - s} ${y - 0.6 * s} ${x - 0.6 * s} ${y - 1.4 * s}`;
  const d2 = stemUp
    ? `M ${x} ${y + 0.5 * s} Q ${x + s} ${y + 1.1 * s} ${x + 0.6 * s} ${y + 1.9 * s}`
    : `M ${x} ${y - 0.5 * s} Q ${x - s} ${y - 1.1 * s} ${x - 0.6 * s} ${y - 1.9 * s}`;
  return (
    <g>
      <path d={d} fill="none" stroke={isHovered ? "#2563EB" : "#1F2937"} strokeWidth={STROKE_WIDTH} strokeLinecap="round" />
      {double && <path d={d2} fill="none" stroke={isHovered ? "#2563EB" : "#1F2937"} strokeWidth={STROKE_WIDTH} strokeLinecap="round" />}
    </g>
  );
}

function Rest({ x, duration }: { x: number; duration: string }) {
  if (duration === "whole") {
    return (
      <rect x={x - 7 * STAFF_SCALE} y={STAFF_TOP + 2 * LINE_SPACE - 2 * STAFF_SCALE} width={14 * STAFF_SCALE} height={4 * STAFF_SCALE} className="fill-on-surface" />
    );
  }
  if (duration === "half") {
    return (
      <rect x={x - 7 * STAFF_SCALE} y={STAFF_TOP + 2 * LINE_SPACE - 7 * STAFF_SCALE} width={14 * STAFF_SCALE} height={4 * STAFF_SCALE} className="fill-on-surface" />
    );
  }
  if (duration === "quarter") {
    return (
      <path
        d={`M ${x - 2 * STAFF_SCALE} ${STAFF_TOP + 2 * LINE_SPACE + 8 * STAFF_SCALE}
            Q ${x + 4 * STAFF_SCALE} ${STAFF_TOP + 2 * LINE_SPACE - 2 * STAFF_SCALE} ${x - 2 * STAFF_SCALE} ${STAFF_TOP + 2 * LINE_SPACE - 8 * STAFF_SCALE}
            Q ${x - 6 * STAFF_SCALE} ${STAFF_TOP + 2 * LINE_SPACE - 4 * STAFF_SCALE} ${x - 2 * STAFF_SCALE} ${STAFF_TOP + 2 * LINE_SPACE + 2 * STAFF_SCALE}
            L ${x - 2 * STAFF_SCALE} ${STAFF_TOP + 2 * LINE_SPACE + 8 * STAFF_SCALE}
            Z`}
        className="fill-on-surface"
      />
    );
  }
  if (duration === "eighth") {
    return (
      <path
        d={`M ${x - 4 * STAFF_SCALE} ${STAFF_TOP + 2 * LINE_SPACE - 8 * STAFF_SCALE}
            Q ${x + 4 * STAFF_SCALE} ${STAFF_TOP + 2 * LINE_SPACE - 2 * STAFF_SCALE} ${x - 2 * STAFF_SCALE} ${STAFF_TOP + 2 * LINE_SPACE + 8 * STAFF_SCALE}
            L ${x - 6 * STAFF_SCALE} ${STAFF_TOP + 2 * LINE_SPACE + 8 * STAFF_SCALE}
            Q ${x - 6 * STAFF_SCALE} ${STAFF_TOP + 2 * LINE_SPACE - 2 * STAFF_SCALE} ${x - 4 * STAFF_SCALE} ${STAFF_TOP + 2 * LINE_SPACE - 8 * STAFF_SCALE}
            Z`}
        className="fill-on-surface"
      />
    );
  }
  return null;
}

function Barline({ x, isFinal }: { x: number; isFinal?: boolean }) {
  return (
    <g>
      <line
        x1={x}
        y1={STAFF_TOP - 4 * STAFF_SCALE}
        x2={x}
        y2={STAFF_BOTTOM + 4 * STAFF_SCALE}
        stroke="#1F2937"
        strokeWidth={STROKE_WIDTH}
      />
      {isFinal && (
        <line
          x1={x + 4 * STAFF_SCALE}
          y1={STAFF_TOP - 4 * STAFF_SCALE}
          x2={x + 4 * STAFF_SCALE}
          y2={STAFF_BOTTOM + 4 * STAFF_SCALE}
          stroke="#1F2937"
          strokeWidth={4 * STAFF_SCALE}
        />
      )}
    </g>
  );
}

export default StaffRenderer;
