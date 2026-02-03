import React from "react";
import { Link } from "react-router-dom";
// Make sure to import these new icons
import { FaFacebookF, FaInstagram, FaTwitter, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#080808] text-gray-400 py-12 px-6 border-t border-gray-800">
      {/* Grid Layout for better organization */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

        {/* Column 1: Brand & Tagline */}
        <div>
          <h2 className="text-white text-2xl font-bold mb-4">BookMyGlam</h2>
          <p className="text-sm leading-relaxed text-gray-400">
            Your premier destination for luxury styling and wellness. We bring the best beauty professionals directly to you.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div className="flex flex-col gap-3">
          <h3 className="text-white font-bold text-lg mb-2">Explore</h3>
          <Link to="/" className="hover:text-purple-500 transition text-sm">Home</Link>
          <Link to="/service" className="hover:text-purple-500 transition text-sm">Services Menu</Link>
          <Link to="/gallery" className="hover:text-purple-500 transition text-sm">Style Gallery</Link>
          <Link to="/booking" className="hover:text-purple-500 transition text-sm">Book Appointment</Link>
        </div>

        {/* Column 3: Contact Details (Crucial for Salons) */}
        <div className="flex flex-col gap-4">
          <h3 className="text-white font-bold text-lg mb-2">Contact Us</h3>

          <div className="flex items-start gap-3 text-sm">
            <FaMapMarkerAlt className="text-purple-600 mt-1" />
            <span>123 Fashion Street, City Center,<br />Nagpur, India</span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <FaPhoneAlt className="text-purple-600" />
            <span>+91 XXXX XXXX XX</span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <FaEnvelope className="text-purple-600" />
            <span>hello@bookmyglam.com</span>
          </div>
        </div>

        {/* Column 4: Opening Hours */}
        <div className="flex flex-col gap-3">
          <h3 className="text-white font-bold text-lg mb-2">Opening Hours</h3>
          <div className="flex justify-between text-sm border-b border-gray-800 pb-2">
            <span>Mon - Fri:</span>
            <span className="text-white">10:00 AM - 9:00 PM</span>
          </div>
          <div className="flex justify-between text-sm border-b border-gray-800 pb-2">
            <span>Weekends</span>
            <span className="text-white">10:00 AM - 8:00 PM</span>
          </div>

        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-800 my-8"></div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-center text-xs text-gray-500">
          © 2026 BookMyGlam. All Rights Reserved.
        </p>

        {/* Social Icons */}
        <div className="flex gap-4">
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-900 border border-gray-700 hover:bg-purple-600 hover:border-purple-600 text-white transition">
            <FaInstagram />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-900 border border-gray-700 hover:bg-purple-600 hover:border-purple-600 text-white transition">
            <FaFacebookF />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-900 border border-gray-700 hover:bg-purple-600 hover:border-purple-600 text-white transition">
            <FaTwitter />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;