import { MnemonicView } from '../../components/ui/MnemonicView.tsx'
import { PinyinText } from '../../components/ui/PinyinText.tsx'
import { SpeakButton } from '../../components/ui/SpeakButton.tsx'
import { PART_OF_SPEECH_LABEL, type Word } from '../../types/content.ts'
import type { StudyDirection } from '../../types/progress.ts'

interface FlashCardProps {
  word: Word
  /** Hướng học: nhìn chữ đoán nghĩa, hoặc nhìn nghĩa đoán chữ */
  direction: StudyDirection
  flipped: boolean
  onFlip: () => void
}

/** Cỡ chữ Hán mặt trước: tối thiểu 72px trên điện thoại, tối đa 120px. */
const FRONT_HANZI_SIZE = 'clamp(72px, 24vw, 120px)'

const FACE =
  'flip-face flex min-h-[26rem] flex-col rounded-card border border-line bg-card p-4 shadow-card sm:p-6'

/**
 * Thẻ học lật được.
 *  - Mặt trước: chữ Hán (hoặc nghĩa, tuỳ hướng học).
 *  - Mặt sau: chữ, pinyin, nút nghe, nghĩa, mẹo nhớ + hình, một câu ví dụ có nút nghe.
 * Lật bằng chạm / bấm chuột vào thẻ (phím cách do trang xử lý). Xoay 400ms; khi giảm chuyển động thì mờ dần.
 */
export function FlashCard({ word, direction, flipped, onFlip }: FlashCardProps) {
  const example = word.examples[0]
  const meaning = word.meaningVi.join(', ')

  return (
    <div className="flip-scene" data-testid="flashcard" data-flipped={flipped}>
      <div className={`flip-inner ${flipped ? 'is-flipped' : ''}`} onClick={onFlip}>
        {/* ---------- Mặt trước ---------- */}
        <div className={`${FACE} cursor-pointer items-center justify-center text-center`} aria-hidden={flipped} inert={flipped}>
          {direction === 'hanzi_to_meaning' ? (
            <p
              lang="zh"
              data-testid="card-front-hanzi"
              className="font-hanzi leading-tight font-semibold text-ink"
              style={{ fontSize: FRONT_HANZI_SIZE }}
            >
              {word.hanzi}
            </p>
          ) : (
            <>
              <p className="font-heading text-3xl leading-snug font-bold text-ink">{meaning}</p>
              <p className="mt-2 text-sm text-ink-soft">{PART_OF_SPEECH_LABEL[word.partOfSpeech]}</p>
            </>
          )}
          <p className="mt-8 text-sm text-ink-soft">
            {direction === 'hanzi_to_meaning'
              ? 'Bạn nhớ nghĩa của chữ này không? Chạm vào thẻ để xem.'
              : 'Bạn nhớ chữ Hán của từ này không? Chạm vào thẻ để xem.'}
          </p>
        </div>

        {/* ---------- Mặt sau ---------- */}
        <div className={`${FACE} is-back gap-4`} aria-hidden={!flipped} inert={!flipped}>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p lang="zh" className="font-hanzi text-6xl leading-none font-semibold text-ink">
              {word.hanzi}
            </p>
            <div className="min-w-0 flex-1">
              <PinyinText text={word.pinyin} className="text-[22px] leading-tight font-medium" />
              <p className="mt-1 text-lg leading-snug font-semibold text-ink">{meaning}</p>
              <p className="text-sm text-ink-soft">{PART_OF_SPEECH_LABEL[word.partOfSpeech]}</p>
            </div>
            <SpeakButton text={word.hanzi} audioSrc={word.audioSrc} label={`Nghe phát âm từ ${word.hanzi}`} />
          </div>

          <MnemonicView word={word} play={flipped} />

          {example && (
            <section aria-label="Câu ví dụ" className="border-t border-line pt-3 text-left">
              <div className="flex flex-wrap items-start gap-3">
                <div className="min-w-0 flex-1">
                  <p lang="zh" className="font-hanzi text-2xl leading-snug text-ink">
                    {example.hanzi}
                  </p>
                  <PinyinText text={example.pinyin} className="text-base" />
                  <p className="text-ink-soft">{example.meaningVi}</p>
                </div>
                <SpeakButton text={example.hanzi} label={`Nghe câu ví dụ: ${example.hanzi}`} />
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
