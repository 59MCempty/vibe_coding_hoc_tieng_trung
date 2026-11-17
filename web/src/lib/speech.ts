/**
 * Phát âm tiếng Trung.
 *  - Có file mp3 (`audioSrc`) thì phát file.
 *  - Không có thì dùng giọng đọc có sẵn của máy (Web Speech API, giọng zh-CN).
 * Không bao giờ ném lỗi: trả về kết quả để giao diện hiện hướng dẫn, việc học không bị chặn.
 */

export type SpeakFailure = 'unsupported' | 'no-voice' | 'error'

export type SpeakResult = { ok: true } | { ok: false, reason: SpeakFailure }

/** Lời nhắn tiếng Việt cho từng loại lỗi. */
export const SPEAK_ERROR_MESSAGE: Record<SpeakFailure, string> = {
  unsupported:
    'Trình duyệt này không hỗ trợ đọc thành tiếng. Bạn thử mở bằng Chrome, Edge hoặc Safari nhé.',
  'no-voice':
    'Máy của bạn chưa có giọng đọc tiếng Trung. Vào Cài đặt của máy → Ngôn ngữ / Chuyển văn bản thành giọng nói → thêm "Tiếng Trung (Giản thể)". Bạn vẫn học tiếp được bình thường.',
  error: 'Chưa phát được âm thanh. Bạn bấm lại lần nữa nhé.',
}

export interface SpeakOptions {
  /** Đường dẫn file mp3, nếu có */
  audioSrc?: string
  /** Tốc độ đọc, 1 = bình thường. Mặc định 0.85 cho người mới. */
  rate?: number
}

function synth(): SpeechSynthesis | null {
  return typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null
}

/** Chọn giọng tiếng Trung phổ thông tốt nhất trong danh sách. */
export function pickChineseVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const norm = (voice: SpeechSynthesisVoice) => voice.lang.replace('_', '-').toLowerCase()
  return (
    voices.find((v) => norm(v) === 'zh-cn') ??
    voices.find((v) => norm(v).startsWith('zh-cn')) ??
    voices.find((v) => norm(v).startsWith('zh') && !/hk|tw|yue/.test(norm(v))) ??
    null
  )
}

let voicesReady: Promise<SpeechSynthesisVoice[]> | null = null

/** Danh sách giọng của máy. Một số trình duyệt nạp chậm nên chờ tối đa 700ms. */
function loadVoices(engine: SpeechSynthesis): Promise<SpeechSynthesisVoice[]> {
  const now = engine.getVoices()
  if (now.length > 0) return Promise.resolve(now)
  if (!voicesReady) {
    voicesReady = new Promise((resolve) => {
      const done = () => resolve(engine.getVoices())
      engine.addEventListener?.('voiceschanged', done, { once: true })
      setTimeout(done, 700)
    })
    void voicesReady.then((voices) => {
      if (voices.length === 0) voicesReady = null
    })
  }
  return voicesReady
}

/** Gọi sớm (khi mở trang học) để lần bấm loa đầu tiên phát ngay. */
export function warmUpSpeech(): void {
  const engine = synth()
  if (engine) void loadVoices(engine)
}

function playFile(src: string): Promise<SpeakResult> {
  return new Promise((resolve) => {
    const audio = new Audio(src)
    audio.addEventListener('playing', () => resolve({ ok: true }), { once: true })
    audio.addEventListener('error', () => resolve({ ok: false, reason: 'error' }), { once: true })
    audio.play().catch(() => resolve({ ok: false, reason: 'error' }))
  })
}

/**
 * Đọc một từ hoặc một câu tiếng Trung. Promise xong ngay khi BẮT ĐẦU phát (để nút loa phản hồi nhanh).
 */
export async function speak(text: string, options: SpeakOptions = {}): Promise<SpeakResult> {
  if (options.audioSrc) {
    const played = await playFile(options.audioSrc)
    if (played.ok) return played
    // file lỗi → thử giọng đọc của máy
  }

  const engine = synth()
  if (!engine || typeof SpeechSynthesisUtterance === 'undefined') {
    return { ok: false, reason: 'unsupported' }
  }

  const voices = await loadVoices(engine)
  const voice = pickChineseVoice(voices)
  // Máy có danh sách giọng nhưng không có tiếng Trung → báo để hướng dẫn cài.
  // Danh sách rỗng (một số máy Android) thì vẫn thử đọc với lang zh-CN.
  if (voices.length > 0 && !voice) return { ok: false, reason: 'no-voice' }

  return new Promise<SpeakResult>((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-CN'
    if (voice) utterance.voice = voice
    utterance.rate = options.rate ?? 0.85
    let settled = false
    const finish = (result: SpeakResult) => {
      if (settled) return
      settled = true
      resolve(result)
    }
    utterance.onstart = () => finish({ ok: true })
    utterance.onend = () => finish({ ok: true })
    utterance.onerror = (event) => {
      // 'interrupted' / 'canceled' là do người dùng bấm từ khác, không phải lỗi
      if (event.error === 'interrupted' || event.error === 'canceled') finish({ ok: true })
      else finish({ ok: false, reason: voices.length === 0 ? 'no-voice' : 'error' })
    }
    engine.cancel() // dừng câu đang đọc dở để phát ngay câu mới
    engine.speak(utterance)
    setTimeout(() => finish({ ok: false, reason: 'error' }), 4000)
  })
}
