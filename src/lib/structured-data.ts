export function generateStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://mindfulspace.app/#webapp",
        name: "MindfulSpace",
        alternateName: "Diario Emocional Inteligente",
        description:
          "Una aplicación inteligente que combina un diario emocional personal con un chatbot de apoyo emocional impulsado por IA. Analiza tus sentimientos, rastrea tendencias emocionales y mejora tu bienestar mental.",
        url: "https://mindfulspace.app",
        applicationCategory: "HealthApplication",
        operatingSystem: "Web Browser",
        browserRequirements: "Requires JavaScript. Requires HTML5.",
        softwareVersion: "1.0",
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.8",
          reviewCount: "127",
          bestRating: "5",
          worstRating: "1",
        },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          priceValidUntil: "2025-12-31",
          availability: "https://schema.org/InStock",
        },
        featureList: [
          "Diario emocional personal",
          "Análisis de sentimientos con IA",
          "Chatbot de apoyo emocional",
          "Seguimiento de tendencias emocionales",
          "Insights personalizados",
          "Privacidad y seguridad garantizadas",
        ],
        screenshot: "https://mindfulspace.app/screenshots/app-preview.png",
        author: {
          "@type": "Organization",
          name: "MindfulSpace Team",
          url: "https://mindfulspace.app",
        },
      },
      {
        "@type": "WebSite",
        "@id": "https://mindfulspace.app/#website",
        name: "MindfulSpace",
        url: "https://mindfulspace.app",
        description:
          "Plataforma de bienestar mental con diario emocional inteligente y asistente de IA",
        inLanguage: "es-ES",
        isPartOf: {
          "@id": "https://mindfulspace.app/#webapp",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: "https://mindfulspace.app/search?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": "https://mindfulspace.app/#organization",
        name: "MindfulSpace",
        url: "https://mindfulspace.app",
        logo: {
          "@type": "ImageObject",
          url: "https://mindfulspace.app/logo.png",
          width: "512",
          height: "512",
        },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "Customer Service",
          availableLanguage: ["Spanish", "English"],
          url: "https://mindfulspace.app/contact",
        },
        sameAs: [
          "https://twitter.com/mindfulspace_app",
          "https://instagram.com/mindfulspace_app",
          "https://linkedin.com/company/mindfulspace",
        ],
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://mindfulspace.app/#softwareapp",
        name: "MindfulSpace - Diario Emocional Inteligente",
        operatingSystem: "Web",
        applicationCategory: "HealthApplication",
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.8",
          reviewCount: "127",
        },
        offers: {
          "@type": "Offer",
          price: "0.00",
          priceCurrency: "USD",
        },
      },
    ],
  };
}

export function generateBreadcrumbStructuredData(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateFAQStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Es MindfulSpace gratuito?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sí, MindfulSpace es completamente gratuito para empezar. Ofrecemos todas las funciones básicas sin costo alguno.",
        },
      },
      {
        "@type": "Question",
        name: "¿Mis datos están seguros?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Absolutamente. Utilizamos encriptación de nivel empresarial y seguimos las mejores prácticas de seguridad para proteger tu información personal.",
        },
      },
      {
        "@type": "Question",
        name: "¿Cómo funciona el análisis de sentimientos?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Utilizamos inteligencia artificial avanzada para analizar el contenido de tus entradas del diario y identificar patrones emocionales, proporcionando insights valiosos sobre tu bienestar mental.",
        },
      },
      {
        "@type": "Question",
        name: "¿Puedo usar MindfulSpace en mi teléfono?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sí, MindfulSpace está optimizado para todos los dispositivos, incluyendo teléfonos móviles, tablets y computadoras de escritorio.",
        },
      },
    ],
  };
}
