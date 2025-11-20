"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const slides = [
  {
    id: 1,
    title: "Iblislar qotili: Cheksiz qal'a",
    desc: "Tanjirou Kamado singlisi Nezuko iblisga aylangandan so‘ng, iblislarni ovlaydigan Iblis Qiruvchi Korp bilan birlashadi.",
    genres: ["Fantastika", "Sarguzasht", "Ekshn"],
    image: "/anime1.jpg",
  },
  {
    id: 2,
    title: "Barcha davrlarning qahramoni",
    desc: "Yosh qahramon o‘z dunyosini himoya qilish uchun maxfiy kuchni uyg‘otadi.",
    genres: ["Fantastika", "Drama"],
    image: "/anime2.jpg",
  },
  {
    id: 3,
    title: "Noma’lum afsona",
    desc: "Afsonaviy jangchilar o‘tmish sirlarini ochish uchun kurashga otlanadi.",
    genres: ["Sarguzasht", "Mistika"],
    image: "/anime3.jpg",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const router = useRouter();

  // 🔹 Har 5 soniyada keyingi rasmga o'tish
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // 🔹 Sahifaga id orqali o'tish
  const handleClick = (id: number) => {
    router.push(`/anime/${id}`);
  };

  return (
    <div className="relative w-full h-[60vh] overflow-hidden mt-16">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          onClick={() => handleClick(slide.id)}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out cursor-pointer ${
            index === current
              ? "opacity-100 translate-x-0 z-10"
              : "opacity-0 translate-x-full z-0"
          }`}
        >
          {/* Background Image */}
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority
            className="object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

          {/* Text Content */}
          <div className="absolute bottom-16 left-10 md:left-20 text-white max-w-3xl select-none">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
              {slide.title}
            </h1>

            <div className="flex gap-3 mb-6">
              {slide.genres.map((g) => (
                <span
                  key={g}
                  className="bg-white/20 backdrop-blur-sm px-4 py-1 rounded-md text-sm font-medium"
                >
                  {g}
                </span>
              ))}
            </div>

            <p className="text-lg text-white/90 leading-relaxed drop-shadow">
              {slide.desc}
            </p>
          </div>
        </div>
      ))}

      {/* Dots Indicator */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              current === i ? "bg-purple-500 scale-110" : "bg-white/50"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}
