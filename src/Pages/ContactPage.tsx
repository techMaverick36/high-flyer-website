import { useState } from 'react'
import { Phone, Mail, MessageCircle, MapPin, Send, Check } from 'lucide-react'
import { companyInfo } from '../utils/company'
import Section, { SectionHeader } from '../components/Section'
import clsx from 'clsx'

interface FormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

const initialForm: FormData = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
}

export default function ContactPage() {
  const [form, setForm] = useState<FormData>(initialForm)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Partial<FormData>>({})

  const update = (field: keyof FormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const validate = () => {
    const e: Partial<FormData> = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    if (!form.message.trim()) e.message = 'Message is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    // Open mailto as form submission
    const subject = encodeURIComponent(form.subject || `Enquiry from ${form.name}`)
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n\nMessage:\n${form.message}`
    )
    window.location.href = `mailto:${companyInfo.email}?subject=${subject}&body=${body}`
    setSubmitted(true)
    setForm(initialForm)
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <div className="pt-[112px]">
      {/* Header */}
      <section className="relative bg-gradient-to-br from-[#0f172a] via-[#0891b2] to-brand-teal py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3C/g%3E%3C/svg%3E")` }} />
        <div className="section-container relative z-10 text-center">
          <span className="section-label text-teal-300">Contact Us</span>
          <h1 className="font-display font-bold text-white text-5xl md:text-7xl mb-8 tracking-tight leading-tight">
            We're Here to Help
          </h1>
          <p className="text-teal-50/70 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            Have a question, need advice on which appliance to choose, or want to place an order? Reach out — we'll respond quickly.
          </p>
        </div>
      </section>

      {/* Quick Contact Cards */}
      <Section alt>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Phone,
              label: 'Call Us',
              value: companyInfo.phone,
              href: `tel:${companyInfo.phone}`,
              color: 'teal',
            },
            {
              icon: MessageCircle,
              label: 'WhatsApp',
              value: 'Chat Instantly',
              href: `https://wa.me/${companyInfo.whatsapp.replace(/\D/g, '')}`,
              color: 'orange',
            },
            {
              icon: Mail,
              label: 'Email Support',
              value: companyInfo.email,
              href: `mailto:${companyInfo.email}`,
              color: 'teal',
            },
          ].map(({ icon: Icon, label, value, href, color }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="card p-8 flex items-center gap-6 group hover:shadow-2xl transition-all"
            >
              <div className={clsx(
                "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 shadow-inner",
                color === 'teal' ? 'bg-teal-50 text-brand-teal' : 'bg-orange-50 text-brand-orange'
              )}>
                <Icon size={28} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{label}</p>
                <p className="font-display font-bold text-slate-900 text-lg">{value}</p>
              </div>
            </a>
          ))}
        </div>
      </Section>

      {/* Main Content */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
          {/* Contact Form */}
          <div className="lg:col-span-7">
            <span className="section-label">Send a Message</span>
            <h2 className="text-4xl font-display font-bold text-slate-900 mb-4 tracking-tight">Get In Touch</h2>
            <p className="text-slate-500 font-medium mb-12">Fill in the form and we'll reach out to you within 24 hours.</p>

            {submitted && (
              <div className="flex items-center gap-4 bg-green-50 border-2 border-green-100 text-green-700 p-6 rounded-2xl mb-10 animate-fade-in shadow-lg shadow-green-500/5">
                <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center shrink-0">
                  <Check size={20} strokeWidth={3} />
                </div>
                <p className="font-bold">
                  Your message has been sent! We'll get back to you shortly.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block ml-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    className={clsx('input-field w-full py-4 text-base font-bold', errors.name && 'border-red-500 ring-2 ring-red-500/10')}
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block ml-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+256 700 000000"
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    className="input-field w-full py-4 text-base font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  className={clsx('input-field w-full py-4 text-base font-bold', errors.email && 'border-red-500 ring-2 ring-red-500/10')}
                />
              </div>

              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block ml-1">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="e.g. Enquiry about Samsung Fridge"
                  value={form.subject}
                  onChange={(e) => update('subject', e.target.value)}
                  className="input-field w-full py-4 text-base font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block ml-1">
                  Message
                </label>
                <textarea
                  rows={6}
                  placeholder="Tell us how we can help you..."
                  value={form.message}
                  onChange={(e) => update('message', e.target.value)}
                  className={clsx('input-field w-full py-4 text-base font-bold resize-none', errors.message && 'border-red-500 ring-2 ring-red-500/10')}
                />
              </div>

              <button type="submit" className="btn btn-primary px-12 py-5 text-lg shadow-xl shadow-brand-teal/20 gap-3 group">
                <Send size={20} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                <span className="uppercase tracking-widest font-black">Send Message</span>
              </button>
            </form>
          </div>

          {/* Locations sidebar */}
          <div className="lg:col-span-5 space-y-8">
            <div className="card bg-slate-900 p-10 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-teal opacity-20 blur-3xl rounded-full" />
              
              <div className="relative z-10">
                <span className="section-label text-teal-400 !mb-4">Our Locations</span>
                <h3 className="font-display font-bold text-3xl mb-8 tracking-tight">
                  Visit Us In Person
                </h3>

                <div className="space-y-10">
                  {companyInfo.locations.map((loc) => (
                    <div
                      key={loc.id}
                      className="group"
                    >
                      <div className="flex items-start gap-5 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-brand-teal transition-all">
                          <MapPin size={20} className="text-white" />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-400 mb-1 block">{loc.type}</span>
                          <h4 className="font-display font-bold text-white text-xl">
                            {loc.name}
                          </h4>
                        </div>
                      </div>
                      <div className="ml-17 space-y-2">
                        <p className="text-slate-400 font-medium text-sm leading-relaxed">{loc.address}</p>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                          <Check size={12} className="text-brand-teal" />
                          {loc.hours}
                        </p>
                        <a
                          href={loc.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block pt-4 text-xs font-black uppercase tracking-[0.2em] text-brand-teal hover:text-white transition-all"
                        >
                          Open in Maps →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Map Integration Box */}
            <div className="card p-2 h-64 bg-white shadow-xl">
              <div className="w-full h-full rounded-2xl bg-teal-50 flex flex-col items-center justify-center border border-teal-100 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%230891b2' fill-opacity='1'%3E%3Crect x='0' y='0' width='1' height='40'/%3E%3Crect x='0' y='0' width='40' height='1'/%3E%3C/g%3E%3C/svg%3E")` }} />
                <MapPin size={48} className="text-brand-teal mb-4 relative z-10" />
                <p className="text-sm font-black text-slate-900 uppercase tracking-widest relative z-10">Map Integration</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter relative z-10">Visit us at Aponye Mall</p>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}