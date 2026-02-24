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
            {/* Map placeholder */}
            <div className="h-56 bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 group-hover:scale-110 transition-transform duration-700"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%230891b2' fill-opacity='1'%3E%3Crect x='0' y='0' width='1' height='40'/%3E%3Crect x='0' y='0' width='40' height='1'/%3E%3C/g%3E%3C/svg%3E")`,
                }}
              />
              <div className="text-center relative z-10 p-6">
                <div className="w-16 h-16 bg-brand-teal rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl transform transition-transform group-hover:rotate-12">
                  <MapPin size={28} className="text-white" />
                </div>
                <div className="inline-block px-4 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-brand-teal text-[10px] font-bold uppercase tracking-widest shadow-sm">
                  {loc.type}
                </div>
              </div>
              <a
                href={loc.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 right-4 bg-slate-900 text-white text-[11px] font-bold uppercase tracking-widest px-4 py-2 rounded-xl flex items-center gap-2 shadow-xl hover:bg-brand-teal transition-all"
              >
                <ExternalLink size={12} /> Directions
              </a>
            </div>

            <div className="p-8">
              <h3 className="font-display font-bold text-slate-900 text-xl mb-4 group-hover:text-brand-teal transition-colors">{loc.name}</h3>
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