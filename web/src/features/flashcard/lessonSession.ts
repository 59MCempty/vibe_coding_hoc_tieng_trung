/**
 * Logic của một buổi học bài bằng thẻ (không dính tới giao diện, để kiểm thử được).
 *
 * Quy tắc "mới học" (data-model.md):
 *   Đã nhớ (good)  → hộp 1, ôn lại vào ngày mai
 *   Hơi nhớ (hard) → hộp 1, ôn lại vào ngày mai
 *   Chưa nhớ (again) → hộp 0, và thẻ quay lại MỘT lần ở cuối buổi
 */

import { addDays } from '../../lib/date.ts'
import type { CardProgress, DateString, LessonPosition, Rating } from '../../types/progress.ts'

export interface LessonSession {
  lessonId: string
  /** Các thẻ của buổi học, theo thứ tự trong bài */
  wordIds: string[]
  /** Thẻ còn phải học; phần tử đầu là thẻ hiện tại */
  queue: string[]
  /** Số thẻ đã chấm trong lượt đầu */
  firstPassDone: number
  /** Đánh giá gần nhất của từng thẻ */
  ratings: Record<string, Rating>
  /** Thẻ đã quay lại một lần (không quay lại lần nữa) */
  retried: string[]
}

export interface ResumeOptions {
  /** Số thẻ đã chấm trong lượt đầu (UserSettings.lastLessonPosition.cardIndex) */
  resumeAt: number
  /** Tiến độ thẻ đã lưu, để biết thẻ nào đang "Chưa nhớ" */
  cards: Record<string, CardProgress | undefined>
}

/** Tạo buổi học từ một bài. Truyền `resume` để học tiếp từ chỗ đang dở. */
export function createSession(lesson: { id: string; wordIds: string[] }, resume?: ResumeOptions): LessonSession {
  const wordIds = [...lesson.wordIds]
  if (!resume) {
    return { lessonId: lesson.id, wordIds, queue: [...wordIds], firstPassDone: 0, ratings: {}, retried: [] }
  }
  const done = Math.min(Math.max(0, Math.floor(resume.resumeAt)), wordIds.length)
  const ratings: Record<string, Rating> = {}
  const pendingRetry: string[] = []
  for (const wordId of wordIds.slice(0, done)) {
    const card = resume.cards[wordId]
    ratings[wordId] = card?.lastRating ?? 'hard'
    if (card && card.box === 0 && card.lastRating === 'again') pendingRetry.push(wordId)
  }
  return {
    lessonId: lesson.id,
    wordIds,
    queue: [...wordIds.slice(done), ...pendingRetry],
    firstPassDone: done,
    ratings,
    retried: [],
  }
}

export function currentWordId(session: LessonSession): string | null {
  return session.queue[0] ?? null
}

export function isFinished(session: LessonSession): boolean {
  return session.queue.length === 0
}

/** Thẻ hiện tại có phải là thẻ "Chưa nhớ" đang quay lại không? */
export function isRetryCard(session: LessonSession): boolean {
  return !isFinished(session) && session.firstPassDone >= session.wordIds.length
}

/** Chấm thẻ hiện tại và chuyển sang thẻ kế. Trả về buổi học mới (không sửa buổi cũ). */
export function rateCurrent(session: LessonSession, rating: Rating): LessonSession {
  const wordId = currentWordId(session)
  if (wordId === null) return session
  const inFirstPass = session.firstPassDone < session.wordIds.length
  const queue = session.queue.slice(1)
  const retried = [...session.retried]
  if (rating === 'again' && inFirstPass) queue.push(wordId) // quay lại cuối buổi
  if (!inFirstPass) retried.push(wordId)
  return {
    ...session,
    queue,
    retried,
    firstPassDone: inFirstPass ? session.firstPassDone + 1 : session.firstPassDone,
    ratings: { ...session.ratings, [wordId]: rating },
  }
}

/** Vị trí cần lưu để học tiếp sau khi đóng trang; null khi đã học xong. */
export function positionOf(session: LessonSession): LessonPosition | null {
  if (isFinished(session)) return null
  return { lessonId: session.lessonId, cardIndex: session.firstPassDone }
}

export interface LessonSummaryData {
  total: number
  /** Thẻ có lần chấm cuối là Đã nhớ hoặc Hơi nhớ */
  remembered: string[]
  /** Thẻ có lần chấm cuối là Chưa nhớ */
  notRemembered: string[]
}

export function summarize(session: LessonSession): LessonSummaryData {
  const remembered: string[] = []
  const notRemembered: string[] = []
  for (const wordId of session.wordIds) {
    if (session.ratings[wordId] === 'again') notRemembered.push(wordId)
    else if (session.ratings[wordId]) remembered.push(wordId)
  }
  return { total: session.wordIds.length, remembered, notRemembered }
}

/**
 * Tiến độ thẻ sau khi chấm trong lúc HỌC BÀI.
 * Thẻ đã ở hộp 1 trở lên (đã vào lịch ôn) thì giữ nguyên: học lại bài cũ không làm mất lịch ôn.
 */
export function applyNewCardRating(
  existing: CardProgress | undefined,
  wordId: string,
  rating: Rating,
  today: DateString,
): CardProgress {
  if (existing && existing.box >= 1) return existing
  const remembered = rating !== 'again'
  return {
    wordId,
    box: remembered ? 1 : 0,
    dueDate: remembered ? addDays(today, 1) : today,
    lastRating: rating,
    reviewCount: existing?.reviewCount ?? 0,
    lapseCount: existing?.lapseCount ?? 0,
    wrongInGames7d: existing?.wrongInGames7d ?? [],
    addedManually: existing?.addedManually ?? false,
  }
}
