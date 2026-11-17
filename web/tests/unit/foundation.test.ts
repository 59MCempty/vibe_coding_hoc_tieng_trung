// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { buildConfusables } from '../../scripts/build-confusables.ts'
import { buildSearchIndex, stripVietnamese } from '../../scripts/build-search-index.ts'
import { collectChars, groupStrokes, isStrokeData } from '../../scripts/fetch-strokes.ts'
import { addDays, compareDates, diffDays, startOfWeek, toDateString } from '../../src/lib/date.ts'
import { pinyinPlain, splitPinyin, stripTones, tonesOf } from '../../src/lib/pinyin.ts'
import { BACKUP_PREFIX, STORAGE_KEY, loadStored, migrateState, serializeState, createInitialState } from '../../src/store/migrate.ts'
import type { Word } from '../../src/types/content.ts'

describe('pinyin', () => {
  const texts = (input: string) => splitPinyin(input).map((s) => s.text)

  it('tách âm tiết viết liền', () => {
    expect(texts('nǐ hǎo')).toEqual(['nǐ', 'hǎo'])
    expect(texts('māma')).toEqual(['mā', 'ma'])
    expect(texts('xīngqī')).toEqual(['xīng', 'qī'])
    expect(texts('diànyǐng')).toEqual(['diàn', 'yǐng'])
    expect(texts('píngguǒ')).toEqual(['píng', 'guǒ'])
    expect(texts('zěnmeyàng')).toEqual(['zěn', 'me', 'yàng'])
    expect(texts('chūzūchē')).toEqual(['chū', 'zū', 'chē'])
    expect(texts('kěnéng')).toEqual(['kě', 'néng'])
    expect(texts('fāngàn')).toEqual(['fān', 'gàn'])
    expect(texts("nǚ'ér")).toEqual(['nǚ', 'ér'])
    expect(texts('Zhōngguó rén')).toEqual(['Zhōng', 'guó', 'rén'])
  })

  it('xử lý âm "er" và đuôi cuốn lưỡi', () => {
    expect(texts('èr')).toEqual(['èr'])
    expect(texts('érzi')).toEqual(['ér', 'zi'])
    expect(texts('nǎr')).toEqual(['nǎ', 'r'])
    expect(texts('yìdiǎnr')).toEqual(['yì', 'diǎn', 'r'])
    expect(texts('zhèr')).toEqual(['zhè', 'r'])
  })

  it('suy ra thanh điệu từ dấu', () => {
    expect(tonesOf('nǐ hǎo')).toEqual([3, 3])
    expect(tonesOf('māma')).toEqual([1, 0])
    expect(tonesOf('bú kèqi')).toEqual([2, 4, 0])
    expect(tonesOf('Wǒ māma hěn hǎo.')).toEqual([3, 1, 0, 3, 3])
    expect(tonesOf('nǚ')).toEqual([3])
  })

  it('bỏ dấu để tìm kiếm', () => {
    expect(stripTones('Nǐ hǎo')).toBe('Ni hao')
    expect(pinyinPlain('nǐ hǎo')).toBe('nihao')
    expect(pinyinPlain("nǚ'ér")).toBe('nver')
  })
})

describe('date', () => {
  it('đổi Date sang chuỗi theo giờ địa phương', () => {
    expect(toDateString(new Date(2026, 10, 17, 23, 59))).toBe('2026-11-17')
    expect(toDateString(new Date(2026, 0, 5, 0, 1))).toBe('2026-01-05')
  })
  it('cộng ngày qua cuối tháng và cuối năm', () => {
    expect(addDays('2026-11-30', 1)).toBe('2026-12-01')
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01')
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28')
    expect(addDays('2026-11-17', 60)).toBe('2027-01-16')
  })
  it('đầu tuần là thứ Hai', () => {
    expect(startOfWeek('2026-11-17')).toBe('2026-11-16') // thứ Ba
    expect(startOfWeek('2026-11-16')).toBe('2026-11-16') // thứ Hai
    expect(startOfWeek('2026-11-22')).toBe('2026-11-16') // Chủ nhật
  })
  it('so sánh và đếm ngày', () => {
    expect(compareDates('2026-11-17', '2026-11-18')).toBeLessThan(0)
    expect(compareDates('2026-11-17', '2026-11-17')).toBe(0)
    expect(diffDays('2026-11-17', '2026-11-20')).toBe(3)
  })
})

describe('lưu trữ: migrate', () => {
  function fakeStorage(initial: Record<string, string> = {}) {
    const data = new Map(Object.entries(initial))
    return {
      data,
      getItem: (key: string) => data.get(key) ?? null,
      setItem: (key: string, value: string) => void data.set(key, value),
    }
  }

  it('chưa có dữ liệu thì trả về null, không báo lỗi', () => {
    expect(loadStored(fakeStorage(), '2026-11-17')).toEqual({ data: null, problem: null })
  })

  it('ghi rồi đọc lại đúng định dạng phẳng có schemaVersion', () => {
    const state = createInitialState()
    state.settings.lastLessonPosition = { lessonId: 'hsk1-l01', cardIndex: 3 }
    const raw = serializeState(state)
    expect(JSON.parse(raw).schemaVersion).toBe(1)
    expect(Object.keys(JSON.parse(raw))).toEqual(
      expect.arrayContaining(['settings', 'cards', 'goal', 'streak', 'reminder', 'badges', 'games', 'weekly']),
    )
    const loaded = loadStored(fakeStorage({ [STORAGE_KEY]: raw }), '2026-11-17')
    expect(loaded.problem).toBeNull()
    expect(loaded.data?.state.settings.lastLessonPosition).toEqual({ lessonId: 'hsk1-l01', cardIndex: 3 })
  })

  it('JSON hỏng: cất bản sao, khởi tạo mới, trả về cờ báo lỗi', () => {
    const storage = fakeStorage({ [STORAGE_KEY]: '{"schemaVersion":1,"cards":' })
    const loaded = loadStored(storage, '2026-11-17')
    expect(loaded.data).toBeNull()
    expect(loaded.problem).toEqual({ backupKey: `${BACKUP_PREFIX}2026-11-17` })
    expect(storage.data.get(`${BACKUP_PREFIX}2026-11-17`)).toBe('{"schemaVersion":1,"cards":')
  })

  it('chạy các bước chuyển đổi tuần tự và bù nhánh còn thiếu', () => {
    const steps = {
      1: (s: Record<string, unknown>) => ({ ...s, step1: true }),
      2: (s: Record<string, unknown>) => ({ ...s, order: s.step1 ? 'đúng thứ tự' : 'sai' }),
    }
    const calls: number[] = []
    const traced = Object.fromEntries(
      Object.entries(steps).map(([v, fn]) => [v, (s: Record<string, unknown>) => (calls.push(Number(v)), fn(s))]),
    )
    const result = migrateState({ cards: { a: { wordId: 'a' } } }, 1, traced, 3)
    expect(calls).toEqual([1, 2])
    expect(result.cards).toEqual({ a: { wordId: 'a' } })
    expect(result.settings.dailyReviewCap).toBe(50)
    expect(result.goal.newWordsTarget).toBe(10)
  })
})

describe('script nội dung', () => {
  const word = (id: string, hanzi: string, pinyin: string, topic: string, meaning = 'nghĩa') =>
    ({ id, hanzi, pinyin, topic, hskLevel: 1, meaningVi: [meaning], examples: [] }) as unknown as Word

  it('search index: pinyin và nghĩa bỏ dấu', () => {
    expect(stripVietnamese('Xin chào')).toBe('xin chao')
    expect(stripVietnamese('Đường đi')).toBe('duong di')
    const [entry] = buildSearchIndex([word('hsk1-001', '你好', 'nǐ hǎo', 'chao-hoi', 'xin chào')])
    expect(entry.pinyinPlain).toBe('nihao')
    expect(entry.meaningPlain).toEqual(['xin chao'])
  })

  it('confusables: 妈妈 dễ nhầm với 吗 (cùng âm) và 马 (là thành phần)', () => {
    const words = [
      word('hsk1-001', '妈妈', 'māma', 'gia-dinh'),
      word('hsk1-002', '吗', 'ma', 'ngu-phap'),
      word('hsk1-003', '马', 'mǎ', 'con-vat'),
      word('hsk1-004', '书', 'shū', 'truong-hoc'),
    ]
    const map = buildConfusables(words, { 妈: { decomposition: '⿰女马', groups: [[0, 1, 2], [3, 4, 5]] } })
    expect(map['hsk1-001'].slice(0, 2).sort()).toEqual(['hsk1-002', 'hsk1-003'])
    expect(map['hsk1-001']).not.toContain('hsk1-001')
  })

  it('fetch-strokes: gom chữ, kiểm tra dữ liệu, chia nhóm nét', () => {
    expect(collectChars([{ hanzi: '你好', examples: [{ hanzi: '你好吗？' }] }])).toEqual(['你', '吗', '好'].sort())
    expect(isStrokeData({ strokes: ['M 1 2 L 3 4 Z'], medians: [[[1, 2]]] })).toBe(true)
    expect(isStrokeData({ strokes: ['<script>'], medians: [[]] })).toBe(false)
    expect(groupStrokes('⿰女马', [[0], [0], [0], [1], [1], [1]], 6)).toEqual({
      decomposition: '⿰女马',
      groups: [[0, 1, 2], [3, 4, 5]],
    })
    expect(groupStrokes('？', [null, null], 2)).toBeNull()
    expect(groupStrokes('⿰女马', [[0], [0]], 2)).toBeNull() // chỉ có một nhóm
  })
})
