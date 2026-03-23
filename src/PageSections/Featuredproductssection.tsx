import { Link } from 'react-router-dom'
import { ArrowRight, Loader2 } from 'lucide-react'
import { useGetFeaturedProductsQuery } from '../store/api/sanityApi'
import Section, { SectionHeader } from '../components/Section'
import ProductCard from '../components/ProductCard'

export default function FeaturedProductsSection() {
  const { data: featured = [], isLoading: loading } = useGetFeaturedProductsQuery()

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

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 size={40} className="animate-spin mb-4 text-brand-teal" />
          <p className="font-medium">Loading featured picks...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </Section>
  )
}