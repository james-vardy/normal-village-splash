# Band splash page

A single-page artist site: hero photo, streaming links, Bandcamp embed, mailing list signup, and upcoming shows, built with [Astro](https://astro.build) and deployed on Cloudflare Pages.

## Structure

```
/
├── functions/api/subscribe.ts   Cloudflare Pages Function - mailing list signup (Mailjet)
├── public/                      Static assets (images, favicon, robots.txt, sitemap.xml)
├── src/pages/index.astro        The entire site: markup, styles and page-load script
└── astro.config.mjs             Site URL (used for canonical/OG tags and the sitemap)
```

The site builds to static HTML; `functions/` is deployed alongside it as a Cloudflare Pages Function, so no server-side Astro adapter is needed.

## Commands

| Command           | Action                                       |
| :----------------- | :-------------------------------------------- |
| `npm install`       | Install dependencies                          |
| `npm run dev`       | Start the Astro dev server at `localhost:4321` |
| `npm run build`     | Build the static site to `./dist/`            |
| `npm run preview`   | Preview the production build locally          |
| `npx wrangler pages dev dist` | Serve the build with Cloudflare Pages Functions locally (needed to test `/api/subscribe`) |

## Mailing list signup

`functions/api/subscribe.ts` adds signups to a Mailjet list. It expects these Cloudflare Pages environment variables (Settings → Variables and Secrets), or a local `.dev.vars` file:

```
MAILJET_API_KEY=...
MAILJET_SECRET_KEY=...
MAILJET_LIST_ID=...
```

Without them the endpoint returns a friendly "not configured" message instead of failing.

## Adapting this for another artist

1. Swap the images in `public/` (hero photo, logo, cover art, favicons) and update the `width`/`height`/`srcset` attributes in `index.astro` to match.
2. Update the copy, streaming links, social links and the JSON-LD `schema` block at the top of `index.astro`.
3. Update `site` in `astro.config.mjs`, `public/robots.txt` and `public/sitemap.xml` to the new domain.
4. Swap the Bandsintown `data-artist-name` and the Bandcamp embed `album=` id in `index.astro`.
