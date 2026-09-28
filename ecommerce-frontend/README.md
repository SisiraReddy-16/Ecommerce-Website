# SimpleShop Frontend

A simple, clean frontend for the `ecommerce-backend` Spring Boot API in your project.

The backend only exposes **product** endpoints (there's no login/signup, cart, or
orders code in it), so the frontend covers exactly those 3 screens:

| Screen           | Backend call(s) used                                |
|-------------------|-------------------------------------------------------|
| All Products (home) | `GET /api/products`, `DELETE /api/products/{id}`   |
| Product Details    | `GET /api/products/{id}`, `DELETE /api/products/{id}` |
| Add Product        | `POST /api/products`                                 |

If you add login/signup, cart, or order endpoints to the backend later, I can build
matching screens for those the same way.

Two complete, separate implementations are included — use whichever fits your project:

```
ecommerce-frontend/
├── html-css-js/          Plain HTML + CSS + JavaScript (no build step, no framework)
│   ├── common.css        shared theme, nav, buttons, form styles
│   ├── product-list.html/.css/.js     Screen 1: All Products
│   ├── product-detail.html/.css/.js   Screen 2: Product Details
│   └── add-product.html/.css/.js      Screen 3: Add Product
│
└── react-version/        React app (Vite) with one component per screen
    ├── src/api.js                shared fetch helper
    ├── src/index.css             shared theme (same look as the HTML version)
    ├── src/Navbar.jsx
    ├── src/App.jsx                routes between screens
    └── src/pages/
        ├── ProductList.jsx        Screen 1
        ├── ProductDetail.jsx      Screen 2
        └── AddProduct.jsx         Screen 3
```

Both versions share the same simple, uncluttered theme: a soft off-white background,
a pine-green accent, plain cards with thin borders instead of heavy shadows, and one
typeface (Inter) throughout.

## 1. Run the backend first

```bash
cd ecommerce-backend
./mvnw spring-boot:run
```

It should start on `http://localhost:8080`. `ProductController` already allows all
origins (`@CrossOrigin(origins = "*")`), so either frontend can call it directly.

## 2. Run the plain HTML/CSS/JS version

No build tools needed. Just open `product-list.html` in a browser, or serve the folder:

```bash
cd ecommerce-frontend/html-css-js
python3 -m http.server 5500
# then visit http://localhost:5500/product-list.html
```

If your backend runs somewhere other than `http://localhost:8080`, update the
`API_BASE` constant at the top of each `.js` file.

## 3. Run the React version

```bash
cd ecommerce-frontend/react-version
npm install
npm run dev
```

Vite will print a local URL (usually `http://localhost:5173`). If your backend runs
somewhere other than `http://localhost:8080`, update `API_BASE` in `src/api.js`.

## Notes

- Both versions include: an empty state (no products yet), a loading spinner, error
  banners if the backend is unreachable, and a confirm-before-delete dialog.
- The "thumbnail" on each product is just its first letter in a colored square —
  the backend's `Product` entity has no image field, so nothing is faked or fetched
  for that.
