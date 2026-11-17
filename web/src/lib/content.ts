/**
 * Tải nội dung học (file JSON trong public/data/) theo từng cấp và giữ trong bộ nhớ.
 * Nội dung tách khỏi code giao diện: sửa từ vựng chỉ cần sửa file JSON.
 */

import type {
  CharComponents,
  ComponentsMap,
  ConfusablesMap,
  HskLevel,
  Lesson,
  RoadmapStage,
  StageId,
  StrokeData,
  Word,
} from '../types/content.ts'

/** Lỗi tải nội dung, kèm lời nhắn tiếng Việt để hiện cho người dùng. */
export class ContentError extends Error {
  constructor(message = 'Không tải được nội dung bài học. Bạn kiểm tra mạng rồi thử lại nhé.') {
    super(message)
    this.name = 'ContentError'
  }
}

const cache = new Map<string, Promise<unknown>>()

function url(path: string): string {
  const base = import.meta.env.BASE_URL ?? '/'
  return `${base}${path}`.replace(/\/{2,}/g, '/')
}

/** Tải một file JSON, mỗi file chỉ tải một lần. */
function fetchJson<T>(path: string): Promise<T> {
  let pending = cache.get(path) as Promise<T> | undefined
  if (!pending) {
    pending = fetch(url(path)).then(async (response) => {
      const type = response.headers.get('content-type') ?? ''
      if (!response.ok || !type.includes('json')) throw new ContentError()
      return (await response.json()) as T
    })
    pending.catch(() => cache.delete(path)) // lỗi thì lần sau thử lại
    cache.set(path, pending)
  }
  return pending
}

/** Như fetchJson nhưng trả về giá trị dự phòng khi file chưa có. */
async function fetchJsonOr<T>(path: string, fallback: T): Promise<T> {
  try {
    return await fetchJson<T>(path)
  } catch {
    return fallback
  }
}

/** `hsk1-012` hoặc `hsk1-l03` → 1 */
export function levelOfId(id: string): HskLevel | null {
  const match = /^hsk([1-6])-/.exec(id)
  return match ? (Number(match[1]) as HskLevel) : null
}

export function levelOfStage(stageId: string): HskLevel | null {
  const match = /^hsk([1-6])$/.exec(stageId)
  return match ? (Number(match[1]) as HskLevel) : null
}

export function getStages(): Promise<RoadmapStage[]> {
  return fetchJson<RoadmapStage[]>('data/stages.json')
}

export async function getStage(stageId: string): Promise<RoadmapStage | null> {
  const stages = await getStages()
  return stages.find((stage) => stage.id === stageId) ?? null
}

/** Mọi từ của một cấp. Cấp chưa có nội dung → mảng rỗng. */
export function getWordsByLevel(level: HskLevel): Promise<Word[]> {
  return fetchJsonOr<Word[]>(`data/words/hsk${level}.json`, [])
}

/** Mọi bài của một cấp, theo thứ tự. Cấp chưa có nội dung → mảng rỗng. */
export async function getLessonsByLevel(level: HskLevel): Promise<Lesson[]> {
  const lessons = await fetchJsonOr<Lesson[]>(`data/lessons/hsk${level}.json`, [])
  return [...lessons].sort((a, b) => a.order - b.order)
}

export async function getLessonsByStage(stageId: StageId | string): Promise<Lesson[]> {
  const level = levelOfStage(stageId)
  return level ? getLessonsByLevel(level) : []
}

export async function getWord(wordId: string): Promise<Word | null> {
  const level = levelOfId(wordId)
  if (!level) return null
  const words = await getWordsByLevel(level)
  return words.find((word) => word.id === wordId) ?? null
}

export async function getWords(wordIds: string[]): Promise<Word[]> {
  const words = await Promise.all(wordIds.map(getWord))
  return words.filter((word): word is Word => word !== null)
}

export async function getLesson(lessonId: string): Promise<Lesson | null> {
  const level = levelOfId(lessonId)
  if (!level) return null
  const lessons = await getLessonsByLevel(level)
  return lessons.find((lesson) => lesson.id === lessonId) ?? null
}

/** Id các từ dễ nhầm với từ này (file sinh tự động). */
export async function getConfusables(wordId: string): Promise<string[]> {
  const map = await fetchJsonOr<ConfusablesMap>('data/generated/confusables.json', {})
  return map[wordId] ?? []
}

/** Cách tách một chữ thành các thành phần (file sinh tự động). Chữ không có dữ liệu → null. */
export async function getComponents(char: string): Promise<CharComponents | null> {
  const map = await fetchJsonOr<ComponentsMap>('data/generated/components.json', {})
  return map[char] ?? null
}

/** Dữ liệu nét của một chữ (public/strokes/<chữ>.json). Không có → null. */
export async function getStrokes(char: string): Promise<StrokeData | null> {
  return fetchJsonOr<StrokeData | null>(`strokes/${encodeURIComponent(char)}.json`, null)
}
