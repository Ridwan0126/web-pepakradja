import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { PrivateRoute } from "./components/PrivateRoute";
import SplashScreen from "./components/SplashScreen";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Transactions from "./pages/Transactions";
import SKRD from "./pages/SKRD";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import NotFound from "./pages/NotFound";
import SPTRD from "./pages/SPTRD";
import Profile from "./pages/Profile";
import SetPassword from "./pages/SetPassword";
import TentangKami from "./pages/TentangKami";
import ScanTicket from "./pages/ScanTicket";
import Ticket from "./pages/Ticket";
import LupaPassword from "./pages/LupaPassword";
import WANotFound from "./pages/WANotFound";

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const splashShown = sessionStorage.getItem("splashShown");
    if (splashShown) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashFinish = () => {
    sessionStorage.setItem("splashShown", "true");
    setShowSplash(false);
  };

  return (
    <>
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
      {/* 
        PENTING: AuthProvider harus membungkus Router 
        agar PrivateRoute (yang ada di dalam Routes) bisa mengakses useAuth() 
      */}
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/tentangkami" element={<TentangKami />} />
            <Route path="/lupapassword" element={<LupaPassword />} />
            <Route path="/setpassword/:token" element={<SetPassword />} />
            <Route path="/wanotfound" element={<WANotFound />} />

            {/* Halaman yang dibatasi: Harus Login */}
            <Route
              path="/transactions"
              element={
                <PrivateRoute>
                  <Transactions />
                </PrivateRoute>
              }
            />
            <Route
              path="/skrd"
              element={
                <PrivateRoute>
                  <SKRD />
                </PrivateRoute>
              }
            />
            <Route
              path="/sptrd"
              element={
                <PrivateRoute>
                  <SPTRD />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />

            {/* Halaman lain yang sudah ada proteksinya */}
            <Route path="/scanticket" element={<ScanTicket />} />
            <Route path="/ticket" element={<Ticket />} />

            <Route
              path="/checkout"
              element={
                <PrivateRoute>
                  <Checkout />
                </PrivateRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;