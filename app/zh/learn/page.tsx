import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { LESSONS } from "@/lib/learn";

export const metadata = {
  title: "学习中心 | NotaBridge 谱桥",
  description: "免费简谱与五线谱学习课程：什么是简谱、两种记谱法的区别、如何识读数字谱、简谱中的节奏。",
};

export default function LearnPageZh() {
  return (
    <>
      <Header />
      <main className="flex-grow max-w-[1280px] mx-auto w-full px-4 md:px-16 py-12">
        <div className="flex flex-col gap-4 mb-10">
          <h1 className="text-3xl font-semibold text-on-surface">学习中心</h1>
          <p className="text-lg text-on-surface-variant">
            通过专题课程理解简谱与五线谱之间的关系。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {LESSONS.map((lesson) => (
            <Link
              key={lesson.slug}
              href={`/zh/learn/${lesson.slug}`}
              className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow hover:border-primary flex flex-col gap-3"
            >
              <h2 className="text-xl font-semibold text-on-surface">{lesson.titleZh}</h2>
              <p className="text-base text-on-surface-variant">{lesson.descriptionZh}</p>
              <span className="text-sm font-medium text-primary mt-2 inline-flex items-center gap-1">
                阅读课程
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          ))}
          <Link
            href="/zh/compare"
            className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow hover:border-primary flex flex-col gap-3"
          >
            <h2 className="text-xl font-semibold text-on-surface">谱例对照</h2>
            <p className="text-base text-on-surface-variant">
              在公域歌曲中查看两种记谱系统的并排对照。
            </p>
            <span className="text-sm font-medium text-primary mt-2 inline-flex items-center gap-1">
              打开谱例库
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
