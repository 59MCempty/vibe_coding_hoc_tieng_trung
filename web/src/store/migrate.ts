/**
 * Đọc dữ liệu đã lưu, nâng cấp khi đổi cấu trúc, và xử lý khi dữ liệu bị hỏng.
 * Nguồn: specs/001-hoc-tieng-trung-hsk/contracts/storage-schema.md
 *
 * Trong localStorage chỉ có MỘT khoá `hoc-tieng-trung:v1`, giá trị là JSON:
 *   { "schemaVersion": 1, "settings": {…}, "cards": {…}, "goal": {…}, … }
 */

import {
  DEFAULT_DAILY_REVIEW_CAP,
  DEFAULT_NEW_WORDS_TARGET,
  type ProgressState,
} from '../types/progress.ts'

export const STORAGE_KEY = 'hoc-tieng-trung:v1'
export const BACKUP_PREFIX = 'hoc-tieng-trung:backup-'
export const SCHEMA_VERSION = 1

/** Trạng thái của người mới, chưa học gì. */
export function createInitialState(): ProgressState {
  let timezone = 'Asia/Ho_Chi_Minh'
  try {
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || timezone
  } catch {
    // giữ mặc định
  }
  return {
    settings: {
      selectedLevel: null,
      studyDirection: 'hanzi_to_meaning',
      dailyReviewCap: DEFAULT_DAILY_REVIEW_CAP,
      soundOn: true,
      lastLessonPosition: null,
      hasSeenIntro: false,
    },
    cards: {},
    goal: {
      newWordsTarget: DEFAULT_NEW_WORDS_TARGET,
      today: null,
      history: [],
      lastSuggestionDate: null,
      pendingSuggestion: null,
    },
    streak: { current: 0, best: 0, lastActiveDate: null, activeDates: [] },
    reminder: {
      enabled: false,
      time: '20:00',
      weekdays: [0, 1, 2, 3, 4, 5, 6],
      timezone,
      channel: 'push',
      deviceId: null,
      permission: 'default',
    },
    badges: [],
    games: {},
    weekly: null,
  }
}

type AnyState = Record<string, unknown>

/**
 * Các bước nâng cấp, chạy tuần tự. Khoá = phiên bản CŨ.
 * Ví dụ khi lên phiên bản 2, thêm:  1: (s) => ({ ...s, truongMoi: giaTriMacDinh })
 */
export const migrations: Record<number, (state: AnyState) => AnyState> = {}

function isObject(value: unknown): value is AnyState {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/** Nâng dữ liệu từ `fromVersion` lên phiên bản hiện tại, rồi bù các nhánh còn thiếu bằng mặc định. */
export function migrateState(
  stored: unknown,
  fromVersion: number,
  steps: Record<number, (state: AnyState) => AnyState> = migrations,
  targetVersion: number = SCHEMA_VERSION,
): ProgressState {
  let state: AnyState = isObject(stored) ? { ...stored } : {}
  for (let version = fromVersion; version < targetVersion; version++) {
    const step = steps[version]
    if (step) state = step(state)
  }
  const base = createInitialState()
  const pick = <K extends keyof ProgressState>(key: K): ProgressState[K] => {
    const value = state[key]
    const fallback = base[key]
    if (Array.isArray(fallback)) return (Array.isArray(value) ? value : fallback) as ProgressState[K]
    if (fallback === null) return (isObject(value) ? value : null) as ProgressState[K]
    return (isObject(value) ? { ...fallback, ...value } : fallback) as ProgressState[K]
  }
  return {
    settings: pick('settings'),
    cards: pick('cards'),
    goal: pick('goal'),
    streak: pick('streak'),
    reminder: pick('reminder'),
    badges: pick('badges'),
    games: pick('games'),
    weekly: pick('weekly'),
  }
}

export interface LoadProblem {
  /** Khoá localStorage chứa bản sao dữ liệu hỏng */
  backupKey: string
}

export interface LoadResult {
  /** null = chưa có dữ liệu (hoặc dữ liệu hỏng đã được cất đi) */
  data: { state: ProgressState; version: number } | null
  problem: LoadProblem | null
}

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>

/**
 * Đọc dữ liệu thô. Nếu JSON hỏng: cất bản sao vào `hoc-tieng-trung:backup-<ngày>`,
 * trả về `data: null` (app khởi tạo mới) và `problem` để giao diện báo cho người dùng.
 */
export function loadStored(storage: StorageLike, todayString: string): LoadResult {
  const raw = storage.getItem(STORAGE_KEY)
  if (raw === null) return { data: null, problem: null }
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!isObject(parsed) || typeof parsed.schemaVersion !== 'number') {
      throw new Error('Sai cấu trúc')
    }
    if (parsed.schemaVersion > SCHEMA_VERSION) throw new Error('Dữ liệu của bản mới hơn')
    const { schemaVersion, ...rest } = parsed
    return { data: { state: migrateState(rest, schemaVersion), version: SCHEMA_VERSION }, problem: null }
  } catch {
    const backupKey = `${BACKUP_PREFIX}${todayString}`
    try {
      storage.setItem(backupKey, raw)
    } catch {
      // hết chỗ lưu: vẫn tiếp tục để người dùng học được
    }
    return { data: null, problem: { backupKey } }
  }
}

/** Chuỗi JSON để ghi xuống localStorage. */
export function serializeState(state: ProgressState): string {
  return JSON.stringify({ schemaVersion: SCHEMA_VERSION, ...state })
}

/** Lấy đúng các nhánh dữ liệu (bỏ các hàm của store). */
export function pickProgress(state: ProgressState): ProgressState {
  return {
    settings: state.settings,
    cards: state.cards,
    goal: state.goal,
    streak: state.streak,
    reminder: state.reminder,
    badges: state.badges,
    games: state.games,
    weekly: state.weekly,
  }
}
