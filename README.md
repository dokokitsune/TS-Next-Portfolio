This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

### Using Nix

With flakes enabled in Nix, enter the development shell to get Node.js 22 and
Yarn Classic on Linux or macOS (Intel or ARM):

```bash
nix develop
yarn install --frozen-lockfile
yarn dev
```

The Nix dependencies are pinned in `flake.lock`. Run `nix flake update` to update
them.

### Using direnv

With direnv hooked into your shell and nix-direnv enabled, allow the repository's
`.envrc` once:

```bash
direnv allow
```

direnv will load the same Nix development environment when you enter the
repository. Then run:

```bash
yarn install --frozen-lockfile
yarn dev
```

Dependency installation is explicit; entering the environment does not run Yarn.

### Using an existing Node.js installation

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Single-page layout

The homepage contains Home, About Me (including work experience and Steam),
Projects, and Contact sections. Navbar links scroll to `/#home`, `/#about`,
`/#projects`, and `/#contact`, with the active link following the visible section.
Anchor navigation supports browser history and reduced-motion preferences.
The former `/aboutMe`, `/projects`, and `/contactMe` routes permanently redirect
to their corresponding homepage sections.

## GitHub and Steam feeds

The website fetches GitHub and Steam directly on the Next.js server. These feeds
do not use API Gateway, Lambda, DynamoDB, or Parameter Store at runtime.

For local development, copy `.env.example` to `.env.local` and configure:

- `GITHUB_TOKEN`: optional token for public repositories and higher API rate limits.
- `STEAM_API_KEY`: Steam Web API key.
- `STEAM_ID`: Steam user ID (defaults to the portfolio owner's public ID).

Supply the same variables to the production Node.js process through your host's
environment or secret management. Keep them server-only: do not prefix them with
`NEXT_PUBLIC_`. `.env.local` is ignored by Git.

For Cloudflare, configure these under **Workers & Pages → your project →
Settings → Variables and Secrets**. Store `STEAM_API_KEY` and `GITHUB_TOKEN` as
encrypted secrets and `STEAM_ID` as a text variable. Configure production and
preview environments separately and redeploy after adding the values.

The current feed implementation has been verified with `next build` and
`next start` on Node.js. Cloudflare deployment and persistent cache integration
still need configuration and validation; setting environment variables alone
does not complete that work. The existing `@cloudflare/next-on-pages` dependency
is deprecated. Confirm whether hosting uses Pages or Workers before selecting
the deployment adapter and cache storage.

GitHub refreshes after one hour; Steam player activity refreshes after 30 minutes.
The projects section fetches up to 12 recently pushed public repositories and their
latest commits (up to 13 GitHub requests per refresh). It initially shows six
projects, with search, language filters, sorting, and a button to show more.
Descriptions, topics, stars, forks, licenses, and website links use repository
metadata; absent metadata is omitted. Short introductions in
`app/projects/projectOverviews.ts` fill in missing descriptions for the main
projects. Search and sorting run locally without additional API requests.
Steam achievement schemas are cached for one day and global percentages for one
hour. Refreshes are triggered by requests, rather than a background schedule.
The last successful data stays cached if an upstream refresh fails.

Public JSON snapshots in `app/lib/feeds/data/` provide a fallback when APIs are
unavailable and no working cache exists, including builds without credentials.
The feed's update date is displayed so older data remains identifiable. These
snapshots contain public display data only and can be updated from successful
feed results when needed. They are not overwritten by failed requests.

The homepage uses the Node.js runtime and ISR (30 minutes), while GitHub's data
cache retains its independent one-hour refresh interval. For self-hosting, run `yarn build`
then `yarn start`. Keep `.next/cache` on persistent storage to retain the data
cache across container restarts; each replica otherwise has its own cache. The
bundled snapshots still work with an empty cache. Steam has its own Suspense
boundary so fetching games does not block the biography or work experience.

Run the feed behavior tests with `yarn test`.

## Contact and résumé

The Contact section is a compact invitation to connect on LinkedIn. It has no
form, email backend, CAPTCHA, or contact-related environment variables. The app
no longer uses AWS SDKs or requires AWS credentials for contact or feed data.

The résumé button still links directly to the existing public PDF on S3. Keeping
it there allows the PDF to be updated independently of a site deployment. To
serve it with the site instead, add the PDF at `public/resume.pdf` and change the
hero link to `/resume.pdf`; updates would then ship with a site deployment.

Existing AWS infrastructure has not been changed by these source updates.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
