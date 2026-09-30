# RA’IHA CENTS website (multi-page)

Static site. No build step needed to host it: upload the folder to Vercel, Netlify or any static host.

## Pages (each has its own URL)
- `index.html` Home
- `shop.html` All 15 fragrances (search and filter)
- `perfumes/<name>.html` One page per fragrance, for example `perfumes/radiant-rose.html`
- `about.html`, `contact.html`, `faq.html`
- `checkout.html` and `thank-you.html`
- `404.html`

On Vercel, `vercel.json` turns on clean URLs (`/shop`, `/perfumes/nawara`). Netlify does this by default.

## Order emails
Placing an order sends the full order to raihascents@gmail.com through FormSubmit, and sends the customer
a confirmation if they entered an email. If sending fails, the bag is kept and the customer is offered a WhatsApp fallback.

ONE-TIME SETUP: after the site is live, place one test order. FormSubmit emails raihascents@gmail.com an
activation message. Open it and click Confirm. Orders arrive from then on. Check Spam/Promotions the first time.
The email address and endpoint are at the top of `app.js`.

## Editing products
Each fragrance page is `perfumes/<name>.html` (description, price shown on the page). The cart reads names and prices
from `products.js`, so change the price in both places. Fragrance notes have not been supplied, so descriptions
describe mood and occasion only.
