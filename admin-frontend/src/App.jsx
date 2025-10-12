import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "./components/Layout/Layout";
import ProductList from "./pages/Products/ProductList";
import ProductDetail from "./pages/Products/ProductDetail";
import OrderList from "./pages/Orders/OrderList";
import OrderDetail from "./pages/Orders/OrderDetail";
import CategoryList from "./pages/Categories/CategoryList";
import UnitList from "./pages/Units/UnitList";
import ProductCreate from "./pages/Products/ProductCreate";
import ProductEdit from "./pages/Products/ProductEdit";
import Dashboard from "./pages/Dashboard/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />

      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="products" element={<ProductList />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="orders" element={<OrderList />} />
          <Route path="orders/:id" element={<OrderDetail />} />
          <Route path="categories" element={<CategoryList />} />
          <Route path="units" element={<UnitList />} />
          <Route path="products/create" element={<ProductCreate />} />
          <Route path="products/:id/edit" element={<ProductEdit />} />
          <Route index element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
