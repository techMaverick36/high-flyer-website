import { Link } from 'react-router-dom'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { companyInfo } from '../utils/company'

export default function CTASection() {
  return (
    <section className="section-padding">
      <div className="section-container">
        <div className="bg-[#0f172a] rounded-2xl px-8 py-16 md:px-20 md:py-20 text-center">
          <div className="max-w-2xl mx-auto">
            <span className="section-label text-teal-400">Ready to Upgrade?</span>
            <h2 className="font-display font-bold text-white text-3xl md:text-5xl mb-6 leading-[1.15]">
              Find Your Perfect Home Appliance Today
            </h2>
            <p className="text-slate-400 text-base md:text-lg mb-10 leading-relaxed">
              Browse our full range, add to cart, and place your order via WhatsApp. No online payment required.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/shop" className="btn btn-primary px-8 py-4 text-base group">
                Shop Collection
                <ArrowRight size={18} className="ml-2 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <a
                href={`https://wa.me/${companyInfo.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn px-8 py-4 text-base bg-white/8 text-white border border-white/15 hover:bg-white/12 transition-all duration-200"
              >
                <MessageCircle size={18} className="mr-2" />
                Ask a Question
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
