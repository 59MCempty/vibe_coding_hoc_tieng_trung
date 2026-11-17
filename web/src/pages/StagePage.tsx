import { Check, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PageLoading } from '../app/Layout.tsx'
import { ButtonLink } from '../components/ui/Button.tsx'
import { getLessonsByStage, getStage } from '../lib/content.ts'
import { useStore } from '../store/index.ts'
import type { Lesson, RoadmapStage } from '../types/content.ts'

type LoadState =
  | { status: 'loading' }
  | { status: 'not-found' }
  | { status: 'ready'; stage: RoadmapStage; lessons: Lesson[] }

/** Chữ số Hán kiểu trang trọng (壹 = 一) làm nền trang trí cho từng cấp; 一 chỉ là một nét nên trông như vệt bẩn */
const STAGE_GLYPH: Record<string, string> = {
  pinyin: '音',
  hsk1: '壹',
  hsk2: '贰',
  hsk3: '叁',
  hsk4: '肆',
  hsk5: '伍',
  hsk6: '陆',
}

/**
 * Trang level `/lo-trinh/:stageId` — bản đơn giản của MVP: danh sách bài của một cấp.
 * (Khoá/mở bài và lộ trình đầy đủ làm ở US4.)
 */
export default function StagePage() {
  const { stageId = '' } = useParams()
  return <StageView key={stageId} stageId={stageId} />
}

function StageView({ stageId }: { stageId: string }) {
  const cards = useStore((state) => state.cards)
  const position = useStore((state) => state.settings.lastLessonPosition)
  const [load, setLoad] = useState<LoadState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false
    Promise.all([getStage(stageId), getLessonsByStage(stageId)])
      .then(([stage, lessons]) => {
        if (cancelled) return
        setLoad(stage ? { status: 'ready', stage, lessons } : { status: 'not-found' })
      })
      .catch(() => !cancelled && setLoad({ status: 'not-found' }))
    return () => {
      cancelled = true
    }
  }, [stageId])

  if (load.status === 'loading') return <PageLoading />

  if (load.status === 'not-found') {
    return (
      <section className="mx-auto max-w-xl px-4 py-12 text-center">
        <h1 className="text-2xl">Không tìm thấy cấp học này</h1>
        <p className="mt-3 text-ink-soft">Bạn quay về HSK 1 để học tiếp nhé.</p>
        <ButtonLink to="/lo-trinh/hsk1" className="mt-6">
          Vào HSK 1
        </ButtonLink>
      </section>
    )
  }

  const { stage, lessons } = load
  const totalWords = lessons.reduce((sum, lesson) => sum + lesson.wordIds.length, 0)
  const learnedWords = lessons.reduce(
    (sum, lesson) => sum + lesson.wordIds.filter((wordId) => cards[wordId]).length,
    0,
  )

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <header className="relative overflow-hidden rounded-card border border-line bg-card p-5 shadow-card">
        <span
          aria-hidden="true"
          lang="zh"
          className="pointer-events-none absolute -top-6 right-2 text-[9rem] leading-none select-none"
          style={{ fontFamily: 'var(--font-display)', color: 'rgb(30 27 24 / 0.08)' }}
        >
          {STAGE_GLYPH[stage.id] ?? '学'}
        </span>
        <p className="text-sm font-semibold text-cinnabar">Cấp học</p>
        <h1 className="mt-1 text-3xl">{stage.titleVi}</h1>
        <p className="relative mt-2 max-w-prose text-ink-soft">{stage.descriptionVi}</p>
        {totalWords > 0 && (
          <p className="relative mt-3 text-sm font-medium text-ink" data-testid="stage-progress">
            Đã học {learnedWords}/{totalWords} từ
          </p>
        )}
      </header>

      {lessons.length === 0 ? (
        <section className="mt-8 text-center">
          <p className="font-semibold text-gold-text">
            {stage.status === 'coming_soon' ? 'Sắp có' : 'Đang soạn nội dung'}
          </p>
          <p className="mt-2 text-ink-soft">Nội dung của cấp này chưa sẵn sàng. Bạn học HSK 1 trước nhé.</p>
          {stage.id !== 'hsk1' && (
            <ButtonLink to="/lo-trinh/hsk1" className="mt-4">
              Vào HSK 1
            </ButtonLink>
          )}
        </section>
      ) : (
        <ol className="mt-6 space-y-3" aria-label={`Các bài của ${stage.titleVi}`}>
          {lessons.map((lesson) => {
            const learned = lesson.wordIds.filter((wordId) => cards[wordId]).length
            const complete = learned === lesson.wordIds.length
            const inProgress = position?.lessonId === lesson.id && position.cardIndex > 0
            return (
              <li key={lesson.id}>
                <Link
                  to={`/bai/${lesson.id}`}
                  className="flex min-h-16 items-center gap-4 rounded-card border border-line bg-card px-4 py-3 shadow-card transition-colors duration-150 hover:border-ink/40 hover:bg-paper-deep/50"
                >
                  <span
                    aria-hidden="true"
                    className={
                      'grid size-11 shrink-0 place-items-center rounded-control font-heading text-lg font-bold ' +
                      (complete ? 'bg-cinnabar text-white' : 'border border-line bg-paper text-ink')
                    }
                  >
                    {complete ? <Check size={22} strokeWidth={2} /> : lesson.order}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-heading text-lg leading-snug font-bold text-ink">
                      <span className="sr-only">Bài {lesson.order}: </span>
                      {lesson.titleVi}
                    </span>
                    <span className="block text-sm text-ink-soft">
                      {lesson.wordIds.length} từ
                      {complete
                        ? ' · đã học xong'
                        : inProgress
                          ? ' · đang học dở'
                          : learned > 0
                            ? ` · đã học ${learned} từ`
                            : ''}
                    </span>
                  </span>
                  <ChevronRight size={20} strokeWidth={1.75} className="shrink-0 text-ink-soft" aria-hidden="true" />
                </Link>
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}
