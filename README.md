# Wealth-it — website

The marketing and support site for the Wealth-it app. Static, multipage, no client-side
JavaScript unless a page asks for some.

- **App repo:** https://github.com/faisalayyy/wealth-it (private)
- **Stack:** [Astro](https://astro.build) 5, plain CSS, no framework runtime
- **Host:** not chosen yet (Cloudflare Pages or Netlify — connect the repo, push to `main`)

## Running it

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # → dist/
npm run preview  # serve the built site
```

## Before launch

- [ ] Set the real domain in `astro.config.mjs` (`site:`) — canonical URLs and OG tags read it
- [ ] Privacy page (the App Store requires the URL, and it is the product's best argument)
- [ ] Support page (the App Store requires this URL too)
- [ ] An OG image
