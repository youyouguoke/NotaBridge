import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { getAllLessonSlugs, getLessonBySlug } from "@/lib/learn";

export function generateStaticParams() {
  return getAllLessonSlugs().map((slug) => ({ slug }));
}

export default async function LessonPageZh({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = getLessonBySlug(slug);
  if (!lesson) notFound();

  return (
    <>
      <Header />
      <main className="flex-grow max-w-[1280px] mx-auto w-full px-4 md:px-16 py-8">
        <div className="flex flex-col gap-4 mb-8">
          <Link href="/zh/learn" className="text-sm font-medium text-secondary hover:text-primary w-fit inline-flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回学习中心
          </Link>
          <h1 className="text-3xl font-semibold text-on-surface">{lesson.titleZh}</h1>
          <p className="text-lg text-on-surface-variant">{lesson.descriptionZh}</p>
        </div>

        <article className="bg-white rounded-2xl border border-[#E5E7EB] p-6 md:p-8 shadow-sm space-y-8">
          {lesson.contentZh.map((section, idx) => (
            <section key={idx}>
              <h2 className="text-xl font-semibold text-on-surface mb-3">{section.heading}</h2>
              <div className="space-y-3 text-base text-on-surface-variant leading-relaxed">
                {section.paragraphs.map((p, pidx) => (
                  <p key={pidx}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </article>
      </main>
      <Footer />
    </>
  );
}
