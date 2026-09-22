import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, MapPin } from 'lucide-react'
import { companyInfo } from '../utils/company'

// Lifestyle images — same Unsplash source already used in the project,
// expanded to full-width crops for the carousel background
const slides = [
  {
    image: '/home1.jpg',
    alt: 'CHiQ 40" Full HD Smart TV',
  },
  {
    image: '/home2.jpg',
    alt: 'SPJ Single Door Refrigerator',
  },
  {
    image: '/home3.jpg',
    alt: 'Midea Automatic Washing Machine',
  },
  {
    image: '/home4.jpg',
    alt: 'SPJ 4-Burner Gas Cooker with Oven',
  },
]

export default function HeroSection() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    // WCAG 2.2.2: auto-advancing content needs a pause mechanism, and
    // respect the OS "reduce motion" setting by not rotating at all.
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (paused || reduceMotion) return

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [paused])

  return (
    // Capped well below 100vh so the next section peeks above the fold and
    // signals there is more to scroll to — a full-viewport hero buries the
    // products on an e-commerce home page.
    <section
      className="relative flex items-center overflow-hidden pt-28 min-h-[600px] md:min-h-[68vh] lg:min-h-[70vh] lg:max-h-[760px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >

      {/* ── Background carousel ── */}
      <div className="absolute inset-0" aria-hidden="true">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className="absolute inset-0 transition-opacity duration-1400 ease-in-out"
            style={{ opacity: idx === current ? 1 : 0 }}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className="w-full h-full object-cover"
              loading={idx === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}

        {/* Overlay — dark enough for text, warm not cold */}
        <div className="absolute inset-0 bg-linear-to-r from-[#0f172a]/80 via-[#0f172a]/55 to-transparent" />
      </div>

      {/* ── Content ── */}
      <div className="section-container relative z-10 w-full py-14 lg:py-20">
        <div className="max-w-2xl">

          {/* No tracking-tight — Clash Display is already tightly spaced, and
              negative tracking at this size closes up the word gaps. */}
          <h1 className="font-display font-bold text-white leading-[1.05] mb-5 text-5xl md:text-6xl lg:text-7xl">
            <span className="block">Premium Home</span>
            <span className="block text-brand-teal">Appliances</span>
     
          </h1>

          <p className="text-white/85 text-lg md:text-xl leading-[1.7] mb-8 max-w-xl">
            Uganda's most trusted appliance showroom — genuine products, honest service, and a team that cares.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/shop"
              className="btn btn-primary px-8 py-4 text-base group"
            >
              Shop Now
              <ArrowRight size={18} className="ml-2 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <a
              href={companyInfo.locations[1]?.mapUrl ?? companyInfo.locations[0].mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn px-8 py-4 text-base bg-white/10 text-white border border-white/25 hover:bg-white/18 transition-all duration-200"
            >
              <MapPin size={18} className="mr-2 shrink-0" />
              Visit Showroom
            </a>
          </div>
        </div>
      </div>

      {/* ── Slide indicators ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10" role="tablist" aria-label="Carousel slides">
        {slides.map((_, idx) => (
          <button
            key={idx}
            role="tab"
            aria-selected={idx === current}
            aria-label={`Slide ${idx + 1}`}
            onClick={() => setCurrent(idx)}
            className={`h-0.75 rounded-full transition-all duration-300 ${
              idx === current ? 'w-8 bg-white' : 'w-2.5 bg-white/35'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
