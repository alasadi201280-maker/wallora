// ==== এখানে আপনার হোয়াটসঅ্যাপ নম্বর বসান (কান্ট্রি কোডসহ, + ছাড়া) ====
const WHATSAPP_NUMBER = "8801XXXXXXXXX";

const CAT_LABEL = { clothes:"জামাকাপড়", shoes:"জুতা", caps:"ক্যাপ", glasses:"চশমা" };
const CAT_COLOR = { clothes:"#1B3B36", shoes:"#7A2E2E", caps:"#E7A33E", glasses:"#3B5B7A" };

const ICONS = {
  clothes:`<svg viewBox="0 0 64 64" fill="none" stroke="${CAT_COLOR.clothes}" stroke-width="2.5"><path d="M22 10l10-4 10 4 8 10-6 6-4-4v34H26V22l-4 4-6-6z" stroke-linejoin="round"/></svg>`,
  shoes:`<svg viewBox="0 0 64 64" fill="none" stroke="${CAT_COLOR.shoes}" stroke-width="2.5"><path d="M6 44c0-8 6-10 12-14l14-10c3 5 8 8 14 8h10c4 0 8 3 8 8v8H6z" stroke-linejoin="round"/><path d="M6 44h52" /></svg>`,
  caps:`<svg viewBox="0 0 64 64" fill="none" stroke="${CAT_COLOR.caps}" stroke-width="2.5"><path d="M10 34a22 22 0 0 1 44 0z" stroke-linejoin="round"/><path d="M4 36c8 4 48 4 56 0" /><circle cx="32" cy="18" r="2.5" fill="${CAT_COLOR.caps}" stroke="none"/></svg>`,
  glasses:`<svg viewBox="0 0 64 64" fill="none" stroke="${CAT_COLOR.glasses}" stroke-width="2.5"><circle cx="18" cy="32" r="11"/><circle cx="46" cy="32" r="11"/><path d="M29 32h6M7 30l4-8h7M57 30l-4-8h-7" /></svg>`
};

const PRODUCTS = [
  {id:"c1",cat:"clothes",name:"কটন পাঞ্জাবি",price:850},
  {id:"c2",cat:"clothes",name:"ডেনিম শার্ট",price:1100},
  {id:"c3",cat:"clothes",name:"প্রিন্টেড টি-শার্ট",price:450},
  {id:"c4",cat:"clothes",name:"ফরমাল ট্রাউজার",price:950},
  {id:"s1",cat:"shoes",name:"স্নিকার্স",price:1650},
  {id:"s2",cat:"shoes",name:"লেদার লোফার",price:1900},
  {id:"s3",cat:"shoes",name:"স্যান্ডেল",price:700},
  {id:"cp1",cat:"caps",name:"বেসবল ক্যাপ",price:350},
  {id:"cp2",cat:"caps",name:"বাকেট হ্যাট",price:400},
  {id:"g1",cat:"glasses",name:"সানগ্লাস — ক্লাসিক",price:600},
  {id:"g2",cat:"glasses",name:"পাওয়ার চশমা ফ্রেম",price:800},
];

let cart = JSON.parse(localStorage.getItem("sg_cart") || "{}");

function saveCart(){
  localStorage.setItem("sg_cart", JSON.stringify(cart));
  renderCart();
}

function money(n){ return "৳ " + n.toLocaleString("bn-BD"); }

function renderProducts(filter="all"){
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";
  PRODUCTS.filter(p => filter === "all" || p.cat === filter).forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.style.setProperty("--cat-color", CAT_COLOR[p.cat]);
    card.innerHTML = `
      <div class="product-icon">${ICONS[p.cat]}</div>
      <p class="product-name">${p.name}</p>
      <p class="product-cat">${CAT_LABEL[p.cat]}</p>
      <p class="product-price">${money(p.price)}</p>
      <button class="add-btn" data-id="${p.id}">কার্টে যোগ করুন</button>
    `;
    grid.appendChild(card);
  });
}

document.getElementById("catNav").addEventListener("click", e => {
  const btn = e.target.closest(".cat-btn");
  if(!btn) return;
  document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  renderProducts(btn.dataset.cat);
});

document.getElementById("productGrid").addEventListener("click", e => {
  const btn = e.target.closest(".add-btn");
  if(!btn) return;
  const id = btn.dataset.id;
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  btn.textContent = "যোগ হয়েছে ✓";
  btn.classList.add("added");
  setTimeout(() => { btn.textContent = "কার্টে যোগ করুন"; btn.classList.remove("added"); }, 900);
});

function cartEntries(){
  return Object.entries(cart)
    .filter(([,qty]) => qty > 0)
    .map(([id,qty]) => ({ ...PRODUCTS.find(p=>p.id===id), qty }));
}

function renderCart(){
  const items = cartEntries();
  const wrap = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");
  const countEl = document.getElementById("cartCount");
  const checkoutBtn = document.getElementById("goCheckout");

  countEl.textContent = items.reduce((s,i)=>s+i.qty,0);

  if(items.length === 0){
    wrap.innerHTML = `<p class="empty-cart">কার্ট খালি — পছন্দের পণ্য যোগ করুন।</p>`;
    totalEl.textContent = money(0);
    checkoutBtn.disabled = true;
    return;
  }
  checkoutBtn.disabled = false;

  wrap.innerHTML = items.map(i => `
    <div class="cart-line" data-id="${i.id}">
      <div class="cart-line-info">
        <div class="cart-line-name">${i.name}</div>
        <div class="cart-line-price">${money(i.price)} × ${i.qty}</div>
        <div class="qty-controls">
          <button data-act="dec">−</button>
          <span>${i.qty}</span>
          <button data-act="inc">+</button>
        </div>
      </div>
      <button class="remove-line" data-act="remove">সরান</button>
    </div>
  `).join("");

  const total = items.reduce((s,i)=>s+i.price*i.qty,0);
  totalEl.textContent = money(total);
}

document.getElementById("cartItems").addEventListener("click", e => {
  const btn = e.target.closest("button[data-act]");
  if(!btn) return;
  const id = btn.closest(".cart-line").dataset.id;
  if(btn.dataset.act === "inc") cart[id]++;
  if(btn.dataset.act === "dec") cart[id] = Math.max(0, cart[id]-1);
  if(btn.dataset.act === "remove") cart[id] = 0;
  saveCart();
});

// Drawer open/close
const drawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
function openDrawer(){ drawer.classList.add("open"); overlay.classList.add("show"); }
function closeDrawer(){ drawer.classList.remove("open"); overlay.classList.remove("show"); }
document.getElementById("openCart").addEventListener("click", openDrawer);
document.getElementById("closeCart").addEventListener("click", closeDrawer);
overlay.addEventListener("click", () => { closeDrawer(); closeCheckout(); });

// Checkout modal
const checkoutOverlay = document.getElementById("checkoutOverlay");
function openCheckout(){
  const items = cartEntries();
  if(items.length === 0) return;
  document.getElementById("orderSummary").innerHTML = items.map(i =>
    `<div><span>${i.name} × ${i.qty}</span><span>${money(i.price*i.qty)}</span></div>`
  ).join("") + `<div><strong>মোট</strong><strong>${money(items.reduce((s,i)=>s+i.price*i.qty,0))}</strong></div>`;
  checkoutOverlay.classList.add("show");
  closeDrawer();
}
function closeCheckout(){ checkoutOverlay.classList.remove("show"); }
document.getElementById("goCheckout").addEventListener("click", openCheckout);
document.getElementById("closeCheckout").addEventListener("click", closeCheckout);

document.getElementById("checkoutForm").addEventListener("submit", e => {
  e.preventDefault();
  const items = cartEntries();
  const f = new FormData(e.target);
  const total = items.reduce((s,i)=>s+i.price*i.qty,0);

  let msg = `*নতুন অর্ডার — স্টাইল ঘর*\n\n`;
  msg += `নাম: ${f.get("name")}\nমোবাইল: ${f.get("phone")}\nঠিকানা: ${f.get("address")}\nপেমেন্ট: ${f.get("payment")}\n\n`;
  msg += `পণ্যসমূহ:\n`;
  items.forEach(i => { msg += `- ${i.name} × ${i.qty} = ${money(i.price*i.qty)}\n`; });
  msg += `\nসর্বমোট: ${money(total)}`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank");

  cart = {};
  saveCart();
  closeCheckout();
  e.target.reset();
});

document.getElementById("year").textContent = new Date().getFullYear();
renderProducts();
renderCart();
