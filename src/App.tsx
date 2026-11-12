import { useEffect, useState } from "react";
import { KeChartsSite } from "./components/KeChartsSite";
import { kePageFromPath, kePathFor, type KePage } from "./lib/keCharts";

function readPage(): KePage {
  return kePageFromPath(window.location.pathname) ?? "home";
}

export default function App() {
  const [page, setPage] = useState<KePage>(() =>
    typeof window !== "undefined" ? readPage() : "home",
  );

  useEffect(() => {
    const onPop = () => setPage(readPage());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const onNavigate = (next: KePage) => {
    const path = kePathFor(next);
    if (window.location.pathname !== path) {
      window.history.pushState({ page: next }, "", path);
    }
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return <KeChartsSite page={page} onNavigate={onNavigate} />;
}
