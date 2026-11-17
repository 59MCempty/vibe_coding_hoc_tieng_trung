import { useEffect, useRef, useState } from 'react'
import { getComponents, getStrokes } from '../../lib/content.ts'
import { EASE, animateOrSkip } from '../../lib/motion.ts'
import type { CharComponents, StrokeData } from '../../types/content.ts'

interface RadicalSplitProps {
  /** Một chữ Hán */
  char: string
  /** Cạnh hình vuông, px */
  size?: number
  /** Chạy hiệu ứng ghép chữ khi chuyển thành true (ví dụ khi thẻ vừa lật) */
  play?: boolean
}

/** Màu cho từng thành phần — lấy từ bảng màu của design system. */
const PART_COLORS = ['var(--cinnabar)', 'var(--tone-1)', 'var(--jade)', 'var(--tone-3)']
const INK = 'var(--ink)'

/** Hướng mỗi thành phần trượt vào (đơn vị của hệ toạ độ 1024). */
const SLIDE_FROM = [
  'translate(-140px, 0px)',
  'translate(140px, 0px)',
  'translate(0px, -140px)',
  'translate(0px, 140px)',
]

interface Loaded {
  char: string
  strokes: StrokeData | null
  components: CharComponents | null
}

/**
 * Hình tách bộ thủ: vẽ chữ Hán từ dữ liệu nét, mỗi thành phần một màu,
 * các thành phần trượt vào ghép thành chữ. Khi giảm chuyển động thì hiện sẵn.
 * Chữ không có dữ liệu tách thì vẽ một màu.
 */
export function RadicalSplit({ char, size = 96, play = true }: RadicalSplitProps) {
  const [data, setData] = useState<Loaded | null>(null)
  const groupRefs = useRef<(SVGGElement | null)[]>([])

  useEffect(() => {
    let cancelled = false
    void Promise.all([getStrokes(char), getComponents(char)]).then(([strokes, components]) => {
      if (!cancelled) setData({ char, strokes, components })
    })
    return () => {
      cancelled = true
    }
  }, [char])

  const ready = data?.char === char ? data : null
  const strokes = ready?.strokes ?? null
  const groups = ready?.components?.groups ?? null

  useEffect(() => {
    if (!play || !groups) return
    groupRefs.current.slice(0, groups.length).forEach((el, index) => {
      void animateOrSkip(
        el,
        [
          { transform: SLIDE_FROM[index % SLIDE_FROM.length], opacity: 0 },
          { transform: 'translate(0px, 0px)', opacity: 1 },
        ],
        { duration: 400, delay: 80 + index * 120, easing: EASE.power2Out },
      )
    })
  }, [play, groups])

  // Chưa tải xong hoặc không có dữ liệu nét: hiện chữ bằng font (giữ nguyên kích thước, không xô lệch).
  if (!strokes) {
    return (
      <span
        lang="zh"
        className="inline-grid place-items-center font-hanzi text-ink"
        style={{ width: size, height: size, fontSize: size * 0.8, lineHeight: 1 }}
        aria-hidden="true"
      >
        {ready ? char : ''}
      </span>
    )
  }

  const grouped = new Set(groups?.flat() ?? [])
  const loose = strokes.strokes.map((_, index) => index).filter((index) => !grouped.has(index))

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 1024 1024"
      role="img"
      aria-label={`Chữ ${char} tách theo thành phần`}
      data-parts={groups?.length ?? 1}
      className="shrink-0 overflow-visible"
    >
      {/* Dữ liệu Hanzi Writer có trục y ngược: lật lại cho đúng chiều */}
      <g transform="scale(1, -1) translate(0, -900)">
        {loose.map((index) => (
          <path key={index} d={strokes.strokes[index]} fill={INK} />
        ))}
        {groups?.map((group, groupIndex) => (
          <g
            key={groupIndex}
            ref={(el) => {
              groupRefs.current[groupIndex] = el
            }}
            fill={PART_COLORS[groupIndex % PART_COLORS.length]}
          >
            {group.map((index) => (
              <path key={index} d={strokes.strokes[index]} />
            ))}
          </g>
        ))}
      </g>
    </svg>
  )
}
