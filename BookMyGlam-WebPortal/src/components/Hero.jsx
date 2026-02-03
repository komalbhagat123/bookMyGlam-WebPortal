import React, { useState } from 'react';
import '../index.css';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div
      className="relative min-h-screen w-full bg-[url('./assets/Hero-Image.png')] bg-center bg-cover bg-no-repeat flex flex-col justify-center items-center text-center px-4 overflow-hidden"
      onMouseMove={handleMouseMove}
      style={{
        '--x': `${position.x}px`,
        '--y': `${position.y}px`
      }}
    >
      {/* Dynamic Background Overlay */}
      <div
        className="absolute top-0 left-0 h-full w-full cursor-none pointer-events-none bg-[radial-gradient(250px_at_var(--x)_var(--y),transparent,rgba(0,0,0,0.911))]"
      ></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-5 cursor-none max-w-5xl mx-auto">

        {/* Responsive Text Sizes */}
        <h1 className="text-4xl md:text-6xl lg:text-[80px] leading-tight font-bold text-white">
          Welcome to <i>"BookMyGlam"</i><br />
          Your Space <span className="text-[#7C3AED]">for Style</span>
        </h1>

        <p className="text-base md:text-[18px] text-[#F3F4F6] px-2">
          <i>Where your beauty is our passion and your comfort is our priority. <br className="hidden md:block" />
            Experience unparalleled luxury and expert care designed for you.</i>
        </p>


        <Link to="/booking">
          {/* Responsive Button Padding */}
          <button className="mt-5 text-base md:text-lg font-bold px-10 md:px-20 py-4 md:py-5 border-none rounded-[10px] bg-[#7C3AED] text-white cursor-pointer transition-transform active:scale-95 hover:bg-purple-700 shadow-lg hover:shadow-purple-500/50">
            Book Your Appointment Now
          </button></Link>
      </div>
    </div>
  );
};

export default Hero;