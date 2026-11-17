/**
 * Sinh public/data/generated/confusables.json — với mỗi từ, id các từ dễ nhầm:
 *   - cùng âm khác thanh (妈 mā / 吗 ma),
 *   - gần hình: chung chữ hoặc chung thành phần (theo decomposition của Make Me a Hanzi),
 *   - cùng chủ đề.
 * Dùng làm đáp án nhiễu trong trò chơi. File sinh tự động, không sửa tay. Chạy: npm run build:data
 */

import { join } from 'node:path'
import { hanChars, pinyinPlain, splitPinyin } from '../src/lib/pinyin.ts'
import type { ComponentsMap, ConfusablesMap, Word } from '../src/types/content.ts'
import { GENERATED_DIR, allWords, readContent, readJsonOr, writeJson } from './lib/content-files.ts'

const MAX_PER_WORD = 8

/** Các thành phần của một chữ theo chuỗi decomposition (bỏ ký hiệu bố cục ⿰⿱… và dấu ？). */
function partsOf(char: string, components: ComponentsMap): string[] {
  const entry = components[char]
  if (!entry) return []
  return hanChars(entry.decomposition).filter((part) => part !== char)
}

interface Features {
  syllables: Set<string>
  chars: Set<string>
  parts: Set<string>
}

function featuresOf(word: Word, components: ComponentsMap): Features {
  const chars = hanChars(word.hanzi)
  return {
    syllables: new Set(splitPinyin(word.pinyin).filter((s) => !s.erhua).map((s) => pinyinPlain(s.text))),
    chars: new Set(chars),
    parts: new Set(chars.flatMap((ch) => partsOf(ch, components))),
  }
}

function shares<T>(a: Set<T>, b: Set<T>): boolean {
  for (const item of a) if (b.has(item)) return true
  return false
}

export function buildConfusables(words: Word[], components: ComponentsMap = {}): ConfusablesMap {
  const features = new Map(words.map((word) => [word.id, featuresOf(word, components)]))
  const result: ConfusablesMap = {}

  for (const word of words) {
    const mine = features.get(word.id)!
    const scored: { id: string; score: number }[] = []
    for (const other of words) {
      if (other.id === word.id || other.hanzi === word.hanzi) continue
      const theirs = features.get(other.id)!
      let score = 0
      if (shares(mine.syllables, theirs.syllables)) score += 4 // cùng âm (khác thanh hoặc khác chữ)
      if (shares(mine.chars, theirs.chars)) score += 3 // chung một chữ
      // chung thành phần, hoặc chữ này là thành phần của chữ kia (马 trong 妈)
      if (shares(mine.parts, theirs.parts) || shares(mine.chars, theirs.parts) || shares(mine.parts, theirs.chars)) {
        score += 3
      }
      if (other.topic === word.topic) score += 1
      if (other.hskLevel === word.hskLevel) score += 0.5
      if (score >= 1) scored.push({ id: other.id, score })
    }
    scored.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
    result[word.id] = scored.slice(0, MAX_PER_WORD).map((item) => item.id)
  }
  return result
}

if (import.meta.main) {
  const words = allWords(readContent())
  const components = readJsonOr<ComponentsMap>(join(GENERATED_DIR, 'components.json'), {})
  const map = buildConfusables(words, components)
  writeJson(join(GENERATED_DIR, 'confusables.json'), map)
  const hasShapeData = Object.keys(components).length > 0
  console.log(
    `confusables.json: ${Object.keys(map).length} từ` +
      (hasShapeData ? '' : ' (chưa có components.json nên chưa xét "gần hình" — chạy npm run fetch:strokes)'),
  )
}
