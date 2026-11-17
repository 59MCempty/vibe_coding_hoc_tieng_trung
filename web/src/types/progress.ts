/**
 * Kiểu dữ liệu TIẾN ĐỘ NGƯỜI HỌC (đọc/ghi, lưu trên trình duyệt).
 * Nguồn: specs/001-hoc-tieng-trung-hsk/data-model.md và contracts/storage-schema.md
 */

import type { StageId } from './content.ts'

/** 'YYYY-MM-DD' theo giờ địa phương */
export type DateString = string

/** Chưa nhớ / Hơi nhớ / Đã nhớ */
export type Rating = 'again' | 'hard' | 'good'

/** Hộp Leitner. Khoảng ôn theo hộp: 0, 1, 3, 7, 14, 30, 60 ngày. */
export type Box = 0 | 1 | 2 | 3 | 4 | 5 | 6

export interface CardProgress {
  wordId: string
  box: Box
  dueDate: DateString
  lastRating: Rating
  reviewCount: number
  lapseCount: number
  /** Số lần trả lời sai trong trò chơi theo ngày, dùng cho Thử thách tuần */
  wrongInGames7d: { date: DateString; count: number }[]
  /** Thêm tay từ trang chi tiết từ */
  addedManually: boolean
}

export interface DailyGoalToday {
  date: DateString
  newLearned: number
  newAvailable: number
  reviewsDone: number
  reviewsDue: number
}

export interface DailyGoal {
  /** 3–20, mặc định 10 */
  newWordsTarget: number
  today: DailyGoalToday | null
  /** Giữ 30 ngày gần nhất */
  history: { date: DateString; met: boolean }[]
  lastSuggestionDate: DateString | null
  pendingSuggestion: { direction: 'up' | 'down'; from: number; to: number } | null
}

export interface Streak {
  current: number
  best: number
  lastActiveDate: DateString | null
  activeDates: DateString[]
}

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6

export interface Reminder {
  enabled: boolean
  /** 'HH:mm' */
  time: string
  /** Ít nhất 1 ngày khi bật nhắc. 0 = Chủ nhật */
  weekdays: Weekday[]
  /** Ví dụ 'Asia/Ho_Chi_Minh' */
  timezone: string
  /** 'calendar' = đã tải file .ics */
  channel: 'push' | 'calendar'
  /** Mã ngẫu nhiên, chỉ dùng cho hàm nhắc */
  deviceId: string | null
  permission: 'granted' | 'denied' | 'default'
}

export interface EarnedBadge {
  badgeId: string
  /** Thời điểm ISO */
  earnedAt: string
}

export type GameId = 'match' | 'listen' | 'write' | 'order' | 'race' | 'weekly'

export interface GameSession {
  game: GameId
  scope: { type: 'lesson' | 'level' | 'due'; id?: string }
  questionIds: string[]
  score: number
  maxCombo: number
  wrongWordIds: string[]
  events: string[]
  /** Thời điểm ISO */
  playedAt: string
}

export interface GameRecord {
  last: GameSession | null
  bestScore: number
}

export interface WeeklyChallenge {
  /** Thứ Hai của tuần */
  weekStart: DateString
  wordIds: string[]
  completed: boolean
  score: number
}

export type StudyDirection = 'hanzi_to_meaning' | 'meaning_to_hanzi'

export interface LessonPosition {
  lessonId: string
  /** Số thẻ đã chấm trong lượt đầu của bài */
  cardIndex: number
}

export interface UserSettings {
  selectedLevel: StageId | null
  studyDirection: StudyDirection
  /** Mặc định 50, chỉnh trong khoảng 10–100 */
  dailyReviewCap: number
  soundOn: boolean
  lastLessonPosition: LessonPosition | null
  hasSeenIntro: boolean
}

/** Toàn bộ dữ liệu lưu dưới khoá `hoc-tieng-trung:v1` (chưa kể `schemaVersion`). */
export interface ProgressState {
  settings: UserSettings
  cards: Record<string, CardProgress>
  goal: DailyGoal
  streak: Streak
  reminder: Reminder
  badges: EarnedBadge[]
  games: Partial<Record<GameId, GameRecord>>
  weekly: WeeklyChallenge | null
}

export const DEFAULT_NEW_WORDS_TARGET = 10
export const DEFAULT_DAILY_REVIEW_CAP = 50
