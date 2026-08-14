"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Header() {
  const pathname = usePathname();
  const isZh = pathname?.startsWith("/zh");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navItems = [
    { href: isZh ? "/zh/convert" : "/convert", label: isZh ? "转换器" : "Converter" },
    { href: isZh ? "/zh/compare" : "/compare", label: isZh ? "谱例库" : "Compare" },
    { href: isZh ? "/zh/learn" : "/learn", label: isZh ? "学习" : "Learn" },
  ];

  const localeHref = isZh ? "/" : "/zh";
  const localeLabel = isZh ? "EN" : "中文";

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-surface/85 dark:bg-surface-container-low/85 backdrop-blur-md shadow-sm border-b border-outline-variant/40"
          : "bg-surface dark:bg-surface-container-low border-b border-transparent"
      }`}
    >
      <div className="flex justify-between items-center h-16 max-w-[1280px] mx-auto px-4 md:px-8">
        {/* Logo */}
        <Link
          href={isZh ? "/zh" : "/"}
          className="flex items-center gap-2.5 text-xl md:text-2xl font-semibold text-primary dark:text-primary-fixed hover:opacity-80 transition-opacity"
        >
          <img
            src="/images/logo.jpg"
            alt="NotaBridge logo"
            className="h-8 w-auto rounded-lg shadow-sm"
          />
          <span>NotaBridge</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-primary-container text-on-primary-container"
                    : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <Link
            href={localeHref}
            className="hidden md:flex items-center rounded-full border border-outline-variant/60 bg-surface-container-lowest dark:bg-surface-dim overflow-hidden text-xs font-semibold transition-colors hover:border-primary/40"
            aria-label={isZh ? "Switch to English" : "切换到中文"}
          >
            <span className={`px-3 py-1.5 ${!isZh ? "bg-primary text-on-primary" : "text-on-surface-variant"}`}>
              EN
            </span>
            <span className={`px-3 py-1.5 ${isZh ? "bg-primary text-on-primary" : "text-on-surface-variant"}`}>
              中文
            </span>
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-full bg-surface-container-high text-on-surface hover:bg-primary-container hover:text-on-primary-container transition-colors"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-outline-variant/30 bg-surface/95 dark:bg-surface-container-low/95 backdrop-blur-md px-4 pb-5 pt-2 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary-container text-on-primary-container"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="pt-2">
            <Link
              href={localeHref}
              className="flex items-center rounded-full border border-outline-variant/60 bg-surface-container-lowest dark:bg-surface-dim overflow-hidden text-xs font-semibold w-fit"
            >
              <span className={`px-4 py-2 ${!isZh ? "bg-primary text-on-primary" : "text-on-surface-variant"}`}>
                EN
              </span>
              <span className={`px-4 py-2 ${isZh ? "bg-primary text-on-primary" : "text-on-surface-variant"}`}>
                中文
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
