import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, Target, Eye, Heart, Clock } from 'lucide-react'
import { companyInfo } from '../utils/company'
import Section, { SectionHeader } from '../components/Section'
import clsx from 'clsx'

export default function AboutPage() {
  return (
    <div className="pt-[112px]">
      {/* Hero */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url("./home1.jpg")` }}
        />
        <div className="absolute inset-0 bg-[#0f172a]/75" />
        <div className="section-container relative z-10 text-center">
          <span className="section-label text-teal-300">About Our Company</span>
          <h1 className="font-display font-bold text-white text-5xl md:text-7xl mb-8 tracking-tight leading-tight">
            We Are High Flyer Trading
          </h1>
          <p className="text-teal-50/70 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            A Ugandan startup built on a simple promise: bring premium home appliances within reach of every family  with genuine quality and honest service.
          </p>
        </div>
      </section>

      {/* Story */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1">
            <span className="section-label">Our Story</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-8 tracking-tight">Born From a Real Need</h2>
            <div className="space-y-6 text-slate-500 text-lg leading-relaxed font-medium">
              <p>
                High Flyer Trading CO LTD was founded with a clear purpose: to make high-quality home appliances accessible to Ugandan families, with the trust and transparency they deserve.
              </p>
              <p>
                Too many people had experienced the frustration of buying an appliance only to find it was a counterfeit, came with no warranty, or left them with no support when something went wrong. We set out to change that.
              </p>
              <p>
                Today, we operate from our showroom at <strong className="text-brand-teal">Aponye Shopping Centre</strong>, where customers can walk in, see the products in person, and get honest advice from our trained team.
              </p>
            </div>
          </div>

          <div className="order-1 lg:order-2 grid grid-cols-2 gap-6">
            {[
              { value: '500+', label: 'Happy Families' },
              { value: '100%', label: 'Genuine Stock' },
              { value: '2+', label: 'Showrooms'},
              { value: '4.8★', label: 'Top Rated'},
            ].map((s) => (
              <div
                key={s.label}
                className="card p-8 text-center bg-slate-50 border-none shadow-inner"
              >
               
                <div className="font-display font-bold text-4xl text-slate-900 mb-2">{s.value}</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Mission / Vision / Values */}
      <Section alt>
        <SectionHeader
          label="Our Foundation"
          title="Mission, Vision & Values"
          centered
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Target,
              title: 'Our Mission',
              color: 'teal',
              text: 'To provide Ugandan homes with genuine, high-quality appliances, backed by expert guidance and reliable support.',
            },
            {
              icon: Eye,
              title: 'Our Vision',
              color: 'orange',
              text: 'To become East Africa\'s most trusted home appliance brand — staying rooted in authenticity and service.',
            },
            {
              icon: Heart,
              title: 'Our Values',
              color: 'teal',
              text: 'Integrity. Transparency. Customer-first. We do what we say, and always put your satisfaction before any sale.',
            },
          ].map(({ icon: Icon, title, text, color }) => (
            <div key={title} className="card p-10 text-center group hover:bg-white transition-all duration-500">
              <div className={clsx(
                "w-20 h-20 rounded-[28px] mx-auto mb-8 flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-inner",
                color === 'teal' ? 'bg-teal-50 text-brand-teal' : 'bg-orange-50 text-brand-orange'
              )}>
                <Icon size={32} strokeWidth={2.5} />
              </div>
              <h3 className="font-display font-bold text-slate-900 text-2xl mb-4 tracking-tight">{title}</h3>
              <p className="text-slate-500 text-[15px] font-medium leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Why Trust Us */}
      <Section>
        <SectionHeader
          label="Trust & Credibility"
          title="Why Customers Choose Us"
          subtitle="We've built our reputation one honest transaction at a time."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {companyInfo.whyChooseUs.map((item) => (
            <div
              key={item.title}
              className="flex items-center gap-6 p-8 card bg-slate-50 border-none group hover:bg-white hover:shadow-2xl hover:shadow-brand-teal/5 transition-all"
            >
              <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-3xl shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <div>
                <h4 className="font-display font-bold text-slate-900 mb-2 text-xl leading-none">{item.title}</h4>
                <p className="text-slate-500 font-medium leading-relaxed text-[15px]">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Locations */}
      <Section alt>
        <SectionHeader
          label="Where to Find Us"
          title="Visit Our Showroom"
          centered
        />
        <div className="max-w-2xl mx-auto">
          {companyInfo.locations.slice(0, 1).map((loc) => (
            <div
              key={loc.id}
              className="card p-10 group hover:shadow-2xl hover:shadow-brand-teal/10 transition-all text-center flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center mb-8 shadow-inner">
                <MapPin size={32} className="text-brand-teal" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-teal mb-4">Official Showroom</span>
              <h3 className="font-display font-bold text-3xl text-slate-900 mb-4">{loc.name}</h3>
              <p className="text-slate-500 font-medium text-lg mb-8 max-w-md">{loc.address}</p>
              
              <div className="w-full h-[1px] bg-slate-100 mb-8" />
              
              <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-xs mb-8">
                <Clock size={16} />
                <span>{loc.hours}</span>
              </div>

              <a
                href={loc.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary px-10 py-4 shadow-xl shadow-brand-teal/20 gap-2 group"
              >
                Get Directions <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section className="!p-0">
        <div className="section-container pb-20">
          <div className="bg-gradient-to-br from-brand-orange to-orange-700 rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="relative z-10">
              <h2 className="font-display font-bold text-white text-4xl md:text-6xl mb-8 tracking-tight">
                Ready to Upgrade Your Home?
              </h2>
              <p className="text-orange-50/80 mb-12 max-w-xl mx-auto text-lg md:text-xl font-medium leading-relaxed">
                Browse our full range of genuine home appliances and place your order directly via WhatsApp.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/shop" className="btn bg-white text-brand-orange px-10 py-5 text-lg font-black uppercase tracking-widest hover:bg-orange-50 transition-all shadow-xl shadow-black/10">
                  Shop Now
                </Link>
                <Link to="/contact" className="btn bg-orange-600/30 text-white border-2 border-white/20 px-10 py-5 text-lg font-black uppercase tracking-widest backdrop-blur-md hover:bg-white/10 transition-all">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}