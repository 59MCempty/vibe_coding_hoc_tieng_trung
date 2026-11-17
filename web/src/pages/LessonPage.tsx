import { ArrowLeft, ArrowLeftRight, Check, Minus, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PageLoading } from '../app/Layout.tsx'
import { Button, ButtonLink } from '../components/ui/Button.tsx'
import { FlashCard } from '../features/flashcard/FlashCard.tsx'
import { LessonSummary } from '../features/flashcard/LessonSummary.tsx'
import {
  applyNewCardRating,
  createSession,
  currentWordId,
  isFinished,
  isRetryCard,
  positionOf,
  rateCurrent,
  summarize,
  type LessonSession,
} from '../features/flashcard/lessonSession.ts'
import { getLesson, getLessonsByStage, getWords } from '../lib/content.ts'
import { today } from '../lib/date.ts'
import { warmUpSpeech } from '../lib/speech.ts'
import { useStore } from '../store/index.ts'
import type { Lesson, Word } from '../types/content.ts'
import type { Rating } from '../types/progress.ts'

interface LessonData {
  lesson: Lesson
  words: Word[]
  nextLesson: Lesson | null
}

type LoadState = { status: 'loading' } | { status: 'not-found' } | { status: 'error' } | { status: 'ready'; data: LessonData }

/** 3 mức tự đánh giá (FR-005) */
const RATINGS: { rating: Rating; label: string; key: string; icon: typeof X; className: string }[] = [
  {
    rating: 'again',
    label: 'Chưa nhớ',
    key: '1',
    icon: X,
    className: 'border border-cinnabar bg-card text-cinnabar hover:bg-paper-deep',
  },
  {
    rating: 'hard',
    label: 'Hơi nhớ',
    key: '2',
    icon: Minus,
    className: 'border border-ink/70 bg-card text-ink hover:bg-paper-deep',
  },
  {
    rating: 'good',
    label: 'Đã nhớ',
    key: '3',
    icon: Check,
    className: 'border border-jade bg-jade text-white hover:brightness-95',
  },
]

/** Hộp thoại hỏi học tiếp khi mở lại bài còn dở (FR-007). */
function ResumeDialog({ cardNumber, total, onResume, onRestart }: { cardNumber: number; total: number; onResume: () => void; onRestart: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="hoc-tiep-tieu-de"
        className="anim-rise w-full max-w-sm rounded-card border border-line bg-card p-6 text-center shadow-card"
      >
        <h2 id="hoc-tiep-tieu-de" className="text-xl">
          Học tiếp từ thẻ đang dở?
        </h2>
        <p className="mt-2 text-ink-soft">
          {cardNumber <= total
            ? `Lần trước bạn dừng ở thẻ ${cardNumber}/${total} của bài này.`
            : 'Lần trước bạn đã xem hết các thẻ, chỉ còn vài từ chưa nhớ cần xem lại.'}
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Button onClick={onResume} autoFocus>
            Học tiếp
          </Button>
          <Button variant="ghost" onClick={onRestart}>
            Học lại từ đầu
          </Button>
        </div>
      </div>
    </div>
  )
}

/** Trang học một bài bằng thẻ lật: `/bai/:lessonId`. Đổi bài thì dựng lại trang từ đầu (key). */
export default function LessonPage() {
  const { lessonId = '' } = useParams()
  return <LessonView key={lessonId} lessonId={lessonId} />
}

function LessonView({ lessonId }: { lessonId: string }) {
  const direction = useStore((state) => state.settings.studyDirection)
  const setStudyDirection = useStore((state) => state.setStudyDirection)

  const [load, setLoad] = useState<LoadState>({ status: 'loading' })
  const [session, setSession] = useState<LessonSession | null>(null)
  /** 'lesson' = học cả bài (có lưu vị trí dở); 'retry' = chỉ ôn lại các từ chưa nhớ */
  const [mode, setMode] = useState<'lesson' | 'retry'>('lesson')
  const [pendingResume, setPendingResume] = useState<LessonSession | null>(null)
  const [flipped, setFlipped] = useState(false)

  // Tải bài và từ; kiểm tra có bài đang dở không
  useEffect(() => {
    let cancelled = false
    warmUpSpeech()

    async function run() {
      const lesson = await getLesson(lessonId)
      if (cancelled) return
      if (!lesson) return setLoad({ status: 'not-found' })
      const [words, siblings] = await Promise.all([getWords(lesson.wordIds), getLessonsByStage(lesson.stageId)])
      if (cancelled) return
      if (words.length === 0) return setLoad({ status: 'error' })
      const nextLesson = siblings.find((other) => other.order === lesson.order + 1) ?? null
      setLoad({ status: 'ready', data: { lesson, words, nextLesson } })

      const { settings, cards } = useStore.getState()
      const position = settings.lastLessonPosition
      if (position && position.lessonId === lesson.id && position.cardIndex > 0) {
        const resumed = createSession(lesson, { resumeAt: position.cardIndex, cards })
        if (!isFinished(resumed)) return setPendingResume(resumed)
      }
      setSession(createSession(lesson))
    }
    run().catch(() => !cancelled && setLoad({ status: 'error' }))
    return () => {
      cancelled = true
    }
  }, [lessonId])

  const flip = useCallback(() => setFlipped((value) => !value), [])

  const rate = useCallback(
    (rating: Rating) => {
      if (!session) return
      const wordId = currentWordId(session)
      if (!wordId) return
      const store = useStore.getState()
      store.saveCard(applyNewCardRating(store.cards[wordId], wordId, rating, today()))
      const next = rateCurrent(session, rating)
      if (mode === 'lesson') store.setLessonPosition(positionOf(next))
      setSession(next)
      setFlipped(false)
    },
    [session, mode],
  )

  // Bàn phím: phím cách để lật; 1 / 2 / 3 để chấm khi thẻ đã lật
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (pendingResume || !session || isFinished(session)) return
      if (event.ctrlKey || event.metaKey || event.altKey) return
      const target = event.target as HTMLElement | null
      const tag = target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (event.code === 'Space') {
        if (tag === 'BUTTON' || tag === 'A') return // để nút đang chọn tự xử lý
        event.preventDefault()
        flip()
      } else if (flipped) {
        const choice = RATINGS.find((item) => item.key === event.key)
        if (choice) rate(choice.rating)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [pendingResume, session, flipped, flip, rate])

  if (load.status === 'loading') return <PageLoading />

  if (load.status === 'not-found' || load.status === 'error') {
    return (
      <section className="mx-auto max-w-xl px-4 py-12 text-center">
        <h1 className="text-2xl">
          {load.status === 'not-found' ? 'Không tìm thấy bài học này' : 'Chưa tải được bài học'}
        </h1>
        <p className="mt-3 text-ink-soft">
          {load.status === 'not-found'
            ? 'Bài có thể đã được đổi tên. Bạn chọn lại bài trong danh sách nhé.'
            : 'Bạn kiểm tra kết nối mạng rồi tải lại trang nhé.'}
        </p>
        <ButtonLink to="/lo-trinh/hsk1" className="mt-6">
          Về danh sách bài
        </ButtonLink>
      </section>
    )
  }

  const { lesson, words, nextLesson } = load.data
  const stagePath = `/lo-trinh/${lesson.stageId}`

  if (session && isFinished(session)) {
    return (
      <LessonSummary
        lesson={lesson}
        summary={summarize(session)}
        words={words}
        nextLesson={nextLesson}
        onRetry={() => {
          const retryIds = summarize(session).notRemembered
          setMode('retry')
          setFlipped(false)
          setSession(createSession({ id: lesson.id, wordIds: retryIds }))
        }}
      />
    )
  }

  const wordId = session ? currentWordId(session) : null
  const word = words.find((item) => item.id === wordId) ?? null
  // Khi đang hỏi học tiếp, thanh tiến độ phía sau hiện đúng chỗ đang dở
  const shown = session ?? pendingResume
  const total = shown?.wordIds.length ?? lesson.wordIds.length
  const done = shown?.firstPassDone ?? 0
  const retrying = session ? isRetryCard(session) : false
  const progressLabel = retrying
    ? `Xem lại từ chưa nhớ: còn ${session?.queue.length ?? 0} thẻ`
    : `Thẻ ${Math.min(done + 1, total)}/${total}`

  return (
    <div className="mx-auto max-w-xl px-4 pt-3">
      <header className="flex items-center gap-2">
        <Link
          to={stagePath}
          aria-label="Về danh sách bài"
          className="-ml-2 grid size-11 shrink-0 place-items-center rounded-control text-ink hover:bg-ink-wash"
        >
          <ArrowLeft size={22} strokeWidth={1.75} aria-hidden="true" />
        </Link>
        <h1 className="min-w-0 flex-1 truncate text-lg">
          {mode === 'retry' ? 'Ôn lại từ chưa nhớ' : `Bài ${lesson.order}: ${lesson.titleVi}`}
        </h1>
        <button
          type="button"
          onClick={() => {
            setStudyDirection(direction === 'hanzi_to_meaning' ? 'meaning_to_hanzi' : 'hanzi_to_meaning')
            setFlipped(false)
          }}
          aria-label={`Đổi hướng học. Đang học: ${direction === 'hanzi_to_meaning' ? 'nhìn chữ Hán đoán nghĩa' : 'nhìn nghĩa đoán chữ Hán'}`}
          className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-control border border-line bg-card px-3 text-sm font-medium text-ink hover:bg-paper-deep"
        >
          <ArrowLeftRight size={16} strokeWidth={1.75} aria-hidden="true" />
          {direction === 'hanzi_to_meaning' ? 'Chữ → Nghĩa' : 'Nghĩa → Chữ'}
        </button>
      </header>

      <div className="mt-2">
        <p className="text-sm text-ink-soft" data-testid="lesson-progress">
          {progressLabel}
        </p>
        <div
          role="progressbar"
          aria-label="Tiến độ trong bài"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={done}
          className="mt-1 h-1.5 overflow-hidden rounded-full bg-line"
        >
          <div
            className="h-full origin-left bg-cinnabar transition-transform duration-300 ease-out motion-reduce:transition-none"
            style={{ transform: `scaleX(${total === 0 ? 0 : done / total})` }}
          />
        </div>
      </div>

      {word && (
        <>
          {/* key = id từ: sang thẻ mới thì hiện mặt trước ngay, không lộ đáp án trong lúc xoay */}
          <div key={`${word.id}-${retrying}`} className="anim-rise mt-4">
            <FlashCard word={word} direction={direction} flipped={flipped} onFlip={flip} />
          </div>

          <div className="mt-4">
            {flipped ? (
              <div role="group" aria-label="Bạn nhớ từ này thế nào?" className="grid grid-cols-3 gap-2">
                {RATINGS.map(({ rating, label, key, icon: Icon, className }) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => rate(rating)}
                    className={`flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-control px-1 text-[15px] font-semibold transition-colors duration-150 ${className}`}
                  >
                    <Icon size={18} strokeWidth={2} aria-hidden="true" />
                    <span>{label}</span>
                    <span className="hidden text-xs font-normal opacity-80 md:block" aria-hidden="true">
                      phím {key}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <Button onClick={flip} className="w-full min-h-14">
                Lật thẻ
              </Button>
            )}
            <p className="mt-2 hidden text-center text-xs text-ink-soft md:block">
              Mẹo: bấm phím cách để lật thẻ.
            </p>
          </div>
        </>
      )}

      {pendingResume && (
        <ResumeDialog
          cardNumber={pendingResume.firstPassDone + 1}
          total={pendingResume.wordIds.length}
          onResume={() => {
            setSession(pendingResume)
            setPendingResume(null)
          }}
          onRestart={() => {
            useStore.getState().setLessonPosition(null)
            setSession(createSession(lesson))
            setPendingResume(null)
          }}
        />
      )}
    </div>
  )
}
