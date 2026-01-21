import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Booking from "./components/Booking";

function App() {
  return (
    <BrowserRouter>
      <div className="bg-brand-dark min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/booking" element={<Booking />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;