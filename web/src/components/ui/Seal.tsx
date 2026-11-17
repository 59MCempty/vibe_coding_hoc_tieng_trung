import { useEffect, useRef } from 'react'
import { EASE, animateOrSkip } from '../../lib/motion.ts'

interface SealProps {
  /** Một hoặc hai chữ Hán trên con dấu, ví dụ 好 */
  text: string
  /** Mô tả cho trình đọc màn hình, ví dụ "Con dấu: hoàn thành bài" */
  label: string
  /** Cạnh con dấu, px */
  size?: number
  /** Có chạy hiệu ứng đóng dấu khi xuất hiện không */
  animate?: boolean
  className?: string
}

/**
 * Con dấu đỏ son — phần thưởng khi hoàn thành.
 * Hiệu ứng: scale 1.4→1, xoay −8°→−4°, 350ms, nảy nhẹ (back.out).
 * Khi giảm chuyển động: chỉ mờ dần 150ms. Chữ dùng font bút lông vì đứng yên.
 */
export function Seal({ text, label, size = 96, animate = true, className = '' }: SealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!animate) return
    void animateOrSkip(
      ref.current,
      [
        { transform: 'scale(1.4) rotate(-8deg)', opacity: 0 },
        { transform: 'scale(1) rotate(-4deg)', opacity: 1 },
      ],
      { duration: 350, easing: EASE.backOut, reduced: 'fade' },
    )
  }, [animate])

  return (
    <div
      ref={ref}
      role="img"
      aria-label={label}
      className={`inline-grid place-items-center rounded-control bg-cinnabar text-card ${className}`.trim()}
      style={{
        width: size,
        height: size,
        transform: 'rotate(-4deg)',
        // viền kép kiểu con dấu khắc
        boxShadow: 'inset 0 0 0 3px var(--cinnabar), inset 0 0 0 5px var(--card)',
      }}
    >
      <span
        aria-hidden="true"
        lang="zh"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: size * (text.length > 1 ? 0.4 : 0.62),
          lineHeight: 1,
        }}
      >
        {text}
      </span>
    </div>
  )
}
