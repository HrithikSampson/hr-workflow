import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Toast from "@/components/Toast";
const inter = Inter({ subsets: ["latin"] });
import ReduxProvider from "@/providers/ReduxProvider";

export const metadata: Metadata = {
  title: "Workflow Builder",
  description: "Build intelligent conversational workflows",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ReduxProvider>
        <body className={inter.className}>
          <Toast />
          {children}
        </body>
      </ReduxProvider>
    </html>
  );
}
