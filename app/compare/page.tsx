import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { SONGS } from "@/lib/songs";

export const metadata = {
  title: "Compare Library | NotaBridge - Numbered Notation Examples",
  description: "Explore public-domain songs side-by-side in numbered notation and staff notation. Learn how both systems represent the same melody.",
};

export default function ComparePage() {
  return (
    <>
      <Header />
      <main className="flex-grow max-w-[1280px] mx-auto w-full px-4 md:px-16 py-12">
        <div className="flex flex-col gap-4 mb-8">
          <Link href="/" className="text-sm font-medium text-secondary hover:text-primary w-fit inline-flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </Link>
          <h1 className="text-3xl font-semibold text-on-surface">Compare Library</h1>
          <p className="text-lg text-on-surface-variant">
            Public-domain examples to learn how numbered and staff notation represent the same music.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SONGS.map((item) => (
            <div
              key={item.slug}
              className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm flex flex-col gap-3 hover:border-primary transition-colors"
            >
              <h3 className="text-xl font-semibold text-on-surface">{item.title}</h3>
              {item.titleZh && <p className="text-sm text-secondary">{item.titleZh}</p>}
              <p className="text-sm text-on-surface-variant">{item.composer}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-xs font-medium px-2 py-1 bg-surface-container rounded text-secondary">
                  {item.key} Major
                </span>
                <span className="text-xs font-medium px-2 py-1 bg-surface-container rounded text-secondary">
                  {item.time}
                </span>
                <span className="text-xs font-medium px-2 py-1 bg-secondary-container rounded text-on-secondary-container">
                  {item.status}
                </span>
              </div>
              <Link
                href={`/compare/${item.slug}`}
                className="mt-auto pt-4 text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
              >
                View comparison
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
