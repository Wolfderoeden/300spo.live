"use client";

import { ChevronDown, Copy, Terminal, Wallet } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

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

declare global {
  interface Window {
    cardano?: Record<string, CardanoWallet | undefined>;
  }
}

const cliCommands = [
  "cardano-cli address key-gen --verification-key-file payment.vkey --signing-key-file payment.skey",
  "cardano-cli stake-address key-gen --verification-key-file stake.vkey --signing-key-file stake.skey",
  "cardano-cli address build --payment-verification-key-file payment.vkey --stake-verification-key-file stake.vkey --mainnet --out-file payment.addr",
];

function readWallets(): Array<[string, CardanoWallet]> {
  if (typeof window === "undefined") {
    return [];
  }

  return Object.entries(window.cardano ?? {}).filter(
    (entry): entry is [string, CardanoWallet] =>
      Boolean(entry[1]?.enable && entry[1]),
  );
}

export function WalletConnectButton() {
  const [open, setOpen] = useState(false);
  const [wallets, setWallets] = useState<Array<[string, CardanoWallet]>>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    function refresh() {
      setWallets(readWallets());
    }

    refresh();
    window.addEventListener("focus", refresh);

    return () => {
      window.removeEventListener("focus", refresh);
    };
  }, []);

  async function connect(id: string, wallet: CardanoWallet) {
    setMessage("");

    try {
      await wallet.enable();
      setSelectedId(id);
      setOpen(false);
    } catch {
      setMessage("Connection was cancelled.");
    }
  }

  async function copyCliCommands() {
    await navigator.clipboard.writeText(cliCommands.join("\n"));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  const label = useMemo(() => {
    if (selectedId) {
      return wallets.find(([id]) => id === selectedId)?.[1].name ?? selectedId;
    }

    return wallets.length ? "Connect wallet" : "Wallet setup";
  }, [selectedId, wallets]);

  return (
    <div className="wallet-connect">
      <button
        aria-expanded={open}
        className="wallet-connect-button"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <Wallet size={16} />
        <span>{label}</span>
        <ChevronDown size={15} />
      </button>

      {open ? (
        <div className="wallet-menu">
          {wallets.length ? (
            <>
              <span className="wallet-menu-label">Available wallets</span>
              <div className="wallet-menu-list">
                {wallets.map(([id, wallet]) => (
                  <button
                    key={id}
                    onClick={() => connect(id, wallet)}
                    type="button"
                  >
                    <Wallet size={15} />
                    {wallet.name ?? id}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="wallet-empty">
              <span className="wallet-menu-label">No browser wallet found</span>
              <p>
                Install a Cardano browser wallet, or create a self-custody wallet
                with Cardano CLI if you prefer managing keys yourself.
              </p>
            </div>
          )}

          <div className="cli-wallet-box">
            <div className="cli-wallet-head">
              <Terminal size={16} />
              <strong>Create with Cardano CLI</strong>
            </div>
            <p>
              Generate keys locally, keep signing keys offline, and never paste
              private keys into a website.
            </p>
            <pre>
              {cliCommands.map((command) => (
                <code key={command}>{command}</code>
              ))}
            </pre>
            <button className="copy-cli-button" onClick={copyCliCommands} type="button">
              <Copy size={15} />
              {copied ? "Copied" : "Copy commands"}
            </button>
          </div>

          {message ? <p className="wallet-message">{message}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
