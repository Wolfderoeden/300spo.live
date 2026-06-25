"use client";

import { useEffect, useMemo, useState } from "react";
import type { ComponentType } from "react";
import { ArrowUpRight, PlugZap, Wallet } from "lucide-react";
import {
  MINSWAP_PARTNER_CODE,
  PAYPAL_ADA_URL,
  TOKEN_ID,
} from "@/app/lib/constants";

type Cip30WalletApi = {
  getUnusedAddresses: () => Promise<string[]>;
  getUsedAddresses: () => Promise<string[]>;
  signTx: (tx: string, partialSign?: boolean) => Promise<string>;
};

type CardanoWallet = {
  name?: string;
  icon?: string;
  enable: () => Promise<Cip30WalletApi>;
};

type MinswapWallet = Cip30WalletApi & { id: string };

declare global {
  interface Window {
    cardano?: Record<string, CardanoWallet | undefined>;
  }
}

function readWallets(): Array<[string, CardanoWallet]> {
  if (typeof window === "undefined") {
    return [];
  }

  return Object.entries(window.cardano ?? {}).filter(
    (entry): entry is [string, CardanoWallet] =>
      Boolean(entry[1]?.enable && entry[1]),
  );
}

export function TradePanel() {
  const [wallets, setWallets] = useState<Array<[string, CardanoWallet]>>(() =>
    readWallets(),
  );
  const [connectedWallet, setConnectedWallet] = useState<MinswapWallet | null>(
    null,
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [Widget, setWidget] = useState<ComponentType<{
    partnerCode: string;
    defaultAsset: string;
    selectableAssets: string[];
    displayMode: "full" | "button";
    wallet?: MinswapWallet;
  }> | null>(null);

  useEffect(() => {
    const walletTimer = window.setTimeout(() => {
      setWallets(readWallets());
    }, 0);

    import("@minswap/aggregator-widget")
      .then((module) => {
        setWidget(() => module.Widget);
      })
      .catch(() => {
        setWidget(null);
      });

    return () => {
      window.clearTimeout(walletTimer);
    };
  }, []);

  async function connect(id: string, wallet: CardanoWallet) {
    const api = await wallet.enable();
    setSelectedId(id);
    setConnectedWallet({ ...api, id });
  }

  const walletLabel = useMemo(() => {
    if (!selectedId) {
      return wallets.length ? "Choose a CIP-30 wallet" : "No CIP-30 wallet found";
    }

    return `Connected: ${wallets.find(([id]) => id === selectedId)?.[1].name ?? selectedId}`;
  }, [selectedId, wallets]);

  return (
    <div className="trade-shell">
      <div className="glass-card panel">
        <div className="accent-bar" />
        <span className="label">CIP-30 connection</span>
        <h3 className="mt-3 text-2xl font-bold text-white">Wallet + ADA access</h3>
        <p className="copy-block mt-3">
          Connect a Cardano wallet for trading, or use the PayPal checkout for
          the 100 USD ADA purchase route.
        </p>
        <div className="wallet-list">
          {wallets.length ? (
            wallets.map(([id, wallet]) => (
              <button
                className="wallet-button"
                type="button"
                key={id}
                onClick={() => connect(id, wallet)}
                title={`Connect ${wallet.name ?? id}`}
              >
                <Wallet size={16} />
                {wallet.name ?? id}
              </button>
            ))
          ) : (
            <span className="fallback-mark">-</span>
          )}
        </div>
        <p className="wallet-status">
          <PlugZap size={15} aria-hidden /> {walletLabel}
        </p>
        <a
          className="pill-link primary-action mt-5"
          href={PAYPAL_ADA_URL}
          target="_blank"
          rel="noreferrer"
        >
          Buy ADA with PayPal
          <ArrowUpRight size={16} />
        </a>
      </div>

      <div className="glass-card widget-frame">
        {Widget ? (
          <Widget
            partnerCode={MINSWAP_PARTNER_CODE}
            defaultAsset={TOKEN_ID}
            selectableAssets={["lovelace", TOKEN_ID]}
            displayMode="full"
            wallet={connectedWallet ?? undefined}
          />
        ) : (
          <div className="widget-loading">-</div>
        )}
      </div>
    </div>
  );
}
