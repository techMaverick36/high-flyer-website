import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import CartDrawer from './components/Cartdrawer'
import FloatingWhatsApp from './components/FloatingWhatsApp'
import HomePage from './Pages/HomePage'
import ShopPage from './Pages/ShopPage'
import ProductDetailPage from './Pages/ProductDetailPage'
import CartPage from './Pages/CartPage'
import AboutPage from './Pages/AboutPage'
import ContactPage from './Pages/ContactPage'
import DeliveryPage from './Pages/DeliveryPage'
import ReturnsPage from './Pages/ReturnsPage'
import FaqPage from './Pages/FaqPage'
import NotFoundPage from './Pages/NotFound'
import SiteSuspended from './Pages/SiteSuspended'
import { siteStatus } from './utils/siteStatus'

// Scroll to top on navigation
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

// /shop was never a real route but was linked site-wide. Keep the query so
// ShopPage can forward an old ?category= link to its category page.
function ShopRedirect() {
  const { search } = useLocation()
  return <Navigate to={{ pathname: '/', search }} replace />
}

function Layout() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <CartDrawer />
      <main>
        <Routes>
          <Route path="/" element={<ShopPage />} />
          <Route path="/category/:slug" element={<ShopPage />} />
          <Route path="/shop" element={<ShopRedirect />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/delivery" element={<DeliveryPage />} />
          <Route path="/returns" element={<ReturnsPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  )
}

export default function App() {
  // Short-circuits ahead of the router, so every URL — including deep links
  // and shared product pages — shows the notice. Flip `suspended` back to
  // false in src/utils/siteStatus.ts to restore the site untouched.
  if (siteStatus.suspended) {
    return (
      <HelmetProvider>
        <SiteSuspended />
      </HelmetProvider>
    )
  }

  return (
    <HelmetProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </HelmetProvider>
  )
}