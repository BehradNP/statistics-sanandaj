import localFont from "next/font/local";

export const yekanBakh = localFont({
  src: [
    {
      path: "../../public/assets/fonts/iran-yekan/YekanBakh-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/assets/fonts/iran-yekan/YekanBakh-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/assets/fonts/iran-yekan/YekanBakh-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-yekan-bakh",
  display: "swap",
});