import { Star } from 'lucide-react'
import { testimonials } from '../utils/company'
import Section, { SectionHeader } from '../components/Section'

export default function TestimonialsSection() {
  return (
    <Section>
      <SectionHeader
        label="Customer Reviews"
        title="What Our Customers Say"
        subtitle="Real stories from happy customers across Kampala and beyond."
        centered
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="card card-hover p-7 flex flex-col"
          >
            {/* Stars */}
            <div className="flex gap-1 mb-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  fill={i < t.rating ? '#f97316' : 'none'}
                  className={i < t.rating ? 'text-brand-orange' : 'text-slate-200'}
                  strokeWidth={2}
                />
              ))}
            </div>

            {/* Quote */}
            <blockquote className="text-[15px] text-slate-600 leading-relaxed flex-1 mb-7 italic">
              {t.text}
            </blockquote>

            {/* Author */}
            <div className="pt-5 border-t border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-brand-teal font-bold text-sm shrink-0">
                {t.name.charAt(0)}
              </div>
              <div>
                <p className="font-display font-bold text-slate-900 text-sm leading-none mb-0.5">{t.name}</p>
                <p className="text-[11px] text-slate-400 uppercase tracking-wide">{t.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats bar — clean, no decorations */}
      <div className="mt-16 bg-slate-900 rounded-2xl px-10 py-12 text-white">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
          {[
            { value: '500+', label: 'Happy Customers' },
            { value: '4.8★', label: 'Average Rating' },
            { value: '100%', label: 'Genuine Products' },
            { value: '2yrs+', label: 'Warranty Support' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display font-bold text-3xl text-white mb-1.5">{stat.value}</div>
              <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}
