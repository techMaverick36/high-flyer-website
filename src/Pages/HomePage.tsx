import HeroSection from '../PageSections/HeroSection'
import CategoriesSection from '../PageSections/CategoriesSection'
import FeaturedProductsSection from '../PageSections/Featuredproductssection'
import WhyUsSection from '../PageSections/WhyUsSection'
import TestimonialsSection from '../PageSections/Testimonialssection'
import LocationsSection from '../PageSections/LocationSection'
import CTASection from '../PageSections/CTASection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <FeaturedProductsSection />
      <WhyUsSection />
      <TestimonialsSection />
      <LocationsSection />
      <CTASection />
    </>
  )
}