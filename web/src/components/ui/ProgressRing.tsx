import type { ReactNode } from 'react'

interface ProgressRingProps {
  /** 0–100 */
  percent: number
  /** Đường kính, px */
  size?: number
  strokeWidth?: number
  /** Mô tả cho trình đọc màn hình, ví dụ "Mục tiêu hôm nay" */
  label: string
  /** Nội dung ở giữa vòng */
  children?: ReactNode
}

/**
 * Vòng tiến độ: vẽ % bằng stroke-dashoffset, chuyển 600ms.
 * Khi giảm chuyển động thì nhảy thẳng tới giá trị cuối (class motion-reduce).
 */
export function ProgressRing({ percent, size = 120, strokeWidth = 8, label, children }: ProgressRingProps) {
  const value = Math.min(100, Math.max(0, Number.isFinite(percent) ? percent : 0))
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - value / 100)

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value)}
      className="relative inline-grid place-items-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--line)" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--cinnabar)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-[600ms] ease-out motion-reduce:transition-none"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
    </div>
  )
}
