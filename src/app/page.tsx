import AnimeGrid from "../components/AnimeGrid";
import Footer from "../components/Footer";
import Header from "../components/Header";
import HeroSlider from "../components/HeroSlider";
import MainHeader from "../components/MainHeader";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Header />

      {/* 🔹 Headerdan keyingi komponentlarga margin-top */}
      <div className="mt-20">
        <HeroSlider />
        <AnimeGrid />
        <Footer />
      </div>
    </main>
  );
}
