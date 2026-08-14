import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function NotFoundPage() {
  return (
    <>
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center max-w-[1280px] mx-auto w-full px-4 md:px-16 py-20 text-center">
        <h1 className="text-6xl font-bold text-on-surface mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-on-surface mb-3">Page Not Found</h2>
        <p className="text-lg text-on-surface-variant mb-8 max-w-md">
          The page you are looking for does not exist. It might have been moved or deleted.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/"
            className="bg-primary text-on-primary px-6 py-3 rounded-lg font-medium hover:bg-primary-container transition-colors"
          >
            Back to Home
          </Link>
          <Link
            href="/convert"
            className="border border-primary text-primary px-6 py-3 rounded-lg font-medium hover:bg-primary/5 transition-colors"
          >
            Try Converter
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
