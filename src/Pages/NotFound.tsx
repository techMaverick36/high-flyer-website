import { Link } from 'react-router-dom'
import { ArrowLeft, Home } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="pt-[112px] min-h-screen bg-background flex items-center justify-center">
      <div className="section-container">
        <div className="card max-w-2xl mx-auto p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-teal-500/5 blur-[80px] rounded-full" />
          <div className="relative z-10">
            <div className="text-[120px] font-display font-black text-slate-100 leading-none mb-4 select-none">404</div>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-slate-900 mb-6 tracking-tight">
              Page Not Found
            </h1>
            <p className="text-slate-500 font-medium mb-12 text-lg md:text-xl leading-relaxed max-w-md mx-auto">
              The page you're looking for doesn't exist. But don't worry, we have a great range of appliances waiting for you!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/" className="btn btn-primary px-10 py-4 shadow-xl shadow-brand-teal/20 gap-3 group">
                <Home size={20} />
                Back to Home
              </Link>
              <Link to="/shop" className="btn bg-white border-2 border-slate-100 text-slate-600 px-10 py-4 font-bold hover:border-brand-teal hover:text-brand-teal transition-all">
                Browse Shop
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}