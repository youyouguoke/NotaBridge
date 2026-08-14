import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { SONGS } from "@/lib/songs";

export const metadata = {
  title: "谱例库 | NotaBridge 谱桥 - 简谱五线谱对照",
  description: "通过公域谱例学习简谱与五线谱如何表示同一首音乐。查看小星星、欢乐颂等经典曲目的双谱对照。",
};

export default function ComparePageZh() {
  return (
    <>
      <Header />
      <main className="flex-grow max-w-[1280px] mx-auto w-full px-4 md:px-16 py-12">
        <div className="flex flex-col gap-4 mb-8">
          <Link href="/zh" className="text-sm font-medium text-secondary hover:text-primary w-fit inline-flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回首页
          </Link>
          <h1 className="text-3xl font-semibold text-on-surface">谱例库</h1>
          <p className="text-lg text-on-surface-variant">
            通过公域谱例学习简谱与五线谱如何表示同一首音乐。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SONGS.map((item) => (
            <div
              key={item.slug}
              className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm flex flex-col gap-3 hover:border-primary transition-colors"
            >
              <h3 className="text-xl font-semibold text-on-surface">{item.titleZh || item.title}</h3>
              {item.titleZh && <p className="text-sm text-secondary">{item.title}</p>}
              <p className="text-sm text-on-surface-variant">{item.composer}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-xs font-medium px-2 py-1 bg-surface-container rounded text-secondary">
                  {item.key} 大调
                </span>
                <span className="text-xs font-medium px-2 py-1 bg-surface-container rounded text-secondary">
                  {item.time}
                </span>
                <span className="text-xs font-medium px-2 py-1 bg-secondary-container rounded text-on-secondary-container">
                  {item.status === "Public Domain" ? "公有领域" : "传统 / 公有领域"}
                  <span className="sr-only">。本示例使用公有领域旋律。</span>
                </span>
              </div>
              <Link
                href={`/zh/compare/${item.slug}`}
                className="mt-auto pt-4 text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
              >
                查看对照
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
