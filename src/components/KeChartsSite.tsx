import { useEffect, useState, type MouseEvent } from "react";
import {
  KE_BRAND,
  KE_COMPARE_ROWS,
  KE_FAQS,
  KE_HOW_STEPS,
  KE_ORIGIN,
  KE_TERMS,
  KE_TIKTOK,
  castKeVote,
  deskFromPage,
  getKeVotes,
  isKeDeskPage,
  kePathFor,
  openSafeExternal,
  trackKeClick,
  type KePage,
  type KeVoteId,
  type KeVoteState,
} from "../lib/keCharts";
import {
  TIKTOK_LANDING_HEADLINE,
  TIKTOK_LANDING_SUB,
  TIKTOK_PLATFORMS,
  type TikTokPlatform,
} from "../lib/tiktokPlatforms";
import "../tiktok.css";

type Props = {
  page: KePage;
  onNavigate: (page: KePage) => void;
};

const KE_ICON = "/ke/favicon.svg";
const KE_OG = "/ke/og.svg";
const KE_THEME_KEY = "ke-charts-theme";
type KeTheme = "light" | "dark";

function LogoMark({ className }: { className?: string }) {
  return (
    <span className={className ? `tg__logo ${className}` : "tg__logo"} aria-hidden="true">
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect className="tg__logo-bg" width="32" height="32" rx="8" fill="#111315" />
        <rect x="5" y="18" width="4.5" height="9" rx="1.2" fill="#fff" />
        <rect x="11.5" y="12" width="4.5" height="15" rx="1.2" fill="#fff" />
        <rect x="18" y="7" width="4.5" height="20" rx="1.2" fill="#fff" />
        <rect x="24.5" y="14" width="2.5" height="13" rx="1" fill="#fff" opacity="0.35" />
      </svg>
    </span>
  );
}

function readTheme(): KeTheme {
  try {
    const v = localStorage.getItem(KE_THEME_KEY);
    if (v === "dark" || v === "light") return v;
  } catch {
    /* ignore */
  }
  return "light";
}

const PAGE_META: Record<KePage, { title: string; desc: string }> = {
  home: {
    title: "KE Charts — Kenya’s top binary desks",
    desc: "Experience Kenya’s top binary trading platforms. Pick a desk and open in one tap.",
  },
  faq: {
    title: "FAQ — KE Charts",
    desc: "Straight answers about KE Charts, listed platforms, M-Pesa, and risk.",
  },
  how: {
    title: "How it works — KE Charts",
    desc: "How to pick a desk on KE Charts and open a binary platform in Kenya.",
  },
  risk: {
    title: "Risk — KE Charts",
    desc: "Binary trading involves risk. Read this before you fund any desk.",
  },
  compare: {
    title: "Compare desks — KE Charts",
    desc: "Side-by-side compare VELT, TradeWise, and EasyTrade for Kenya traders.",
  },
  terms: {
    title: "Terms — KE Charts",
    desc: "Terms for the KE Charts directory website only.",
  },
  velt: {
    title: "VELT — KE Charts",
    desc: "Open VELT Binary — Kenya’s #1 digit desk with AI scan and M-Pesa.",
  },
  tradewise: {
    title: "TradeWise — KE Charts",
    desc: "Open TradeWise Binary — Even/Odd, Match/Differ, Over/Under on one ticket.",
  },
  easytrade: {
    title: "EasyTrade — KE Charts",
    desc: "Open EasyTrade Binary — simple last-digit desk with practice funds.",
  },
};

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

function setIcon(rel: string, href: string, type?: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
  if (type) el.type = type;
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = href;
}

function setJsonLd(id: string, data: Record<string, unknown>) {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

export function KeChartsSite({ page, onNavigate }: Props) {
  const [theme, setTheme] = useState<KeTheme>(() =>
    typeof window !== "undefined" ? readTheme() : "light",
  );

  useEffect(() => {
    try {
      localStorage.setItem(KE_THEME_KEY, theme);
    } catch {
      /* ignore */
    }
    setMeta("name", "theme-color", theme === "dark" ? "#0b0c0e" : "#f2f3f5");
  }, [theme]);

  useEffect(() => {
    const meta = PAGE_META[page];
    const prevTitle = document.title;
    const path = kePathFor(page);
    const ogUrl = path === "/" ? `${KE_ORIGIN}/` : `${KE_ORIGIN}${path}`;
    document.title = meta.title;
    setIcon("icon", KE_ICON, "image/svg+xml");
    setIcon("apple-touch-icon", KE_ICON);
    setIcon("shortcut icon", KE_ICON);
    setCanonical(ogUrl);
    setMeta("name", "description", meta.desc);
    setMeta("name", "robots", "index, follow, max-image-preview:large, max-snippet:-1");
    setMeta("name", "application-name", KE_BRAND);
    setMeta("name", "apple-mobile-web-app-title", KE_BRAND);
    setMeta("name", "theme-color", theme === "dark" ? "#0b0c0e" : "#f2f3f5");
    setMeta("property", "og:title", meta.title);
    setMeta("property", "og:description", meta.desc);
    setMeta("property", "og:site_name", KE_BRAND);
    setMeta("property", "og:url", ogUrl);
    setMeta("property", "og:image", `${KE_ORIGIN}${KE_OG}`);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:locale", "en_KE");
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", meta.title);
    setMeta("name", "twitter:description", meta.desc);
    setMeta("name", "twitter:image", `${KE_ORIGIN}${KE_OG}`);

    setJsonLd("ke-ld-website", {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: KE_BRAND,
      url: KE_ORIGIN,
      description: PAGE_META.home.desc,
      inLanguage: "en-KE",
      potentialAction: {
        "@type": "ViewAction",
        target: `${KE_ORIGIN}/compare`,
      },
    });

    setJsonLd("ke-ld-list", {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Kenya binary trading platforms",
      itemListElement: TIKTOK_PLATFORMS.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: p.name,
        url: `${KE_ORIGIN}${kePathFor(p.id)}`,
        description: p.tagline,
      })),
    });

    setJsonLd("ke-ld-breadcrumb", {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: KE_ORIGIN },
        ...(page === "home"
          ? []
          : [
              {
                "@type": "ListItem",
                position: 2,
                name: meta.title.split(" — ")[0] || meta.title,
                item: ogUrl,
              },
            ]),
      ],
    });

    return () => {
      document.title = prevTitle;
    };
  }, [page, theme]);

  const go = (next: KePage) => (e: MouseEvent) => {
    e.preventDefault();
    onNavigate(next);
  };

  const openDesk = (p: TikTokPlatform, source: string) => {
    trackKeClick(p.id, source);
    openSafeExternal(p.href);
  };

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return (
    <div className="tg" data-theme={theme}>
      <div className="tg__shell">
        <header className="tg__topbar">
          <a className="tg__nav-brand" href={kePathFor("home")} onClick={go("home")}>
            <LogoMark className="tg__logo--nav" />
            {KE_BRAND}
          </a>
          <div className="tg__topbar-end">
            <nav className="tg__nav-links" aria-label="KE Charts">
              <a href={kePathFor("compare")} className={page === "compare" ? "is-on" : undefined} onClick={go("compare")}>
                Compare
              </a>
              <a href={kePathFor("how")} className={page === "how" ? "is-on" : undefined} onClick={go("how")}>
                How
              </a>
              <a href={kePathFor("faq")} className={page === "faq" ? "is-on" : undefined} onClick={go("faq")}>
                FAQ
              </a>
              <a href={kePathFor("risk")} className={page === "risk" ? "is-on" : undefined} onClick={go("risk")}>
                Risk
              </a>
            </nav>
            <button
              type="button"
              className="tg__theme"
              data-mode={theme}
              onClick={toggleTheme}
              aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
              aria-pressed={theme === "dark"}
            >
              <span className="tg__theme-track" aria-hidden="true">
                <span className="tg__theme-knob">
                  {theme === "light" ? (
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
                      <circle cx="12" cy="12" r="4" fill="currentColor" />
                      <path
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
                      />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                      <path d="M21 14.3A8.5 8.5 0 0 1 9.7 3 7 7 0 1 0 21 14.3z" />
                    </svg>
                  )}
                </span>
              </span>
            </button>
          </div>
        </header>

        {page === "home" ? <Home onNavigate={onNavigate} openDesk={openDesk} /> : null}
        {page === "faq" ? <Faq /> : null}
        {page === "how" ? <How /> : null}
        {page === "risk" ? <Risk /> : null}
        {page === "compare" ? <Compare openDesk={openDesk} onNavigate={onNavigate} /> : null}
        {page === "terms" ? <Terms /> : null}
        {isKeDeskPage(page) ? (
          <DeskDetail
            desk={deskFromPage(page)!}
            openDesk={openDesk}
            onBack={() => onNavigate("home")}
          />
        ) : null}

        <footer className="tg__foot">
          <div className="tg__foot-brand">
            <LogoMark className="tg__logo--foot" />
            <div>
              <strong>{KE_BRAND}</strong>
              <span>Kenya’s curated binary desks</span>
            </div>
          </div>
          <div className="tg__foot-grid">
            <div>
              <em>Desks</em>
              {TIKTOK_PLATFORMS.map((p) => (
                <a key={p.id} href={kePathFor(p.id)} onClick={go(p.id)}>
                  {p.name}
                </a>
              ))}
            </div>
            <div>
              <em>Guide</em>
              <a href={kePathFor("compare")} onClick={go("compare")}>
                Compare
              </a>
              <a href={kePathFor("how")} onClick={go("how")}>
                How it works
              </a>
              <a href={kePathFor("faq")} onClick={go("faq")}>
                FAQ
              </a>
              <a href={kePathFor("risk")} onClick={go("risk")}>
                Risk
              </a>
            </div>
            <div>
              <em>Legal</em>
              <a href={kePathFor("terms")} onClick={go("terms")}>
                Terms
              </a>
              <a href={kePathFor("risk")} onClick={go("risk")}>
                Risk warning
              </a>
            </div>
          </div>
          <p className="tg__foot-note">Trading involves risk. You can lose money. KE Charts is a directory — not a broker.</p>
        </footer>
      </div>

      <aside className="tg__tiktok" aria-label="TikTok">
        <div className="tg__tiktok-inner">
          <span>From TikTok? Pick a desk below — or compare first.</span>
          <div className="tg__tiktok-actions">
            <a href={kePathFor("compare")} onClick={go("compare")}>
              Compare
            </a>
            <a
              href={KE_TIKTOK}
              target="_blank"
              rel="noopener noreferrer nofollow"
              referrerPolicy="strict-origin-when-cross-origin"
              onClick={(e) => {
                e.preventDefault();
                trackKeClick("tiktok", "sticky");
                openSafeExternal(KE_TIKTOK);
              }}
            >
              TikTok
            </a>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Home({
  onNavigate,
  openDesk,
}: {
  onNavigate: (page: KePage) => void;
  openDesk: (p: TikTokPlatform, source: string) => void;
}) {
  return (
    <>
      <header className="tg__header">
        <h1 className="tg__brand">{KE_BRAND}</h1>
        <p className="tg__headline">{TIKTOK_LANDING_HEADLINE}</p>
        <p className="tg__sub">{TIKTOK_LANDING_SUB}</p>
        <div className="tg__header-actions">
          <a
            className="tg__btn tg__btn--dark"
            href={kePathFor("compare")}
            onClick={(e) => {
              e.preventDefault();
              onNavigate("compare");
            }}
          >
            Compare desks
          </a>
          <a
            className="tg__btn tg__btn--ghost"
            href={kePathFor("how")}
            onClick={(e) => {
              e.preventDefault();
              onNavigate("how");
            }}
          >
            How it works
          </a>
        </div>
      </header>

      <ol className="tg__links">
        {TIKTOK_PLATFORMS.map((p) => (
          <li key={p.id}>
            <div className="tg__link">
              <button type="button" className="tg__shot-btn" onClick={() => openDesk(p, "home-card")}>
                <img className="tg__shot" src={p.image} alt="" loading="lazy" />
              </button>
              <span className="tg__body">
                <span className="tg__copy">
                  {p.badge ? <span className="tg__badge">{p.badge}</span> : null}
                  <strong>{p.name}</strong>
                  <span className="tg__tagline">{p.tagline}</span>
                </span>
                <span className="tg__actions">
                  <a
                    className="tg__more"
                    href={kePathFor(p.id)}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(p.id);
                    }}
                  >
                    Details
                  </a>
                  <button type="button" className="tg__go" onClick={() => openDesk(p, "home-open")}>
                    Open
                  </button>
                </span>
              </span>
            </div>
          </li>
        ))}
      </ol>

      <Vote />
    </>
  );
}

function Vote() {
  const [votes, setVotes] = useState<KeVoteState>(() =>
    typeof window !== "undefined"
      ? getKeVotes()
      : {
          counts: { velt: 0, tradewise: 0, easytrade: 0 },
          mine: null,
          total: 0,
        },
  );

  useEffect(() => {
    setVotes(getKeVotes());
  }, []);

  const onVote = (id: KeVoteId) => setVotes(castKeVote(id));

  const ranked = [...TIKTOK_PLATFORMS].sort(
    (a, b) => votes.counts[b.id] - votes.counts[a.id],
  );

  return (
    <>
      <section className="tg__vote" aria-labelledby="ke-vote-title">
        <header className="tg__vote-head">
          <h2 id="ke-vote-title">Community pick</h2>
          <p>
            Which desk is best? · {votes.total.toLocaleString()} votes
            {votes.mine
              ? ` · You chose ${TIKTOK_PLATFORMS.find((x) => x.id === votes.mine)?.name}`
              : ""}
          </p>
        </header>
        <ul className="tg__vote-list">
          {ranked.map((p) => {
            const n = votes.counts[p.id];
            const pct = votes.total > 0 ? Math.round((n / votes.total) * 100) : 0;
            const picked = votes.mine === p.id;
            return (
              <li key={p.id}>
                <button
                  type="button"
                  className={`tg__vote-row${picked ? " is-picked" : ""}`}
                  onClick={() => onVote(p.id)}
                  aria-pressed={picked}
                >
                  <span className="tg__vote-fill" style={{ width: `${pct}%` }} aria-hidden="true" />
                  <span className="tg__vote-label">
                    {picked ? <span className="tg__vote-check" aria-hidden="true" /> : null}
                    {p.name}
                  </span>
                  <span className="tg__vote-pct">{pct}%</span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <aside className="tg__credit">
        <p>
          Made by developer <strong>Josh</strong>
        </p>
        <a
          href="https://wa.me/447470413701"
          target="_blank"
          rel="noopener noreferrer"
          referrerPolicy="no-referrer"
          onClick={(e) => {
            e.preventDefault();
            trackKeClick("josh", "whatsapp");
            openSafeExternal("https://wa.me/447470413701");
          }}
        >
          WhatsApp +44 7470 413701
        </a>
      </aside>
    </>
  );
}

function Compare({
  openDesk,
  onNavigate,
}: {
  openDesk: (p: TikTokPlatform, source: string) => void;
  onNavigate: (page: KePage) => void;
}) {
  return (
    <section className="tg__page">
      <header className="tg__page-head">
        <h1>Compare</h1>
        <p>Side-by-side — pick what fits, then open.</p>
      </header>
      <div className="tg__compare-wrap">
        <table className="tg__compare">
          <thead>
            <tr>
              <th scope="col"> </th>
              {TIKTOK_PLATFORMS.map((p) => (
                <th key={p.id} scope="col">
                  {p.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {KE_COMPARE_ROWS.map((row) => (
              <tr key={row.key}>
                <th scope="row">{row.label}</th>
                {TIKTOK_PLATFORMS.map((p) => (
                  <td key={p.id}>{p[row.key]}</td>
                ))}
              </tr>
            ))}
            <tr>
              <th scope="row">Open</th>
              {TIKTOK_PLATFORMS.map((p) => (
                <td key={p.id}>
                  <button type="button" className="tg__go tg__go--sm" onClick={() => openDesk(p, "compare")}>
                    Open
                  </button>
                  <a
                    className="tg__more"
                    href={kePathFor(p.id)}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(p.id);
                    }}
                  >
                    Details
                  </a>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

function DeskDetail({
  desk,
  openDesk,
  onBack,
}: {
  desk: TikTokPlatform;
  openDesk: (p: TikTokPlatform, source: string) => void;
  onBack: () => void;
}) {
  return (
    <section className="tg__page">
      <button type="button" className="tg__back" onClick={onBack}>
        ← All desks
      </button>
      <img className="tg__desk-hero" src={desk.image} alt="" />
      <header className="tg__page-head">
        {desk.badge ? <span className="tg__badge">{desk.badge}</span> : null}
        <h1>{desk.name}</h1>
        <p>{desk.blurb}</p>
      </header>
      <ul className="tg__points">
        {desk.points.map((pt) => (
          <li key={pt}>{pt}</li>
        ))}
      </ul>
      <dl className="tg__facts">
        <div>
          <dt>Contracts</dt>
          <dd>{desk.contracts}</dd>
        </div>
        <div>
          <dt>Practice</dt>
          <dd>{desk.practice}</dd>
        </div>
        <div>
          <dt>M-Pesa / cash</dt>
          <dd>{desk.mpesa}</dd>
        </div>
        <div>
          <dt>Tools</dt>
          <dd>{desk.tools}</dd>
        </div>
        <div>
          <dt>Signup</dt>
          <dd>{desk.signup}</dd>
        </div>
      </dl>
      <button type="button" className="tg__go tg__go--wide" onClick={() => openDesk(desk, "desk-page")}>
        Open {desk.name}
      </button>
    </section>
  );
}

function Faq() {
  return (
    <section className="tg__page">
      <header className="tg__page-head">
        <h1>FAQ</h1>
        <p>Straight answers before you open a desk.</p>
      </header>
      <div className="tg__faq">
        {KE_FAQS.map((item) => (
          <details key={item.q} className="tg__faq-item">
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function How() {
  return (
    <section className="tg__page">
      <header className="tg__page-head">
        <h1>How it works</h1>
        <p>Four steps from this link to a live desk.</p>
      </header>
      <ol className="tg__steps">
        {KE_HOW_STEPS.map((s) => (
          <li key={s.n} className="tg__step">
            <em>{s.n}</em>
            <strong>{s.title}</strong>
            <p>{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Risk() {
  return (
    <section className="tg__page">
      <header className="tg__page-head">
        <h1>Risk</h1>
        <p>Read this before you fund any platform.</p>
      </header>
      <div className="tg__prose">
        <p>
          Binary and last-digit trading involves significant risk. You can lose your entire stake on a
          contract. Past results do not guarantee future outcomes.
        </p>
        <p>
          KE Charts is a directory. We do not hold deposits, execute trades, or guarantee any platform’s
          payouts, uptime, or support. Always verify the URL and read that site’s own terms and risk
          disclosure.
        </p>
        <p>
          Only trade with money you can afford to lose. If you are unsure, practise with virtual funds
          first — or do not trade.
        </p>
      </div>
    </section>
  );
}

function Terms() {
  return (
    <section className="tg__page">
      <header className="tg__page-head">
        <h1>Terms</h1>
        <p>These terms apply only to the KE Charts website.</p>
      </header>
      <div className="tg__prose">
        {KE_TERMS.map((block) => (
          <div key={block.h}>
            <h2 className="tg__prose-h">{block.h}</h2>
            <p>{block.p}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
