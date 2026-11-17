import { splitPinyin } from '../../lib/pinyin.ts'

interface PinyinTextProps {
  /** Pinyin có dấu thanh, ví dụ "nǐ hǎo" */
  text: string
  className?: string
}

const TONE_COLOR = ['var(--tone-0)', 'var(--tone-1)', 'var(--tone-2)', 'var(--tone-3)', 'var(--tone-4)']

/**
 * Hiện pinyin, mỗi âm tiết tô màu theo thanh điệu.
 * Dấu thanh luôn được giữ nguyên trên chữ, nên người không phân biệt được màu vẫn đọc đúng.
 */
export function PinyinText({ text, className = '' }: PinyinTextProps) {
  const syllables = splitPinyin(text)
  const parts: { text: string; tone: number | null }[] = []
  let cursor = 0
  for (const syllable of syllables) {
    if (syllable.start > cursor) parts.push({ text: text.slice(cursor, syllable.start), tone: null })
    parts.push({ text: syllable.text, tone: syllable.tone })
    cursor = syllable.end
  }
  if (cursor < text.length) parts.push({ text: text.slice(cursor), tone: null })

  return (
    <span className={`font-body ${className}`.trim()} lang="zh-Latn">
      {parts.map((part, index) =>
        part.tone === null ? (
          <span key={index}>{part.text}</span>
        ) : (
          <span key={index} data-tone={part.tone} style={{ color: TONE_COLOR[part.tone] }}>
            {part.text}
          </span>
        ),
      )}
    </span>
  )
}
