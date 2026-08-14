"use client";

import { useEffect } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log the error to an external service if available.
    console.error("Global error:", error);
  }, [error]);

  return (
    <>
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center max-w-[1280px] mx-auto w-full px-4 md:px-16 py-20 text-center">
        <h1 className="text-5xl font-bold text-error mb-4">Oops</h1>
        <h2 className="text-2xl font-semibold text-on-surface mb-3">Something went wrong</h2>
        <p className="text-lg text-on-surface-variant mb-8 max-w-md">
          We encountered an unexpected error. You can try refreshing the page or go back home.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={reset}
            className="bg-primary text-on-primary px-6 py-3 rounded-lg font-medium hover:bg-primary-container transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="border border-primary text-primary px-6 py-3 rounded-lg font-medium hover:bg-primary/5 transition-colors"
          >
            Back to Home
          </Link>
        </div>
        {process.env.NODE_ENV === "development" && error?.message && (
          <pre className="mt-8 text-left bg-surface-container p-4 rounded-lg text-sm text-on-surface-variant max-w-2xl overflow-auto">
            {error.message}
          </pre>
        )}
      </main>
      <Footer />
    </>
  );
}
