import { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { getSongBySlug, getAllSlugs } from "@/lib/songs";
import SongComparison from "@/components/music/SongComparison";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const song = getSongBySlug(slug);
  if (!song) return {};
  return {
    title: `${song.titleZh || song.title} - 简谱与五线谱对照 | NotaBridge 谱桥`,
    description: `查看 ${song.titleZh || song.title} 的简谱与五线谱对照。${song.composer}，${song.key} 大调，${song.time}。`,
  };
}

export default async function CompareDetailPageZh({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const song = getSongBySlug(slug);
  if (!song) notFound();

  return (
    <>
      <Header />
      <main className="flex-grow max-w-[1280px] mx-auto w-full px-4 md:px-16 py-8">
        <div className="flex flex-col gap-4 mb-6">
          <Link href="/zh/compare" className="text-sm font-medium text-secondary hover:text-primary w-fit inline-flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回谱例库
          </Link>
          <h1 className="text-3xl font-semibold text-on-surface">{song.titleZh || song.title}</h1>
          <p className="text-lg text-secondary">{song.title}</p>
          <p className="text-base text-on-surface-variant">
            {song.composer} · {song.key} 大调 · {song.time} · q={song.tempo}
          </p>
        </div>

        <SongComparison song={song} locale="zh" />
      </main>
      <Footer />
    </>
  );
}
