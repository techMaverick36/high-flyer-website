import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number
  reviewCount?: number
  size?: number
  showCount?: boolean
}

export default function StarRating({
  rating,
  reviewCount,
  size = 14,
  showCount = true,
}: StarRatingProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5 text-brand-orange">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={size}
            fill={i < Math.round(rating) ? 'currentColor' : 'none'}
            strokeWidth={2.5}
            className={i < Math.round(rating) ? '' : 'text-slate-200'}
          />
        ))}
      </div>
      <span className="text-sm font-black text-slate-900">{rating.toFixed(1)}</span>
      {showCount && reviewCount !== undefined && (
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">({reviewCount} reviews)</span>
      )}
    </div>
  )
}