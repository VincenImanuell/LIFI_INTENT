# Intent Explorer

A live, interactive tour of [LI.FI Intents](https://docs.li.fi/lifi-intents/introduction) — the
intent-based solver marketplace where users declare a desired outcome and a competitive solver
network fulfills it.

Built for the **LI.FI Intents Mini Builder Challenge**.

## What it teaches

The page walks any developer — even one who has never touched cross-chain UX — from the mental
model down to the byte-level encoding, in seven hands-on sections:

1. **Bridge aggregation vs. LI.FI Intents** — a side-by-side that explains why intents flip the
   capital, speed, and trust model of cross-chain transfers.
2. **EIP-7930 interoperable addresses** — the chain-agnostic address format every LI.FI Intent
   uses. Paste any address and see each byte decoded.
3. **Fetch a live quote** — pick a preset route, POST to `https://order.li.fi/quote/request`,
   and inspect the real solver-priced response. No wallet required.
4. **Annotated JSON viewer** — the response is shown with inline `// explainer` comments on
   every important field.
5. **Order lifecycle** — an animated 5-state stepper (`Submitted → Open → Signed → Delivered →
   Settled`) with the actor responsible for each transition.
6. **StandardOrder anatomy** — a real OIF `StandardOrder` JSON with hover annotations on every
   field, plus notes on Escrow vs. Compact, the two-deadline design, and multi-output orders.
7. **Auction types** — four cards covering Limit, Exclusive Limit, Dutch, and Exclusive Dutch
   orders, each with its `output.context` byte breakdown.

## Stack

- [Vite](https://vitejs.dev) + [React 19](https://react.dev)
- [Tailwind CSS v4](https://tailwindcss.com) (via the official Vite plugin)
- Direct browser `fetch()` to `https://order.li.fi` — CORS is wide open and no API key is needed
  for integrator-side quote requests.

No backend, no wallet integration, no signing keys. The demo is read-only by design — its job is
to teach the surface area of LI.FI Intents, not to settle funds.

## Local development

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:5173`.

## Production build

```bash
npm run build
npm run preview
```

## Deploying to Vercel

This repo is configured to deploy on Vercel with zero config. From the Vercel dashboard:

1. Import the GitHub repo.
2. Framework preset is auto-detected as **Vite**.
3. Build command: `npm run build` · Output directory: `dist`.
4. Deploy.

A `vercel.json` is included with explicit settings so the deploy stays deterministic.

## Project structure

```
src/
  components/         React components, one file per section
    Header.jsx
    Hero.jsx
    Comparison.jsx
    AddressDecoder.jsx
    QuoteBuilder.jsx
    QuoteResult.jsx
    AnnotatedJson.jsx
    LifecycleStepper.jsx
    OrderAnatomy.jsx
    OrderTypes.jsx
    Resources.jsx
    Footer.jsx
    Section.jsx       (shared section wrapper)
  lib/
    interopAddress.js EIP-7930 encode/decode
    chains.js         curated EVM chain registry
    tokens.js         curated token registry + base-unit helpers
    quoteApi.js       thin wrapper over POST /quote/request
```

## Acknowledgements

Built using only the public [LI.FI documentation](https://docs.li.fi). All quotes shown are real
and fetched live from `https://order.li.fi`. The page is not affiliated with LI.FI.
