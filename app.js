/* RA'IHA CENTS shared script: cart, shop filters, checkout and order email */

/* ---------- ORDER EMAIL SETTINGS ---------- */
// Orders are emailed to this address through FormSubmit (free, no server needed).
// The very first order triggers a one-time activation email to this inbox: open it and click Confirm.
const ORDER_EMAIL = "raihascents@gmail.com";
const ORDER_EMAIL_ENDPOINT = "https://formsubmit.co/ajax/" + ORDER_EMAIL;
const WHATSAPP_NUMBER = "923092198294";
/* ------------------------------------------ */

const products = window.RAIHA_PRODUCTS || [];
const DELIVERY = window.RAIHA_DELIVERY || 250;
const BASE = document.body.dataset.base || "";
const $ = s => document.querySelector(s);
const money = n => "Rs. " + Number(n).toLocaleString("en-PK");
const byId = id => products.find(p => p.id === Number(id));

let cart = [];
try { cart = JSON.parse(localStorage.getItem("raiha-cart") || "[]").filter(i => byId(i.id)); } catch (e) { cart = []; }
function saveCart() { try { localStorage.setItem("raiha-cart", JSON.stringify(cart)); } catch (e) {} }

function toast(msg) {
  let t = $("#toast");
  if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add("show");
  clearTimeout(window.__toast); window.__toast = setTimeout(() => t.classList.remove("show"), 2200);
}

/* ---------- cart ---------- */
function totals() {
  const subtotal = cart.reduce((s, i) => s + byId(i.id).price * i.qty, 0);
  const delivery = subtotal ? DELIVERY : 0;
  return { subtotal, delivery, total: subtotal + delivery };
}
function addToCart(id) {
  id = Number(id);
  const ex = cart.find(x => x.id === id);
  if (ex) ex.qty++; else cart.push({ id, qty: 1 });
  saveCart(); renderCart(); openCart(); toast("Added to your bag");
}
function removeFromCart(id) { cart = cart.filter(x => x.id !== id); saveCart(); renderCart(); }
function changeQty(id, d) {
  const it = cart.find(x => x.id === id); if (!it) return;
  it.qty += d; if (it.qty <= 0) removeFromCart(id); else { saveCart(); renderCart(); }
}
function renderCart() {
  $("#cartCount").textContent = cart.reduce((s, i) => s + i.qty, 0);
  const box = $("#cartItems");
  if (!cart.length) {
    box.innerHTML = '<div class="cart-empty">Your bag is empty.<br><br><a class="btn btn-ghost" href="' + BASE + 'shop.html">Explore Fragrances</a></div>';
  } else {
    box.innerHTML = cart.map(i => {
      const p = byId(i.id);
      return '<div class="cart-item"><img src="' + BASE + p.image + '" alt="' + p.name + '">' +
        '<div><h4><a href="' + BASE + 'perfumes/' + p.slug + '.html">' + p.name + '</a></h4><small>' + money(p.price) + '</small>' +
        '<div class="qty"><button data-qty="-1" data-id="' + p.id + '" aria-label="Decrease">−</button><span>' + i.qty + '</span><button data-qty="1" data-id="' + p.id + '" aria-label="Increase">+</button></div>' +
        '<button class="remove" data-remove="' + p.id + '">Remove</button></div><b>' + money(p.price * i.qty) + '</b></div>';
    }).join("");
  }
  const t = totals();
  $("#cartSubtotal").textContent = money(t.subtotal);
  $("#cartDelivery").textContent = money(t.delivery);
  $("#cartTotal").textContent = money(t.total);
}
function openCart() {
  $("#cartDrawer").classList.add("open"); $("#overlay").classList.add("open");
  $("#cartDrawer").setAttribute("aria-hidden", "false"); document.body.classList.add("no-scroll");
}
function closeCart() {
  $("#cartDrawer").classList.remove("open"); $("#overlay").classList.remove("open");
  $("#cartDrawer").setAttribute("aria-hidden", "true"); document.body.classList.remove("no-scroll");
}

/* ---------- order helpers ---------- */
function itemLines(items) {
  return items.map(i => { const p = byId(i.id); return p.name + " x " + i.qty + " = " + money(p.price * i.qty); });
}
function newOrderNumber() {
  return "RC-" + Date.now().toString(36).toUpperCase().slice(-6);
}
function whatsappUrl(items, customer, orderNo) {
  const sub = items.reduce((s, i) => s + byId(i.id).price * i.qty, 0);
  let msg = "Hello RA’IHA CENTS, I would like to place an order" + (orderNo ? " (" + orderNo + ")" : "") + ".\n\n" +
    itemLines(items).map(l => "- " + l).join("\n") +
    "\n\nSubtotal: " + money(sub) + "\nDelivery: " + money(DELIVERY) + "\nTotal: " + money(sub + DELIVERY) + "\nPayment: Cash on Delivery";
  if (customer) {
    msg += "\n\nName: " + customer.name + "\nPhone: " + customer.phone + "\nAddress: " + customer.address +
      "\nCity: " + customer.city + "\nProvince: " + customer.province +
      (customer.postal ? "\nPostal Code: " + customer.postal : "") + (customer.notes ? "\nNotes: " + customer.notes : "");
  }
  return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(msg);
}

/* ---------- wiring ---------- */
document.addEventListener("click", e => {
  const add = e.target.closest("[data-add]"); if (add) { addToCart(add.dataset.add); return; }
  const q = e.target.closest("[data-qty]"); if (q) { changeQty(Number(q.dataset.id), Number(q.dataset.qty)); return; }
  const r = e.target.closest("[data-remove]"); if (r) { removeFromCart(Number(r.dataset.remove)); return; }
});
$("#cartBtn").addEventListener("click", openCart);
$("#closeCart").addEventListener("click", closeCart);
$("#overlay").addEventListener("click", closeCart);
$("#continueShopping").addEventListener("click", closeCart);
$("#menuBtn").addEventListener("click", () => $("#mobileNav").classList.toggle("open"));
$("#checkoutBtn").addEventListener("click", e => { if (!cart.length) { e.preventDefault(); toast("Your bag is empty"); } });
$("#whatsappCartBtn").addEventListener("click", () => {
  if (!cart.length) { toast("Your bag is empty"); return; }
  window.open(whatsappUrl(cart, null), "_blank");
});
$("#year").textContent = new Date().getFullYear();

/* ---------- shop page: search + filter ---------- */
if ($("#productGrid") && $("#searchInput")) {
  let filter = "all", q = "";
  const cards = [...document.querySelectorAll("#productGrid .product-card")];
  const apply = () => {
    let shown = 0;
    cards.forEach(c => {
      const ok = (!q || c.dataset.search.includes(q)) && (filter === "all" || c.dataset.featured === "1");
      c.hidden = !ok; if (ok) shown++;
    });
    $("#noResults").hidden = shown > 0;
  };
  $("#searchInput").addEventListener("input", e => { q = e.target.value.trim().toLowerCase(); apply(); });
  document.querySelectorAll(".filter").forEach(b => b.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(x => x.classList.remove("active"));
    b.classList.add("active"); filter = b.dataset.filter; apply();
  }));
  if (location.search.includes("search")) setTimeout(() => $("#searchInput").focus(), 200);
}

/* ---------- checkout page ---------- */
if ($("#checkoutForm")) {
  const t = totals();
  if (!cart.length) { $("#emptyCheckout").hidden = false; }
  else {
    $("#checkoutLayout").hidden = false;
    $("#summaryItems").innerHTML = cart.map(i => {
      const p = byId(i.id);
      return '<div class="sum-item"><img src="' + BASE + p.image + '" alt="' + p.name + '"><div><h4>' + p.name + '</h4><small>Qty ' + i.qty + '</small></div><b>' + money(p.price * i.qty) + '</b></div>';
    }).join("");
    $("#sumSubtotal").textContent = money(t.subtotal);
    $("#sumDelivery").textContent = money(t.delivery);
    $("#sumTotal").textContent = money(t.total);
  }

  const form = $("#checkoutForm"), btn = $("#placeOrderBtn"), errBox = $("#formError");
  let sending = false;

  const showError = (order) => {
    errBox.hidden = false;
    errBox.innerHTML = "We could not send your order by email just now. Your bag is safe, nothing has been lost. Please try again in a moment, or send this order to us on WhatsApp instead." +
      '<br><a class="btn btn-ghost" target="_blank" rel="noopener" href="' + whatsappUrl(order.items, order.customer, order.orderNo) + '">Send order on WhatsApp</a>';
  };

  form.addEventListener("submit", async e => {
    e.preventDefault();
    if (sending) return;
    errBox.hidden = true;
    let bad = null;
    form.querySelectorAll("[required]").forEach(f => {
      const empty = !f.value.trim(); f.classList.toggle("invalid", empty); if (empty && !bad) bad = f;
    });
    const em = form.elements.email;
    if (em.value && !em.checkValidity()) { em.classList.add("invalid"); bad = bad || em; } else em.classList.remove("invalid");
    if (bad) { bad.focus(); errBox.hidden = false; errBox.textContent = "Please fill in the highlighted fields."; return; }
    if (form.elements.website.value) return;   // honeypot: bots only

    const fd = Object.fromEntries(new FormData(form).entries()); delete fd.website;
    const items = cart.map(x => ({ ...x }));
    const tt = totals();
    const orderNo = newOrderNumber();
    const order = { orderNo, customer: fd, items, totals: tt, at: new Date().toISOString() };

    const payload = {
      _subject: "New COD order " + orderNo + " from " + fd.name + " (" + money(tt.total) + ")",
      _template: "table",
      _captcha: "false",
      _autoresponse: "Thank you for your order with RA’IHA CENTS. Your order number is " + orderNo + ". Your total is " + money(tt.total) + " (Cash on Delivery, delivery included). We will contact you shortly to confirm. For any question, message us on WhatsApp at 03092198294.",
      "Order Number": orderNo,
      "Customer Name": fd.name,
      "Phone": fd.phone,
      "City": fd.city,
      "Province": fd.province,
      "Address": fd.address,
      "Postal Code": fd.postal || "-",
      "Notes": fd.notes || "-",
      "Items": itemLines(items).join("\n"),
      "Subtotal": money(tt.subtotal),
      "Delivery": money(tt.delivery),
      "Total (Cash on Delivery)": money(tt.total)
    };
    if (fd.email) payload.email = fd.email; else delete payload._autoresponse;

    sending = true; btn.disabled = true; btn.textContent = "Placing your order...";
    const ctrl = new AbortController(); const timer = setTimeout(() => ctrl.abort(), 20000);
    try {
      const res = await fetch(ORDER_EMAIL_ENDPOINT, {
        method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload), signal: ctrl.signal
      });
      const data = await res.json().catch(() => ({}));
      const ok = res.ok && (data.success === true || data.success === "true");
      if (!ok) throw new Error((data && data.message) || ("HTTP " + res.status));
      try { sessionStorage.setItem("raiha-last-order", JSON.stringify(order)); } catch (x) {}
      cart = []; saveCart();
      location.href = BASE + "thank-you.html";
    } catch (err) {
      console.error("Order email failed:", err);
      showError(order);
      sending = false; btn.disabled = false; btn.textContent = "Place COD Order";
    } finally { clearTimeout(timer); }
  });
}

/* ---------- thank-you page ---------- */
if ($("#thanks") || $("#noOrder")) {
  let order = null;
  try { order = JSON.parse(sessionStorage.getItem("raiha-last-order") || "null"); } catch (e) {}
  if (!order) { $("#noOrder").hidden = false; }
  else {
    $("#thanks").hidden = false;
    $("#tnOrder").textContent = order.orderNo;
    $("#tnTotal").textContent = money(order.totals.total);
    $("#tnItems").innerHTML = order.items.map(i => { const p = byId(i.id); return '<div class="sum-row"><span>' + p.name + ' x ' + i.qty + '</span><b>' + money(p.price * i.qty) + '</b></div>'; }).join("");
    $("#thanksLine").textContent = order.customer.email
      ? "We have received your order and sent a confirmation to " + order.customer.email + ". Our team will contact you on " + order.customer.phone + " to confirm delivery."
      : "We have received your order. Our team will contact you on " + order.customer.phone + " to confirm delivery.";
    $("#tnWhatsApp").addEventListener("click", () => window.open(whatsappUrl(order.items, order.customer, order.orderNo), "_blank"));
  }
}

renderCart();
