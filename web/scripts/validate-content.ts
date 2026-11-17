/**
 * Kiểm tra nội dung học — 9 quy tắc trong specs/001-hoc-tieng-trung-hsk/contracts/content-schema.md
 *
 *   npm run validate:content              kiểm tra đầy đủ (chạy trước mỗi lần build, có lỗi thì chặn build)
 *   npm run validate:content -- --draft   khi đang soạn: bỏ qua quy tắc 5 và 7 (cần file ảnh, file nét)
 */

import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { hanChars, hasToneMark, isHan, splitPinyin } from '../src/lib/pinyin.ts'
import { PARTS_OF_SPEECH, type Lesson, type RoadmapStage, type Word } from '../src/types/content.ts'
import { PUBLIC_DIR, readContent } from './lib/content-files.ts'

export interface Issue {
  /** Số quy tắc (1–9) */
  rule: number
  /** Ở đâu: id từ, id bài… */
  where: string
  message: string
}

export interface ContentReport {
  /** Số từ theo cấp */
  wordsPerLevel: Record<number, number>
  totalWords: number
  /** % từ `concrete` có trường ảnh */
  percentConcreteWithImage: number
  concreteCount: number
  abstractCount: number
  /** % từ có mẹo nhớ hợp lệ */
  percentWithMnemonic: number
  /** Từ trong câu ví dụ không nằm trong danh sách từ đã soạn (để người duyệt xem) */
  tokensOutsideList: string[]
}

export interface ValidateInput {
  words: Record<number, Word[]>
  lessons: Record<number, Lesson[]>
  stages?: RoadmapStage[]
  /** true = bỏ qua quy tắc 5 và 7 */
  draft?: boolean
  /** Kiểm tra file có tồn tại không; đường dẫn tính từ thư mục public/ */
  fileExists?: (relativePath: string) => boolean
}

export interface ValidateResult {
  errors: Issue[]
  warnings: Issue[]
  report: ContentReport
}

const STORY_MAX = 200
const PUNCTUATION = /^[\p{P}\p{S}\s]+$/u

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

/** Đường dẫn file nét của một chữ, tính từ public/ */
export function strokePath(char: string): string {
  return `strokes/${char}.json`
}

export function validateContent(input: ValidateInput): ValidateResult {
  const errors: Issue[] = []
  const warnings: Issue[] = []
  const draft = input.draft ?? false
  const fileExists = input.fileExists ?? (() => false)
  const err = (rule: number, where: string, message: string) => errors.push({ rule, where, message })
  const warn = (rule: number, where: string, message: string) => warnings.push({ rule, where, message })

  const levels = Object.keys(input.words).map(Number).sort()
  const all: Word[] = levels.flatMap((level) => input.words[level] ?? [])

  // Từ → cấp thấp nhất chứa nó (cho quy tắc 4)
  const levelOfHanzi = new Map<string, number>()
  for (const level of levels) {
    for (const word of input.words[level] ?? []) {
      if (typeof word?.hanzi === 'string' && !levelOfHanzi.has(word.hanzi)) levelOfHanzi.set(word.hanzi, level)
    }
  }

  const seenIds = new Set<string>()
  const missingStrokes = new Set<string>()
  const outside = new Set<string>()
  let withMnemonic = 0
  let concreteCount = 0
  let concreteWithImage = 0

  for (const level of levels) {
    for (const word of input.words[level] ?? []) {
      const where = isNonEmptyString(word?.id) ? `${word.id} ${word.hanzi ?? ''}`.trim() : '(từ không có id)'

      // ---- Quy tắc 1: đủ trường, id đúng dạng và không trùng ----
      if (!isNonEmptyString(word?.id)) {
        err(1, where, 'Thiếu `id`.')
        continue
      }
      if (!/^hsk[1-6]-\d{3}$/.test(word.id)) err(1, where, '`id` phải có dạng `hsk1-001`.')
      if (seenIds.has(word.id)) err(1, where, '`id` bị trùng.')
      seenIds.add(word.id)
      if (word.hskLevel !== level) err(1, where, `\`hskLevel\` phải là ${level} (theo tên file).`)
      if (!word.id.startsWith(`hsk${level}-`)) err(1, where, `\`id\` phải bắt đầu bằng \`hsk${level}-\`.`)

      const chars = isNonEmptyString(word.hanzi) ? [...word.hanzi] : []
      if (chars.length < 1 || chars.length > 4 || !chars.every(isHan)) {
        err(1, where, '`hanzi` phải là 1–4 chữ Hán.')
      }
      if (!Array.isArray(word.meaningVi) || word.meaningVi.length < 1 || !word.meaningVi.every(isNonEmptyString)) {
        err(1, where, '`meaningVi` cần ít nhất 1 nghĩa tiếng Việt.')
      }
      if (!PARTS_OF_SPEECH.includes(word.partOfSpeech)) {
        err(1, where, `\`partOfSpeech\` phải là một trong: ${PARTS_OF_SPEECH.join(', ')}.`)
      }
      if (!isNonEmptyString(word.topic)) err(1, where, 'Thiếu `topic`.')
      if (word.kind !== 'concrete' && word.kind !== 'abstract') {
        err(1, where, '`kind` phải là `concrete` hoặc `abstract`.')
      }
      if (word.kind === 'concrete') {
        concreteCount++
        if (isNonEmptyString(word.image)) concreteWithImage++
        else err(1, where, 'Từ `concrete` bắt buộc có `image`.')
      }

      // ---- Quy tắc 2: pinyin có dấu, số âm tiết = số chữ, tones khớp dấu ----
      if (!isNonEmptyString(word.pinyin)) {
        err(2, where, 'Thiếu `pinyin`.')
      } else {
        const syllables = splitPinyin(word.pinyin)
        // Từ một chữ đọc thanh nhẹ (吗 ma, 的 de) là hợp lệ; từ nhiều chữ mà không có dấu nào là thiếu dấu.
        if (!hasToneMark(word.pinyin) && syllables.length > 1) {
          err(2, where, '`pinyin` phải có dấu thanh.')
        }
        if (/[0-9]/.test(word.pinyin)) err(2, where, '`pinyin` dùng dấu thanh (ǎ), không dùng số (a3).')
        if (syllables.length !== chars.length) {
          err(2, where, `\`pinyin\` có ${syllables.length} âm tiết nhưng từ có ${chars.length} chữ.`)
        }
        const expected = syllables.map((s) => s.tone)
        if (!Array.isArray(word.tones) || word.tones.join(',') !== expected.join(',')) {
          err(2, where, `\`tones\` phải là [${expected.join(', ')}] theo dấu trong pinyin "${word.pinyin}".`)
        }
        if (!hasToneMark(word.pinyin) && syllables.length === 1) {
          warn(2, where, 'Cả từ đọc thanh nhẹ (không dấu) — kiểm tra lại có đúng không.')
        }
      }

      // ---- Quy tắc 3: ≥ 2 câu ví dụ, đủ trường, ghép tokens = hanzi ----
      const examples = Array.isArray(word.examples) ? word.examples : []
      if (examples.length < 2) err(3, where, `Cần ít nhất 2 câu ví dụ (đang có ${examples.length}).`)
      examples.forEach((example, index) => {
        const at = `${where} · câu ${index + 1}`
        if (!isNonEmptyString(example?.hanzi) || !isNonEmptyString(example?.pinyin) || !isNonEmptyString(example?.meaningVi)) {
          err(3, at, 'Câu ví dụ cần đủ `hanzi`, `pinyin`, `meaningVi`.')
          return
        }
        if (!Array.isArray(example.tokens) || example.tokens.length === 0) {
          err(3, at, 'Câu ví dụ thiếu `tokens`.')
          return
        }
        if (example.tokens.join('') !== example.hanzi) {
          err(3, at, `Ghép \`tokens\` ("${example.tokens.join('')}") không bằng \`hanzi\` ("${example.hanzi}").`)
        }
        if (!hasToneMark(example.pinyin)) err(3, at, '`pinyin` của câu phải có dấu thanh.')
        const syllableCount = splitPinyin(example.pinyin).length
        const charCount = hanChars(example.hanzi).length
        if (syllableCount !== charCount) {
          err(3, at, `Pinyin có ${syllableCount} âm tiết nhưng câu có ${charCount} chữ Hán.`)
        }
        if (isNonEmptyString(word.hanzi) && !example.hanzi.includes(word.hanzi)) {
          warn(3, at, `Câu ví dụ không chứa từ "${word.hanzi}".`)
        }

        // ---- Quy tắc 4: câu chỉ dùng từ cùng cấp trở xuống (cảnh báo) ----
        for (const token of example.tokens) {
          if (PUNCTUATION.test(token)) continue
          const tokenLevel = levelOfHanzi.get(token)
          if (tokenLevel === undefined) outside.add(token)
          else if (tokenLevel > level) {
            warn(4, at, `Từ "${token}" thuộc HSK ${tokenLevel}, cao hơn cấp của từ chính (HSK ${level}).`)
          }
        }

        // ---- Quy tắc 7 (phần câu ví dụ) ----
        if (!draft) {
          for (const ch of hanChars(example.hanzi)) {
            if (!fileExists(strokePath(ch))) missingStrokes.add(ch)
          }
        }
      })

      // ---- Quy tắc 5: concrete có file ảnh; abstract có đủ file nét ----
      if (!draft) {
        if (word.kind === 'concrete' && isNonEmptyString(word.image) && !fileExists(word.image)) {
          err(5, where, `Không thấy file ảnh \`${word.image}\`.`)
        }
        if (word.kind === 'abstract') {
          const lacking = chars.filter((ch) => isHan(ch) && !fileExists(strokePath(ch)))
          if (lacking.length > 0) {
            err(5, where, `Từ \`abstract\` thiếu file nét cho: ${lacking.join(' ')} (không vẽ được hình tách bộ thủ).`)
          }
        }
        // ---- Quy tắc 7 (phần từ) ----
        for (const ch of chars) {
          if (isHan(ch) && !fileExists(strokePath(ch))) missingStrokes.add(ch)
        }
      }

      // ---- Quy tắc 6: mẹo nhớ ----
      const mnemonic = word.mnemonic
      const components = Array.isArray(mnemonic?.components) ? mnemonic.components : []
      let mnemonicOk = true
      if (components.length === 0) {
        err(6, where, '`mnemonic.components` không được rỗng.')
        mnemonicOk = false
      } else if (!components.every((c) => isNonEmptyString(c?.part) && isNonEmptyString(c?.meaningVi))) {
        err(6, where, 'Mỗi thành phần của mẹo nhớ cần `part` và `meaningVi`.')
        mnemonicOk = false
      }
      if (!isNonEmptyString(mnemonic?.story)) {
        err(6, where, 'Thiếu `mnemonic.story`.')
        mnemonicOk = false
      } else if ([...mnemonic.story].length > STORY_MAX) {
        err(6, where, `\`mnemonic.story\` dài ${[...mnemonic.story].length} ký tự, tối đa ${STORY_MAX}.`)
        mnemonicOk = false
      }
      if (mnemonicOk) withMnemonic++
    }
  }

  // ---- Quy tắc 7: mọi chữ có dữ liệu nét ----
  if (!draft && missingStrokes.size > 0) {
    err(7, 'strokes/', `Thiếu dữ liệu nét cho ${missingStrokes.size} chữ: ${[...missingStrokes].join(' ')}. Chạy \`npm run fetch:strokes\`.`)
  }

  // ---- Quy tắc 8: bài 8–12 từ, từ tồn tại, mỗi từ thuộc đúng một bài ----
  const lessonOfWord = new Map<string, string>()
  const lessonIds = new Set<string>()
  for (const level of Object.keys(input.lessons).map(Number).sort()) {
    for (const lesson of input.lessons[level] ?? []) {
      const where = isNonEmptyString(lesson?.id) ? lesson.id : '(bài không có id)'
      if (!isNonEmptyString(lesson?.id) || !/^hsk[1-6]-l\d{2}$/.test(lesson.id)) {
        err(8, where, '`id` của bài phải có dạng `hsk1-l01`.')
      }
      if (lessonIds.has(lesson.id)) err(8, where, '`id` của bài bị trùng.')
      lessonIds.add(lesson.id)
      if (lesson.stageId !== `hsk${level}`) err(8, where, `\`stageId\` phải là \`hsk${level}\`.`)
      if (!isNonEmptyString(lesson.titleVi)) err(8, where, 'Thiếu `titleVi`.')
      if (typeof lesson.order !== 'number') err(8, where, 'Thiếu `order`.')
      const wordIds = Array.isArray(lesson.wordIds) ? lesson.wordIds : []
      if (wordIds.length < 8 || wordIds.length > 12) {
        err(8, where, `Bài cần 8–12 từ (đang có ${wordIds.length}).`)
      }
      for (const wordId of wordIds) {
        if (!seenIds.has(wordId)) err(8, where, `Từ \`${wordId}\` không tồn tại.`)
        const other = lessonOfWord.get(wordId)
        if (other) err(8, where, `Từ \`${wordId}\` đã thuộc bài \`${other}\`.`)
        else lessonOfWord.set(wordId, lesson.id)
      }
    }
  }
  for (const word of all) {
    if (isNonEmptyString(word?.id) && !lessonOfWord.has(word.id)) {
      err(8, `${word.id} ${word.hanzi ?? ''}`.trim(), 'Từ chưa thuộc bài nào.')
    }
  }
  for (const stage of input.stages ?? []) {
    for (const lessonId of stage.lessonIds ?? []) {
      if (!lessonIds.has(lessonId)) err(8, `stages.json · ${stage.id}`, `Bài \`${lessonId}\` không tồn tại.`)
    }
    if (stage.status === 'coming_soon' && (stage.lessonIds ?? []).length > 0) {
      err(8, `stages.json · ${stage.id}`, 'Chặng `coming_soon` phải có `lessonIds` rỗng.')
    }
  }

  // ---- Quy tắc 9: báo cáo ----
  const wordsPerLevel: Record<number, number> = {}
  for (const level of levels) wordsPerLevel[level] = (input.words[level] ?? []).length
  const percent = (part: number, whole: number) => (whole === 0 ? 100 : Math.round((part / whole) * 1000) / 10)
  const report: ContentReport = {
    wordsPerLevel,
    totalWords: all.length,
    concreteCount,
    abstractCount: all.length - concreteCount,
    percentConcreteWithImage: percent(concreteWithImage, concreteCount),
    percentWithMnemonic: percent(withMnemonic, all.length),
    tokensOutsideList: [...outside].sort(),
  }
  if (outside.size > 0) {
    warn(4, 'câu ví dụ', `${outside.size} từ trong câu ví dụ không có trong danh sách từ đã soạn (người duyệt xem lại): ${report.tokensOutsideList.join(' ')}`)
  }

  return { errors, warnings, report }
}

/* ------------------------------ Chạy từ dòng lệnh ------------------------------ */

function main(): void {
  const draft = process.argv.includes('--draft')
  const content = readContent()
  const result = validateContent({
    ...content,
    draft,
    fileExists: (relativePath) => existsSync(join(PUBLIC_DIR, relativePath)),
  })

  console.log(`Kiểm tra nội dung${draft ? ' (chế độ --draft: bỏ qua quy tắc 5 và 7)' : ''}`)
  for (const issue of result.warnings) console.log(`  CẢNH BÁO  [quy tắc ${issue.rule}] ${issue.where}: ${issue.message}`)
  for (const issue of result.errors) console.log(`  LỖI       [quy tắc ${issue.rule}] ${issue.where}: ${issue.message}`)

  const { report } = result
  console.log('\nBáo cáo:')
  for (const [level, count] of Object.entries(report.wordsPerLevel)) console.log(`  HSK ${level}: ${count} từ`)
  if (report.totalWords === 0) console.log('  (chưa có từ nào)')
  console.log(`  Từ cụ thể (concrete): ${report.concreteCount}, có ảnh: ${report.percentConcreteWithImage}%`)
  console.log(`  Từ trừu tượng (abstract, dùng hình tách bộ thủ): ${report.abstractCount}`)
  console.log(`  Có mẹo nhớ: ${report.percentWithMnemonic}%`)
  console.log(`\n${result.errors.length} lỗi, ${result.warnings.length} cảnh báo.`)

  if (result.errors.length > 0) {
    console.log('Có lỗi nội dung — sửa xong mới build được.')
    process.exit(1)
  }
}

if (import.meta.main) main()
