export interface Lesson {
  slug: string;
  title: string;
  titleZh: string;
  description: string;
  descriptionZh: string;
  content: { heading: string; paragraphs: string[] }[];
  contentZh: { heading: string; paragraphs: string[] }[];
}

export const LESSONS: Lesson[] = [
  {
    slug: "jianpu",
    title: "What is Numbered Notation?",
    titleZh: "什么是简谱？",
    description: "Learn the basics of number-based music notation, widely used across Asia, and understand its foundational principles for sight-reading.",
    descriptionZh: "了解在亚洲广泛使用的数字记谱法基础，以及视奏的核心原则。",
    content: [
      {
        heading: "What is Numbered Notation?",
        paragraphs: [
          "Numbered Notation (also known as Jianpu 简谱) is a music notation system that uses numbers 1–7 to represent the seven notes of a major scale. It is especially popular across Asia and among learners who want a faster path to reading music.",
          "In Numbered Notation, the digit 1 always represents the tonic (the first note) of the key. For example, in C major, 1 = C, 2 = D, 3 = E, and so on.",
        ],
      },
      {
        heading: "The Number-to-Pitch Map",
        paragraphs: [
          "Here is the basic mapping in C major: 1 = C, 2 = D, 3 = E, 4 = F, 5 = G, 6 = A, 7 = B.",
          "Octave dots are placed above or below the number to show higher or lower octaves. A dot above means one octave higher; a dot below means one octave lower.",
        ],
      },
      {
        heading: "Why Use Jianpu?",
        paragraphs: [
          "Jianpu is compact, easy to type, and does not require drawing staff lines. That makes it ideal for quickly sharing melodies in chat messages, classrooms, or online forums.",
          "NotaBridge bridges Jianpu and standard staff notation, so you can convert your numbers into professional sheet music instantly.",
        ],
      },
    ],
    contentZh: [
      {
        heading: "什么是简谱？",
        paragraphs: [
          "简谱是一种用数字 1–7 表示自然大调七个音级的记谱法，在亚洲广泛使用，尤其适合希望快速入门音乐的学习者。",
          "在简谱中，数字 1 始终代表调式的主音（do）。例如在 C 大调中，1 = C，2 = D，3 = E，依此类推。",
        ],
      },
      {
        heading: "数字与音高对应关系",
        paragraphs: [
          "在 C 大调中，基本对应关系为：1 = C，2 = D，3 = E，4 = F，5 = G，6 = A，7 = B。",
          "通过在高音点（'）或低音点（,）来表示不同八度：一个高音点表示高一个八度，一个低音点表示低一个八度。",
        ],
      },
      {
        heading: "为什么使用简谱？",
        paragraphs: [
          "简谱紧凑、易于输入，不需要画五线谱，非常适合在聊天、课堂或论坛中快速分享旋律。",
          "谱桥连接简谱与标准五线谱，让你可以一键把数字谱转换为专业乐谱。",
        ],
      },
    ],
  },
  {
    slug: "numbered-vs-staff",
    title: "Numbered Notation vs Staff Notation",
    titleZh: "简谱与五线谱的区别",
    description: "Understand the fundamental differences between these two universal systems, and discover when to effectively utilize each.",
    descriptionZh: "理解两种通用记谱系统之间的根本差异，并了解何时更有效地使用它们。",
    content: [
      {
        heading: "Numbered Notation vs Staff Notation",
        paragraphs: [
          "Numbered Notation expresses pitch through scale degrees (1, 2, 3…), while Staff Notation uses a five-line staff with note heads to show exact pitch and rhythm.",
          "Staff notation is universal across Western music and required for reading classical scores, piano literature, and ensemble parts. Numbered notation is faster to write and more intuitive for singers and melodic instruments.",
        ],
      },
      {
        heading: "When to Use Each",
        paragraphs: [
          "Use Numbered Notation when you need a quick sketch of a melody, a teaching aid, or a song shared in text format.",
          "Use Staff Notation when you need precise rhythm, harmony, dynamics, and compatibility with standard music software and performers.",
        ],
      },
    ],
    contentZh: [
      {
        heading: "简谱与五线谱的区别",
        paragraphs: [
          "简谱用音阶级数（1、2、3…）表示音高，而五线谱通过五条平行线和音符的位置来精确表示音高与节奏。",
          "五线谱是西方音乐的通用语言，阅读古典乐谱、钢琴文献和乐队分谱时必不可少；简谱则更快速、更适合声乐和旋律乐器的入门学习。",
        ],
      },
      {
        heading: "何时使用哪种记谱法",
        paragraphs: [
          "如果你需要快速记录旋律、制作教学材料，或以文本形式分享歌曲，简谱是更好的选择。",
          "如果你需要精确的节奏、和声、力度，或与标准音乐软件和演奏者兼容，五线谱更合适。",
        ],
      },
    ],
  },
  {
    slug: "how-to-read",
    title: "How to Read Music Numbers",
    titleZh: "如何识读数字谱",
    description: "Dive deep into scale degrees, octave dots, rhythm marks, and expressive symbols that make up the language of numerical musical scores.",
    descriptionZh: "深入学习音阶级数、八度点、节奏标记和表情符号，掌握数字乐谱语言的构成。",
    content: [
      {
        heading: "How to Read Music Numbers",
        paragraphs: [
          "Each number from 1 to 7 represents a scale degree. In C major these are C, D, E, F, G, A, B. The key signature tells you which note is the tonic.",
          "Add ' (apostrophe) above a number to raise it one octave; add , (comma) below to lower it one octave. You can stack multiple dots for wider ranges.",
        ],
      },
      {
        heading: "Accidentals",
        paragraphs: [
          "Write # before a number to raise it by a semitone (sharp) and b to lower it (flat). For example, #4 raises the fourth scale degree by one semitone.",
        ],
      },
    ],
    contentZh: [
      {
        heading: "如何识读数字谱",
        paragraphs: [
          "数字 1–7 代表音阶中的各个音级。在 C 大调中分别是 C、D、E、F、G、A、B。调号决定了哪个音是主音。",
          "在高音数字后加 ' 可升高一个八度，加 , 可降低一个八度。多个点号可叠加，表示更大的音域跨度。",
        ],
      },
      {
        heading: "变化音",
        paragraphs: [
          "在数字前加 # 表示升高半音（升号），加 b 表示降低半音（降号）。例如 #4 表示将第四级音升高半音。",
        ],
      },
    ],
  },
  {
    slug: "rhythm",
    title: "Rhythm in Numbered Notation",
    titleZh: "简谱中的节奏",
    description: "Master the basic rhythmic values — quarter, eighth, half notes, rests, and dots — using simple Jianpu symbols.",
    descriptionZh: "使用简单的简谱符号掌握基本节奏时值：四分音符、八分音符、二分音符、休止符与附点。",
    content: [
      {
        heading: "Rhythm in Numbered Notation",
        paragraphs: [
          "A plain number like 1 is a quarter note by default. Add _ underneath to make it an eighth note (1_) or __ for a sixteenth note (1__).",
          "Add - after a number to extend its duration: 1- is a half note and 1-- is a whole note. A dot after the number (1.) adds half of the original value.",
        ],
      },
      {
        heading: "Rests and Barlines",
        paragraphs: [
          "The number 0 represents a rest. It follows the same duration rules as notes. Use the vertical bar | to separate measures.",
        ],
      },
    ],
    contentZh: [
      {
        heading: "简谱中的节奏",
        paragraphs: [
          "单独的数字如 1 默认是四分音符。在数字后加 _ 表示八分音符（1_），加 __ 表示十六分音符（1__）。",
          "在数字后加 - 可延长时值：1- 是二分音符，1-- 是全音符。数字后加 .（附点）表示增加原时值的一半。",
        ],
      },
      {
        heading: "休止符与小节线",
        paragraphs: [
          "数字 0 表示休止符，其时值规则与音符相同。使用竖线 | 分隔小节。",
        ],
      },
    ],
  },
];

export function getLessonBySlug(slug: string): Lesson | undefined {
  return LESSONS.find((l) => l.slug === slug);
}

export function getAllLessonSlugs(): string[] {
  return LESSONS.map((l) => l.slug);
}
