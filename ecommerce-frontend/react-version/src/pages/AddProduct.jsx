// src/pages/AddProduct.jsx
// Screen: Add Product.
// Backend call used: POST /api/products { name, price }

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createProduct } from "../api";

export default function AddProduct() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [nameError, setNameError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [banner, setBanner] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate() {
    let isValid = true;
    const trimmedName = name.trim();

    if (!trimmedName) {
      setNameError("Product name is required.");
      isValid = false;
    } else {
      setNameError("");
    }

    if (!price.trim()) {
      setPriceError("Price is required.");
      isValid = false;
    } else if (isNaN(Number(price)) || Number(price) < 0) {
      setPriceError("Enter a valid, non-negative price.");
      isValid = false;
    } else {
      setPriceError("");
    }

    return isValid;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setBanner("");
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await createProduct({ name: name.trim(), price: Number(price) });
      navigate("/");
    } catch (err) {
      setBanner("Couldn't add this product. Is the backend running?");
      console.error(err);
      setIsSubmitting(false);
    }
  }

  return (
    <main className="page-shell">
      <div className="form-wrap">
        <h1>Add a Product</h1>
        <p className="form-subtitle">It'll appear in the catalog right away.</p>

        {banner && <div className="banner banner-error">{banner}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="name">Product name</label>
            <input
              id="name"
              type="text"
              placeholder="e.g. Ceramic Mug"
              autoComplete="off"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div className="field-error">{nameError}</div>
          </div>

          <div className="field">
            <label htmlFor="price">Price (USD)</label>
            <input
              id="price"
              type="number"
              placeholder="e.g. 18.00"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <div className="field-error">{priceError}</div>
          </div>

          <div className="form-actions">
            <Link to="/" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Adding…" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
