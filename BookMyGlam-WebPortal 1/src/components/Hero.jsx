import React, { useState } from 'react';
import '../index.css';

const Hero = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    // We calculate coordinates relative to the PARENT container
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <>
      {/* FIX 1: MOVED `onMouseMove` to the main container.
        Now, even if you hover over the text, this parent still hears the event.
      */}
      <div
        className="relative w-full h-[80vh] bg-cover bg-center flex items-center justify-center text-center px-4 hero-Sec"
        onMouseMove={handleMouseMove}
        style={{
          // FIX 2: MOVED variables here.
          // The .box inside will automatically "inherit" these variables.
          '--x': `${position.x}px`,
          '--y': `${position.y}px`
        }}
      >

        {/* FIX 3: Removed logic from here. 
          It just sits there and reads the inherited --x and --y from the parent.
          Added 'pointer-events-none' so it doesn't block clicks.
        */}
        <div className="box pointer-events-none"></div>

        {/* Content */}
        <div className="relative z-10 max-w-3xl mx-auto content">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
            Welcome to BookMyGlam – <br />
            Your Space <span className="text-brand-purple">for Style</span>
          </h1>

          <p className="text-gray-300 text-lg mb-8 font-light">
            Where your beauty is our passion and your comfort is our priority. <br />
            Experience unparalleled luxury and expert care designed for you.
          </p>

          <button className="bg-brand-purple hover:bg-purple-700 text-white px-8 py-3 rounded font-bold text-lg shadow-lg hover:shadow-purple-500/50 transition">
            Book Your Appointment Now
          </button>
        </div>
      </div>
    </>
  );
};

export default Hero;