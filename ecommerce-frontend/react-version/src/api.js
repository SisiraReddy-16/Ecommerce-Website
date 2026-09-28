// src/api.js
// Small fetch wrapper shared by every screen.
// Change API_BASE if your backend runs somewhere other than localhost:8080.

export const API_BASE = "http://localhost:8080/api/products";

async function request(path = "", options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  // DELETE returns a plain string, not JSON
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  return response.text();
}

export function getAllProducts() {
  return request("");
}

export function getProduct(id) {
  return request(`/${id}`);
}

export function createProduct(product) {
  return request("", {
    method: "POST",
    body: JSON.stringify(product),
  });
}

export function deleteProduct(id) {
  return request(`/${id}`, { method: "DELETE" });
}
