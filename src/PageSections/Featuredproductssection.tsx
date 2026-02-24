import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { getFeaturedProducts } from '../utils/products'
import Section, { SectionHeader } from '../components/Section'
import ProductCard from '../components/ProductCard'

export default function FeaturedProductsSection() {
  const featured = getFeaturedProducts()

  return (
    <Section>
      <SectionHeader
        label="Featured Products"
        title="Top Picks This Season"
        subtitle="Hand-selected appliances that customers love quality, value, and reliability guaranteed."
        action={
          <Link to="/shop" className="btn btn-outline btn-sm">
            View All <ArrowRight size={14} />
          </Link>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {featured.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </Section>
  )
}