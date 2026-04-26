# Launch Checklist

Use this checklist before sharing the site with clients or promoting a production deploy.

## Automated verification

Run the full verification pipeline:

```bash
npm run verify
```

This runs `lint`, `typecheck`, `test`, and `build` in the same order expected for launch readiness.

## Manual validation

Confirm these checks against the deployed preview or production URL:

1. Lighthouse
   Record desktop and mobile Lighthouse runs for the home page, blog index, and a representative article page.
2. structured data
   Validate the homepage, article page, and about page JSON-LD payloads with Google's Rich Results Test or Schema Markup Validator.
3. sitemap
   Open `/sitemap.xml` and confirm static pages, posts, and category archives are present with canonical production URLs.
4. rss
   Open `/rss.xml` and confirm the feed renders valid XML with article titles, canonical links, and publish dates.
5. social preview
   Verify Open Graph and Twitter preview cards for the homepage and at least one article using a social card debugger.
6. Netlify
   Confirm the Netlify deploy uses the expected build command, publishes successfully, and serves the current `NEXT_PUBLIC_SITE_URL`.
