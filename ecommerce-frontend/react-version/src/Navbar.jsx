// src/Navbar.jsx
import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="top-nav">
      <div className="top-nav__inner">
        <div className="top-nav__brand">
          Simple<span>Shop</span>
        </div>
        <div className="top-nav__links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => "top-nav__link" + (isActive ? " is-active" : "")}
          >
            All Products
          </NavLink>
          <NavLink
            to="/add"
            className={({ isActive }) => "top-nav__link" + (isActive ? " is-active" : "")}
          >
            Add Product
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
