/**
 * Đọc/ghi file nội dung cho các script. Chạy bằng Node (không phải trình duyệt).
 */

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Lesson, RoadmapStage, Word } from '../../src/types/content.ts'

/** Thư mục web/public */
export const PUBLIC_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'public')
export const DATA_DIR = join(PUBLIC_DIR, 'data')
export const GENERATED_DIR = join(DATA_DIR, 'generated')
export const STROKES_DIR = join(PUBLIC_DIR, 'strokes')

export function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, 'utf8')) as T
}

export function readJsonOr<T>(path: string, fallback: T): T {
  return existsSync(path) ? readJson<T>(path) : fallback
}

export function writeJson(path: string, data: unknown, pretty = false): void {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, JSON.stringify(data, null, pretty ? 2 : undefined) + '\n', 'utf8')
}

/** Các cấp có file trong một thư mục, ví dụ words/hsk1.json → [1] */
function levelsIn(dir: string): number[] {
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .map((name) => /^hsk([1-6])\.json$/.exec(name))
    .filter((match): match is RegExpExecArray => match !== null)
    .map((match) => Number(match[1]))
    .sort()
}

export interface ContentFiles {
  /** Từ theo cấp: { 1: Word[], … } */
  words: Record<number, Word[]>
  lessons: Record<number, Lesson[]>
  stages: RoadmapStage[]
}

/** Đọc toàn bộ nội dung đang có trong public/data. */
export function readContent(): ContentFiles {
  const words: Record<number, Word[]> = {}
  for (const level of levelsIn(join(DATA_DIR, 'words'))) {
    words[level] = readJson<Word[]>(join(DATA_DIR, 'words', `hsk${level}.json`))
  }
  const lessons: Record<number, Lesson[]> = {}
  for (const level of levelsIn(join(DATA_DIR, 'lessons'))) {
    lessons[level] = readJson<Lesson[]>(join(DATA_DIR, 'lessons', `hsk${level}.json`))
  }
  const stages = readJsonOr<RoadmapStage[]>(join(DATA_DIR, 'stages.json'), [])
  return { words, lessons, stages }
}

export function allWords(content: ContentFiles): Word[] {
  return Object.keys(content.words)
    .map(Number)
    .sort()
    .flatMap((level) => content.words[level])
}
