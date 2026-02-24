import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { categories } from '../utils/products'
import Section, { SectionHeader } from '../components/Section'

export default function CategoriesSection() {
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

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/shop?category=${cat.id}`}
            className="group card card-hover text-center flex flex-col items-center overflow-hidden"
          >
            <div className="w-full aspect-[4/3] relative overflow-hidden">
              <img
                src={cat.image}
                alt={cat.label}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                <span className="text-white text-xs font-bold uppercase tracking-widest">Explore Category</span>
              </div>
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
        ))}
      </div>
    </Section>
  )
}