/**
 * Tải dữ liệu nét chữ và cách tách chữ. Chạy: npm run fetch:strokes
 *
 *  1. Với mỗi chữ Hán xuất hiện trong từ và câu ví dụ: tải dữ liệu nét của hanzi-writer-data
 *     → public/strokes/<chữ>.json (chữ đã có file thì bỏ qua; thêm --force để tải lại).
 *  2. Tải dictionary.txt của Make Me a Hanzi, lấy `decomposition` và `matches`
 *     → public/data/generated/components.json  { "<chữ>": { decomposition, groups } }
 *     (mỗi nhóm = chỉ số các nét thuộc một thành phần; chữ thiếu dữ liệu thì không có mục).
 *  3. Ghi nguồn và giấy phép vào public/data/credits.json.
 */

import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { hanChars } from '../src/lib/pinyin.ts'
import type { CharComponents, ComponentsMap, StrokeData } from '../src/types/content.ts'
import { DATA_DIR, GENERATED_DIR, STROKES_DIR, allWords, readContent, readJson, writeJson } from './lib/content-files.ts'

const STROKES_VERSION = '2.0.1'
const STROKES_URL = (char: string) =>
  `https://cdn.jsdelivr.net/npm/hanzi-writer-data@${STROKES_VERSION}/${encodeURIComponent(char)}.json`
const DICTIONARY_URL = 'https://raw.githubusercontent.com/skishore/makemeahanzi/master/dictionary.txt'

/** Mọi chữ Hán trong từ và câu ví dụ, không trùng. */
export function collectChars(words: { hanzi: string; examples: { hanzi: string }[] }[]): string[] {
  const set = new Set<string>()
  for (const word of words) {
    for (const ch of hanChars(word.hanzi)) set.add(ch)
    for (const example of word.examples ?? []) for (const ch of hanChars(example.hanzi)) set.add(ch)
  }
  return [...set].sort()
}

/** Dữ liệu tải về có đúng dạng của Hanzi Writer không (không tin dữ liệu ngoài). */
export function isStrokeData(value: unknown): value is StrokeData {
  if (typeof value !== 'object' || value === null) return false
  const data = value as Record<string, unknown>
  return (
    Array.isArray(data.strokes) &&
    data.strokes.length > 0 &&
    data.strokes.every((s) => typeof s === 'string' && /^[MLQCZ0-9 .,-]+$/i.test(s)) &&
    Array.isArray(data.medians) &&
    data.medians.length === data.strokes.length
  )
}

/**
 * Gom các nét theo thành phần cấp một của chữ.
 * `matches[i]` của Make Me a Hanzi là đường đi tới thành phần chứa nét i trong cây decomposition
 * (ví dụ [0] = thành phần thứ nhất, [1, 0] = phần con đầu của thành phần thứ hai), hoặc null.
 * Trả về null nếu không chia được thành ít nhất 2 nhóm.
 */
export function groupStrokes(decomposition: string, matches: unknown, strokeCount: number): CharComponents | null {
  if (typeof decomposition !== 'string' || decomposition.length < 2 || decomposition.startsWith('？')) return null
  if (!Array.isArray(matches) || matches.length !== strokeCount) return null
  const byComponent = new Map<number, number[]>()
  matches.forEach((path, strokeIndex) => {
    if (!Array.isArray(path) || typeof path[0] !== 'number') return
    const list = byComponent.get(path[0]) ?? []
    list.push(strokeIndex)
    byComponent.set(path[0], list)
  })
  if (byComponent.size < 2) return null
  const groups = [...byComponent.entries()].sort((a, b) => a[0] - b[0]).map(([, strokes]) => strokes)
  return { decomposition, groups }
}

async function fetchText(url: string): Promise<string> {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`)
  return response.text()
}

async function main(): Promise<void> {
  const force = process.argv.includes('--force')
  const chars = collectChars(allWords(readContent()))
  console.log(`Cần dữ liệu nét cho ${chars.length} chữ.`)

  // 1. Dữ liệu nét
  const strokeCounts = new Map<string, number>()
  const failed: string[] = []
  let downloaded = 0
  const queue = [...chars]
  const worker = async () => {
    for (let ch = queue.shift(); ch !== undefined; ch = queue.shift()) {
      const file = join(STROKES_DIR, `${ch}.json`)
      try {
        if (existsSync(file) && !force) {
          strokeCounts.set(ch, readJson<StrokeData>(file).strokes.length)
          continue
        }
        const data: unknown = JSON.parse(await fetchText(STROKES_URL(ch)))
        if (!isStrokeData(data)) throw new Error('dữ liệu sai dạng')
        const clean: StrokeData = { strokes: data.strokes, medians: data.medians }
        if (Array.isArray(data.radStrokes)) clean.radStrokes = data.radStrokes
        writeJson(file, clean)
        strokeCounts.set(ch, clean.strokes.length)
        downloaded++
      } catch (error) {
        failed.push(ch)
        console.log(`  Không tải được nét của "${ch}": ${(error as Error).message}`)
      }
    }
  }
  await Promise.all(Array.from({ length: 6 }, worker))
  console.log(`Nét chữ: tải mới ${downloaded}, đã có sẵn ${chars.length - downloaded - failed.length}, lỗi ${failed.length}.`)

  // 2. Cách tách chữ
  const components: ComponentsMap = {}
  try {
    const wanted = new Set(chars)
    const dictionary = await fetchText(DICTIONARY_URL)
    for (const line of dictionary.split('\n')) {
      if (!line.trim()) continue
      let entry: { character?: unknown; decomposition?: unknown; matches?: unknown }
      try {
        entry = JSON.parse(line)
      } catch {
        continue
      }
      if (typeof entry.character !== 'string' || !wanted.has(entry.character)) continue
      const count = strokeCounts.get(entry.character)
      if (count === undefined) continue
      const grouped = groupStrokes(String(entry.decomposition ?? ''), entry.matches, count)
      if (grouped) components[entry.character] = grouped
    }
    const sorted = Object.fromEntries(Object.entries(components).sort(([a], [b]) => a.localeCompare(b)))
    writeJson(join(GENERATED_DIR, 'components.json'), sorted)
    console.log(`components.json: ${Object.keys(sorted).length}/${chars.length} chữ tách được thành phần.`)
  } catch (error) {
    console.log(`Không tải được dictionary.txt: ${(error as Error).message}. Giữ nguyên components.json cũ.`)
    process.exitCode = 1
  }

  // 3. Nguồn và giấy phép
  writeJson(
    join(DATA_DIR, 'credits.json'),
    [
      {
        id: 'hanzi-writer',
        name: 'Hanzi Writer',
        usedFor: 'Thư viện vẽ thứ tự nét chữ Hán',
        license: 'MIT',
        url: 'https://github.com/chanind/hanzi-writer',
      },
      {
        id: 'hanzi-writer-data',
        name: 'hanzi-writer-data',
        usedFor: 'Dữ liệu nét của từng chữ (thư mục strokes/)',
        license: 'Arphic Public License (dữ liệu nét gốc từ Make Me a Hanzi)',
        url: 'https://github.com/chanind/hanzi-writer-data',
        version: STROKES_VERSION,
      },
      {
        id: 'makemeahanzi',
        name: 'Make Me a Hanzi',
        usedFor: 'Cách tách chữ thành các thành phần (data/generated/components.json)',
        license: 'dictionary.txt: GNU LGPL; dữ liệu nét (graphics.txt): Arphic Public License',
        url: 'https://github.com/skishore/makemeahanzi',
      },
    ],
    true,
  )
  console.log('Đã ghi credits.json.')
  if (failed.length > 0) process.exitCode = 1
}

if (import.meta.main) await main()
