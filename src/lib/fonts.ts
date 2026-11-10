import { Cormorant_Garamond, Lato, Noto_Serif_Telugu } from "next/font/google";

export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  style: ["normal", "italic"],
  variable: "--font-lato",
  display: "swap",
});

export const notoSerifTelugu = Noto_Serif_Telugu({
  subsets: ["telugu"],
  weight: ["400", "600", "700"],
  variable: "--font-noto-telugu",
  display: "swap",
});

export const fontVariables = [
  cormorant.variable,
  lato.variable,
  notoSerifTelugu.variable,
].join(" ");
