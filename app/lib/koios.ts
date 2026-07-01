import {
  DREP_ID,
  NFT_POLICY_ID,
  POOL_BECH32,
  TOKEN_ID,
  TOKEN_NAME_HEX,
  TOKEN_POLICY_ID,
} from "./constants";

const KOIOS_BASE = "https://api.koios.rest/api/v1";
const MINSWAP_BASE = "https://api-mainnet-prod.minswap.org";
const NFT_COLLECTION_SIZE = 300;

type JsonRecord = Record<string, unknown>;

async function safeJson<T>(url: string, init?: RequestInit): Promise<T | null> {
  try {
    const response = await fetch(url, {
      ...init,
      cache: "no-store",
      headers: {
        accept: "application/json",
        ...(init?.headers ?? {}),
      },
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function postJson<T>(path: string, body: JsonRecord) {
  return safeJson<T>(`${KOIOS_BASE}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

function first<T>(value: T[] | null): T | null {
  return Array.isArray(value) && value.length > 0 ? value[0] : null;
}

function countUnique(values: Array<string | null | undefined>) {
  const set = new Set(values.filter(Boolean));
  return set.size || null;
}

export async function getMetrics() {
  const [
    tip,
    poolInfo,
    poolHistory,
    tokenInfo,
    tokenSummary,
    drepInfo,
    nftAssets,
    nftAddresses,
    tokenMinswap,
  ] = await Promise.all([
    safeJson<JsonRecord[]>(`${KOIOS_BASE}/tip`),
    postJson<JsonRecord[]>("/pool_info", {
      _pool_bech32_ids: [POOL_BECH32],
    }),
    safeJson<JsonRecord[]>(
      `${KOIOS_BASE}/pool_history?_pool_bech32=${POOL_BECH32}&limit=5`,
    ),
    postJson<JsonRecord[]>("/asset_info", {
      _asset_list: [[TOKEN_POLICY_ID, TOKEN_NAME_HEX]],
    }),
    safeJson<JsonRecord[]>(
      `${KOIOS_BASE}/asset_summary?_asset_policy=${TOKEN_POLICY_ID}&_asset_name=${TOKEN_NAME_HEX}`,
    ),
    postJson<JsonRecord[]>("/drep_info", { _drep_ids: [DREP_ID] }),
    safeJson<JsonRecord[]>(
      `${KOIOS_BASE}/policy_asset_list?_asset_policy=${NFT_POLICY_ID}&limit=1000`,
    ),
    safeJson<JsonRecord[]>(
      `${KOIOS_BASE}/policy_asset_addresses?_asset_policy=${NFT_POLICY_ID}&limit=1000`,
    ),
    safeJson<JsonRecord>(
      `${MINSWAP_BASE}/v1/assets/${TOKEN_ID}/metrics?currency=usd`,
    ),
  ]);

  const pool = first(poolInfo);
  const token = first(tokenInfo);
  const summary = first(tokenSummary);
  const drep = first(drepInfo);
  const latestTip = first(tip);
  const latestHistory = first(poolHistory);

  return {
    fetchedAt: new Date().toISOString(),
    chain: {
      epoch: latestTip?.epoch_no ?? null,
      blockHeight: latestTip?.block_height ?? null,
      blockTime: latestTip?.block_time ?? null,
    },
    pool: {
      ticker: (pool?.meta_json as JsonRecord | undefined)?.ticker ?? null,
      name: (pool?.meta_json as JsonRecord | undefined)?.name ?? null,
      status: pool?.pool_status ?? null,
      liveStake: pool?.live_stake ?? null,
      activeStake: pool?.active_stake ?? latestHistory?.active_stake ?? null,
      liveDelegators: pool?.live_delegators ?? null,
      liveSaturation: pool?.live_saturation ?? null,
      blockCount: pool?.block_count ?? null,
      pledge: pool?.pledge ?? null,
      fixedCost: pool?.fixed_cost ?? null,
      margin: pool?.margin ?? null,
      votingPower: pool?.voting_power ?? null,
      relayCount: Array.isArray(pool?.relays) ? pool.relays.length : null,
      latestEpochBlocks: latestHistory?.block_cnt ?? null,
    },
    token: {
      name:
        (token?.token_registry_metadata as JsonRecord | undefined)?.name ??
        token?.asset_name_ascii ??
        null,
      ticker:
        (token?.token_registry_metadata as JsonRecord | undefined)?.ticker ??
        null,
      fingerprint: token?.fingerprint ?? null,
      totalSupply: token?.total_supply ?? null,
      mintCount: token?.mint_cnt ?? null,
      burnCount: token?.burn_cnt ?? null,
      holders: summary?.addresses ?? null,
      stakedWallets: summary?.staked_wallets ?? null,
      transactions: summary?.total_transactions ?? null,
      priceUsd: tokenMinswap?.price ?? null,
      liquidityUsd: tokenMinswap?.liquidity ?? null,
      volume24hUsd: tokenMinswap?.volume_24h ?? null,
      priceChange24h: tokenMinswap?.price_change_24h ?? null,
    },
    nft: {
      policyId: NFT_POLICY_ID,
      assetCount: Array.isArray(nftAssets) ? NFT_COLLECTION_SIZE : null,
      supply: Array.isArray(nftAssets) ? NFT_COLLECTION_SIZE : null,
      holderCount: Array.isArray(nftAddresses)
        ? countUnique(
            nftAddresses.map((row) =>
              typeof row.stake_address === "string" ? row.stake_address : null,
            ),
          )
        : null,
    },
    drep: {
      id: drep?.drep_id ?? null,
      status: drep?.drep_status ?? null,
      active: drep?.active ?? null,
      votingPower: drep?.amount ?? null,
      expiresEpoch: drep?.expires_epoch_no ?? null,
      deposit: drep?.deposit ?? null,
      metadataUrl: drep?.meta_url ?? null,
    },
  };
}
