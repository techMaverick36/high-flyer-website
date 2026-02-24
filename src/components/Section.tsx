import type { ReactNode } from 'react'
import clsx from 'clsx'

interface SectionProps {
  children: ReactNode
  className?: string
  alt?: boolean
  id?: string
}

export default function Section({ children, className, alt = false, id }: SectionProps) {
  return (
    <section
      id={id}
      className={clsx(
        'section-padding',
        alt ? 'bg-slate-50/50' : 'bg-white',
        className
      )}
    >
      <div className="section-container">{children}</div>
    </section>
  )
}

interface SectionHeaderProps {
  label?: string
  title: string
  subtitle?: string
  centered?: boolean
  action?: ReactNode
}

export function SectionHeader({
  label,
  title,
  subtitle,
  centered = false,
  action,
}: SectionHeaderProps) {
  return (
    <div
      className={clsx(
        'mb-10 md:mb-12',
        centered ? 'text-center' : 'flex flex-col md:flex-row md:items-end md:justify-between gap-4'
      )}
    >
      <div className={centered ? 'mx-auto' : ''}>
        {label && <p className="section-label mb-2">{label}</p>}
        <h2 className="section-title">{title}</h2>
        {subtitle && (
          <p className={clsx('section-subtitle', centered && 'mx-auto text-center')}>{subtitle}</p>
        )}
      </div>
      {action && !centered && <div className="shrink-0">{action}</div>}
    </div>
  )
}