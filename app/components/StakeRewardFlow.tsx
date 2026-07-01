import { ArrowRight, BadgeDollarSign, Blocks, WalletCards } from "lucide-react";
import { POOL_BECH32, SPO_DELEGATE_URL } from "@/app/lib/constants";

export function StakeRewardFlow() {
  return (
    <div className="reward-flow-grid">
      <div className="glass-card panel reward-story">
        <div className="accent-bar" />
        <span className="label">Staking made visual</span>
        <h2>How 300 SPO can turn idle ADA into protocol rewards.</h2>
        <p className="copy-block">
          Your ADA stays in your wallet. You delegate its staking power to a
          pool, and when the pool mints blocks, Cardano calculates rewards for
          delegators. In this example, a 10% share receives about 10% of the
          delegator rewards after protocol and pool fees.
        </p>
        <div className="reward-story-points">
          <span>Self-custody: ADA never leaves your wallet</span>
          <span>Rewards are protocol-calculated</span>
          <span>Paid to your rewards account when available</span>
        </div>
        <div className="inline-actions">
          <a className="pill-link primary-action" href={SPO_DELEGATE_URL}>
            Delegate to 300 SPO
            <ArrowRight size={16} />
          </a>
          <span className="id-chip">Pool: {POOL_BECH32}</span>
        </div>
      </div>

      <div className="glass-card reward-visual-card" aria-label="Animated staking rewards example">
        <div className="reward-stage">
          <div className="reward-node reward-node-left">
            <Blocks size={26} />
            <span>Block minted</span>
          </div>
          <div className="reward-rail" aria-hidden>
            <span className="reward-block" />
            <span className="reward-coin reward-coin-one">₳</span>
            <span className="reward-coin reward-coin-two">₳</span>
            <span className="reward-coin reward-coin-three">₳</span>
          </div>
          <div className="reward-node reward-node-right">
            <WalletCards size={26} />
            <span>Your wallet</span>
          </div>
        </div>

        <div className="stake-share-panel">
          <div className="share-meter" aria-hidden>
            <span />
          </div>
          <div>
            <span className="label">Example stake share</span>
            <strong>10%</strong>
            <p>
              If your delegated stake is 10% of the total delegated stake, the
              reward share follows that proportion. Actual rewards vary by pool
              performance, parameters, fees, and stake size.
            </p>
          </div>
          <BadgeDollarSign className="reward-badge-icon" size={34} />
        </div>
      </div>
    </div>
  );
}
