import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ChevronDown } from 'lucide-react'
import SEO from '../components/SEO'
import HelpPageLayout from '../components/HelpPageLayout'
import { policies } from '../utils/policies'
import { companyInfo } from '../utils/company'

const showroom = companyInfo.locations.find((l) => l.id === 'showroom')

/** `answer` is plain text: it's both what's shown and what goes into the
 *  FAQPage JSON-LD, so the two can't drift apart. */
const faqs: { question: string; answer: string; link?: { to: string; label: string } }[] = [
  {
    question: 'Are your products genuine?',
    answer:
      'Yes. Every appliance we sell is 100% authentic, sourced directly from certified manufacturers and authorised distributors.',
  },
  {
    question: 'Do you deliver outside Kampala?',
    answer: `Yes. We deliver to ${policies.delivery.area}.`,
    link: { to: '/delivery', label: 'Delivery & payment details' },
  },
  {
    question: 'How much does delivery cost?',
    answer: policies.delivery.fees,
  },
  {
    question: 'How long does delivery take?',
    answer: policies.delivery.timing,
  },
  {
    question: 'How can I pay?',
    answer:
      'You can pay cash on delivery, by Mobile Money, by bank transfer (EFT), or in person at our showroom.',
  },
  {
    question: 'Can I pay on delivery?',
    answer: 'Yes. Cash on delivery is available — you pay when your order arrives.',
  },
  {
    question: 'Do your appliances come with a warranty?',
    answer:
      "Yes. Every product carries the full manufacturer's warranty. The warranty period is shown on each product page, and we handle warranty claims on your behalf.",
    link: { to: '/returns', label: 'Returns & warranty details' },
  },
  {
    question: 'Can I return an item?',
    answer: `Yes. You can return an item within ${policies.returns.days} days of receiving it for a refund or exchange, as long as it is unused and in its original packaging.`,
    link: { to: '/returns', label: 'How to make a return' },
  },
  {
    question: 'Can I see an appliance before I buy it?',
    answer: `Yes. Visit our showroom at ${showroom?.address ?? 'Aponye Shopping Centre, Kampala'} to see and compare appliances in person.${showroom ? ` Opening hours: ${showroom.hours.replace('\n', ', ')}.` : ''}`,
  },
  {
    question: 'Do you install appliances?',
    answer:
      'Yes. We offer professional installation for appliances that need it, such as air conditioners and TV wall mounts. Ask about installation when you order.',
  },
  {
    question: 'How do I place an order?',
    answer:
      'Add products to your cart and send the order to us via WhatsApp or email. We then confirm availability, the delivery fee and the delivery date with you. You can also order by phone or at the showroom.',
  },
]

export default function FaqPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }

  return (
    <>
      <SEO
        title="Frequently Asked Questions"
        path="/faq"
        description="Answers about buying appliances from High Flyer Trading: genuine products, delivery across East Africa, cash on delivery, warranty, returns and installation."
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
      <HelpPageLayout
        path="/faq"
        label="FAQ"
        title="Frequently Asked Questions"
        intro="Quick answers about our products, delivery, payment, warranty and returns."
      >
        <div className="space-y-3">
          {faqs.map((f) => (
            <details key={f.question} className="group card bg-white">
              <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <h2 className="font-semibold text-slate-900 text-base md:text-lg">{f.question}</h2>
                <ChevronDown
                  size={18}
                  aria-hidden="true"
                  className="text-slate-400 shrink-0 transition-transform group-open:rotate-180"
                />
              </summary>
              <div className="px-5 pb-5 -mt-1 text-slate-600 leading-relaxed">
                <p>{f.answer}</p>
                {f.link && (
                  <Link to={f.link.to} className="inline-block mt-2 text-sm font-semibold text-brand-teal hover:underline">
                    {f.link.label} →
                  </Link>
                )}
              </div>
            </details>
          ))}
        </div>
      </HelpPageLayout>
    </>
  )
}
