"use client";

import React from "react";
import { FaTelegram, FaInstagram } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1b1b1b] text-center text-white py-8">
      <div className="flex justify-center gap-6 mb-4">
        <a
          href="https://t.me/@uzkadubbing"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-300 text-2xl hover:text-[#1da1f2] transition-colors"
        >
          <FaTelegram />
        </a>
        <a
          href="https://instagram.com/uzkadubbing"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-300 text-2xl hover:text-[#e1306c] transition-colors"
        >
          <FaInstagram />
        </a>
      </div>

      <p>
        © 2025 <span className="text-red-500 font-semibold">Uzkadubbing</span>
      </p>
      <p>Barcha huquqlar himoyalangan.</p>
    </footer>
  );
};

export default Footer;
