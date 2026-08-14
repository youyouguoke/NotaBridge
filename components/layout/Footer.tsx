"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const isZh = pathname?.startsWith("/zh");

  return (
    <footer className="w-full mt-12 bg-surface-container-lowest dark:bg-surface-dim border-t border-outline-variant/30">
      <div className="flex flex-col items-center gap-4 py-8 max-w-[1280px] mx-auto px-4 md:px-16">
        <span className="text-2xl font-semibold text-primary">NotaBridge</span>
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-xs text-secondary transition-all">
          <Link href={isZh ? "/zh/learn" : "/learn"} className="hover:text-primary transition-colors">
            {isZh ? "学习中心" : "Learn"}
          </Link>
          <Link href={isZh ? "/zh/compare" : "/compare"} className="hover:text-primary transition-colors">
            {isZh ? "谱例库" : "Compare Library"}
          </Link>
          <a className="hover:text-primary transition-colors" href="mailto:hello@notabridge.com">
            {isZh ? "联系我们" : "Contact"}
          </a>
          <Link href={isZh ? "/zh/privacy" : "/privacy"} className="hover:text-primary transition-colors">
            {isZh ? "隐私政策" : "Privacy Policy"}
          </Link>
          <Link href={isZh ? "/zh/terms" : "/terms"} className="hover:text-primary transition-colors">
            {isZh ? "服务条款" : "Terms of Service"}
          </Link>
        </div>
        <span className="text-xs text-secondary">
          &copy; 2026 NotaBridge. {isZh ? "让音乐学习更简单。" : "Empowering musical literacy through tactile education."}
        </span>
      </div>
    </footer>
  );
}
