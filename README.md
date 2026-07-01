# 300

Cardano website for the 300 ecosystem at `300spo.live`.

## What Is Included

- 300 token and 300 Degens NFT collection presentation
- 300 SPO live metrics
- DRep profile with delegated ADA shown from on-chain data
- ADA/USD ticker
- Minswap trading widget with top-bar CIP-30 wallet connection
- CardanoMix ADA entry link
- Automatic Cardano news
- Blog and editable content pages
- Admin CMS for text, sections, tabs/pages, image uploads, video uploads, and visibility toggles

## Data Policy

On-chain data is fetched live. If a source cannot be fetched, the UI shows `-`.

## Local Development

```bash
pnpm install
pnpm dev
pnpm lint
pnpm build
```

Create a local `.dev.vars` file for admin testing:

```bash
ADMIN_PASSWORD=replace-with-a-strong-password
```

Production secrets are configured in Sites runtime environment variables.

## Hosting

The app is built for OpenAI Sites / Cloudflare Workers-compatible hosting with:

- D1 binding: `DB`
- R2 binding: `MEDIA`
- Secret env var: `ADMIN_PASSWORD`

The current Sites deployment URL is:

```text
https://threehundred-spo-live.workspace-vo-4842.chatgpt-team.site
```
