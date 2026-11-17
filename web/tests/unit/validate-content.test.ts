// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { validateContent, type ValidateInput } from '../../scripts/validate-content.ts'
import type { Lesson, Word } from '../../src/types/content.ts'

/** Một từ mẫu đúng mọi quy tắc. */
function makeWord(n: number, overrides: Partial<Word> = {}): Word {
  const id = `hsk1-${String(n).padStart(3, '0')}`
  return {
    id,
    hanzi: '妈妈',
    pinyin: 'māma',
    tones: [1, 0],
    meaningVi: ['mẹ'],
    partOfSpeech: 'danh',
    hskLevel: 1,
    topic: 'gia-dinh',
    kind: 'abstract',
    examples: [
      { hanzi: '我妈妈很好。', pinyin: 'Wǒ māma hěn hǎo.', meaningVi: 'Mẹ tôi rất khoẻ.', tokens: ['我', '妈妈', '很', '好', '。'] },
      { hanzi: '妈妈，你好！', pinyin: 'Māma, nǐ hǎo!', meaningVi: 'Con chào mẹ!', tokens: ['妈妈', '，', '你好', '！'] },
    ],
    mnemonic: {
      components: [
        { part: '女', meaningVi: 'người phụ nữ' },
        { part: '马', meaningVi: 'ngựa (gợi âm mǎ)' },
      ],
      story: 'Người phụ nữ tất tả như ngựa chạy lo cho cả nhà — đó là mẹ.',
    },
    ...overrides,
  } as Word
}

/** Bộ dữ liệu đúng: 8 từ trong 1 bài. `change` sửa từ đầu tiên để tạo dữ liệu sai. */
function makeInput(change: Partial<Word> = {}, extra: Partial<ValidateInput> = {}): ValidateInput {
  const words = Array.from({ length: 8 }, (_, i) => makeWord(i + 1, i === 0 ? change : {}))
  const lesson: Lesson = {
    id: 'hsk1-l01',
    stageId: 'hsk1',
    order: 1,
    titleVi: 'Gia đình',
    topic: 'gia-dinh',
    wordIds: words.map((w) => w.id),
  }
  return { words: { 1: words }, lessons: { 1: [lesson] }, fileExists: () => true, ...extra }
}

const rulesOf = (input: ValidateInput) => validateContent(input).errors.map((e) => e.rule)

describe('validateContent', () => {
  it('dữ liệu đúng thì không có lỗi', () => {
    const result = validateContent(makeInput())
    expect(result.errors).toEqual([])
  })

  describe('quy tắc 1: đủ trường, id không trùng', () => {
    it('báo lỗi khi id trùng', () => {
      const input = makeInput()
      input.words[1][1] = makeWord(1)
      expect(rulesOf(input)).toContain(1)
    })
    it('báo lỗi khi thiếu nghĩa tiếng Việt', () => {
      expect(rulesOf(makeInput({ meaningVi: [] }))).toContain(1)
    })
    it('báo lỗi khi loại từ không hợp lệ', () => {
      expect(rulesOf(makeInput({ partOfSpeech: 'noun' as never }))).toContain(1)
    })
    it('báo lỗi khi từ concrete không có image', () => {
      expect(rulesOf(makeInput({ kind: 'concrete' } as Partial<Word>))).toContain(1)
    })
    it('báo lỗi khi id sai dạng', () => {
      const input = makeInput({ id: 'hsk1-1' })
      input.lessons[1][0].wordIds[0] = 'hsk1-1'
      expect(rulesOf(input)).toContain(1)
    })
  })

  describe('quy tắc 2: pinyin và thanh điệu', () => {
    it('báo lỗi khi pinyin không có dấu', () => {
      expect(rulesOf(makeInput({ pinyin: 'mama', tones: [0, 0] }))).toContain(2)
    })
    it('báo lỗi khi số âm tiết khác số chữ', () => {
      expect(rulesOf(makeInput({ pinyin: 'mā', tones: [1] }))).toContain(2)
    })
    it('báo lỗi khi tones không khớp dấu', () => {
      expect(rulesOf(makeInput({ tones: [3, 0] }))).toContain(2)
    })
    it('chấp nhận từ một chữ đọc thanh nhẹ', () => {
      const result = validateContent(makeInput({ hanzi: '吗', pinyin: 'ma', tones: [0] }))
      expect(result.errors.filter((e) => e.rule === 2)).toEqual([])
    })
    it('chấp nhận đuôi cuốn lưỡi 儿: nǎr = 哪 + 儿', () => {
      const result = validateContent(makeInput({ hanzi: '哪儿', pinyin: 'nǎr', tones: [3, 0] }))
      expect(result.errors.filter((e) => e.rule === 2)).toEqual([])
    })
  })

  describe('quy tắc 3: câu ví dụ', () => {
    it('báo lỗi khi chỉ có 1 câu', () => {
      const word = makeWord(1)
      expect(rulesOf(makeInput({ examples: [word.examples[0]] }))).toContain(3)
    })
    it('báo lỗi khi ghép tokens khác hanzi', () => {
      const word = makeWord(1)
      const broken = { ...word.examples[0], tokens: ['我', '妈妈', '好', '。'] }
      expect(rulesOf(makeInput({ examples: [broken, word.examples[1]] }))).toContain(3)
    })
    it('báo lỗi khi pinyin của câu thiếu âm tiết', () => {
      const word = makeWord(1)
      const broken = { ...word.examples[0], pinyin: 'Wǒ māma hǎo.' }
      expect(rulesOf(makeInput({ examples: [broken, word.examples[1]] }))).toContain(3)
    })
  })

  describe('quy tắc 4: từ cấp cao hơn trong câu (chỉ cảnh báo)', () => {
    it('cảnh báo nhưng không chặn', () => {
      const input = makeInput()
      input.words[2] = [makeWord(1, { id: 'hsk2-001', hanzi: '很', pinyin: 'hěn', tones: [3], hskLevel: 2 })]
      input.lessons[2] = []
      const result = validateContent(input)
      expect(result.warnings.some((w) => w.rule === 4 && w.message.includes('很'))).toBe(true)
      expect(result.errors.some((e) => e.rule === 4)).toBe(false)
    })
  })

  describe('quy tắc 5 và 7: file ảnh và file nét', () => {
    const noFiles = { fileExists: () => false }
    it('báo lỗi khi từ concrete không có file ảnh', () => {
      const change = { kind: 'concrete', image: 'images/words/hsk1-001.webp' } as Partial<Word>
      const fileExists = (path: string) => !path.startsWith('images/')
      expect(rulesOf(makeInput(change, { fileExists }))).toContain(5)
    })
    it('báo lỗi khi thiếu file nét', () => {
      const rules = rulesOf(makeInput({}, noFiles))
      expect(rules).toContain(5)
      expect(rules).toContain(7)
    })
    it('chế độ --draft bỏ qua quy tắc 5 và 7', () => {
      const rules = rulesOf(makeInput({}, { ...noFiles, draft: true }))
      expect(rules).not.toContain(5)
      expect(rules).not.toContain(7)
      expect(rules).toEqual([])
    })
  })

  describe('quy tắc 6: mẹo nhớ', () => {
    it('báo lỗi khi không có thành phần', () => {
      expect(rulesOf(makeInput({ mnemonic: { components: [], story: 'Một câu chuyện.' } }))).toContain(6)
    })
    it('báo lỗi khi câu chuyện dài quá 200 ký tự', () => {
      const story = 'a'.repeat(201)
      const components = [{ part: '女', meaningVi: 'phụ nữ' }]
      expect(rulesOf(makeInput({ mnemonic: { components, story } }))).toContain(6)
    })
  })

  describe('quy tắc 8: bài học', () => {
    it('báo lỗi khi bài có ít hơn 8 từ', () => {
      const input = makeInput()
      input.lessons[1][0].wordIds.pop()
      expect(rulesOf(input)).toContain(8) // bài 7 từ + 1 từ không thuộc bài nào
    })
    it('báo lỗi khi bài trỏ tới từ không tồn tại', () => {
      const input = makeInput()
      input.lessons[1][0].wordIds.push('hsk1-999')
      expect(rulesOf(input)).toContain(8)
    })
    it('báo lỗi khi một từ thuộc hai bài', () => {
      const input = makeInput()
      input.lessons[1].push({ ...input.lessons[1][0], id: 'hsk1-l02', order: 2 })
      expect(rulesOf(input)).toContain(8)
    })
  })

  describe('quy tắc 9: báo cáo', () => {
    it('đếm số từ mỗi cấp, % có ảnh và % có mẹo nhớ', () => {
      const { report } = validateContent(makeInput())
      expect(report.wordsPerLevel).toEqual({ 1: 8 })
      expect(report.totalWords).toBe(8)
      expect(report.percentWithMnemonic).toBe(100)
      expect(report.percentConcreteWithImage).toBe(100)
      expect(report.abstractCount).toBe(8)
    })
  })
})
