import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WebSiteJsonLd, OrganizationJsonLd } from "./JsonLd";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const siteUrl = "https://notabridge.com";
const siteTitle = "NotaBridge - The easiest bridge between numbered notation and staff notation";
const siteDescription = "Convert numbered notation into sheet music and learn how both systems represent the same melody.";
const ogImage = `${siteUrl}/images/logo.jpg`;

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    siteName: "NotaBridge",
    images: [
      {
        url: ogImage,
        width: 1280,
        height: 698,
        alt: "NotaBridge logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [ogImage],
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      "en": `${siteUrl}`,
      "zh-CN": `${siteUrl}/zh`,
      "x-default": siteUrl,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <WebSiteJsonLd
          name="NotaBridge"
          url={siteUrl}
          description={siteDescription}
          inLanguage={["en", "zh-CN"]}
        />
        <OrganizationJsonLd
          name="NotaBridge"
          url={siteUrl}
          logo={ogImage}
        />
      </head>
      <body className="min-h-full flex flex-col pt-16">{children}</body>
    </html>
  );
}
