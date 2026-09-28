/* add-product.js
   Talks to the Spring Boot backend:
     POST /api/products -> create a product { name, price }
*/

const API_BASE = "http://localhost:8080/api/products";

const form = document.getElementById("productForm");
const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");
const nameError = document.getElementById("nameError");
const priceError = document.getElementById("priceError");
const submitBtn = document.getElementById("submitBtn");
const bannerEl = document.getElementById("banner");

form.addEventListener("submit", handleSubmit);

async function handleSubmit(e) {
  e.preventDefault();
  hideBanner();

  const name = nameInput.value.trim();
  const priceRaw = priceInput.value.trim();

  if (!validate(name, priceRaw)) return;

  const price = Number(priceRaw);

  submitBtn.disabled = true;
  submitBtn.textContent = "Adding…";

  try {
    const response = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price }),
    });

    if (!response.ok) throw new Error("Server responded with " + response.status);

    window.location.href = "product-list.html";
  } catch (err) {
    showBanner("Couldn't add this product. Is the backend running at " + API_BASE + "?");
    console.error(err);
    submitBtn.disabled = false;
    submitBtn.textContent = "Add Product";
  }
}

function validate(name, priceRaw) {
  let isValid = true;

  if (!name) {
    nameError.textContent = "Product name is required.";
    isValid = false;
  } else {
    nameError.textContent = "";
  }

  if (!priceRaw) {
    priceError.textContent = "Price is required.";
    isValid = false;
  } else if (isNaN(Number(priceRaw)) || Number(priceRaw) < 0) {
    priceError.textContent = "Enter a valid, non-negative price.";
    isValid = false;
  } else {
    priceError.textContent = "";
  }

  return isValid;
}

function showBanner(message) {
  bannerEl.textContent = message;
  bannerEl.classList.add("is-visible");
}

function hideBanner() {
  bannerEl.classList.remove("is-visible");
}
