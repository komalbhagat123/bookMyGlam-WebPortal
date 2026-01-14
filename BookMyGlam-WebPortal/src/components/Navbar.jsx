import React from 'react';
import { Link } from 'react-router-dom';
import img from "../assets/SBMS-LOGO-2.png";

const Navbar = () => {
  return (
    <nav className="bg-black text-white py-4 px-6 md:px-12 flex justify-between items-center border-b border-gray-800">
      {/* Logo */}
      <div className="text-2xl font-bold flex items-center gap-2">
        <a href=""><span className="text-brand-purple text-3xl"><img src={img} alt="" srcset="" /></span></a>
      </div>

      {/* Desktop Menu */}
      <div className= "Menu">
      <ul className="hidden md:flex space-x-8 text-sm font-medium text-gray-300 list-none">
       <a href=""><li className="hover:text-brand-purple  transition">Home</li></a> 
        <a href=""><li className="hover:text-brand-purple cursor-pointer transition">Booking</li></a>
        <a href=""><li className="hover:text-brand-purple cursor-pointer transition">Service</li></a>
        <a href=""><li className="hover:text-brand-purple cursor-pointer transition">Gallery</li></a>
        <a href=""><li className="hover:text-brand-purple cursor-pointer transition">About Us</li></a>
      </ul>

      {/* Button */}
      <button className="bg-brand-purple hover:bg-purple-700 text-white px-6 py-2 rounded font-semibold transition text-sm">
        Book Now
      </button>
      </div>
    </nav>
  );
};

export default Navbar;