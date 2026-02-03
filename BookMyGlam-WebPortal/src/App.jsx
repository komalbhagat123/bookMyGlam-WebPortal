import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Booking from "./components/Booking";
import Services from "./components/Services";
import Contact from "./components/Contact";
import Gallery from "./components/Gallery";
import About from "./components/About";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (

    <BrowserRouter>

      <Navbar />

      <div className="bg-brand-dark min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/booking" element={<Booking />} />
          {/* Add placeholder routes to prevent crashes if you click other links */}
          <Route path="/service" element={<Services />} />
          <Route path="/gallery" element={<Gallery/>} />
          <Route path="/about" element={<About />}/>
          <Route path="/contact" element={<Contact/>} />
        </Routes>
      </div>

      <Footer />
    </BrowserRouter>
  );
}

export default App;