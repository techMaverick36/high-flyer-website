import HeroSection from '../PageSections/HeroSection'
import CategoriesSection from '../PageSections/CategoriesSection'
import FeaturedProductsSection from '../PageSections/Featuredproductssection'
import WhyUsSection from '../PageSections/WhyUsSection'
import TestimonialsSection from '../PageSections/Testimonialssection'
import LocationsSection from '../PageSections/LocationSection'
import CTASection from '../PageSections/CTASection'
import SEO from '../components/SEO'

export default function HomePage() {
  return (
    <>
      <SEO
        path="/"
        description="Uganda's most trusted home appliance showroom. Shop genuine refrigerators, TVs, washing machines, cookers and more at Aponye Shopping Centre, Kampala."
      />
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