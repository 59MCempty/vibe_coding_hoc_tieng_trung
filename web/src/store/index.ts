/**
 * Kho trạng thái tiến độ học (Zustand + persist).
 * Mọi thứ nằm trong một khoá localStorage `hoc-tieng-trung:v1`, không cần tài khoản.
 */

import { create } from 'zustand'
import { persist, type PersistStorage, type StorageValue } from 'zustand/middleware'
import { today } from '../lib/date.ts'
import type {
  CardProgress,
  LessonPosition,
  ProgressState,
  StudyDirection,
} from '../types/progress.ts'
import {
  SCHEMA_VERSION,
  STORAGE_KEY,
  createInitialState,
  loadStored,
  pickProgress,
  serializeState,
  type LoadProblem,
} from './migrate.ts'

export interface StoreActions {
  /** Ghi (hoặc ghi đè) tiến độ của một thẻ. */
  saveCard: (card: CardProgress) => void
  /** Nhớ vị trí đang học dở trong bài; null = không còn bài dở. */
  setLessonPosition: (position: LessonPosition | null) => void
  /** Hướng học: nhìn chữ đoán nghĩa, hoặc nhìn nghĩa đoán chữ. */
  setStudyDirection: (direction: StudyDirection) => void
}

export type Store = ProgressState & StoreActions

let loadProblem: LoadProblem | null = null

/** Khác null nếu lần mở này phát hiện dữ liệu hỏng (đã cất bản sao). */
export function getLoadProblem(): LoadProblem | null {
  return loadProblem
}

function getLocalStorage(): Storage | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage
  } catch {
    return null // trình duyệt chặn lưu trữ (chế độ riêng tư nghiêm ngặt)
  }
}

/** Lưu đúng định dạng phẳng của contracts/storage-schema.md thay vì định dạng mặc định của Zustand. */
const flatStorage: PersistStorage<ProgressState> = {
  getItem: () => {
    const storage = getLocalStorage()
    if (!storage) return null
    const result = loadStored(storage, today())
    loadProblem = result.problem
    return result.data as StorageValue<ProgressState> | null
  },
  setItem: (_name, value) => {
    const storage = getLocalStorage()
    if (!storage) return
    try {
      storage.setItem(STORAGE_KEY, serializeState(value.state))
    } catch {
      // hết chỗ lưu: bỏ qua, không làm gián đoạn việc học
    }
  },
  removeItem: () => {
    getLocalStorage()?.removeItem(STORAGE_KEY)
  },
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      ...createInitialState(),
      saveCard: (card) => set((state) => ({ cards: { ...state.cards, [card.wordId]: card } })),
      setLessonPosition: (position) =>
        set((state) => ({ settings: { ...state.settings, lastLessonPosition: position } })),
      setStudyDirection: (direction) =>
        set((state) => ({ settings: { ...state.settings, studyDirection: direction } })),
    }),
    {
      name: STORAGE_KEY,
      version: SCHEMA_VERSION,
      storage: flatStorage,
      partialize: (state) => pickProgress(state),
    },
  ),
)
