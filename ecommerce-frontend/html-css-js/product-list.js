/* product-list.js
   Talks to the Spring Boot backend:
     GET    /api/products      -> list all products
     DELETE /api/products/{id} -> remove a product
*/

// Change this if your backend runs somewhere other than localhost:8080
const API_BASE = "http://localhost:8080/api/products";

const gridEl = document.getElementById("productGrid");
const loadingEl = document.getElementById("loading");
const emptyStateEl = document.getElementById("emptyState");
const bannerEl = document.getElementById("banner");

const confirmOverlay = document.getElementById("confirmOverlay");
const confirmText = document.getElementById("confirmText");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

let pendingDeleteId = null;

document.addEventListener("DOMContentLoaded", loadProducts);
cancelDeleteBtn.addEventListener("click", closeConfirm);
confirmDeleteBtn.addEventListener("click", handleConfirmedDelete);

async function loadProducts() {
  showLoading(true);
  hideBanner();

  try {
    const response = await fetch(API_BASE);
    if (!response.ok) throw new Error("Server responded with " + response.status);

    const products = await response.json();
    renderProducts(products);
  } catch (err) {
    showBanner("Couldn't load products. Is the backend running at " + API_BASE + "?");
    console.error(err);
  } finally {
    showLoading(false);
  }
}

function renderProducts(products) {
  gridEl.innerHTML = "";

  if (!products || products.length === 0) {
    emptyStateEl.style.display = "block";
    return;
  }
  emptyStateEl.style.display = "none";

  products.forEach((product) => {
    gridEl.appendChild(buildProductCard(product));
  });
}

function buildProductCard(product) {
  const card = document.createElement("div");
  card.className = "product-card";

  const initial = (product.name || "?").trim().charAt(0).toUpperCase();

  card.innerHTML = `
    <div class="product-card__thumb">${initial}</div>
    <p class="product-card__name">${escapeHtml(product.name)}</p>
    <p class="product-card__price">${formatPrice(product.price)}</p>
    <div class="product-card__actions">
      <a class="btn btn-secondary" href="product-detail.html?id=${product.id}">View</a>
      <button class="btn btn-danger" data-id="${product.id}" data-name="${escapeHtml(product.name)}">Delete</button>
    </div>
  `;

  card.querySelector(".btn-danger").addEventListener("click", (e) => {
    openConfirm(e.currentTarget.dataset.id, e.currentTarget.dataset.name);
  });

  return card;
}

function openConfirm(id, name) {
  pendingDeleteId = id;
  confirmText.textContent = `"${name}" will be permanently removed.`;
  confirmOverlay.classList.add("is-visible");
}

function closeConfirm() {
  pendingDeleteId = null;
  confirmOverlay.classList.remove("is-visible");
}

async function handleConfirmedDelete() {
  if (!pendingDeleteId) return;

  confirmDeleteBtn.disabled = true;
  try {
    const response = await fetch(`${API_BASE}/${pendingDeleteId}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Server responded with " + response.status);

    closeConfirm();
    loadProducts();
  } catch (err) {
    showBanner("Couldn't delete that product. Please try again.");
    console.error(err);
  } finally {
    confirmDeleteBtn.disabled = false;
  }
}

function formatPrice(price) {
  const num = Number(price);
  return isNaN(num) ? "—" : "$" + num.toFixed(2);
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

function showLoading(isLoading) {
  loadingEl.style.display = isLoading ? "block" : "none";
}

function showBanner(message) {
  bannerEl.textContent = message;
  bannerEl.classList.add("is-visible");
}

function hideBanner() {
  bannerEl.classList.remove("is-visible");
}
