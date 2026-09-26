import { Routes, Route } from "react-router-dom";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Navbar from "./components/Navbar";
import FloatingCart from "./components/FloatingCart";
import ItServices from "./pages/services/ItServices";
import CreativeStudio from "./pages/services/CreativeStudio";
import ProductDetail from "./pages/ProductDetail";
import Footer from "./components/Footer";

const App = () => {
  return (
    <>
      <Navbar />
      <FloatingCart />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/services" element={<Services />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/services/it-services" element={<ItServices />} />
        <Route path="/services/creative-studio" element={<CreativeStudio />} />
        <Route path="/shop/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
      <Footer />
    </>
  );
};
export default App;
