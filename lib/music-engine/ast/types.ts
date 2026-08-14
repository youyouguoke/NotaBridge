export type Accidental = "#" | "b" | "natural";

export type DurationType =
  | "whole"
  | "half"
  | "quarter"
  | "eighth"
  | "sixteenth";

export const durationToQuarterValue: Record<DurationType, number> = {
  whole: 4,
  half: 2,
  quarter: 1,
  eighth: 0.5,
  sixteenth: 0.25,
};

export interface Duration {
  type: DurationType;
  dotted?: boolean;
}

export interface Note {
  degree: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 0;
  octave: number;
  accidental?: Accidental;
  duration: Duration;
  lyric?: string;
  tie?: boolean;
  slur?: boolean;
}

export interface Rest {
  duration: Duration;
}

export type NoteOrRest = Note | Rest;

export function isRest(n: NoteOrRest): n is Rest {
  return !("degree" in n);
}

export function isNote(n: NoteOrRest): n is Note {
  return "degree" in n;
}

export interface KeySignature {
  tonic: string;
  mode: "major" | "minor";
}

export interface TimeSignature {
  numerator: number;
  denominator: number;
}

export interface Measure {
  index: number;
  notes: NoteOrRest[];
}

export interface ScoreMetadata {
  title?: string;
  composer?: string;
  copyrightStatus?: "public_domain" | "licensed" | "unknown";
}

export interface ScoreAST {
  metadata: ScoreMetadata;
  keySignature: KeySignature;
  timeSignature: TimeSignature;
  tempo: number;
  measures: Measure[];
}

export const DEFAULT_KEY: KeySignature = { tonic: "C", mode: "major" };
export const DEFAULT_TIME: TimeSignature = { numerator: 4, denominator: 4 };
export const DEFAULT_TEMPO = 120;
