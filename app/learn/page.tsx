import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { LESSONS } from "@/lib/learn";

export const metadata = {
  title: "Learn Music Notation | NotaBridge",
  description: "Free lessons on numbered notation (Jianpu) and staff notation. Learn to read, compare, and convert between both systems.",
};

export default function LearnPage() {
  return (
    <>
      <Header />
      <main className="flex-grow max-w-[1280px] mx-auto w-full px-4 md:px-16 py-12">
        <div className="flex flex-col gap-4 mb-10">
          <h1 className="text-3xl font-semibold text-on-surface">Learn Music Notation</h1>
          <p className="text-lg text-on-surface-variant">
            Understand the relationship between numbered notation and staff notation through focused lessons.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {LESSONS.map((lesson) => (
            <Link
              key={lesson.slug}
              href={`/learn/${lesson.slug}`}
              className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow hover:border-primary flex flex-col gap-3"
            >
              <h2 className="text-xl font-semibold text-on-surface">{lesson.title}</h2>
              <p className="text-base text-on-surface-variant">{lesson.description}</p>
              <span className="text-sm font-medium text-primary mt-2 inline-flex items-center gap-1">
                Read more
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          ))}
          <Link
            href="/compare"
            className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow hover:border-primary flex flex-col gap-3"
          >
            <h2 className="text-xl font-semibold text-on-surface">Compare Examples</h2>
            <p className="text-base text-on-surface-variant">
              See side-by-side comparisons of public-domain songs in both notation systems.
            </p>
            <span className="text-sm font-medium text-primary mt-2 inline-flex items-center gap-1">
              Open library
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
