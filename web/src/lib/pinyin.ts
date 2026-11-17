/**
 * Xử lý pinyin: tách âm tiết, suy ra thanh điệu từ dấu, bỏ dấu.
 * File này không dùng gì của trình duyệt để các script trong `scripts/` cũng dùng được.
 *
 * Thanh điệu: 1 (ā), 2 (á), 3 (ǎ), 4 (à), 0 = thanh nhẹ (không dấu).
 */

export type Tone = 0 | 1 | 2 | 3 | 4

export interface PinyinSyllable {
  /** Âm tiết đúng như trong chuỗi gốc (giữ chữ hoa, giữ dấu). */
  text: string
  tone: Tone
  /** Vị trí trong chuỗi gốc: [start, end). */
  start: number
  end: number
  /** true nếu đây là đuôi "r" cuốn lưỡi của chữ 儿 (nǎr = 哪 + 儿). */
  erhua: boolean
}

const TONE_MARKS: Record<string, [base: string, tone: Tone]> = {
  ā: ['a', 1], á: ['a', 2], ǎ: ['a', 3], à: ['a', 4],
  ē: ['e', 1], é: ['e', 2], ě: ['e', 3], è: ['e', 4],
  ī: ['i', 1], í: ['i', 2], ǐ: ['i', 3], ì: ['i', 4],
  ō: ['o', 1], ó: ['o', 2], ǒ: ['o', 3], ò: ['o', 4],
  ū: ['u', 1], ú: ['u', 2], ǔ: ['u', 3], ù: ['u', 4],
  ǖ: ['ü', 1], ǘ: ['ü', 2], ǚ: ['ü', 3], ǜ: ['ü', 4],
}

const VOWELS = 'aeiouü' + Object.keys(TONE_MARKS).join('')
const V = `[${VOWELS}]`

/**
 * Một âm tiết = phụ âm đầu (nếu có) + cụm nguyên âm + đuôi n/ng (chỉ khi KHÔNG đứng trước nguyên âm,
 * vì khi đó n/g là phụ âm đầu của âm tiết sau: "fāngàn" = fān + gàn).
 * Đuôi "r" xử lý riêng: "er" là một âm tiết (二 èr), còn "nǎr" là 哪 + 儿.
 */
const SYLLABLE = new RegExp(
  `(?:zh|ch|sh|[bpmfdtnlgkhjqxrzcsyw])?${V}+(?:ng(?!${V})|n(?!${V}))?|r(?!${V})`,
  'gu',
)

function toneOf(text: string): Tone {
  for (const ch of text) {
    const mark = TONE_MARKS[ch]
    if (mark) return mark[1]
  }
  return 0
}

/** Tách chuỗi pinyin (một từ hoặc cả câu) thành các âm tiết, bỏ qua dấu câu và khoảng trắng. */
export function splitPinyin(input: string): PinyinSyllable[] {
  const source = input.normalize('NFC')
  const lower = source.toLowerCase()
  const out: PinyinSyllable[] = []
  SYLLABLE.lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = SYLLABLE.exec(lower)) !== null) {
    const start = match.index
    const end = start + match[0].length
    if (match[0] === 'r') {
      const prev = out[out.length - 1]
      // "e" + "r" liền nhau, không có phụ âm đầu → âm tiết "er" (二, 儿子)
      if (prev && prev.end === start && stripTones(prev.text).toLowerCase() === 'e') {
        prev.end = end
        prev.text = source.slice(prev.start, end)
        continue
      }
      out.push({ text: source.slice(start, end), tone: 0, start, end, erhua: true })
      continue
    }
    out.push({ text: source.slice(start, end), tone: toneOf(match[0]), start, end, erhua: false })
  }
  return out
}

/** Thanh điệu của từng âm tiết, ví dụ "nǐ hǎo" → [3, 3], "māma" → [1, 0]. */
export function tonesOf(input: string): Tone[] {
  return splitPinyin(input).map((s) => s.tone)
}

/** Bỏ dấu thanh nhưng giữ nguyên chữ: "nǚ" → "nü", "hǎo" → "hao". */
export function stripTones(input: string): string {
  let out = ''
  for (const ch of input.normalize('NFC')) {
    const lower = ch.toLowerCase()
    const mark = TONE_MARKS[lower]
    if (!mark) out += ch
    else out += ch === lower ? mark[0] : mark[0].toUpperCase()
  }
  return out
}

/** Dạng để tìm kiếm: bỏ dấu, bỏ khoảng trắng và dấu câu, ü → v. "nǐ hǎo" → "nihao". */
export function pinyinPlain(input: string): string {
  return stripTones(input)
    .toLowerCase()
    .replace(/ü/g, 'v')
    .replace(/[^a-z]/g, '')
}

/** Chuỗi có ít nhất một dấu thanh không? */
export function hasToneMark(input: string): boolean {
  for (const ch of input.normalize('NFC').toLowerCase()) {
    if (TONE_MARKS[ch]) return true
  }
  return false
}

const HAN = /\p{Script=Han}/u

/** Các chữ Hán trong chuỗi (bỏ dấu câu, chữ Latinh, số). */
export function hanChars(input: string): string[] {
  return [...input].filter((ch) => HAN.test(ch))
}

export function isHan(ch: string): boolean {
  return HAN.test(ch)
}
