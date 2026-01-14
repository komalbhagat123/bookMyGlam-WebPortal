import Navbar from './components/Navbar';
import Hero from './components/Hero';

function App() {
  return (
    <div className="bg-brand-dark min-h-screen">
      <Navbar />
      <Hero />
      
      {/* Baaki sections placeholder */}
      <div className="h-screen bg-black text-white flex items-center justify-center">
         Next Sections: Cards & Offers...
      </div>
    </div>
  );
}

export default App;