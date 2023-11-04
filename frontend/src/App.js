import './App.css';
import Navbar from './components/navbar/Navbar';
import {Routes,Route, useNavigate, createSearchParams} from 'react-router-dom'
import Products from './pages/products/Products';
import Product from './pages/product/Product';
import Cart from './pages/cart/Cart';
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';
import Order from './pages/order/Order';
import AdminOrders from './pages/admin/AdminOrders';
import AddProduct from './pages/admin/AddProduct';

function App() {


  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/adminOrders" element={<AdminOrders />} />
        <Route path="/addProduct" element={<AddProduct />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/orders" element={<Order />} />
      </Routes>
    </div>
  );
}

export default App;
