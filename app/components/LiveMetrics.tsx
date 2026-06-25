"use client";

import { useEffect, useMemo, useState } from "react";
import {
  formatAda,
  formatDate,
  formatNumber,
  formatPercent,
  formatUsd,
} from "@/app/lib/format";

type Metrics = {
  fetchedAt?: string;
  chain?: { epoch?: unknown; blockHeight?: unknown; blockTime?: unknown };
  pool?: Record<string, unknown>;
  token?: Record<string, unknown>;
  nft?: Record<string, unknown>;
  drep?: Record<string, unknown>;
};

type Price = {
  adaUsd?: unknown;
  change24h?: unknown;
};

function MetricCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <article className="metric-card">
      <div className="accent-bar" />
      <span className="label">{label}</span>
      <strong className="metric-value">{value}</strong>
      {sub ? <p className="metric-sub">{sub}</p> : null}
    </article>
  );
}

async function getJson<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      return null;
    }
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export function LiveTicker() {
  const [price, setPrice] = useState<Price | null>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  useEffect(() => {
    let alive = true;

    async function refresh() {
      const [priceData, metricData] = await Promise.all([
        getJson<Price>("/api/price"),
        getJson<Metrics>("/api/metrics"),
      ]);

      if (!alive) {
        return;
      }

      setPrice(priceData);
      setMetrics(metricData);
    }

    refresh();
    const interval = window.setInterval(refresh, 60_000);

    return () => {
      alive = false;
      window.clearInterval(interval);
    };
  }, []);

  return (
    <aside className="ticker-glass" aria-label="Live Cardano snapshot">
      <div className="ticker-row">
        <span className="label">ADA / USD</span>
        <strong className="value">{formatUsd(price?.adaUsd)}</strong>
      </div>
      <div className="ticker-row">
        <span className="label">ADA 24h</span>
        <strong className="value">{formatPercent(price?.change24h)}</strong>
      </div>
      <div className="ticker-row">
        <span className="label">300 price</span>
        <strong className="value">{formatUsd(metrics?.token?.priceUsd)}</strong>
      </div>
      <div className="ticker-row">
        <span className="label">Chain tip</span>
        <strong className="value">
          {formatNumber(metrics?.chain?.blockHeight, { maximumFractionDigits: 0 })}
        </strong>
      </div>
    </aside>
  );
}

export function MetricsGrid() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  useEffect(() => {
    let alive = true;

    async function refresh() {
      const metricData = await getJson<Metrics>("/api/metrics");
      if (alive) {
        setMetrics(metricData);
      }
    }

    refresh();
    const interval = window.setInterval(refresh, 90_000);

    return () => {
      alive = false;
      window.clearInterval(interval);
    };
  }, []);

  const cards = useMemo(
    () => [
      {
        label: "SPO live stake",
        value: formatAda(metrics?.pool?.liveStake),
        sub: `${formatNumber(metrics?.pool?.liveDelegators)} delegators`,
      },
      {
        label: "SPO blocks",
        value: formatNumber(metrics?.pool?.blockCount),
        sub: `Saturation ${formatPercent(metrics?.pool?.liveSaturation)}`,
      },
      {
        label: "300 holders",
        value: formatNumber(metrics?.token?.holders),
        sub: `${formatNumber(metrics?.token?.transactions)} asset txs`,
      },
      {
        label: "300 supply",
        value: formatNumber(metrics?.token?.totalSupply),
        sub: `Liquidity ${formatUsd(metrics?.token?.liquidityUsd)}`,
      },
      {
        label: "300 Degens NFTs",
        value: formatNumber(metrics?.nft?.assetCount),
        sub: `${formatNumber(metrics?.nft?.holderCount)} holders`,
      },
      {
        label: "DRep voting power",
        value: formatAda(metrics?.drep?.votingPower),
        sub: `Status ${metrics?.drep?.status ?? "-"}`,
      },
      {
        label: "DRep expiry epoch",
        value: formatNumber(metrics?.drep?.expiresEpoch),
        sub: `Deposit ${formatAda(metrics?.drep?.deposit)}`,
      },
      {
        label: "Latest block time",
        value: formatDate(metrics?.chain?.blockTime),
        sub: `Epoch ${formatNumber(metrics?.chain?.epoch)}`,
      },
    ],
    [metrics],
  );

  return (
    <div className="grid metrics-grid">
      {cards.map((card) => (
        <MetricCard key={card.label} {...card} />
      ))}
    </div>
  );
}

