export interface Song {
  slug: string;
  title: string;
  titleZh?: string;
  composer: string;
  key: "C" | "G" | "D" | "F" | "Bb";
  time: "4/4" | "3/4" | "2/4" | "6/8";
  tempo: number;
  notation: string;
  lyrics?: string;
  status: "Public Domain" | "Traditional";
  tags: string[];
}

export const SONGS: Song[] = [
  {
    slug: "twinkle-twinkle-little-star",
    title: "Twinkle Twinkle Little Star",
    titleZh: "小星星",
    composer: "Traditional",
    key: "C",
    time: "4/4",
    tempo: 72,
    notation: "1 1 5 5 | 6 6 5 - | 4 4 3 3 | 2 2 1 - | 5 5 4 4 | 3 3 2 - | 5 5 4 4 | 3 3 2 - | 1 1 5 5 | 6 6 5 - | 4 4 3 3 | 2 2 1 -",
    lyrics: "Twin kle twin kle lit tle star | How I won der what you are | Up a bove the world so high | Like a dia mond in the sky | Twin kle twin kle lit tle star | How I won der what you are | Twin kle twin kle lit tle star | How I won der what you are | Twin kle twin kle lit tle star | How I won der what you are | Twin kle twin kle lit tle star | How I won der what you are",
    status: "Public Domain",
    tags: ["children", "english", "beginner"],
  },
  {
    slug: "ode-to-joy",
    title: "Ode to Joy",
    titleZh: "欢乐颂",
    composer: "Ludwig van Beethoven",
    key: "C",
    time: "4/4",
    tempo: 120,
    notation: "3 3 4 5 | 5 4 3 2 | 1 1 2 3 | 3 2 2 - | 3 3 4 5 | 5 4 3 2 | 1 1 2 3 | 2 1 1 -",
    lyrics: "Joy- ful joy- ful we a- dore Thee | God of glo- ry Lord of love | Hearts un- fold like flowers be- fore Thee | O- pen- ing to the sun a- bove | Melts the clouds of sin and sad- ness | Drives the dark of doubt a- way | Giv- er of im- mor- tal glad- ness | Fill us with the light of day",
    status: "Public Domain",
    tags: ["classical", "english", "beginner"],
  },
  {
    slug: "mary-had-a-little-lamb",
    title: "Mary Had a Little Lamb",
    titleZh: "玛丽有只小羊羔",
    composer: "Traditional",
    key: "C",
    time: "4/4",
    tempo: 100,
    notation: "3 2 1 2 | 3 3 3 - | 2 2 2 - | 3 5 5 -",
    lyrics: "Ma - ry had a lit - tle lamb | lit - tle lamb | lit - tle lamb | Ma - ry had a lit - tle lamb",
    status: "Public Domain",
    tags: ["children", "english", "beginner"],
  },
  {
    slug: "two-tigers",
    title: "Two Tigers",
    titleZh: "两只老虎",
    composer: "Traditional",
    key: "C",
    time: "4/4",
    tempo: 100,
    notation: "1 2 3 1 | 1 2 3 1 | 3 4 5 - | 3 4 5 - | 5 6 5 4 | 3 1 2 - | 5 6 5 4 | 3 1 2 -",
    lyrics: "两 只 老 虎 | 两 只 老 虎 | 跑 得 快 | 跑 得 快 | 一 只 没 有 耳 朵 | 一 只 没 有 尾 巴 | 真 奇 怪 | 真 奇 怪",
    status: "Public Domain",
    tags: ["children", "chinese", "beginner"],
  },
  {
    slug: "jasmine-flower",
    title: "Jasmine Flower",
    titleZh: "茉莉花",
    composer: "Traditional",
    key: "C",
    time: "4/4",
    tempo: 80,
    notation: "3 3 5 6 | 1' 6 5 - | 3 3 5 6 | 1' 6 5 - | 5 5 3 2 | 1 2 3 - | 2 3 5 3 | 2 1 6 -",
    lyrics: "好 一 朵 美 丽 的 茉 莉 花 | 好 一 朵 美 丽 的 茉 莉 花 | 芬 芳 美 丽 满 枝 桠 | 又 香 又 白 人 人 夸",
    status: "Public Domain",
    tags: ["folk", "chinese", "intermediate"],
  },
];

export function getSongBySlug(slug: string): Song | undefined {
  return SONGS.find((s) => s.slug === slug);
}

export function getAllSlugs(): string[] {
  return SONGS.map((s) => s.slug);
}
