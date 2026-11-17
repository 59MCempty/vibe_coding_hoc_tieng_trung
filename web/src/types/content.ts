/**
 * Kiểu dữ liệu NỘI DUNG (chỉ đọc, nằm trong public/data/*.json).
 * Nguồn: specs/001-hoc-tieng-trung-hsk/data-model.md và contracts/content-schema.md
 */

/** Thanh điệu: 1–4, 0 = thanh nhẹ. */
export type ToneNumber = 0 | 1 | 2 | 3 | 4

export const PARTS_OF_SPEECH = [
  'danh', // danh từ
  'động', // động từ
  'tính', // tính từ
  'phó', // phó từ
  'lượng', // lượng từ
  'đại', // đại từ
  'giới', // giới từ
  'liên', // liên từ
  'trợ', // trợ từ
  'thán', // thán từ
  'số', // số từ
] as const
export type PartOfSpeech = (typeof PARTS_OF_SPEECH)[number]

export const PART_OF_SPEECH_LABEL: Record<PartOfSpeech, string> = {
  danh: 'danh từ',
  động: 'động từ',
  tính: 'tính từ',
  phó: 'phó từ',
  lượng: 'lượng từ',
  đại: 'đại từ',
  giới: 'giới từ',
  liên: 'liên từ',
  trợ: 'trợ từ',
  thán: 'thán từ',
  số: 'số từ',
}

export type HskLevel = 1 | 2 | 3 | 4 | 5 | 6

/** Câu ví dụ. `tokens` ghép lại phải đúng bằng `hanzi` (dùng cho trò Sắp xếp câu). */
export interface ExampleSentence {
  hanzi: string
  pinyin: string
  meaningVi: string
  tokens: string[]
}

/** Mẹo nhớ: tách chữ thành các thành phần + câu chuyện liên tưởng (≤ 200 ký tự). */
export interface MnemonicComponent {
  part: string
  meaningVi: string
}
export interface Mnemonic {
  components: MnemonicComponent[] // không rỗng
  story: string
}

interface WordBase {
  /** Dạng `hsk1-001` */
  id: string
  /** Chữ giản thể, 1–4 chữ */
  hanzi: string
  /** Có dấu thanh, ví dụ `nǐ hǎo` */
  pinyin: string
  /** Một số cho mỗi chữ */
  tones: ToneNumber[]
  /** Ít nhất 1 nghĩa */
  meaningVi: string[]
  partOfSpeech: PartOfSpeech
  hskLevel: HskLevel
  topic: string
  /** Ít nhất 2 câu */
  examples: ExampleSentence[]
  mnemonic: Mnemonic
  /** File mp3 nếu có; không có thì dùng giọng đọc của máy */
  audioSrc?: string
}

/** Từ cụ thể: BẮT BUỘC có ảnh minh hoạ. */
export interface ConcreteWord extends WordBase {
  kind: 'concrete'
  image: string
}
/** Từ trừu tượng: dùng hình tách bộ thủ vẽ từ dữ liệu nét. */
export interface AbstractWord extends WordBase {
  kind: 'abstract'
  image?: undefined
}
export type Word = ConcreteWord | AbstractWord

/** Bài học: 8–12 từ. */
export interface Lesson {
  /** Dạng `hsk1-l01` */
  id: string
  stageId: StageId
  order: number
  titleVi: string
  topic: string
  wordIds: string[]
}

export type StageId = 'pinyin' | 'hsk1' | 'hsk2' | 'hsk3' | 'hsk4' | 'hsk5' | 'hsk6'

export interface RoadmapStage {
  id: StageId
  order: number
  titleVi: string
  /** Mô tả "bạn đã biết gì", dùng ở phần chọn level */
  descriptionVi: string
  status: 'available' | 'coming_soon'
  lessonIds: string[]
}

export type BadgeRule =
  | { type: 'words_learned'; value: number }
  | { type: 'streak'; value: number }
  | { type: 'stage_complete'; stageId: StageId }
  | { type: 'weekly_challenge' }

export interface BadgeDefinition {
  id: string
  titleVi: string
  descriptionVi: string
  rule: BadgeRule
}

/* ---------- File sinh tự động trong public/data/generated/ ---------- */

/** confusables.json: id các từ dễ nhầm với mỗi từ. */
export type ConfusablesMap = Record<string, string[]>

/** components.json: cách tách một chữ và nét nào thuộc thành phần nào. */
export interface CharComponents {
  /** Chuỗi mô tả của Make Me a Hanzi, ví dụ "⿰女马" */
  decomposition: string
  /** Mỗi nhóm là chỉ số các nét thuộc một thành phần */
  groups: number[][]
}
export type ComponentsMap = Record<string, CharComponents>

/** search-index.json */
export interface SearchIndexEntry {
  id: string
  hanzi: string
  pinyin: string
  /** `nǐ hǎo` → `nihao` */
  pinyinPlain: string
  /** nghĩa tiếng Việt bỏ dấu: `xin chào` → `xin chao` */
  meaningPlain: string[]
  hskLevel: HskLevel
}

/** Dữ liệu nét của Hanzi Writer cho một chữ (public/strokes/<chữ>.json). */
export interface StrokeData {
  strokes: string[]
  medians: number[][][]
  radStrokes?: number[]
}
