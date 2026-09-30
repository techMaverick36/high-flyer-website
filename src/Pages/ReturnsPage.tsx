import SEO from '../components/SEO'
import HelpPageLayout, { HelpSection } from '../components/HelpPageLayout'
import { policies } from '../utils/policies'

const { days, conditions } = policies.returns

export default function ReturnsPage() {
  return (
    <>
      <SEO
        title="Returns & Warranty"
        path="/returns"
        description={`Return unused appliances within ${days} days in original packaging. Every product sold by High Flyer Trading carries a full manufacturer warranty, and we handle claims for you.`}
      />
      <HelpPageLayout
        path="/returns"
        label="Returns & Warranty"
        title="Returns & Warranty"
        intro={`Changed your mind? You have ${days} days to return an unused item. And every appliance we sell is covered by the manufacturer's warranty.`}
      >
        <HelpSection id="returns" title={`${days}-day returns`}>
          <p>You can return an item within {days} days of receiving it, for a refund or an exchange, as long as:</p>
          <ul className="list-disc pl-5 space-y-1">
            {conditions.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </HelpSection>

        <HelpSection title="How to make a return">
          <ol className="list-decimal pl-5 space-y-2">
            <li>Contact us by WhatsApp, phone or email within {days} days, with your name and the item you bought.</li>
            <li>We confirm the return and agree with you how the item will come back to us.</li>
            <li>Once we've checked the item, we process your refund or exchange.</li>
          </ol>
        </HelpSection>

        <HelpSection id="warranty" title="Manufacturer warranty">
          <p>
            Every appliance we sell is genuine and comes with the full manufacturer's warranty. The
            warranty period depends on the product and brand, and is shown on each product page.
          </p>
          <p>
            If something goes wrong during the warranty period, contact us — we handle the warranty
            claim on your behalf, so you don't have to deal with the manufacturer yourself. Keep your
            receipt, since manufacturers usually ask for proof of purchase.
          </p>
        </HelpSection>

        <HelpSection title="Damaged or faulty on arrival">
          <p>
            Please check your appliance when it's delivered. If it arrives damaged or doesn't work,
            contact us as soon as possible so we can put it right.
          </p>
        </HelpSection>
      </HelpPageLayout>
    </>
  )
}
