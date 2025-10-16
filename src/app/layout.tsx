import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MindfulSpace - Tu Diario Emocional y Asistente de Bienestar Mental",
  description:
    "Una aplicación inteligente que combina un diario emocional personal con un chatbot de apoyo emocional impulsado por IA. Analiza tus sentimientos, rastrea tendencias emocionales y mejora tu bienestar mental.",
  keywords: [
    "bienestar mental",
    "diario emocional",
    "análisis de sentimientos",
    "chatbot terapéutico",
    "salud mental",
    "autocuidado",
    "journal personal",
    "inteligencia artificial",
    "mindfulness",
  ],
  authors: [{ name: "MindfulSpace Team" }],
  creator: "MindfulSpace",
  publisher: "MindfulSpace",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://mindfulspace.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "MindfulSpace - Tu Diario Emocional Inteligente",
    description:
      "Descubre patrones emocionales, recibe apoyo personalizado y mejora tu bienestar mental con nuestra plataforma impulsada por IA.",
    url: "https://mindfulspace.app",
    siteName: "MindfulSpace",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MindfulSpace - Diario Emocional Inteligente",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MindfulSpace - Tu Diario Emocional Inteligente",
    description:
      "Analiza tus emociones, rastrea tendencias y mejora tu bienestar mental con IA.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#6366f1" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
