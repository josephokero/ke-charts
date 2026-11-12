/** Platforms shown on KE Charts (kecharts.com). Edit here to swap sites. */

export type TikTokPlatform = {
  id: "velt" | "tradewise" | "easytrade";
  name: string;
  tagline: string;
  href: string;
  image: string;
  badge?: string;
  contracts: string;
  practice: string;
  mpesa: string;
  tools: string;
  signup: string;
  highlight: string;
  blurb: string;
  points: string[];
};

export const TIKTOK_LANDING_BRAND = "KE Charts";
export const TIKTOK_LANDING_HEADLINE =
  "Experience Kenya’s top binary trading platforms.";
export const TIKTOK_LANDING_SUB = "Pick a desk. Open in one tap.";

export const TIKTOK_PLATFORMS: TikTokPlatform[] = [
  {
    id: "tradewise",
    name: "TradeWise",
    tagline: "Kenya’s #1 — Even · Odd · Match · Over/Under.",
    href: "https://tradewisebinary.com/",
    image: "/ke/tradewise.png",
    badge: "#1",
    contracts: "Even/Odd · Match/Differ · Over/Under",
    practice: "$10,000 virtual funds",
    mpesa: "Methods by country after login",
    tools: "AI Scanner · Auto Trade",
    signup: "Name · email · phone · Kenya (+254)",
    highlight: "Clear ticket · practice first",
    blurb:
      "TradeWise keeps last-digit contracts on one ticket — Even/Odd, Match/Differ, Over/Under — with practice funds before you fund.",
    points: [
      "Signup supports Kenya (+254) phone numbers",
      "$10,000 virtual practice on new accounts",
      "AI Scanner + Auto Trade with target/stop",
      "Funding options depend on account region",
    ],
  },
  {
    id: "easytrade",
    name: "EasyTrade",
    tagline: "#2 pick — simple ticket, practice, then live.",
    href: "https://easytradebinary.com/",
    image: "/ke/easytrade.png",
    badge: "#2",
    contracts: "Even/Odd · Match/Differ · Over/Under",
    practice: "$10,000 virtual funds",
    mpesa: "Methods by country after login",
    tools: "AI Scanner · Auto Trade",
    signup: "Email/phone signup · practice first",
    highlight: "Simple last-digit desk",
    blurb:
      "EasyTrade is a clean last-digit desk — three contracts, practice funds, then fund when you’re ready. Browser only.",
    points: [
      "Three contracts on one clear ticket",
      "$10,000 virtual practice before live",
      "AI Scanner suggests; you confirm the trade",
      "Deposit/withdraw methods vary by country",
    ],
  },
  {
    id: "velt",
    name: "VELT",
    tagline: "Digits, AI scan, M-Pesa cash desk.",
    href: "https://veltbinary.app/",
    image: "/ke/velt.png",
    contracts: "Even/Odd · Over/Under · Matches",
    practice: "Demo wallet (no deposit)",
    mpesa: "Deposit + withdraw",
    tools: "AI Scan · Auto trade · 2FA / passkey",
    signup: "Email + password (Kenya desk)",
    highlight: "Built for Kenya + M-Pesa",
    blurb:
      "VELT is Kenya’s digit desk — live markets, AI scan, demo practice, and M-Pesa cash on one mobile ticket.",
    points: [
      "M-Pesa deposit and withdraw on the cash desk",
      "AI scan ranks digit bias; optional auto trade",
      "Demo first, then live — phone and desktop",
      "Security: SMS 2FA and device passkeys",
    ],
  },
];

export function platformById(id: string): TikTokPlatform | undefined {
  return TIKTOK_PLATFORMS.find((p) => p.id === id);
}
