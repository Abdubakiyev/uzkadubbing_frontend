"use client";

import React from "react";
import { FaTelegram, FaInstagram, FaHeart, FaCrown, FaFilm } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-[#111] to-black text-white py-12">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/5 to-transparent"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent"></div>
      
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-3 mb-6 md:mb-0">
            <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-amber-600 rounded-full flex items-center justify-center">
              <FaFilm className="text-white text-xl" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                Uzkadubbing
              </span>
              <p className="text-gray-400 text-sm">Eng yaxshi animelar</p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex space-x-6">
            <a
              href="https://t.me/@uzkadubbing"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative w-14 h-14 bg-gradient-to-br from-gray-900 to-black rounded-full flex items-center justify-center border border-gray-800 hover:border-[#1da1f2]/50 transition-all duration-300 hover:scale-110"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#1da1f2]/0 via-[#1da1f2]/10 to-[#1da1f2]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
              <FaTelegram className="text-gray-300 text-2xl group-hover:text-[#1da1f2] transition-colors duration-300" />
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#1da1f2] rounded-full blur-sm opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
            </a>
            
            <a
              href="https://instagram.com/uzkadubbing"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative w-14 h-14 bg-gradient-to-br from-gray-900 to-black rounded-full flex items-center justify-center border border-gray-800 hover:border-[#e1306c]/50 transition-all duration-300 hover:scale-110"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#e1306c]/0 via-[#e1306c]/10 to-[#e1306c]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
              <FaInstagram className="text-gray-300 text-2xl group-hover:text-[#e1306c] transition-colors duration-300" />
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#e1306c] rounded-full blur-sm opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent my-8"></div>

        {/* Copyright Section */}
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-4">
            © 2025{" "}
            <span className="bg-gradient-to-r from-red-500 via-red-400 to-amber-500 bg-clip-text text-transparent font-bold">
              Uzkadubbing
            </span>
          </p>
          
          <p className="text-gray-500 mb-6">
            Barcha huquqlar himoyalangan.
          </p>
          
          {/* Made with love */}
          <div className="flex items-center justify-center space-x-2 text-gray-500 text-sm">
            <span>Made with</span>
            <FaHeart className="text-red-500 animate-pulse" />
            <span>by Uzkadubbing Team</span>
          </div>

          {/* Premium Badge */}
          <div className="mt-6 inline-flex items-center space-x-2 bg-gradient-to-r from-amber-900/20 to-yellow-900/20 backdrop-blur-sm px-4 py-2 rounded-full border border-amber-500/20">
            <FaCrown className="text-amber-400" />
            <span className="text-amber-300 text-sm font-medium">Premium Anime Platform</span>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-yellow-500 to-red-600"></div>
      
      {/* Floating Elements */}
      <div className="absolute bottom-10 left-10 w-4 h-4 bg-red-500/20 rounded-full blur-md animate-pulse"></div>
      <div className="absolute top-10 right-10 w-3 h-3 bg-yellow-500/20 rounded-full blur-md animate-pulse delay-1000"></div>
    </footer>
  );
};

export default Footer;