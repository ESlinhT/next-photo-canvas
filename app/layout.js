'use client'

import localFont from "next/font/local";
import "./globals.css";
import GlobalProvider from "@/app/context/GlobalProvider";
import FramesProvider from "@/app/context/FramesProvider";

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

export default function RootLayout({children}) {
    return (
        <GlobalProvider>
            <html lang="en">
                <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                    <FramesProvider>
                        {children}
                    </FramesProvider>
                </body>
            </html>
        </GlobalProvider>
    );
}
