import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#080808] text-gray-400 py-12 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Links */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-white">Home</a>
            <a href="#" className="hover:text-white">Services</a>
            <a href="#" className="hover:text-white">About Us</a>
            <a href="#" className="hover:text-white">Contact</a>
            <a href="#" className="hover:text-white">Privacy Policy</a>
          </div>

          {/* Social Icons */}
          <div className="flex gap-4">
            <a
              href="#"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-700 hover:bg-purple-600 hover:border-purple-600 transition"
            >
              <FaInstagram />
            </a>

            <a
              href="#"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-700 hover:bg-purple-600 hover:border-purple-600 transition"
            >
              <FaFacebookF />
            </a>

            <a
              href="#"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-700 hover:bg-purple-600 hover:border-purple-600 transition"
            >
              <FaTwitter />
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Copyright */}
        <p className="text-center text-xs text-gray-500">
          © 2026 BookMyGlam. All Rights Reserved.
        </p>

      </div>
    </footer>
  );
};

export default Footer;
