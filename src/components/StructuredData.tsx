import {
  generateFAQStructuredData,
  generateStructuredData,
} from "@/lib/structured-data";
import Script from "next/script";

export function StructuredData() {
  const structuredData = generateStructuredData();
  const faqData = generateFAQStructuredData();

  return (
    <>
      <Script
        id="structured-data-webapp"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <Script
        id="structured-data-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqData),
        }}
      />
    </>
  );
}
