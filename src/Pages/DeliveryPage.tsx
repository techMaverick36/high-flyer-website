import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import SEO from '../components/SEO'
import HelpPageLayout, { HelpSection } from '../components/HelpPageLayout'
import { policies } from '../utils/policies'
import { companyInfo } from '../utils/company'

const showroom = companyInfo.locations.find((l) => l.id === 'showroom')

export default function DeliveryPage() {
  return (
    <>
      <SEO
        title="Delivery & Payment"
        path="/delivery"
        description="High Flyer Trading delivers home appliances across Kampala, Uganda and East Africa. Pay cash on delivery, by Mobile Money, bank transfer, or at our Kampala showroom."
      />
      <HelpPageLayout
        path="/delivery"
        label="Delivery & Payment"
        title="Delivery & Payment"
        intro="We deliver across Uganda and East Africa, and you can pay the way that suits you — including cash on delivery."
      >
        <HelpSection title="Where we deliver">
          <p>We deliver to {policies.delivery.area}.</p>
          <p>
            Prefer to collect? You can pick up your order from our showroom at{' '}
            {showroom?.address ?? 'Aponye Shopping Centre, Kampala'}.
          </p>
        </HelpSection>

        <HelpSection title="Delivery fees">
          <p>{policies.delivery.fees}</p>
        </HelpSection>

        <HelpSection title="Delivery times">
          <p>{policies.delivery.timing}</p>
        </HelpSection>

        <HelpSection title="Installation">
          <p>
            For appliances that need it, such as air conditioners and TV wall mounts, our team
            offers professional installation. Ask us about installation when you place your order.
          </p>
        </HelpSection>

        <HelpSection title="Payment options">
          <ul className="grid sm:grid-cols-2 gap-3">
            {policies.payment.methods.map((m) => (
              <li key={m.name} className="card bg-white p-4 flex gap-3">
                <Check size={18} className="text-brand-teal shrink-0 mt-0.5" strokeWidth={3} />
                <div>
                  <p className="font-semibold text-slate-900">{m.name}</p>
                  <p className="text-sm text-slate-500">{m.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </HelpSection>

        <HelpSection title="How to order">
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              Add the appliances you want to your cart from the <Link to="/" className="text-brand-teal font-semibold hover:underline">shop</Link>.
            </li>
            <li>Send your order to us via WhatsApp or email from the cart.</li>
            <li>We confirm availability, the delivery fee and the delivery date with you.</li>
            <li>Pay using any of the options above, and we deliver.</li>
          </ol>
          <p>
            You can also order by phone or in person at the showroom
            {showroom ? ` (${showroom.hours.replace('\n', ', ')})` : ''}.
          </p>
        </HelpSection>
      </HelpPageLayout>
    </>
  )
}
