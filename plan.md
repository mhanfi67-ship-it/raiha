1. **Initialize Backend Project**
   - Run `npm init -y` in the root directory.
   - Install dependencies using `npm install express sqlite3 jsonwebtoken cookie-parser dotenv`.
   - Verify success by listing `package.json` and `node_modules`.
2. **Create Database Schema**
   - Create `init_db.js` to create `users`, `orders`, and `notifications` tables using SQLite.
   - Run `node init_db.js` using `run_in_bash_session` to initialize the database file.
   - Verify the database file `database.sqlite` was created using `list_files`.
3. **Create Server Basics**
   - Create `server.js` with basic Express setup, serving static files from `/app`.
   - Start the server in the background and verify it runs using `run_in_bash_session`.
4. **Implement Auth Endpoints**
   - Edit `server.js` to add `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, and `/api/auth/me`.
   - Verify the edits by reading `server.js`.
5. **Create Auth Frontend Files**
   - Create `login.html` and `register.html` matching existing UI.
   - Verify creation using `list_files`.
6. **Implement Order API Endpoints**
   - Edit `server.js` to add `POST /api/orders` which saves the order, creates an admin notification, and triggers FormSubmit via backend fetch.
   - Edit `server.js` to add `GET /api/orders` (admin and user views).
   - Verify edits by reading `server.js`.
7. **Migrate Frontend Order Logic**
   - Edit `app.js` and `checkout.html` to POST to `/api/orders` instead of FormSubmit directly.
   - Add JWT cookie to requests.
   - Verify edits by reading `app.js`.
8. **Implement Notification Endpoints**
   - Edit `server.js` to add `GET /api/notifications`, `PATCH /api/notifications/:id/read`, `PATCH /api/notifications/read-all`.
   - Verify edits by reading `server.js`.
9. **Implement Order Status Endpoint**
   - Edit `server.js` to add `PATCH /api/orders/:id/status` (admin only), validating status, updating DB, and creating a customer notification.
   - Verify edits by reading `server.js`.
10. **Create Frontend Notification UI**
    - Edit `index.html`, `shop.html`, `checkout.html` etc. to add a notification bell and dropdown.
    - Edit `app.js` to fetch and render notifications, and handle read/unread state.
    - Verify edits using `read_file` on `index.html` and `app.js`.
11. **Create Profile and Admin Dashboards**
    - Create `profile.html` for customer order history.
    - Create `admin.html` for admin order management and status changes.
    - Verify creation using `list_files`.
12. **End-to-End Testing**
    - Write a Node.js script `test_e2e.js` that makes API calls to simulate registration, placing an order, checking notifications, admin login, changing order status, and checking customer notifications.
    - Run the script and verify successful output.
13. **Pre-commit Steps**
    - Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.
14. **Submit**
    - Submit the changes with a clear commit message.
