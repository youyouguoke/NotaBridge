import {
  Accidental,
  DEFAULT_KEY,
  DEFAULT_TEMPO,
  DEFAULT_TIME,
  Duration,
  DurationType,
  KeySignature,
  Measure,
  Note,
  NoteOrRest,
  Rest,
  ScoreAST,
  ScoreMetadata,
  TimeSignature,
} from "../ast/types";

const SEMITONES_MAJOR: number[] = [0, 2, 4, 5, 7, 9, 11];
const KEY_SEMITONES: Record<string, number> = {
  C: 0,
  "C#": 1,
  Db: 1,
  D: 2,
  "D#": 3,
  Eb: 3,
  E: 4,
  F: 5,
  "F#": 6,
  Gb: 6,
  G: 7,
  "G#": 8,
  Ab: 8,
  A: 9,
  "A#": 10,
  Bb: 10,
  B: 11,
};

export const PITCH_NAMES_SHARP = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
export const PITCH_NAMES_FLAT = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

export function parseDuration(raw: string): {
  duration: Duration;
  consumed: number;
} {
  let type: DurationType = "quarter";
  let dotted = false;
  let consumed = 0;

  if (raw[consumed] === "-") {
    if (raw.length >= 2 && raw[1] === "-") {
      type = "whole";
      consumed = 2;
    } else {
      type = "half";
      consumed = 1;
    }
  }

  if (raw[consumed] === ".") {
    dotted = true;
    consumed += 1;
  }

  if (raw[consumed] === "_") {
    if (raw.length >= consumed + 2 && raw[consumed + 1] === "_") {
      type = "sixteenth";
      consumed += 2;
    } else {
      type = "eighth";
      consumed += 1;
    }
  }

  return { duration: { type, dotted }, consumed };
}

function parseNote(token: string, errors: string[]): Note | Rest {
  if (token.startsWith("0")) {
    const tail = token.slice(1);
    const { duration, consumed } = parseDuration(tail);
    if (consumed !== tail.length) {
      errors.push(`无法识别的休止符 "${token}"`);
    }
    return { duration } as Rest;
  }

  let pos = 0;
  let accidental: Accidental | undefined;
  if (token[pos] === "#") {
    accidental = "#";
    pos += 1;
  } else if (token[pos] === "b") {
    accidental = "b";
    pos += 1;
  }

  const degreeChar = token[pos];
  if (!degreeChar || !/[1-7]/.test(degreeChar)) {
    errors.push(`无法识别的音符 "${token}"`);
    return { duration: { type: "quarter" } } as Rest;
  }
  const degree = parseInt(degreeChar, 10) as 1 | 2 | 3 | 4 | 5 | 6 | 7;
  pos += 1;

  let octave = 0;
  while (pos < token.length && token[pos] === "'") {
    octave += 1;
    pos += 1;
  }
  while (pos < token.length && token[pos] === ",") {
    octave -= 1;
    pos += 1;
  }

  const tail = token.slice(pos);
  const { duration, consumed } = parseDuration(tail);
  if (consumed !== tail.length) {
    errors.push(`无法识别的节奏标记 "${token}"`);
  }

  return {
    degree,
    octave,
    accidental,
    duration,
  };
}

function tokenize(source: string): string[] {
  const raw = source
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);

  // Collapse standalone "-" / "--" tokens into the preceding note so that
  // "5 -" becomes "5-" (half note) and "5 - -" becomes "5--" (whole note).
  const collapsed: string[] = [];
  for (const token of raw) {
    if (/^-+$/.test(token) && collapsed.length > 0) {
      const prev = collapsed[collapsed.length - 1];
      if (!/^\|/.test(prev) && !/^-+$/.test(prev)) {
        collapsed[collapsed.length - 1] = prev + token;
        continue;
      }
    }
    collapsed.push(token);
  }
  return collapsed;
}

export interface ParseOptions {
  metadata?: ScoreMetadata;
  keySignature?: KeySignature;
  timeSignature?: TimeSignature;
  tempo?: number;
  lyrics?: string;
}

export interface ParseSuccess {
  success: true;
  score: ScoreAST;
}

export interface ParseFailure {
  success: false;
  errors: string[];
  score?: ScoreAST;
}

export type ParseResult = ParseSuccess | ParseFailure;

export function parseJianpu(source: string, options: ParseOptions = {}): ScoreAST {
  const result = parseJianpuWithErrors(source, options);
  if (result.success) {
    return result.score;
  }
  // Even if validation failed (e.g. measure duration mismatch), return the
  // partially parsed score so the renderer can still show the notes and the
  // user can see what needs fixing.
  if (result.score) {
    return result.score;
  }
  return {
    metadata: options.metadata ?? { title: "Untitled" },
    keySignature: options.keySignature ?? DEFAULT_KEY,
    timeSignature: options.timeSignature ?? DEFAULT_TIME,
    tempo: options.tempo ?? DEFAULT_TEMPO,
    measures: [],
  };
}

export function parseJianpuWithErrors(source: string, options: ParseOptions = {}): ParseResult {
  const errors: string[] = [];

  if (!source || !source.trim()) {
    errors.push("请输入简谱内容。");
    return { success: false, errors };
  }

  const lines = source.split(/\n/).map((l) => l.trim());
  const notationLine = lines[0] || "";
  const lyricLine = options.lyrics ?? lines[1] ?? "";

  // Split lyrics by the same bar separators used in notation, so each measure
  // gets its own lyrics. Within a measure, skip hyphen placeholders (`-`)
  // and assign one lyric token per note (rests get none).
  const lyricsByMeasure = lyricLine
    .split("|")
    .map((segment) =>
      segment
        .split(/\s+/)
        .map((t) => t.trim())
        .filter(Boolean)
    );

  const tokens = tokenize(notationLine);
  const measures: Measure[] = [];
  let current: NoteOrRest[] = [];
  let measureIndex = 0;
  let lyricIndexInMeasure = 0;

  for (const token of tokens) {
    if (token === "|") {
      measures.push({ index: measureIndex, notes: current });
      measureIndex += 1;
      current = [];
      lyricIndexInMeasure = 0;
      continue;
    }

    const parsed = parseNote(token, errors);
    if ("degree" in parsed && parsed.degree >= 1 && parsed.degree <= 7) {
      const measureLyrics = lyricsByMeasure[measureIndex] ?? [];
      // Advance lyric pointer, skipping standalone hyphen placeholders.
      while (
        lyricIndexInMeasure < measureLyrics.length &&
        measureLyrics[lyricIndexInMeasure] === "-"
      ) {
        lyricIndexInMeasure += 1;
      }
      if (lyricIndexInMeasure < measureLyrics.length) {
        parsed.lyric = measureLyrics[lyricIndexInMeasure];
        lyricIndexInMeasure += 1;
      }
    }
    current.push(parsed);
  }

  if (current.length > 0) {
    measures.push({ index: measureIndex, notes: current });
  }

  const [numerator, denominator] = options.timeSignature
    ? [options.timeSignature.numerator, options.timeSignature.denominator]
    : [DEFAULT_TIME.numerator, DEFAULT_TIME.denominator];

  const expectedQuartersPerMeasure = (numerator / denominator) * 4;

  measures.forEach((measure, idx) => {
    const duration = measureDuration(measure);
    const diff = Math.abs(duration - expectedQuartersPerMeasure);
    if (diff > 0.001) {
      const label = idx + 1;
      if (duration < expectedQuartersPerMeasure) {
        errors.push(
          `第 ${label} 小节时值不足 (当前 ${formatDuration(duration)}，需要 ${formatDuration(
            expectedQuartersPerMeasure
          )})`
        );
      } else {
        errors.push(
          `第 ${label} 小节时值超出 (当前 ${formatDuration(duration)}，需要 ${formatDuration(
            expectedQuartersPerMeasure
          )})`
        );
      }
    }
  });

  if (errors.length > 0) {
    return {
      success: false,
      errors,
      score: {
        metadata: options.metadata ?? { title: "Untitled" },
        keySignature: options.keySignature ?? DEFAULT_KEY,
        timeSignature: options.timeSignature ?? DEFAULT_TIME,
        tempo: options.tempo ?? DEFAULT_TEMPO,
        measures,
      },
    };
  }

  return {
    success: true,
    score: {
      metadata: options.metadata ?? { title: "Untitled" },
      keySignature: options.keySignature ?? DEFAULT_KEY,
      timeSignature: options.timeSignature ?? DEFAULT_TIME,
      tempo: options.tempo ?? DEFAULT_TEMPO,
      measures,
    },
  };
}

function formatDuration(quarters: number): string {
  return `${quarters.toFixed(2)} 拍`;
}

export function isNote(n: NoteOrRest): n is Note {
  return "degree" in n;
}

export function degreeToMidi(degree: number, octave: number, key: KeySignature): number {
  const keyBase = KEY_SEMITONES[key.tonic] ?? 0;
  const semitone = SEMITONES_MAJOR[(degree - 1 + 7) % 7];
  const octaveOffset = octave * 12;
  return 60 + keyBase + semitone + octaveOffset;
}

export function midiToPitchName(midi: number, useSharps = true): string {
  const names = useSharps ? PITCH_NAMES_SHARP : PITCH_NAMES_FLAT;
  return names[((midi % 12) + 12) % 12];
}

export function noteToPitchName(note: Note, key: KeySignature, useSharps = true): string {
  const midi = degreeToMidi(note.degree, note.octave, key);
  let name = midiToPitchName(midi, useSharps);
  if (note.accidental === "#") name += "#";
  if (note.accidental === "b") name += "b";
  return name;
}

export function noteToScientificPitch(note: Note, key: KeySignature): string {
  const midi = degreeToMidi(note.degree, note.octave, key);
  const octave = Math.floor(midi / 12) - 1;
  return `${midiToPitchName(midi)}${octave}`;
}

export const durationToQuarterValue: Record<DurationType, number> = {
  whole: 4,
  half: 2,
  quarter: 1,
  eighth: 0.5,
  sixteenth: 0.25,
};

export function measureDuration(measure: Measure): number {
  return measure.notes.reduce((sum: number, n: NoteOrRest) => {
    const base = durationToQuarterValue[n.duration.type];
    return sum + base * (n.duration.dotted ? 1.5 : 1);
  }, 0);
}
