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
    title: `${song.title} - Numbered & Staff Notation | NotaBridge`,
    description: `See ${song.title} in numbered notation and staff notation side-by-side. ${song.composer}, ${song.key} Major, ${song.time}.`,
  };
}

export default async function CompareDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const song = getSongBySlug(slug);
  if (!song) notFound();

  return (
    <>
      <Header />
      <main className="flex-grow max-w-[1280px] mx-auto w-full px-4 md:px-16 py-8">
        <div className="flex flex-col gap-4 mb-6">
          <Link href="/compare" className="text-sm font-medium text-secondary hover:text-primary w-fit inline-flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Library
          </Link>
          <h1 className="text-3xl font-semibold text-on-surface">{song.title}</h1>
          {song.titleZh && <p className="text-lg text-secondary">{song.titleZh}</p>}
          <p className="text-base text-on-surface-variant">
            {song.composer} · {song.key} Major · {song.time} · q={song.tempo}
          </p>
        </div>

        <SongComparison song={song} />
      </main>
      <Footer />
    </>
  );
}
