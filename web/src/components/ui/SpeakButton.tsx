import { Volume2 } from 'lucide-react'
import { useState, type MouseEvent } from 'react'
import { SPEAK_ERROR_MESSAGE, speak } from '../../lib/speech.ts'

interface SpeakButtonProps {
  /** Chữ Hán cần đọc (một từ hoặc cả câu) */
  text: string
  /** Nhãn cho trình đọc màn hình, ví dụ "Nghe phát âm từ 你好" */
  label: string
  /** File mp3 nếu có */
  audioSrc?: string
  className?: string
}

/**
 * Nút loa: bấm là đọc ngay bằng giọng tiếng Trung của máy (hoặc file mp3).
 * Nếu máy không có giọng tiếng Trung thì hiện hướng dẫn tiếng Việt ngay dưới nút; việc học không bị chặn.
 */
export function SpeakButton({ text, label, audioSrc, className = '' }: SpeakButtonProps) {
  const [speaking, setSpeaking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleClick(event: MouseEvent) {
    event.stopPropagation() // không làm lật thẻ
    setError(null)
    setSpeaking(true)
    const result = await speak(text, { audioSrc })
    setSpeaking(false)
    if (!result.ok) setError(SPEAK_ERROR_MESSAGE[result.reason])
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        aria-label={label}
        data-speaking={speaking || undefined}
        className={
          'inline-grid size-11 shrink-0 place-items-center rounded-full border border-line bg-paper text-cinnabar ' +
          'transition-colors duration-150 hover:bg-paper-deep active:bg-paper-deep ' +
          'data-[speaking]:border-cinnabar data-[speaking]:bg-cinnabar data-[speaking]:text-white ' +
          className
        }
      >
        <Volume2 size={22} strokeWidth={1.75} aria-hidden="true" />
      </button>
      {error && (
        <span role="alert" className="basis-full text-left text-sm text-ink-soft">
          {error}
        </span>
      )}
    </>
  )
}
