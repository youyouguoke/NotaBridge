import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Privacy Policy | NotaBridge",
  description: "NotaBridge privacy policy. We do not collect personal data unless you contact us directly.",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="flex-grow max-w-[720px] mx-auto w-full px-4 md:px-16 py-12">
        <h1 className="text-3xl font-semibold text-on-surface mb-6">Privacy Policy</h1>
        <div className="space-y-4 text-base text-on-surface-variant leading-relaxed">
          <p>
            NotaBridge is committed to protecting your privacy. This Privacy Policy explains how we handle information when you use our website.
          </p>
          <h2 className="text-xl font-semibold text-on-surface mt-6">1. Information We Do Not Collect</h2>
          <p>
            We do not require account registration, and we do not track your personal browsing behavior. Music notation you enter into the converter is processed locally in your browser and is not sent to our servers.
          </p>
          <h2 className="text-xl font-semibold text-on-surface mt-6">2. Contact Information</h2>
          <p>
            If you email us at hello@notabridge.app, we will receive only the information you choose to provide, such as your email address and message content.
          </p>
          <h2 className="text-xl font-semibold text-on-surface mt-6">3. Cookies</h2>
          <p>
            NotaBridge does not use cookies for tracking or advertising. We may rely on standard analytics services solely to understand site traffic at an aggregate level.
          </p>
          <h2 className="text-xl font-semibold text-on-surface mt-6">4. Changes</h2>
          <p>
            We may update this policy from time to time. Continued use of the site after changes means you accept the revised policy.
          </p>
          <p className="pt-4 text-sm text-secondary">Last updated: August 2026</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
