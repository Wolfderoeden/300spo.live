"use client";

import { Widget } from "@minswap/aggregator-widget";
import "@minswap/aggregator-widget/index.css";
import { ArrowUpRight, CreditCard, Repeat2 } from "lucide-react";
import { CARDANOMIX_URL, MINSWAP_PARTNER_CODE } from "@/app/lib/constants";

export function TradePanel() {
  return (
    <div className="trade-shell">
      <div className="glass-card panel trade-intro-panel">
        <div className="accent-bar" />
        <span className="label">Buy and swap</span>
        <h3>ADA first, 300 when ready.</h3>
        <p className="copy-block">
          New to Cardano? Start by getting ADA through CardanoMix, then use the
          swap panel to explore 300 without leaving the site.
        </p>
        <div className="trade-benefits">
          <span>
            <CreditCard size={16} />
            ADA access through CardanoMix
          </span>
          <span>
            <Repeat2 size={16} />
            300 swaps through Minswap
          </span>
        </div>
        <a
          className="pill-link primary-action"
          href={CARDANOMIX_URL}
          target="_blank"
          rel="noreferrer"
        >
          Buy ADA on CardanoMix
          <ArrowUpRight size={16} />
        </a>
      </div>

      <div className="glass-card widget-frame">
        <Widget displayMode={"full"} partnerCode={MINSWAP_PARTNER_CODE} />
      </div>
    </div>
  );
}
