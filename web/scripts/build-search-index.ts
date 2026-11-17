/**
 * Sinh public/data/generated/search-index.json — khoá tìm kiếm cho mọi từ.
 *   `nǐ hǎo`  → pinyinPlain  `nihao`
 *   `xin chào` → meaningPlain `xin chao`
 * File sinh tự động, không sửa tay. Chạy: npm run build:data
 */

import { join } from 'node:path'
import { pinyinPlain } from '../src/lib/pinyin.ts'
import type { SearchIndexEntry, Word } from '../src/types/content.ts'
import { GENERATED_DIR, allWords, readContent, writeJson } from './lib/content-files.ts'

/** Bỏ dấu tiếng Việt, đưa về chữ thường: "Xin chào" → "xin chao", "đi" → "di". */
export function stripVietnamese(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

export function buildSearchIndex(words: Word[]): SearchIndexEntry[] {
  return words.map((word) => ({
    id: word.id,
    hanzi: word.hanzi,
    pinyin: word.pinyin,
    pinyinPlain: pinyinPlain(word.pinyin),
    meaningPlain: word.meaningVi.map(stripVietnamese),
    hskLevel: word.hskLevel,
  }))
}

if (import.meta.main) {
  const index = buildSearchIndex(allWords(readContent()))
  writeJson(join(GENERATED_DIR, 'search-index.json'), index)
  console.log(`search-index.json: ${index.length} từ`)
}
