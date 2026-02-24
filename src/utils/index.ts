import type { CartItem, CustomerInfo } from './types'
import { companyInfo } from './company'

export function formatPrice(amount: number): string {
  return `UGX ${amount.toLocaleString()}`
}

export function getDiscountPercent(originalPrice: number, currentPrice: number): number {
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
}

export function openWhatsAppOrder(items: CartItem[], customer: CustomerInfo, total: number): void {
  const itemsList = items
    .map(
      (item) =>
        `• ${item.product.name} × ${item.quantity} — ${formatPrice(item.product.price * item.quantity)}`
    )
    .join('\n')

  const message = encodeURIComponent(
    `Hello High Flyer Trading! I'd like to place an order.\n\n` +
      `*Order Details:*\n${itemsList}\n\n` +
      `*Total:* ${formatPrice(total)}\n\n` +
      `*Customer Info:*\n` +
      `Name: ${customer.name}\n` +
      `Phone: ${customer.phone}\n` +
      `Email: ${customer.email}\n` +
      (customer.address ? `Address: ${customer.address}\n` : '') +
      (customer.notes ? `Notes: ${customer.notes}` : '')
  )

  window.open(
    `https://wa.me/${companyInfo.whatsapp.replace(/\D/g, '')}?text=${message}`,
    '_blank'
  )
}

export function openEmailOrder(items: CartItem[], customer: CustomerInfo, total: number): void {
  const itemsList = items
    .map(
      (item) =>
        `- ${item.product.name} × ${item.quantity}: ${formatPrice(item.product.price * item.quantity)}`
    )
    .join('\n')

  const subject = encodeURIComponent(`New Order from ${customer.name}`)
  const body = encodeURIComponent(
    `Order Details:\n${itemsList}\n\nTotal: ${formatPrice(total)}\n\n` +
      `Customer Info:\nName: ${customer.name}\nPhone: ${customer.phone}\nEmail: ${customer.email}\n` +
      (customer.address ? `Address: ${customer.address}\n` : '') +
      (customer.notes ? `Notes: ${customer.notes}` : '')
  )

  window.location.href = `mailto:${companyInfo.email}?subject=${subject}&body=${body}`
}
