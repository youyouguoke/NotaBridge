import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Terms of Service | NotaBridge",
  description: "Terms of Service for using NotaBridge, the online numbered notation and staff notation converter.",
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="flex-grow max-w-[720px] mx-auto w-full px-4 md:px-16 py-12">
        <h1 className="text-3xl font-semibold text-on-surface mb-6">Terms of Service</h1>
        <div className="space-y-4 text-base text-on-surface-variant leading-relaxed">
          <p>
            By accessing or using NotaBridge, you agree to be bound by these Terms of Service. If you do not agree, please do not use the site.
          </p>
          <h2 className="text-xl font-semibold text-on-surface mt-6">1. Use of the Service</h2>
          <p>
            NotaBridge provides tools for converting numbered musical notation (Jianpu) into staff notation. You may use the service for personal, educational, and non-commercial purposes.
          </p>
          <h2 className="text-xl font-semibold text-on-surface mt-6">2. Content You Create</h2>
          <p>
            Any music notation you enter belongs to you. We do not claim ownership of user-generated content. Please ensure you have the right to use and share any content you input.
          </p>
          <h2 className="text-xl font-semibold text-on-surface mt-6">3. Public-Domain Examples</h2>
          <p>
            Songs in the Compare Library are provided as public-domain or traditional examples for educational purposes.
          </p>
          <h2 className="text-xl font-semibold text-on-surface mt-6">4. Disclaimer</h2>
          <p>
            NotaBridge is provided "as is" without warranties of any kind. We do not guarantee that every conversion will be musically perfect.
          </p>
          <h2 className="text-xl font-semibold text-on-surface mt-6">5. Changes</h2>
          <p>
            We may modify these terms at any time. Continued use of the site after changes constitutes acceptance of the updated terms.
          </p>
          <p className="pt-4 text-sm text-secondary">Last updated: August 2026</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
