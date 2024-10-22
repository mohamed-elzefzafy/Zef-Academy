import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import Topbar from "@/components/layout/Topbar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Zef Academy",
  description: "Zef Academy is a big platform for teaching",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  
    <ClerkProvider afterSignOutUrl="/sign-in">
   <html lang="en">

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
           <ThemeProvider attribute="class" defaultTheme="dark">
            <Topbar/>
        {children}
        </ThemeProvider>
      </body>

    </html>
    </ClerkProvider>

 
  );
}
