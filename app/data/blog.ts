export const blogPosts = [
  {
    slug: "300-cardano-hub",
    title: "300 Cardano hub",
    date: "2026-06-25",
    excerpt:
      "300 brings the token, 300 NFTs, staking, governance, swaps, and Cardano discovery into one readable home.",
    body: [
      "This first post anchors the site around four live surfaces: the 300 native token, the 300 NFT collection, the 300 stake pool, and the registered DRep identity.",
      "The site is wired for real data. On-chain metrics come from Cardano query APIs, trading routes through Minswap, and missing values show as a simple dash.",
      "More long-form posts can cover pool updates, governance notes, token releases, NFT drops, and practical Cardano guides for visitors who are not already deep in crypto.",
    ],
  },
];

export type BlogPost = (typeof blogPosts)[number];
