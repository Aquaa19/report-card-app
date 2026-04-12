import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

import SideNav from "@/components/SideNav";
import TopBar from "@/components/TopBar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });

export const metadata: Metadata = {
  title: "Luminescent Scholar | Analytics Dashboard",
  description: "Premium academic analytics and student management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL,GRAD,opsz@400,0,0,24&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className={`${inter.variable} ${jakarta.variable} font-sans antialiased text-slate-900 bg-slate-50 dark:text-slate-50 dark:bg-[#0a0a1a] h-screen flex overflow-hidden transition-colors duration-500`}>
        
        <SideNav /> 

        <div className="flex-1 flex flex-col min-w-0">
          <TopBar />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>

      </body>
    </html>
  );
}