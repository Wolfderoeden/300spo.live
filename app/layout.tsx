import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "300",
  description:
    "The 300 Cardano hub for the 300 token, 300 Degens NFTs, SPO metrics, DRep status, swaps, ADA buys, and Cardano news.",
  metadataBase: new URL("https://300spo.live"),
  openGraph: {
    title: "300",
    description:
      "A live Cardano hub for the 300 ecosystem, with on-chain metrics and Cardano news.",
    url: "https://300spo.live",
    siteName: "300",
    images: [{ url: "/arctic-hero.png", width: 1200, height: 750 }],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-ms-theme="default-dark">
      <body>{children}</body>
    </html>
  );
}
