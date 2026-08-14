import { NoteOrRest, isNote, durationToQuarterValue, ScoreAST } from "@/lib/music-engine/ast/types";

export const ROW_HEIGHT = 120;
export const TOP_MARGIN = 20;
export const LEFT_MARGIN = 24;
export const RIGHT_MARGIN = 24;
export const MEASURES_PER_ROW = 4;
export const FONT_SIZE = 22;
export const LYRIC_FONT_SIZE = 14;
export const TITLE_HEIGHT = 0; // page-level heading replaces SVG title
export const HEADER_INFO_HEIGHT = 24; // key/time/tempo line
export const STAFF_LINE_SPACE = 11; // shared visual scale
export const STAFF_SCALE = 1.15;
export const CLEF_WIDTH = 92 * STAFF_SCALE; // reserve horizontal space for treble clef

export interface NoteSlot {
  item: NoteOrRest;
  x: number;
  duration: number;
}

export interface MeasureLayout {
  notes: NoteSlot[];
  duration: number;
  width: number;
  offsetX: number;
}

export interface RowLayout {
  measures: MeasureLayout[];
  width: number;
  height: number;
}

export interface ScoreLayout {
  rows: RowLayout[];
  width: number;
  height: number;
  innerWidth: number;
  beatWidth: number;
}

export function noteDuration(note: NoteOrRest): number {
  const base = durationToQuarterValue[note.duration.type];
  return base * (note.duration.dotted ? 1.5 : 1);
}

export function measureDuration(notes: NoteOrRest[]): number {
  return notes.reduce((sum, n) => sum + noteDuration(n), 0);
}

export function beatsPerMeasure(time: { numerator: number; denominator: number }): number {
  // Convert the time signature to a quarter-note beat count.
  // 4/4 -> 4, 3/4 -> 3, 6/8 -> 3, 2/4 -> 2.
  return (time.numerator / time.denominator) * 4;
}

export function computeScoreLayout(
  score: ScoreAST,
  width: number,
  hasClef = false
): ScoreLayout {
  const innerWidth = Math.max(1, width - LEFT_MARGIN - RIGHT_MARGIN);
  const clefOffset = hasClef ? CLEF_WIDTH : 0;
  const rowWidth = Math.max(1, innerWidth - clefOffset);
  const beats = beatsPerMeasure(score.timeSignature);
  const beatsPerRow = beats * MEASURES_PER_ROW;
  const beatWidth = beatsPerRow > 0 ? rowWidth / beatsPerRow : 1;
  const measureWidth = beats * beatWidth;

  interface MeasureBlock {
    notes: NoteOrRest[];
    duration: number;
  }

  const rows: MeasureBlock[][] = [];
  let current: MeasureBlock[] = [];
  for (const measure of score.measures) {
    if (current.length >= MEASURES_PER_ROW) {
      rows.push(current);
      current = [];
    }
    current.push({
      notes: measure.notes,
      duration: measureDuration(measure.notes),
    });
  }
  if (current.length > 0) {
    rows.push(current);
  }

  const rowLayouts: RowLayout[] = rows.map((row) => {
    const layouts = row.map((measure, mIdx) => {
      const offsetX = mIdx * measureWidth;
      const totalDuration = measure.duration;

      let elapsed = 0;
      const slots: NoteSlot[] = measure.notes.map((item) => {
        const d = noteDuration(item);
        // Position the note/rest at the rhythmic center of its duration so the
        // first and last items are inset from the barlines and every beat is
        // aligned across measures and rows.
        const x = elapsed * beatWidth + (d / 2) * beatWidth;
        elapsed += d;
        return { item, x, duration: d };
      });

      return {
        notes: slots,
        duration: totalDuration,
        width: measureWidth,
        offsetX,
      };
    });

    return {
      measures: layouts,
      width: innerWidth,
      height: ROW_HEIGHT,
    };
  });

  return {
    rows: rowLayouts,
    width,
    height: rows.length * ROW_HEIGHT + TOP_MARGIN + HEADER_INFO_HEIGHT + 8,
    innerWidth,
    beatWidth,
  };
}
