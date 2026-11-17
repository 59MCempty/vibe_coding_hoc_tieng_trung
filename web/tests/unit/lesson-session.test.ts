// @vitest-environment node
import { describe, expect, it } from 'vitest'
import {
  applyNewCardRating,
  createSession,
  currentWordId,
  isFinished,
  positionOf,
  rateCurrent,
  summarize,
  type LessonSession,
} from '../../src/features/flashcard/lessonSession.ts'
import type { CardProgress, Rating } from '../../src/types/progress.ts'

const lesson = { id: 'hsk1-l01', wordIds: ['w1', 'w2', 'w3', 'w4'] }
const TODAY = '2026-11-17'

/** Chấm lần lượt các thẻ theo danh sách đánh giá. */
function rateAll(session: LessonSession, ratings: Rating[]): LessonSession {
  return ratings.reduce((s, rating) => rateCurrent(s, rating), session)
}

describe('thứ tự thẻ', () => {
  it('đi theo đúng thứ tự từ trong bài', () => {
    let session = createSession(lesson)
    const seen: string[] = []
    while (!isFinished(session)) {
      seen.push(currentWordId(session)!)
      session = rateCurrent(session, 'good')
    }
    expect(seen).toEqual(['w1', 'w2', 'w3', 'w4'])
  })

  it('bài mới bắt đầu ở thẻ đầu, chưa xong', () => {
    const session = createSession(lesson)
    expect(currentWordId(session)).toBe('w1')
    expect(isFinished(session)).toBe(false)
    expect(session.firstPassDone).toBe(0)
  })

  it('hết thẻ thì xong và không còn thẻ hiện tại', () => {
    const session = rateAll(createSession(lesson), ['good', 'good', 'hard', 'good'])
    expect(isFinished(session)).toBe(true)
    expect(currentWordId(session)).toBeNull()
    expect(rateCurrent(session, 'good')).toBe(session) // chấm thêm không làm gì
  })
})

describe('chấm 3 mức', () => {
  it('"Đã nhớ" → hộp 1, ôn lại vào ngày mai', () => {
    const card = applyNewCardRating(undefined, 'w1', 'good', TODAY)
    expect(card).toMatchObject({ wordId: 'w1', box: 1, dueDate: '2026-11-18', lastRating: 'good' })
    expect(card).toMatchObject({ reviewCount: 0, lapseCount: 0, addedManually: false, wrongInGames7d: [] })
  })

  it('"Hơi nhớ" → hộp 1, ôn lại vào ngày mai', () => {
    expect(applyNewCardRating(undefined, 'w1', 'hard', TODAY)).toMatchObject({
      box: 1,
      dueDate: '2026-11-18',
      lastRating: 'hard',
    })
  })

  it('"Chưa nhớ" → hộp 0, đến hạn ngay hôm nay', () => {
    expect(applyNewCardRating(undefined, 'w1', 'again', TODAY)).toMatchObject({
      box: 0,
      dueDate: TODAY,
      lastRating: 'again',
    })
  })

  it('thẻ hộp 0 được chấm "Đã nhớ" khi quay lại thì lên hộp 1', () => {
    const first = applyNewCardRating(undefined, 'w1', 'again', TODAY)
    expect(applyNewCardRating(first, 'w1', 'good', TODAY)).toMatchObject({ box: 1, lastRating: 'good' })
  })

  it('học lại bài cũ không làm mất lịch ôn của thẻ đã ở hộp cao', () => {
    const learned: CardProgress = {
      wordId: 'w1',
      box: 4,
      dueDate: '2026-12-01',
      lastRating: 'good',
      reviewCount: 5,
      lapseCount: 0,
      wrongInGames7d: [],
      addedManually: false,
    }
    expect(applyNewCardRating(learned, 'w1', 'again', TODAY)).toEqual(learned)
  })

  it('giữ cờ "thêm tay" của thẻ đã thêm từ trang chi tiết', () => {
    const manual = { ...applyNewCardRating(undefined, 'w1', 'again', TODAY), addedManually: true }
    expect(applyNewCardRating(manual, 'w1', 'good', TODAY).addedManually).toBe(true)
  })
})

describe('thẻ "Chưa nhớ" quay lại cuối buổi', () => {
  it('quay lại sau khi hết các thẻ còn lại', () => {
    let session = createSession(lesson)
    session = rateCurrent(session, 'again') // w1
    expect(session.queue).toEqual(['w2', 'w3', 'w4', 'w1'])
    session = rateAll(session, ['good', 'again', 'good']) // w2, w3, w4
    expect(session.queue).toEqual(['w1', 'w3'])
    expect(isFinished(session)).toBe(false)
    expect(currentWordId(session)).toBe('w1')
  })

  it('mỗi thẻ chỉ quay lại một lần, lần chấm thứ hai là kết quả cuối', () => {
    let session = rateAll(createSession(lesson), ['again', 'good', 'good', 'good'])
    expect(currentWordId(session)).toBe('w1')
    session = rateCurrent(session, 'again')
    expect(isFinished(session)).toBe(true)
    expect(summarize(session).notRemembered).toEqual(['w1'])
  })

  it('tổng kết: đếm từ đã nhớ và chưa nhớ theo lần chấm cuối', () => {
    let session = rateAll(createSession(lesson), ['again', 'hard', 'again', 'good'])
    session = rateAll(session, ['good', 'again']) // w1 nhớ lại được, w3 vẫn chưa
    const summary = summarize(session)
    expect(summary.total).toBe(4)
    expect(summary.remembered).toEqual(['w1', 'w2', 'w4'])
    expect(summary.notRemembered).toEqual(['w3'])
  })
})

describe('lưu và khôi phục vị trí (lastLessonPosition)', () => {
  it('vị trí tăng sau mỗi thẻ của lượt đầu', () => {
    let session = createSession(lesson)
    expect(positionOf(session)).toEqual({ lessonId: 'hsk1-l01', cardIndex: 0 })
    session = rateCurrent(session, 'good')
    expect(positionOf(session)).toEqual({ lessonId: 'hsk1-l01', cardIndex: 1 })
    session = rateCurrent(session, 'again')
    expect(positionOf(session)).toEqual({ lessonId: 'hsk1-l01', cardIndex: 2 })
  })

  it('học xong thì không còn vị trí dở', () => {
    const session = rateAll(createSession(lesson), ['good', 'good', 'good', 'good'])
    expect(positionOf(session)).toBeNull()
  })

  it('khôi phục: tiếp tục từ thẻ đang dở, thẻ "Chưa nhớ" trước đó vẫn quay lại cuối buổi', () => {
    const cards: Record<string, CardProgress> = {
      w1: applyNewCardRating(undefined, 'w1', 'again', TODAY),
      w2: applyNewCardRating(undefined, 'w2', 'good', TODAY),
    }
    const session = createSession(lesson, { resumeAt: 2, cards })
    expect(currentWordId(session)).toBe('w3')
    expect(session.queue).toEqual(['w3', 'w4', 'w1'])
    expect(session.firstPassDone).toBe(2)
    expect(session.ratings).toEqual({ w1: 'again', w2: 'good' })
    const done = rateAll(session, ['good', 'good', 'good'])
    expect(isFinished(done)).toBe(true)
    expect(summarize(done).remembered).toEqual(['w1', 'w2', 'w3', 'w4'])
  })

  it('khôi phục khi đã qua lượt đầu: chỉ còn các thẻ "Chưa nhớ"', () => {
    const cards: Record<string, CardProgress> = {
      w1: applyNewCardRating(undefined, 'w1', 'good', TODAY),
      w2: applyNewCardRating(undefined, 'w2', 'again', TODAY),
      w3: applyNewCardRating(undefined, 'w3', 'hard', TODAY),
      w4: applyNewCardRating(undefined, 'w4', 'good', TODAY),
    }
    const session = createSession(lesson, { resumeAt: 4, cards })
    expect(session.queue).toEqual(['w2'])
    expect(positionOf(session)).toEqual({ lessonId: 'hsk1-l01', cardIndex: 4 })
  })

  it('vị trí lưu vượt quá số thẻ (dữ liệu cũ) thì kẹp lại, không lỗi', () => {
    const session = createSession(lesson, { resumeAt: 99, cards: {} })
    expect(session.firstPassDone).toBe(4)
    expect(isFinished(session)).toBe(true)
  })
})
