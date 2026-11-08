import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Desktop Images
import hero1 from '../../assets/hero1.png';
import hero2 from '../../assets/hero2.png';
import hero3 from '../../assets/hero3.png';

// Mobile Images
import mobileHero1 from '../../assets/mobile/hero-mobile-1.png';
import mobileHero2 from '../../assets/mobile/hero-mobile-2.png';
import mobileHero3 from '../../assets/mobile/hero-mobile-3.png';

const banners = [
  {
    desktop: hero1,
    mobile: mobileHero1,
  },
  {
    desktop: hero2,
    mobile: mobileHero2,
  },
  {
    desktop: hero3,
    mobile: mobileHero3,
  },
];

export const HeroBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Automatic sliding
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + banners.length) % banners.length
    );
  };

  return (
    <section className="relative w-full mt-0 mb-3 sm:my-2 group">

      {/* Banner Container */}
      <div className="relative w-full overflow-hidden rounded-xl sm:rounded-2xl bg-cream-50">

        {banners.map((banner, index) => (
          <Link
            to="/products"
            key={index}
            className={`block w-full transition-opacity duration-700 ${
              currentSlide === index
                ? 'opacity-100 relative z-10'
                : 'opacity-0 absolute inset-0 pointer-events-none'
            }`}
          >
            <picture>
              {/* Mobile Image */}
              <source
                media="(max-width: 639px)"
                srcSet={banner.mobile}
              />

              {/* Desktop Image */}
              <img
                src={banner.desktop}
                alt={`Ghajanas promotional banner ${index + 1}`}
                className="w-full h-auto block"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            </picture>
          </Link>
        ))}

        {/* Previous Button */}
        <button
          onClick={prevSlide}
          aria-label="Previous banner"
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20
          w-8 h-8 sm:w-12 sm:h-12 rounded-full
          bg-white/90 text-forest-900 shadow-lg
          flex items-center justify-center
          hover:bg-forest-900 hover:text-white
          transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
        >
          <ChevronLeft size={22} />
        </button>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          aria-label="Next banner"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20
          w-8 h-8 sm:w-12 sm:h-12 rounded-full
          bg-white/90 text-forest-900 shadow-lg
          flex items-center justify-center
          hover:bg-forest-900 hover:text-white
          transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
        >
          <ChevronRight size={22} />
        </button>

        {/* Pagination Dots */}
        <div className="absolute bottom-3 sm:bottom-5 left-1/2
          -translate-x-1/2 flex items-center gap-2 z-20">



        </div>

      </div>
    </section>
  );
};