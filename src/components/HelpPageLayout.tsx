import type { ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ChevronRight, MessageCircle, Phone, Mail } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import clsx from 'clsx'
import { companyInfo } from '../utils/company'
import { helpPages } from '../utils/policies'
import { SITE_ORIGIN } from '../utils/site'

interface HelpPageLayoutProps {
  path: string
  label: string
  title: string
  intro: string
  children: ReactNode
}

/**
 * Shared shell for the Delivery, Returns and FAQ pages: header, breadcrumb
 * (visible + JSON-LD), a side menu cross-linking the help pages, and a
 * contact box so every page ends with a way to ask a question.
 */
export default function HelpPageLayout({ path, label, title, intro, children }: HelpPageLayoutProps) {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_ORIGIN}/home` },
      { '@type': 'ListItem', position: 2, name: label, item: `${SITE_ORIGIN}${path}` },
    ],
  }
  const whatsappHref = `https://wa.me/${companyInfo.whatsapp.replace(/\D/g, '')}`

  return (
    <div className="pt-24 md:pt-28 min-h-screen bg-background">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <header className="bg-white border-b border-slate-100">
        <div className="section-container py-10 md:py-14">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-2 text-sm font-medium">
              <li>
                <Link to="/home" className="text-slate-400 hover:text-brand-teal transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight size={14} className="text-slate-300" />
              </li>
              <li aria-current="page" className="text-slate-700">
                {label}
              </li>
            </ol>
          </nav>
          <h1 className="font-display font-bold text-3xl md:text-5xl text-slate-900 tracking-tight mb-4">
            {title}
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed max-w-2xl">{intro}</p>
        </div>
      </header>

      <div className="section-container py-10 md:py-16">
        <div className="grid lg:grid-cols-[220px_1fr] gap-8 lg:gap-14">
          <aside className="lg:sticky lg:top-36 self-start">
            <p className="label-caps text-[11px] text-slate-400 mb-3">Help</p>
            <nav aria-label="Help pages" className="flex lg:flex-col gap-2 overflow-x-auto">
              {helpPages.map((page) => (
                <NavLink
                  key={page.path}
                  to={page.path}
                  className={({ isActive }) =>
                    clsx(
                      'px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors',
                      isActive
                        ? 'bg-teal-50 text-brand-teal font-semibold'
                        : 'text-slate-600 hover:bg-slate-50 font-medium'
                    )
                  }
                >
                  {page.label}
                </NavLink>
              ))}
            </nav>
          </aside>

          <div className="min-w-0 max-w-3xl">
            {children}

            <section className="mt-14 card bg-white p-6 md:p-8">
              <h2 className="font-display font-bold text-xl text-slate-900 mb-2">Still have a question?</h2>
              <p className="text-slate-600 mb-6">
                Our team is happy to help before and after you buy.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-primary px-5 py-3 gap-2">
                  <MessageCircle size={18} />
                  WhatsApp us
                </a>
                <a
                  href={`tel:${companyInfo.phone}`}
                  className="btn px-5 py-3 gap-2 bg-white border border-slate-200 text-slate-700 hover:border-brand-teal hover:text-brand-teal"
                >
                  <Phone size={18} />
                  {companyInfo.phone}
                </a>
                <a
                  href={`mailto:${companyInfo.email}`}
                  className="btn px-5 py-3 gap-2 bg-white border border-slate-200 text-slate-700 hover:border-brand-teal hover:text-brand-teal"
                >
                  <Mail size={18} />
                  Email
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

/** A titled block of body copy inside a help page. */
export function HelpSection({ id, title, children }: { id?: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="mb-10 last:mb-0 scroll-mt-40">
      <h2 className="font-display font-bold text-2xl text-slate-900 mb-4">{title}</h2>
      <div className="space-y-4 text-slate-600 leading-relaxed">{children}</div>
    </section>
  )
}
