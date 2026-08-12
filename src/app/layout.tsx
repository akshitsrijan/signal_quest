import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { BootSequence } from "~/app/_components/boot-sequence";

export const metadata: Metadata = {
  title: "SIGNAL QUEST",
  description:
    "SIGNAL QUEST is a hackathon for builders working across speech & audio, computer vision, biomedical signals, AI/ML, wireless & IoT, and sustainable tech.",
  icons: [{ rel: "icon", url: "/logo_preview.png" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <BootSequence />
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
