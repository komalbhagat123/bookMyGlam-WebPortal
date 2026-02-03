import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X } from "lucide-react";
import img from "../assets/logo.png"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  const getLinkClass = ({ isActive }) =>
    isActive
      ? "text-purple-600 font-bold transition duration-300"
      : "text-gray-300 hover:text-purple-600 transition duration-300";

  return (
    <nav className="bg-black text-white py-4 px-6 md:px-12 border-b border-gray-800 relative z-50">
      <div className="flex justify-between items-center w-full max-w-7xl mx-auto">

        {/* Logo */}
        <div className="text-2xl font-bold flex items-center gap-2">
          <Link to="/" onClick={closeMenu}>
            <span className="text-brand-purple text-3xl">
              <img src={img} alt="Logo" className="h-30 w-auto" />
            </span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8 text-sm font-bold items-center">
          <li><NavLink to="/" className={getLinkClass}>Home</NavLink></li>
          <li><NavLink to="/service" className={getLinkClass}>Service</NavLink></li>
          <li><NavLink to="/gallery" className={getLinkClass}>Gallery</NavLink></li>
          <li><NavLink to="/about" className={getLinkClass}>About Us</NavLink></li>
          <li><NavLink to="/contact" className={getLinkClass}>Contact Us</NavLink></li>
          <li>
            <Link to="/booking">
              <button className="bg-purple-600 hover:bg-purple-700 active:scale-95 text-white px-6 py-2 rounded font-bold transition text-sm">
                Book Now
              </button>
            </Link>
          </li>
        </ul>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden text-gray-300 hover:text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#0f0f0f] border-b border-gray-800 flex flex-col items-center py-6 space-y-6 shadow-xl">
          <NavLink to="/" onClick={closeMenu} className="text-gray-300 hover:text-purple-500 text-lg transition">Home</NavLink>
          <NavLink to="/service" onClick={closeMenu} className="text-gray-300 hover:text-purple-500 text-lg transition">Service</NavLink>
          <NavLink to="/gallery" onClick={closeMenu} className="text-gray-300 hover:text-purple-500 text-lg transition">Gallery</NavLink>
          <NavLink to="/about" onClick={closeMenu} className="text-gray-300 hover:text-purple-500 text-lg transition">About Us</NavLink>
          <NavLink to="/contact" onClick={closeMenu} className="text-gray-300 hover:text-purple-500 text-lg transition">Contact Us</NavLink>

          <Link to="/booking" onClick={closeMenu} className="w-3/4">
            <button className="bg-purple-600 hover:bg-purple-700 active:scale-95 w-full py-3 rounded-lg text-white font-bold transition">
              Book Now
            </button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;