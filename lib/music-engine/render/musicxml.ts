import {
  ScoreAST,
  Note,
  NoteOrRest,
  isNote,
  DurationType,
  KeySignature,
  TimeSignature,
} from "@/lib/music-engine/ast/types";
import { degreeToMidi, PITCH_NAMES_SHARP } from "@/lib/music-engine/parser/parser";

const DURATION_MAP: Record<DurationType, { type: string; duration: number }> = {
  whole: { type: "whole", duration: 16 },
  half: { type: "half", duration: 8 },
  quarter: { type: "quarter", duration: 4 },
  eighth: { type: "eighth", duration: 2 },
  sixteenth: { type: "16th", duration: 1 },
};

const MEASURES_PER_ROW = 4;

function pitchNameAndOctave(midi: number): { step: string; alter: number; octave: number } {
  const octave = Math.floor(midi / 12) - 1;
  const pc = ((midi % 12) + 12) % 12;
  const name = PITCH_NAMES_SHARP[pc];
  let step = name[0];
  let alter = 0;
  if (name.length > 1) {
    alter = name[1] === "#" ? 1 : -1;
  }
  return { step, alter, octave };
}

function keyToFifths(key: KeySignature): number {
  const map: Record<string, number> = {
    C: 0,
    G: 1,
    D: 2,
    A: 3,
    E: 4,
    B: 5,
    "F#": 6,
    "C#": 7,
    F: -1,
    Bb: -2,
    Eb: -3,
    Ab: -4,
    Db: -5,
    Gb: -6,
    Cb: -7,
  };
  return map[key.tonic] ?? 0;
}

export function generateMusicXML(score: ScoreAST, measureWidths?: number[]): string {
  const divisions = 4;
  const parts = score.measures.map((measure, mIdx) => {
    const notesXml = measure.notes.map((n, nIdx) => noteToXml(n, mIdx, nIdx, score, divisions)).join("\n");
    const widthAttr = measureWidths?.[mIdx] ? ` width="${measureWidths[mIdx].toFixed(1)}"` : "";
    const newSystem = mIdx > 0 && mIdx % MEASURES_PER_ROW === 0 ? "      <print new-system=\"yes\"/>\n" : "";
    return `    <measure number="${mIdx + 1}"${widthAttr}>
      <attributes>
        <divisions>${divisions}</divisions>
        ${mIdx === 0 ? timeSignatureToXml(score.timeSignature) : ""}
        ${mIdx === 0 ? keySignatureToXml(score.keySignature) : ""}
        ${mIdx === 0 ? clefToXml() : ""}
      </attributes>
      ${newSystem}${notesXml}
    </measure>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 4.0 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise version="4.0">
  <part-list>
    <score-part id="P1">
      <part-name>${escapeXml(score.metadata.title || "Music")}</part-name>
    </score-part>
  </part-list>
  <part id="P1">
${parts.join("\n")}
  </part>
</score-partwise>`;
}

function timeSignatureToXml(ts: TimeSignature): string {
  return `      <time>
        <beats>${ts.numerator}</beats>
        <beat-type>${ts.denominator}</beat-type>
      </time>`;
}

function keySignatureToXml(key: KeySignature): string {
  return `      <key>
        <fifths>${keyToFifths(key)}</fifths>
        <mode>${key.mode}</mode>
      </key>`;
}

function clefToXml(): string {
  return `      <clef>
        <sign>G</sign>
        <line>2</line>
      </clef>`;
}

function noteToXml(
  noteOrRest: NoteOrRest,
  measureIndex: number,
  noteIndex: number,
  score: ScoreAST,
  divisions: number
): string {
  if (!isNote(noteOrRest)) {
    const dur = DURATION_MAP[noteOrRest.duration.type];
    const duration = Math.floor(dur.duration * divisions);
    const dotted = noteOrRest.duration.dotted ? `<dot/>` : "";
    return `      <note>
        <rest/>
        <duration>${duration}</duration>
        <type>${dur.type}</type>
        ${dotted}
      </note>`;
  }

  const note = noteOrRest as Note;
  const midi = degreeToMidi(note.degree, note.octave, score.keySignature);
  const { step, alter, octave } = pitchNameAndOctave(midi);
  const dur = DURATION_MAP[note.duration.type];
  const duration = Math.floor(dur.duration * divisions);
  const dotted = note.duration.dotted ? `<dot/>` : "";
  const alterXml = alter !== 0 ? `<alter>${alter}</alter>` : "";
  const accidentalXml = note.accidental === "#"
    ? `<accidental>sharp</accidental>`
    : note.accidental === "b"
      ? `<accidental>flat</accidental>`
      : "";
  const lyricXml = note.lyric
    ? `<lyric number="1">
          <text>${escapeXml(note.lyric)}</text>
        </lyric>`
    : "";

  return `      <note>
        <pitch>
          <step>${step}</step>
          ${alterXml}
          <octave>${octave}</octave>
        </pitch>
        <duration>${duration}</duration>
        <type>${dur.type}</type>
        ${dotted}
        ${accidentalXml}
        ${lyricXml}
      </note>`;
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
