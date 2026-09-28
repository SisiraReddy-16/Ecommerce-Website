// src/pages/ProductList.jsx
// Screen: All Products (home).
// Backend calls used: GET /api/products, DELETE /api/products/{id}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllProducts, deleteProduct } from "../api";

function formatPrice(price) {
  const num = Number(price);
  return isNaN(num) ? "—" : "$" + num.toFixed(2);
}

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null); // { id, name }
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setIsLoading(true);
    setError("");
    try {
      const data = await getAllProducts();
      setProducts(data || []);
    } catch (err) {
      setError("Couldn't load products. Is the backend running?");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleConfirmedDelete() {
    if (!pendingDelete) return;
    setIsDeleting(true);
    try {
      await deleteProduct(pendingDelete.id);
      setPendingDelete(null);
      loadProducts();
    } catch (err) {
      setError("Couldn't delete that product. Please try again.");
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <main className="page-shell">
      <header className="list-header">
        <div>
          <h1>All Products</h1>
          <p className="list-header__subtitle">Everything currently in the catalog.</p>
        </div>
        <Link to="/add" className="btn btn-primary">
          + Add Product
        </Link>
      </header>

      {error && <div className="banner banner-error">{error}</div>}

      {isLoading && <div className="spinner" />}

      {!isLoading && products.length === 0 && (
        <div className="empty-state">
          <h3>No products yet</h3>
          <p>Add your first product to see it listed here.</p>
          <Link to="/add" className="btn btn-primary" style={{ marginTop: 16 }}>
            Add a product
          </Link>
        </div>
      )}

      {!isLoading && products.length > 0 && (
        <div className="product-grid">
          {products.map((product) => (
            <div className="product-card" key={product.id}>
              <div className="product-card__thumb">
                {(product.name || "?").trim().charAt(0).toUpperCase()}
              </div>
              <p className="product-card__name">{product.name}</p>
              <p className="product-card__price">{formatPrice(product.price)}</p>
              <div className="product-card__actions">
                <Link className="btn btn-secondary" to={`/products/${product.id}`}>
                  View
                </Link>
                <button
                  className="btn btn-danger"
                  onClick={() => setPendingDelete({ id: product.id, name: product.name })}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {pendingDelete && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <h3>Remove this product?</h3>
            <p>"{pendingDelete.name}" will be permanently removed.</p>
            <div className="confirm-box__actions">
              <button className="btn btn-secondary" onClick={() => setPendingDelete(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" disabled={isDeleting} onClick={handleConfirmedDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
