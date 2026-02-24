import type { Testimonial } from './types'

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Grace Nakato',
    location: 'Kampala, Ntinda',
    rating: 5,
    text: 'I bought my Samsung fridge from High Flyer and the experience was amazing. The team was very knowledgeable and helped me pick the right model for my family. Delivery was on time and the product is perfect!',
    product: 'Samsung 350L Refrigerator',
  },
  {
    id: '2',
    name: 'Moses Okello',
    location: 'Kampala, Nakawa',
    rating: 5,
    text: 'Professional service from start to finish. The 55" Samsung QLED TV I got is absolutely stunning. High Flyer gave me a great deal and even helped with the wall mounting. Highly recommended!',
    product: 'Samsung 55" QLED TV',
  },
  {
    id: '3',
    name: 'Sarah Namukasa',
    location: 'Kampala, Makindye',
    rating: 5,
    text: 'I was worried about the warranty before buying but the team at High Flyer Trading explained everything clearly. My washing machine has been running perfectly for over a year. Trustworthy team!',
    product: 'Samsung 8KG Washing Machine',
  },
  {
    id: '4',
    name: 'David Ssemwogerere',
    location: 'Entebbe',
    rating: 5,
    text: 'Excellent selection of appliances and very fair prices. The showroom at Aponye is well-organized. I got my AC unit installed quickly and the team follows up to ensure you are satisfied. 10/10!',
    product: 'Midea 1.5HP Air Conditioner',
  },
]

export const companyInfo = {
  name: 'High Flyer Trading CO LTD',
  tagline: 'Uganda\'s Home Appliance Destination',
  phone: '+256 704 427891',
  whatsapp: '+256 704 427891',
  email: 'info@highflyertrading.co.ug',
  locations: [
    {
      id: 'office',
      type: 'Main Office',
      name: 'Yamaha Centre – Head Office',
      address: 'Yamaha Centre, Kampala, Uganda',
      hours: 'Mon–Fri: 8:00 AM – 6:00 PM\nSat: 9:00 AM – 5:00 PM',
      mapUrl: 'https://maps.google.com/?q=Yamaha+Centre+Kampala+Uganda',
      coordinates: { lat: 0.3136, lng: 32.5811 },
    },
    {
      id: 'showroom',
      type: 'Showroom',
      name: 'Aponye Shopping Centre – Showroom',
      address: 'Aponye Shopping Centre, Kampala, Uganda',
      hours: 'Mon–Sat: 8:00 AM – 7:00 PM\nSun: 10:00 AM – 4:00 PM',
      mapUrl: 'https://maps.google.com/?q=Aponye+Shopping+Centre+Kampala+Uganda',
      coordinates: { lat: 0.3143, lng: 32.5795 },
    },
  ],
  socialMedia: {
    facebook: 'https://facebook.com/highflyertrading',
    instagram: 'https://instagram.com/highflyertrading',
    twitter: 'https://twitter.com/highflyertrading',
  },
  whyChooseUs: [
    {
      icon: '🏆',
      title: 'Genuine Products Only',
      description:
        'Every appliance we sell is 100% authentic, sourced directly from certified manufacturers and authorized distributors.',
    },
    {
      icon: '🛡️',
      title: 'Manufacturer Warranty',
      description:
        'All products come with full manufacturer warranties. We handle claims on your behalf — hassle-free.',
    },
    {
      icon: '🚚',
      title: 'Delivery & Installation',
      description:
        'We deliver across Kampala and offer professional installation services so your appliance is ready to use from day one.',
    },
    {
      icon: '💬',
      title: 'Expert Advice',
      description:
        'Our trained team helps you pick the right appliance for your needs and budget. No pushy sales tactics.',
    },
    {
      icon: '🏪',
      title: 'Physical Showroom',
      description:
        'Visit our showroom at Aponye to see, touch, and test appliances before you buy. Real products, real confidence.',
    },
    {
      icon: '⚡',
      title: 'After-Sales Support',
      description:
        'Our support doesn\'t end at purchase. We\'re available on WhatsApp and phone for any questions or issues.',
    },
  ],
}