import Section, { SectionHeader } from '../components/Section'
import { companyInfo } from '../utils/company'

export default function WhyUsSection() {
  return (
    <Section alt>
      <SectionHeader
        label="Why High Flyer"
        title="Your Trusted Appliance Partner"
        subtitle="We don't just sell appliances we build lasting relationships built on trust, quality, and genuine service."
        centered
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {companyInfo.whyChooseUs.map((item, index) => (
          <div
            key={item.title}
            className="card card-hover p-10 group relative overflow-hidden"
          >
            <span className="absolute top-4 right-5 font-display text-7xl font-black text-slate-100 select-none leading-none pointer-events-none">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className="font-display font-bold text-slate-900 mb-4 text-xl group-hover:text-brand-teal transition-colors relative z-10">{item.title}</h3>
            <p className="text-[15px] text-slate-500 font-medium leading-relaxed relative z-10">{item.description}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}