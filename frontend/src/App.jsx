import { Routes, Route, useLocation } from "react-router-dom";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Navbar from "./components/Navbar";
import FloatingCart from "./components/FloatingCart";
import ItServices from "./pages/Services/ItServices";
import CreativeStudio from "./pages/Services/CreativeStudio";
import WorkspaceTransformation from "./pages/Services/WorkspaceTransformation";
import ProductDetail from "./pages/ProductDetail";
import Footer from "./components/Footer";

const App = () => {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");
  const isDedicatedService =
    pathname.startsWith("/services/it-services") ||
    pathname.startsWith("/services/creative-studio") ||
    pathname.startsWith("/services/workspace-transformation");
  const showGlobalChrome = !isAdmin && !isDedicatedService;

  return (
    <>
      {showGlobalChrome && <Navbar />}
      {showGlobalChrome && <FloatingCart />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/services" element={<Services />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/services/it-services" element={<ItServices />} />
        <Route path="/services/creative-studio" element={<CreativeStudio />} />
        <Route
          path="/services/workspace-transformation"
          element={<WorkspaceTransformation />}
        />
        <Route path="/shop/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
      {showGlobalChrome && <Footer />}
    </>
  );
};
export default App;
