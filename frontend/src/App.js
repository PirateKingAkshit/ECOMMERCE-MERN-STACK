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
import MyProfile from './pages/My Profile/MyProfile';
import ForgotPasswordForm from './pages/forgot-password/ForgotPasswordForm';
import ResetPasswordForm from './pages/forgot-password/ResetPasswordForm';

function App() {


  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/profile" element={<MyProfile />} />
        <Route path="/adminOrders" element={<AdminOrders />} />
        <Route path="/addProduct" element={<AddProduct />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/orders" element={<Order />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/change-password" element={<ForgotPasswordForm />} />
        <Route path="/reset-password/:id/:token" element={<ResetPasswordForm />} />
      </Routes>
    </div>
  );
}

export default App;
