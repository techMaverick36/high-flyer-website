import { useLocation } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import { companyInfo } from '../utils/company'
import { SITE_ORIGIN } from '../utils/site'

/**
 * Always-visible WhatsApp button. Most customers here order and ask
 * questions on WhatsApp from their phones, so it stays within thumb reach
 * on every page. On a product page the message carries the product link,
 * so staff know straight away what the customer is asking about.
 */
export default function FloatingWhatsApp() {
  const { pathname } = useLocation()

  // The cart page has its own WhatsApp order button.
  if (pathname === '/cart') return null

  const message = pathname.startsWith('/product/')
    ? `Hi High Flyer! I'm interested in this product: ${SITE_ORIGIN}${pathname}`
    : 'Hi High Flyer! I have a question about your appliances.'
  const href = `https://wa.me/${companyInfo.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      // z-40 keeps it under the header menu and cart drawer (z-50+).
      className="fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] md:right-6 md:bottom-6 z-40 flex items-center gap-2 rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 h-14 w-14 md:w-auto md:px-5 justify-center hover:bg-[#1ebe5b] transition-colors"
    >
      <MessageCircle size={26} aria-hidden="true" />
      <span className="hidden md:inline font-semibold text-sm">WhatsApp us</span>
    </a>
  )
}
