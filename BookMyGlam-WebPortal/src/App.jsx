import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Home from "./components/Home";
import Booking from "./components/Booking";
import Services from "./components/Services";
import Contact from "./components/Contact";
import Gallery from "./components/Gallery";
import About from "./components/About";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ChatBot from "./components/ChatBot";

// ✅ Add this
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop /> {/* ✅ Add this */}
      <Navbar />
      <div className="bg-brand-dark min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/service" element={<Services />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
      <ChatBot />
      <Footer />
    </BrowserRouter>
  );
}

export default App;