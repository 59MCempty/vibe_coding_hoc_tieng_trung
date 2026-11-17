import { ArrowRight, RotateCcw } from 'lucide-react'
import { Button, ButtonLink } from '../../components/ui/Button.tsx'
import { Card } from '../../components/ui/Card.tsx'
import { PinyinText } from '../../components/ui/PinyinText.tsx'
import { Seal } from '../../components/ui/Seal.tsx'
import type { Lesson, Word } from '../../types/content.ts'
import type { LessonSummaryData } from './lessonSession.ts'

interface LessonSummaryProps {
  lesson: Lesson
  summary: LessonSummaryData
  /** Các từ của bài, để hiện lại từ chưa nhớ */
  words: Word[]
  /** Bài kế tiếp trong cùng cấp, nếu có */
  nextLesson: Lesson | null
  /** Bấm "Ôn lại từ chưa nhớ" */
  onRetry: () => void
}

/** Màn tổng kết cuối bài: số từ đã nhớ / chưa nhớ, con dấu đỏ, và bước tiếp theo. */
export function LessonSummary({ lesson, summary, words, nextLesson, onRetry }: LessonSummaryProps) {
  const notRemembered = words.filter((word) => summary.notRemembered.includes(word.id))
  const allRemembered = notRemembered.length === 0
  const stagePath = `/lo-trinh/${lesson.stageId}`

  return (
    <section className="anim-rise mx-auto max-w-xl px-4 py-8 text-center" aria-labelledby="tong-ket">
      <div className="relative mx-auto grid w-fit place-items-center">
        {/* Vệt mực loang phía sau con dấu */}
        <span aria-hidden="true" className="absolute size-36 rounded-full bg-ink-wash blur-xl" />
        <Seal text="好" label="Con dấu đỏ: hoàn thành bài học" size={104} className="relative" />
      </div>

      <h1 id="tong-ket" className="mt-6 text-2xl">
        Xong bài “{lesson.titleVi}”
      </h1>
      <p className="mt-2 text-ink-soft">
        {allRemembered
          ? 'Bạn nhớ hết các từ của bài này. Ngày mai các từ này sẽ quay lại để ôn.'
          : 'Làm tốt lắm. Từ nào chưa nhớ thì ôn lại thêm một lượt là vào ngay.'}
      </p>

      <dl className="mt-6 grid grid-cols-2 gap-3">
        <Card className="p-4">
          <dt className="text-sm text-ink-soft">Đã nhớ</dt>
          <dd className="font-heading text-4xl font-bold text-jade" data-testid="summary-remembered">
            {summary.remembered.length}
          </dd>
        </Card>
        <Card className="p-4">
          <dt className="text-sm text-ink-soft">Chưa nhớ</dt>
          <dd className="font-heading text-4xl font-bold text-cinnabar" data-testid="summary-not-remembered">
            {summary.notRemembered.length}
          </dd>
        </Card>
      </dl>

      {!allRemembered && (
        <ul className="mt-4 divide-y divide-line rounded-card border border-line bg-card text-left">
          {notRemembered.map((word) => (
            <li key={word.id} className="flex flex-wrap items-baseline gap-x-3 px-4 py-2">
              <span lang="zh" className="font-hanzi text-2xl text-ink">
                {word.hanzi}
              </span>
              <PinyinText text={word.pinyin} />
              <span className="text-ink-soft">{word.meaningVi[0]}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8 flex flex-col gap-3">
        {/* Một hành động chính: còn từ chưa nhớ thì ôn lại, không thì học bài tiếp */}
        {!allRemembered && (
          <Button onClick={onRetry}>
            <RotateCcw size={18} strokeWidth={1.75} aria-hidden="true" />
            Ôn lại {notRemembered.length} từ chưa nhớ
          </Button>
        )}
        {nextLesson && (
          <ButtonLink to={`/bai/${nextLesson.id}`} variant={allRemembered ? 'primary' : 'secondary'}>
            Học bài tiếp theo: {nextLesson.titleVi}
            <ArrowRight size={18} strokeWidth={1.75} aria-hidden="true" />
          </ButtonLink>
        )}
        <ButtonLink to={stagePath} variant={nextLesson || !allRemembered ? 'ghost' : 'primary'}>
          Về danh sách bài
        </ButtonLink>
      </div>
    </section>
  )
}
