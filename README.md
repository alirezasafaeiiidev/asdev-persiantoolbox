# Persian Tools

Minimal, fast, privacy-first Persian utilities (PDF, image, finance, date, text, validation).

## Scope

In scope:

- Client-side tools and calculators.
- SEO-first public pages.
- Lightweight operational scripts for deploy checks.

Out of scope:

- Accounts, subscriptions, and history.
- Admin dashboards and monetization flows.

## Local Development

```bash
pnpm install
pnpm run dev
```

## Testing

```bash
pnpm run lint
pnpm run typecheck
pnpm vitest --run
pnpm run build
```

## Deployment Ops

- Env templates:
  - `env.staging.example`
  - `env.production.example`
- VPS runbook:
  - `docs/vps-deploy-runbook.md`
- Readiness gates:
  - `pnpm deploy:readiness:validate`
  - `pnpm deploy:readiness:run`
- Post-deploy report:
  - `pnpm deploy:post:report -- --base-url=https://persian-tools.ir --environment=production --git-ref=<tag-or-sha>`

## Brand Attribution

- Engineering hub: `https://alirezasafaeidev.ir/engineering`
- Request review: `https://alirezasafaeidev.ir/engineering/request`

## License

See `LICENSE`, `LICENSE-COMMERCIAL.md`, and `LICENSE-NONCOMMERCIAL.md`.
