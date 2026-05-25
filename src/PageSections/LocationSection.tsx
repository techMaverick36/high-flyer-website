import { MapPin, Clock, ExternalLink, Phone, MessageCircle } from 'lucide-react'
import { companyInfo } from '../utils/company'
import Section, { SectionHeader } from '../components/Section'

export default function LocationsSection() {
  return (
    <Section alt>
      <SectionHeader
        label="Find Us"
        title="Visit Us In Person"
        subtitle="Come see, touch, and test our appliances before you buy. Our team is ready to help."
        centered
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {companyInfo.locations.map((loc) => (
          <div
            key={loc.id}
            className="card card-hover overflow-hidden group"
          >
            {/* Location header */}
            <div className="bg-slate-900 px-8 py-7 flex items-center justify-between gap-4 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-40 h-40 bg-brand-teal/10 rounded-full blur-2xl pointer-events-none" />
              <div className="relative">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-teal-400 mb-1.5 block">{loc.type}</span>
                <h3 className="font-display font-bold text-white text-xl group-hover:text-teal-300 transition-colors leading-snug">{loc.name}</h3>
              </div>
              <a
                href={loc.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex items-center gap-2 px-4 py-2.5 bg-brand-teal text-white text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-teal-600 transition-all shrink-0"
              >
                <ExternalLink size={12} /> Directions
              </a>
            </div>

            <div className="p-8">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
                    <MapPin size={16} className="text-brand-teal" />
                  </div>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed pt-1">{loc.address}</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
                    <Clock size={16} className="text-brand-teal" />
                  </div>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed pt-1 whitespace-pre-line">{loc.hours}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Contact strip */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <a href={`tel:${companyInfo.phone}`} className="btn btn-outline gap-2 justify-center">
          <Phone size={16} />
          Call {companyInfo.phone}
        </a>
        <a
          href={`https://wa.me/${companyInfo.whatsapp.replace(/\D/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn bg-[#25D366] text-white gap-2 justify-center p-2 hover:bg-[#196334] transition-colors"
        >
          <MessageCircle size={16} />
          Chat on WhatsApp
        </a>
      </div>
    </Section>
  )
}