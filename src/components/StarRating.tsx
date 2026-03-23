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
  const clampedRating = Math.min(5, Math.max(0, rating))
  const fillPercent = (clampedRating / 5) * 100

  return (
    <div className="flex items-center gap-2">
      {/* Partial-fill star strip */}
      <div className="relative flex items-center gap-0.5" style={{ isolation: 'isolate' }}>
        {/* Empty stars (base layer) */}
        <div className="flex items-center gap-0.5 text-slate-200">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={size} fill="currentColor" strokeWidth={0} />
          ))}
        </div>
        {/* Filled stars clipped to rating width */}
        <div
          className="absolute inset-0 flex items-center gap-0.5 text-brand-orange overflow-hidden"
          style={{ width: `${fillPercent}%` }}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={size} fill="currentColor" strokeWidth={0} style={{ flexShrink: 0 }} />
          ))}
        </div>
      </div>
      <span className="text-sm font-black text-slate-900">{clampedRating.toFixed(1)}</span>
      {showCount && reviewCount !== undefined && (
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">({reviewCount} reviews)</span>
      )}
    </div>
  )
}
