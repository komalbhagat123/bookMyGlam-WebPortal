import React from 'react';
// Note: Apni image yahan import karein ya public folder ka path dein
// import heroBg from '../assets/hero-bg.jpg'; 

const Hero = () => {
  return (
    <div className="relative w-full h-[80vh] bg-cover bg-center flex items-center justify-center text-center px-4 hero-Sec">

      {/* Dark Overlay for readability */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto content" >
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
          Welcome to Elegance – <br />
          Your Space <span className="text-brand-purple">for Style</span>
        </h1>

        <p className="text-gray-300 text-lg mb-8 font-light">
          Where your beauty is our passion and your comfort is our priority. <br></br>
          Experience unparalleled luxury and expert care designed for you.
        </p>

        <button className="bg-brand-purple hover:bg-purple-700 text-white px-8 py-3 rounded font-bold text-lg shadow-lg hover:shadow-purple-500/50 transition">
          Book Your Appointment Now
        </button>
      </div>
    </div>
  );
};

export default Hero;