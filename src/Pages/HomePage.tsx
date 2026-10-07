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
        // The shop (/) targets buying online; this page targets the showroom,
        // so the two don't compete for the same searches.
        title="Home Appliance Showroom in Kampala"
        path="/home"
        description="Visit our home appliance showroom at Aponye Shopping Centre, Kampala. Genuine Hisense, Midea, TCL and Philips appliances with manufacturer warranty."
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