import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function HomePageZh() {
  return (
    <>
      <Header />
      <main className="flex-grow flex flex-col max-w-[1280px] mx-auto w-full px-4 md:px-16 py-12 gap-12">
        {/* Hero */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-8">
          <div className="flex flex-col gap-6">
            <h1 className="text-4xl md:text-5xl font-bold text-on-surface tracking-tight">
              连接简谱与五线谱的在线记谱工具
            </h1>
            <p className="text-lg text-on-surface-variant">
              将简谱转换为五线谱，同时学习两种记谱方式的对应关系。
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/zh/convert"
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium text-sm py-2 px-6 rounded-lg transition-colors inline-flex items-center gap-2"
              >
                开始转换
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/zh/learn"
                className="text-[#475569] font-medium text-sm hover:text-[#2563EB] transition-colors py-2 px-4 rounded-lg inline-flex items-center gap-1"
              >
                了解更多
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
          <div className="flex justify-center items-center p-4 bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_10px_15px_-3px_rgba(31,41,55,0.04)]">
            <img
              src="/images/hero-zh.png"
              alt="简谱与五线谱对照的音乐教材风格插图"
              className="w-full h-auto object-contain max-h-[400px] rounded-lg"
            />
          </div>
        </section>

        {/* How it works */}
        <section className="flex flex-col gap-6">
          <h2 className="text-3xl font-semibold text-on-surface text-center">功能介绍</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: "keyboard", title: "输入简谱", body: "使用键盘快速输入数字简谱。" },
              { icon: "music", title: "生成五线谱", body: "即时转换为标准五线谱格式。" },
              { icon: "book", title: "对照学习", body: "同时查看两种记谱法，提升识谱能力。" },
            ].map((card) => (
              <div
                key={card.title}
                className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-[0_10px_15px_-3px_rgba(31,41,55,0.04)] flex flex-col items-center text-center gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mb-1">
                  {card.icon === "keyboard" && (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <rect x="2" y="6" width="20" height="12" rx="2" />
                      <path d="M6 10h.01M8 10h.01M10 10h.01M14 10h.01M16 10h.01M18 10h.01M8 14h8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  {card.icon === "music" && (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13" />
                      <circle cx="6" cy="19" r="3" />
                      <circle cx="18" cy="16" r="3" />
                    </svg>
                  )}
                  {card.icon === "book" && (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-on-surface">{card.title}</h3>
                <p className="text-base text-on-surface-variant">{card.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6 py-8">
          <div className="md:col-span-5 bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-[0_10px_15px_-3px_rgba(31,41,55,0.04)] flex flex-col justify-center">
            <h3 className="text-2xl font-semibold text-on-surface mb-3">简谱转五线谱</h3>
            <p className="text-base text-on-surface-variant mb-6">
              快速准确地将数字简谱翻译成标准五线谱，支持多种调式、八度与节奏。
            </p>
            <div className="mt-auto pt-4 border-t border-[#E5E7EB] flex items-center justify-between">
              <span className="text-sm font-medium text-secondary">精准转换</span>
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <div className="md:col-span-7 grid grid-rows-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-[0_10px_15px_-3px_rgba(31,41,55,0.04)] flex items-center gap-4">
              <div className="p-3 bg-secondary-container rounded-lg text-on-secondary-container">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-on-surface">双栏对照视图</h4>
                <p className="text-base text-on-surface-variant">双视窗对照，直观展示两种记谱法的对应关系。</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-[0_10px_15px_-3px_rgba(31,41,55,0.04)] flex items-center gap-4">
              <div className="p-3 bg-secondary-container rounded-lg text-on-secondary-container">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-on-surface">在线生成乐谱</h4>
                <p className="text-base text-on-surface-variant">导出高清乐谱，方便练习与教学。</p>
              </div>
            </div>
          </div>
        </section>

        {/* Learn Music Notation */}
        <section className="flex flex-col gap-6">
          <h2 className="text-3xl font-semibold text-on-surface border-b border-[#E5E7EB] pb-3">学习中心</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "什么是简谱？",
                body: "快速了解简谱系统及其起源。",
              },
              {
                title: "简谱与五线谱的区别",
                body: "理解两种记谱法的关键差异与各自优势。",
              },
              {
                title: "如何识读数字谱",
                body: "学习将 1-7 数字转化为音高与节奏的基础。",
              },
            ].map((card) => (
              <Link
                key={card.title}
                href="/zh/learn"
                className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-[0_10px_15px_-3px_rgba(31,41,55,0.04)] hover:border-[#2563EB] transition-colors group"
              >
                <h4 className="text-xl font-semibold text-on-surface group-hover:text-[#2563EB] transition-colors mb-2">
                  {card.title}
                </h4>
                <p className="text-base text-on-surface-variant">{card.body}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
