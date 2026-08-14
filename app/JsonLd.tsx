interface WebSiteSchema {
  "@context": "https://schema.org";
  "@type": "WebSite";
  name: string;
  url: string;
  description: string;
  inLanguage: string[];
  potentialAction?: {
    "@type": "SearchAction";
    target: string;
    "query-input": string;
  };
}

interface OrganizationSchema {
  "@context": "https://schema.org";
  "@type": "Organization";
  name: string;
  url: string;
  logo: string;
  sameAs?: string[];
}

export function WebSiteJsonLd({
  name,
  url,
  description,
  inLanguage,
}: {
  name: string;
  url: string;
  description: string;
  inLanguage: string[];
}) {
  const schema: WebSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
    description,
    inLanguage,
  };

  return (
    <script
      id="jsonld-website"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function OrganizationJsonLd({
  name,
  url,
  logo,
  sameAs = [],
}: {
  name: string;
  url: string;
  logo: string;
  sameAs?: string[];
}) {
  const schema: OrganizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    logo,
    sameAs,
  };

  return (
    <script
      id="jsonld-organization"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
