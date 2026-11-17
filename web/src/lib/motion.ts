/**
 * Helper hiệu ứng.
 * Quy ước của dự án (constitution IV):
 *  - chỉ animate `transform` và `opacity`;
 *  - khi người dùng bật "Giảm chuyển động" thì hiện ngay trạng thái cuối (hoặc mờ dần 150ms);
 *  - hiệu ứng không bao giờ chặn thao tác.
 */

const ALLOWED_PROPS = new Set(['transform', 'opacity', 'offset', 'easing', 'composite'])

/** Người dùng có bật "Giảm chuyển động" trong hệ điều hành không? */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export interface AnimateOptions {
  duration: number
  easing?: string
  delay?: number
  /** Khi giảm chuyển động: 'final' = hiện ngay; 'fade' = mờ dần 150ms. Mặc định 'final'. */
  reduced?: 'final' | 'fade'
}

/** Đường cong hay dùng (tương đương các ease của GSAP nêu trong design-system.md). */
export const EASE = {
  backOut: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  power2Out: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
} as const

function applyFinalFrame(el: HTMLElement | SVGElement, last: Keyframe) {
  if (typeof last.transform === 'string') el.style.transform = last.transform
  if (last.opacity !== undefined && last.opacity !== null) el.style.opacity = String(last.opacity)
}

/**
 * Chạy hiệu ứng trên một phần tử, hoặc bỏ qua và đặt ngay trạng thái cuối khi giảm chuyển động.
 * Luôn trả về Promise kết thúc khi phần tử ở trạng thái cuối. Không ném lỗi.
 */
export function animateOrSkip(
  el: HTMLElement | SVGElement | null,
  keyframes: Keyframe[],
  options: AnimateOptions,
): Promise<void> {
  if (!el || keyframes.length === 0) return Promise.resolve()

  if (import.meta.env?.DEV) {
    for (const frame of keyframes) {
      for (const prop of Object.keys(frame)) {
        if (!ALLOWED_PROPS.has(prop)) {
          console.warn(`[motion] Chỉ nên animate transform/opacity, gặp "${prop}".`)
        }
      }
    }
  }

  const last = keyframes[keyframes.length - 1]
  const canAnimate = typeof el.animate === 'function'

  if (prefersReducedMotion() || !canAnimate) {
    applyFinalFrame(el, last)
    if (canAnimate && options.reduced === 'fade') {
      return el
        .animate([{ opacity: 0 }, { opacity: last.opacity ?? 1 }], { duration: 150, easing: 'linear' })
        .finished.then(
          () => undefined,
          () => undefined,
        )
    }
    return Promise.resolve()
  }

  const animation = el.animate(keyframes, {
    duration: options.duration,
    easing: options.easing ?? 'ease-out',
    delay: options.delay ?? 0,
    fill: 'both',
  })
  return animation.finished.then(
    () => undefined,
    () => undefined,
  )
}
