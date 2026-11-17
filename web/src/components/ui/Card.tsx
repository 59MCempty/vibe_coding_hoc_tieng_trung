import type { HTMLAttributes } from 'react'

/** Thẻ giấy: bo 10px, viền mảnh, bóng một lớp (design-system.md). */
export function Card({ className = '', ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-card border border-line bg-card shadow-card ${className}`.trim()}
      {...rest}
    />
  )
}
