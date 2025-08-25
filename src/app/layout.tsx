import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer, Navbar, TargetCursor } from "@/components/layout";
import { ThemeProvider } from "@/components/theme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevCrate - Your Curated Developer Toolbox",
  description:
    "Discover and explore the best developer tools, UI libraries, and resources. DevCrate helps developers find the perfect tools to supercharge their workflow.",
  keywords:
    "developer tools, programming, software development, coding resources, UI libraries",
  authors: [{ name: "spacecentre" }],
  openGraph: {
    title: "DevCrate - Your Curated Developer Toolbox",
    description: "Discover and explore the best developer tools and resources",
    type: "website",
  },
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <TargetCursor spinDuration={5} hideDefaultCursor />
          <main className="pt-16">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
