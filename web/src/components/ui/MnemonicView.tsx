import { Lightbulb } from 'lucide-react'
import { hanChars } from '../../lib/pinyin.ts'
import type { Word } from '../../types/content.ts'
import { RadicalSplit } from './RadicalSplit.tsx'

interface MnemonicViewProps {
  word: Word
  /** Chạy hiệu ứng ghép bộ thủ khi chuyển thành true */
  play?: boolean
}

/**
 * Mẹo nhớ của một từ:
 *  - hình: ảnh minh hoạ (từ cụ thể) hoặc hình tách bộ thủ (từ trừu tượng);
 *  - các thành phần của chữ kèm nghĩa;
 *  - câu chuyện liên tưởng.
 */
export function MnemonicView({ word, play = true }: MnemonicViewProps) {
  const chars = hanChars(word.hanzi)
  const partSize = chars.length >= 3 ? 64 : 80

  return (
    <section aria-label="Mẹo nhớ" className="rounded-control bg-paper-deep/60 p-3 text-left">
      <h3 className="flex items-center gap-1.5 font-body text-sm font-semibold text-gold-text">
        <Lightbulb size={16} strokeWidth={1.75} aria-hidden="true" />
        Mẹo nhớ
      </h3>

      <div className="mt-2 flex flex-wrap items-start gap-3">
        {word.kind === 'concrete' ? (
          // Giữ chỗ 96×96 để ảnh tải chậm không làm xô lệch bố cục
          <img
            src={`/${word.image}`}
            alt={`Hình minh hoạ: ${word.meaningVi[0]}`}
            width={96}
            height={96}
            loading="lazy"
            decoding="async"
            className="size-24 shrink-0 rounded-control border border-line bg-paper object-cover"
          />
        ) : (
          <div className="flex shrink-0 gap-1" style={{ minHeight: partSize }}>
            {chars.map((char, index) => (
              <RadicalSplit key={`${char}-${index}`} char={char} size={partSize} play={play} />
            ))}
          </div>
        )}

        <ul className="min-w-0 flex-1 basis-40 space-y-1 text-sm">
          {word.mnemonic.components.map((component, index) => (
            <li key={index} className="flex items-baseline gap-2">
              <span lang="zh" className="shrink-0 font-hanzi text-xl leading-none text-ink">
                {component.part}
              </span>
              <span className="text-ink-soft">{component.meaningVi}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-2 text-[15px] leading-relaxed text-ink">{word.mnemonic.story}</p>
    </section>
  )
}
