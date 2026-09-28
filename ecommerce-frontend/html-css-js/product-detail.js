/* product-detail.js
   Talks to the Spring Boot backend:
     GET    /api/products/{id} -> fetch one product
     DELETE /api/products/{id} -> remove it, then return to the list
*/

const API_BASE = "http://localhost:8080/api/products";

const productId = new URLSearchParams(window.location.search).get("id");

const loadingEl = document.getElementById("loading");
const bannerEl = document.getElementById("banner");
const notFoundEl = document.getElementById("notFoundState");
const detailCardEl = document.getElementById("detailCard");

const confirmOverlay = document.getElementById("confirmOverlay");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
const deleteBtn = document.getElementById("deleteBtn");

document.addEventListener("DOMContentLoaded", loadProduct);
deleteBtn.addEventListener("click", () => confirmOverlay.classList.add("is-visible"));
cancelDeleteBtn.addEventListener("click", () => confirmOverlay.classList.remove("is-visible"));
confirmDeleteBtn.addEventListener("click", handleDelete);

async function loadProduct() {
  if (!productId) {
    showNotFound();
    return;
  }

  showLoading(true);
  try {
    const response = await fetch(`${API_BASE}/${productId}`);
    if (response.status === 404) {
      showNotFound();
      return;
    }
    if (!response.ok) throw new Error("Server responded with " + response.status);

    const product = await response.json();
    if (!product || product.id == null) {
      showNotFound();
      return;
    }
    renderProduct(product);
  } catch (err) {
    showBanner("Couldn't load this product. Is the backend running at " + API_BASE + "?");
    console.error(err);
  } finally {
    showLoading(false);
  }
}

function renderProduct(product) {
  document.getElementById("detailThumb").textContent = (product.name || "?").trim().charAt(0).toUpperCase();
  document.getElementById("detailId").textContent = product.id;
  document.getElementById("detailName").textContent = product.name;
  document.getElementById("detailPrice").textContent = formatPrice(product.price);
  detailCardEl.style.display = "flex";
}

async function handleDelete() {
  confirmDeleteBtn.disabled = true;
  try {
    const response = await fetch(`${API_BASE}/${productId}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Server responded with " + response.status);

    window.location.href = "product-list.html";
  } catch (err) {
    confirmOverlay.classList.remove("is-visible");
    showBanner("Couldn't delete this product. Please try again.");
    console.error(err);
  } finally {
    confirmDeleteBtn.disabled = false;
  }
}

function showNotFound() {
  detailCardEl.style.display = "none";
  notFoundEl.style.display = "block";
}

function formatPrice(price) {
  const num = Number(price);
  return isNaN(num) ? "—" : "$" + num.toFixed(2);
}

function showLoading(isLoading) {
  loadingEl.style.display = isLoading ? "block" : "none";
}

function showBanner(message) {
  bannerEl.textContent = message;
  bannerEl.classList.add("is-visible");
}
