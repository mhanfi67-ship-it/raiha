# Architecture Audit

1.  **Frontend framework/library:** Pure HTML, CSS, and Vanilla JavaScript. No framework like React or Vue is used.
2.  **Backend technology:** None currently exists. The site is purely static.
3.  **Database technology:** None currently exists. (Uses localStorage/sessionStorage for cart and last order).
4.  **Authentication system:** None currently exists. No user accounts or admin login.
5.  **Existing order/checkout system:** Client-side cart (`app.js`), form submission on `checkout.html`. When checkout form is submitted, it posts directly to `https://formsubmit.co/ajax/raihascents@gmail.com`.
6.  **Existing order database/table/collection:** None.
7.  **Existing customer information:** Only collected during checkout and sent via email. Not stored anywhere permanently except in the email inbox.
8.  **Existing admin/profile/dashboard:** None.
9.  **Existing API endpoints:** None (uses FormSubmit external API).
10. **Existing email or messaging functionality:** Uses FormSubmit for order emails. Also provides a WhatsApp fallback link.
11. **Hosting/deployment environment:** Designed to be hosted on static platforms like Vercel, Netlify, or GitHub Pages. `vercel.json` exists for clean URLs.
12. **Environment variables currently required:** None. Order email and WhatsApp number are hardcoded in `app.js`.

**How an order currently moves through the system:**
Customer → Checkout → Order Creation (Client-side JS) → External FormSubmit API → Admin Email

**Identified issue for implementing the user's request:**
The user requested a persistent two-way notification system, customer profiles/accounts to view statuses, an admin dashboard to view/change statuses, and persistent database storage, while simultaneously stating: "Reuse my existing backend/database/API architecture whenever possible" and "Do NOT introduce an unnecessarily complicated service." 
Since there *is* no backend, database, or authentication system, I *must* introduce them to fulfill the core requirements (persistent notifications, order status changes, user/admin views).

A simple Node.js (Express) + SQLite or JSON file based backend, or a serverless function approach with a simple DB (like Supabase or Firebase) would be needed. However, since the user seems to want a lightweight approach that fits the static nature, I should propose a solution.

Given the constraints and instructions, the simplest and most robust way to add backend capabilities without entirely restructuring the static site to a heavy framework is to add a small Node.js/Express API alongside the static files, or use a lightweight database like SQLite.

Wait, since I cannot guarantee the user has a Node.js hosting environment (they explicitly mention Vercel for static hosting in README), maybe I can implement a lightweight backend using Vercel Serverless Functions (`/api` directory) and a cloud database, OR simply provide a Node.js `server.js` and SQLite database that serves the static files and provides the API endpoints. A Node.js + SQLite setup is entirely self-contained and easy to test in this sandbox.

Let's use Node.js, Express, and SQLite for the backend. We will serve the static frontend from a `public` directory (or just the root).

We will need to add:
1. `server.js` (Express backend)
2. SQLite DB setup for `users`, `orders`, `notifications`
3. Simple JWT or session based authentication for Admin vs Customer.
4. Update `checkout.html` to post to our new API instead of FormSubmit.
5. Create a `profile.html` for customers.
6. Create an `admin.html` for the owner.
