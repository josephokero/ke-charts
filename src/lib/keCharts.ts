/** KE Charts mini-site helpers + content. */

import { platformById, type TikTokPlatform } from "./tiktokPlatforms";

export type KeStaticPage = "home" | "faq" | "how" | "risk" | "compare" | "terms";
export type KeDeskPage = "velt" | "tradewise" | "easytrade";
export type KePage = KeStaticPage | KeDeskPage;

export const KE_ORIGIN = "https://kecharts.com";
export const KE_BRAND = "KE Charts";
export const KE_TIKTOK = "https://www.tiktok.com/@missbillionaire14";

/** Standalone ke-charts project — always own-host routing (no /ke prefix). */
export function isKeChartsHost(
  _hostname = typeof window !== "undefined" ? window.location.hostname : "",
): boolean {
  return true;
}

export function isKeDeskPage(page: KePage): page is KeDeskPage {
  return page === "velt" || page === "tradewise" || page === "easytrade";
}

export function kePageFromPath(pathname: string): KePage | null {
  const raw = pathname.replace(/\/+$/, "") || "/";
  const p = raw.toLowerCase();

  const map: Record<string, KePage> = {
    "/": "home",
    "/index": "home",
    "/index.html": "home",
    "/faq": "faq",
    "/how": "how",
    "/how-it-works": "how",
    "/risk": "risk",
    "/compare": "compare",
    "/terms": "terms",
    "/velt": "velt",
    "/tradewise": "tradewise",
    "/easytrade": "easytrade",
  };

  if (isKeChartsHost()) return map[p] ?? null;

  if (p === "/ke" || p === "/go") return "home";
  const strip = p.replace(/^\/(ke|go)/, "") || "/";
  if (strip === "/" || strip === "") return "home";
  return map[strip] ?? null;
}

export function kePathFor(page: KePage): string {
  const leaf = page === "home" ? "" : `/${page === "how" ? "how" : page}`;
  if (typeof window !== "undefined" && isKeChartsHost()) return leaf || "/";
  return `/ke${leaf || ""}`;
}

export type KeVoteId = "velt" | "tradewise" | "easytrade";

const KE_VOTE_KEY = "ke_charts_votes";
const KE_VOTE_PICK_KEY = "ke_charts_my_vote";

/** Seed so bars look alive before local votes pile up. */
const KE_VOTE_SEED: Record<KeVoteId, number> = {
  velt: 128,
  tradewise: 74,
  easytrade: 61,
};

export type KeVoteState = {
  counts: Record<KeVoteId, number>;
  mine: KeVoteId | null;
  total: number;
};

function readLocalVotes(): Record<KeVoteId, number> {
  try {
    const raw = localStorage.getItem(KE_VOTE_KEY);
    if (!raw) return { velt: 0, tradewise: 0, easytrade: 0 };
    const data = JSON.parse(raw) as Partial<Record<KeVoteId, number>>;
    return {
      velt: Math.max(0, Number(data.velt) || 0),
      tradewise: Math.max(0, Number(data.tradewise) || 0),
      easytrade: Math.max(0, Number(data.easytrade) || 0),
    };
  } catch {
    return { velt: 0, tradewise: 0, easytrade: 0 };
  }
}

export function getKeVotes(): KeVoteState {
  const local = readLocalVotes();
  let mine: KeVoteId | null = null;
  try {
    const v = localStorage.getItem(KE_VOTE_PICK_KEY);
    if (v === "velt" || v === "tradewise" || v === "easytrade") mine = v;
  } catch {
    /* ignore */
  }
  const counts: Record<KeVoteId, number> = {
    velt: KE_VOTE_SEED.velt + local.velt,
    tradewise: KE_VOTE_SEED.tradewise + local.tradewise,
    easytrade: KE_VOTE_SEED.easytrade + local.easytrade,
  };
  return {
    counts,
    mine,
    total: counts.velt + counts.tradewise + counts.easytrade,
  };
}

/** One vote per browser; changing pick moves the vote. */
export function castKeVote(id: KeVoteId): KeVoteState {
  if (id !== "velt" && id !== "tradewise" && id !== "easytrade") return getKeVotes();
  const local = readLocalVotes();
  let mine: KeVoteId | null = null;
  try {
    const v = localStorage.getItem(KE_VOTE_PICK_KEY);
    if (v === "velt" || v === "tradewise" || v === "easytrade") mine = v;
  } catch {
    /* ignore */
  }
  if (mine === id) return getKeVotes();
  if (mine) local[mine] = Math.max(0, local[mine] - 1);
  local[id] = (local[id] ?? 0) + 1;
  try {
    localStorage.setItem(KE_VOTE_KEY, JSON.stringify(local));
    localStorage.setItem(KE_VOTE_PICK_KEY, id);
  } catch {
    /* ignore */
  }
  trackKeClick(id, "vote");
  return getKeVotes();
}

/** Only allow listed HTTPS desk / contact URLs to open. */
const KE_SAFE_HOSTS = new Set([
  "veltbinary.app",
  "www.veltbinary.app",
  "tradewisebinary.com",
  "www.tradewisebinary.com",
  "easytradebinary.com",
  "www.easytradebinary.com",
  "www.tiktok.com",
  "tiktok.com",
  "wa.me",
  "api.whatsapp.com",
]);

export function isSafeExternalUrl(raw: string): boolean {
  try {
    const u = new URL(raw);
    if (u.protocol !== "https:") return false;
    if (u.username || u.password) return false;
    return KE_SAFE_HOSTS.has(u.hostname.toLowerCase());
  } catch {
    return false;
  }
}

export function openSafeExternal(raw: string): boolean {
  if (!isSafeExternalUrl(raw)) return false;
  window.open(raw, "_blank", "noopener,noreferrer");
  return true;
}

export const KE_INDEX_PAGES: KePage[] = [
  "home",
  "compare",
  "velt",
  "tradewise",
  "easytrade",
  "how",
  "faq",
  "risk",
  "terms",
];

export function trackKeClick(platformId: string, source: string) {
  try {
    const key = "ke_charts_clicks";
    const raw = localStorage.getItem(key);
    const data = raw ? (JSON.parse(raw) as Record<string, number>) : {};
    const k = `${platformId}:${source}`;
    data[k] = (data[k] ?? 0) + 1;
    data._total = (data._total ?? 0) + 1;
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    /* ignore */
  }
  try {
    window.dispatchEvent(
      new CustomEvent("ke-charts-click", { detail: { platformId, source } }),
    );
  } catch {
    /* ignore */
  }
}

export function deskFromPage(page: KePage): TikTokPlatform | undefined {
  if (!isKeDeskPage(page)) return undefined;
  return platformById(page);
}

export const KE_FAQS: { q: string; a: string }[] = [
  {
    q: "What is KE Charts?",
    a: "KE Charts is a short link hub for Kenya’s top binary trading platforms. We list desks you can open in one tap — we don’t hold your money or place trades for you.",
  },
  {
    q: "Which platforms are listed?",
    a: "Right now: VELT, TradeWise, and EasyTrade. Each card opens the official site in a new tab.",
  },
  {
    q: "Do I create an account on KE Charts?",
    a: "No. You pick a desk, open it, and sign up on that platform’s own site.",
  },
  {
    q: "Is this free?",
    a: "Yes. KE Charts is free to use. Platforms may have their own deposits, fees, and rules after you open them.",
  },
  {
    q: "Can I deposit with M-Pesa?",
    a: "Funding depends on each platform. VELT supports M-Pesa cash. Check TradeWise and EasyTrade after you sign in for methods available in Kenya.",
  },
  {
    q: "Is trading risky?",
    a: "Yes. Binary and last-digit contracts can lose your stake. Only use money you can afford to lose. Read each platform’s risk disclosure before you fund.",
  },
  {
    q: "How do I know a desk is real?",
    a: "We only link to live sites we’ve reviewed. Always check the URL in your browser before you log in or deposit.",
  },
  {
    q: "Who do I contact for support?",
    a: "For account, deposit, or withdrawal help, use that platform’s support. KE Charts is a directory — we don’t manage balances on the desks we list.",
  },
];

export const KE_HOW_STEPS: { n: string; title: string; body: string }[] = [
  {
    n: "01",
    title: "Open KE Charts",
    body: "Land here from TikTok or kecharts.com. Three verified desks, ready to open.",
  },
  {
    n: "02",
    title: "Compare or pick",
    body: "Scan the cards, open Compare, or read a desk page — then tap Open.",
  },
  {
    n: "03",
    title: "Create on their site",
    body: "Sign up on the platform itself. Practice with virtual funds first when they offer it.",
  },
  {
    n: "04",
    title: "Fund when ready",
    body: "Deposit only when you understand the ticket and the risk. Withdraw through that desk’s cash options.",
  },
];

export const KE_COMPARE_ROWS: {
  label: string;
  key: keyof Pick<TikTokPlatform, "contracts" | "practice" | "mpesa" | "tools" | "signup" | "highlight">;
}[] = [
  { label: "Contracts", key: "contracts" },
  { label: "Practice", key: "practice" },
  { label: "M-Pesa / cash", key: "mpesa" },
  { label: "Tools", key: "tools" },
  { label: "Signup", key: "signup" },
  { label: "Best for", key: "highlight" },
];

export const KE_TERMS: { h: string; p: string }[] = [
  {
    h: "What KE Charts is",
    p: "KE Charts is a free directory website. We list and compare binary trading platforms for Kenya. We do not run a trading desk, hold deposits, or place trades for you.",
  },
  {
    h: "External sites",
    p: "When you tap Open, you leave KE Charts and use that platform’s own site, rules, and support. Always check the URL before you sign in or deposit.",
  },
  {
    h: "No advice",
    p: "Nothing on KE Charts is financial advice. Binary trading involves risk. You can lose money. Read each desk’s risk disclosure before you fund.",
  },
  {
    h: "Accuracy",
    p: "We try to keep desk details current from public pages and reviews. Features and payment methods can change — confirm on the platform itself.",
  },
  {
    h: "Contact",
    p: "For account or payment issues, contact the platform you opened. KE Charts only maintains this directory site.",
  },
];

