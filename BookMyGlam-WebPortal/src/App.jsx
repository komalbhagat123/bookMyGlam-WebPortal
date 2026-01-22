import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Booking from "./components/Booking";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"

function App() {
  return (<>
    <Navbar />

    <BrowserRouter>
      <div className="bg-brand-dark min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/booking" element={<Booking />} />
        </Routes>
      </div>
    </BrowserRouter>
      <Footer/>
    </>
  );
}

export default App;