import type { Metadata } from "next";
import { yekanBakh } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "سامانه آمار و عملکرد شهرداری سنندج",
  description: "سامانه مدیریت آمار و عملکرد شهرداری سنندج",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={yekanBakh.variable}>
      <body className={yekanBakh.className}>{children}</body>
    </html>
  );
}