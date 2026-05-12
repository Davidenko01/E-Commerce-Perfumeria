import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { getPerfumes } from "../services/api";
import type { Perfume } from "../types";

const DISCOUNT_THRESHOLD = 3;
const DEMO_DISCOUNT_PERCENT = 20;

function isOnSaleDemo(index: number): boolean {
  return index < DISCOUNT_THRESHOLD;
}

function getDiscountPercentageDemo(): number {
  return DEMO_DISCOUNT_PERCENT;
}

function getSalePrice(originalPrice: number): number {
  return Math.round(originalPrice * (1 - DEMO_DISCOUNT_PERCENT / 100));
}

export function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);

  useEffect(() => {
    getPerfumes().then((data) => setPerfumes(data.slice(0, 5)));
  }, []);

  const featuredProducts = perfumes;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % featuredProducts.length);
  }, [featuredProducts.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(
      (prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length,
    );
  }, [featuredProducts.length]);

  useEffect(() => {
    if (!isAutoPlaying || featuredProducts.length === 0) return;

    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide, featuredProducts.length]);

  if (featuredProducts.length === 0) {
    return (
      <section className="relative min-h-screen flex flex-col pt-20 bg-card">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </section>
    );
  }

  const currentProduct = featuredProducts[currentIndex];

  const getPrice = (p: Perfume) => Number(p.variantes?.[0]?.precio) || 0;
  const getVolumen = (p: Perfume) => p.variantes?.[0]?.volumen || 100;
  const getImage = (p: Perfume) =>
    "https://juleriaque.vtexassets.com/arquivos/ids/201824/coco-mademoiselle-intense-edp-AE3E1B6032EA4163346339F94012FDF2.jpg?v=638768653782330000"
  const getBrand = (p: Perfume) => p.marca?.nombre || "Perfumería";

  return (
    <section
      className="relative min-h-screen flex flex-col pt-20 bg-card"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background Image with Transition */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {featuredProducts.map((product, index) => (
          <div
            key={product.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={getImage(product)}
              alt={product.nombre}
              className="w-full h-full object-cover opacity-20"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-card via-card/80 to-card/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-card/60 via-card/30 to-card" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <span className="inline-block text-xs tracking-[0.4em] uppercase text-muted-foreground mb-4">
                {getBrand(currentProduct)}
              </span>

              <div className="overflow-hidden">
                <h1
                  key={currentProduct.id}
                  className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium leading-tight tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700"
                >
                  {currentProduct.nombre}
                </h1>
              </div>

              <p
                key={`desc-${currentProduct.id}`}
                className="mt-6 text-base md:text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100"
              >
                {currentProduct.descripcion}
              </p>

              <div
                key={`price-${currentProduct.id}`}
                className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 flex items-center gap-3"
              >
                {isOnSaleDemo(currentIndex) ? (
                  <>
                    <span className="text-2xl font-serif text-accent">
                      ${getSalePrice(getPrice(currentProduct))}
                    </span>
                    <span className="text-lg font-serif text-muted-foreground line-through">
                      ${getPrice(currentProduct)}
                    </span>
                    <span className="px-2 py-1 bg-accent text-accent-foreground text-xs tracking-widest uppercase">
                      -{getDiscountPercentageDemo()}%
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-serif">
                    ${getPrice(currentProduct)}
                  </span>
                )}
                <span className="text-muted-foreground">
                  / {getVolumen(currentProduct)}ml
                </span>
              </div>

              <div className="mt-10 flex flex-col sm:flex-row items-center lg:items-start gap-4">
                <Link
                  to={`/producto/${currentProduct.id}`}
                  className="group inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 text-sm tracking-widest uppercase hover:opacity-90 transition-opacity"
                >
                  Descubrir
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/"
                  className="inline-flex items-center gap-3 border border-primary text-primary px-8 py-4 text-sm tracking-widest uppercase hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  Ver Colección
                </Link>
              </div>
            </div>

            {/* Right - Product Image */}
            <div className="relative aspect-[3/4] max-w-md mx-auto lg:mx-0 lg:ml-auto w-full">
              {featuredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className={`absolute inset-0 transition-all duration-700 ${
                    index === currentIndex
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-95"
                  }`}
                >
                  <img
                    src={getImage(product)}
                    alt={product.nombre}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="relative z-10 py-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-center gap-8">
            {/* Previous Arrow */}
            <button
              onClick={prevSlide}
              className="p-3 border border-border hover:border-foreground hover:bg-secondary/50 transition-all"
              aria-label="Anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Dot Indicators */}
            <div className="flex items-center gap-4">
              {featuredProducts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`transition-all duration-300 ${
                    index === currentIndex
                      ? "w-12 h-1 bg-foreground"
                      : "w-6 h-1 bg-border hover:bg-muted-foreground"
                  }`}
                  aria-label={`Ver perfume ${index + 1}`}
                />
              ))}
            </div>

            {/* Next Arrow */}
            <button
              onClick={nextSlide}
              className="p-3 border border-border hover:border-foreground hover:bg-secondary/50 transition-all"
              aria-label="Siguiente"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
