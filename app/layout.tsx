import type {
  Metadata,
  Viewport,
} from "next";

import "./globals.css";

import { CampaignRuntime } from "@/components/motion/campaign-runtime";

/* =========================================================
   SITE URL
========================================================= */

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

const socialImage =
  "/opengraph-image";

/* =========================================================
   METADATA
========================================================= */

export const metadata: Metadata = {
  metadataBase: new URL(
    siteUrl,
  ),

  title: {
    default:
      "VELOCE — Premium Car Rental",
    template:
      "%s | VELOCE",
  },

  description:
    "VELOCE is a cinematic premium car rental portfolio concept featuring performance vehicles, interactive browsing, and a streamlined reservation experience.",

  applicationName:
    "VELOCE",

  keywords: [
    "VELOCE",
    "premium car rental",
    "luxury car rental",
    "performance cars",
    "automotive website",
    "car rental UI",
    "Metro Manila",
    "Philippines",
  ],

  authors: [
    {
      name:
        "Ranz Nathaniel S. Vasquez",
    },
  ],

  creator:
    "Ranz Nathaniel S. Vasquez",

  category:
    "Automotive",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title:
      "VELOCE — Drive Exceptional",
    description:
      "A cinematic premium car rental portfolio concept built around exceptional machines and personal journeys.",
    type:
      "website",
    siteName:
      "VELOCE",
    locale:
      "en_PH",

    images: [
      {
        url:
          socialImage,
        width:
          1200,
        height:
          630,
        alt:
          "VELOCE — Drive Exceptional",
      },
    ],
  },

  twitter: {
    card:
      "summary_large_image",
    title:
      "VELOCE — Drive Exceptional",
    description:
      "A cinematic premium car rental portfolio concept featuring performance vehicles and a refined reservation experience.",
    images: [
      socialImage,
    ],
  },

  icons: {
    icon:
      "/icon.svg",
  },

  robots: {
    index:
      true,
    follow:
      true,
  },
};

/* =========================================================
   VIEWPORT
========================================================= */

export const viewport: Viewport = {
  width:
    "device-width",
  initialScale:
    1,

  themeColor:
    "#050505",

  colorScheme:
    "dark",
};

/* =========================================================
   ROOT LAYOUT
========================================================= */

export default function RootLayout({
  children,
}: Readonly<{
  children:
    React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="bg-[#050505]"
    >
      <body
        id="top"
        className="min-h-screen bg-[#050505] antialiased"
      >
        {/* Accessibility first */}

        <a
          href="#main-content"
          className="skip-link"
        >
          Skip to content
        </a>

        {/* Global cinematic runtime */}

        <CampaignRuntime />

        {children}
      </body>
    </html>
  );
}