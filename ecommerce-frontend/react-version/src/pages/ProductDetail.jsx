// src/pages/ProductDetail.jsx
// Screen: Product Details.
// Backend calls used: GET /api/products/{id}, DELETE /api/products/{id}

import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getProduct, deleteProduct } from "../api";

function formatPrice(price) {
  const num = Number(price);
  return isNaN(num) ? "—" : "$" + num.toFixed(2);
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function loadProduct() {
    setIsLoading(true);
    setError("");
    try {
      const data = await getProduct(id);
      if (!data || data.id == null) {
        setNotFound(true);
      } else {
        setProduct(data);
      }
    } catch (err) {
      setError("Couldn't load this product. Is the backend running?");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deleteProduct(id);
      navigate("/");
    } catch (err) {
      setShowConfirm(false);
      setError("Couldn't delete this product. Please try again.");
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <main className="page-shell">
      <Link to="/" className="back-link">
        ← Back to all products
      </Link>

      {error && <div className="banner banner-error">{error}</div>}

      {isLoading && <div className="spinner" />}

      {!isLoading && notFound && (
        <div className="empty-state">
          <h3>Product not found</h3>
          <p>It may have been removed already.</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: 16 }}>
            Back to catalog
          </Link>
        </div>
      )}

      {!isLoading && product && (
        <section className="detail-card">
          <div className="detail-card__thumb">
            {(product.name || "?").trim().charAt(0).toUpperCase()}
          </div>
          <div className="detail-card__body">
            <p className="detail-card__id">Product ID: {product.id}</p>
            <h1>{product.name}</h1>
            <p className="detail-card__price">{formatPrice(product.price)}</p>
            <div className="detail-card__actions">
              <button className="btn btn-danger" onClick={() => setShowConfirm(true)}>
                Delete Product
              </button>
            </div>
          </div>
        </section>
      )}

      {showConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <h3>Remove this product?</h3>
            <p>This action can't be undone.</p>
            <div className="confirm-box__actions">
              <button className="btn btn-secondary" onClick={() => setShowConfirm(false)}>
                Cancel
              </button>
              <button className="btn btn-danger" disabled={isDeleting} onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
