import { Link } from 'react-router-dom'
import { ArrowRight, Loader2 } from 'lucide-react'
import { useGetAllCategoriesQuery } from '../store/api/sanityApi'
import Section, { SectionHeader } from '../components/Section'

export default function CategoriesSection() {
  const { data: categories = [], isLoading: loading } = useGetAllCategoriesQuery()
  return (
    <Section alt>
      <SectionHeader
        label="Browse by Category"
        title="Everything For Your Home"
        subtitle="From kitchen to living room find the perfect appliance for every corner of your home."
        action={
          <Link to="/shop" className="btn btn-outline btn-sm">
            All Products <ArrowRight size={14} />
          </Link>
        }
      />

      <div className="grid md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 size={40} className="animate-spin mb-4 text-brand-teal" />
            <p className="font-medium">Loading categories...</p>
          </div>
        ) : (
          categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.id}`}
              className="group card card-hover text-center flex flex-col items-center overflow-hidden"
            >
              <div className="w-full aspect-[4/3] relative overflow-hidden bg-slate-100">
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                    <span className="text-slate-300 text-sm font-bold uppercase tracking-widest">{cat.label}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-slate-900/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-6 flex flex-col items-center">
                <h3 className="font-display font-bold text-slate-900 text-lg mb-2 group-hover:text-brand-teal transition-colors">
                  {cat.label}
                </h3>
                <p className="text-sm text-slate-500 mb-6 font-medium leading-relaxed">{cat.description}</p>
                <div className="mt-auto px-4 py-1.5 rounded-full bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-widest group-hover:bg-brand-teal/10 group-hover:text-brand-teal transition-all">
                  {cat.count} Products
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </Section>
  )
}