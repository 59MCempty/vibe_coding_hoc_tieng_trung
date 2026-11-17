/**
 * Ngày theo giờ địa phương của thiết bị, dạng chuỗi `YYYY-MM-DD`.
 * Dùng chuỗi (không dùng Date) để lưu và so sánh, tránh lệch múi giờ khi học qua nửa đêm.
 */

export type DateString = string // 'YYYY-MM-DD'

const pad = (n: number) => String(n).padStart(2, '0')

/** Đổi Date → 'YYYY-MM-DD' theo giờ địa phương. */
export function toDateString(date: Date): DateString {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/** Đổi 'YYYY-MM-DD' → Date lúc 12 giờ trưa giờ địa phương (tránh lỗi đổi giờ mùa hè). */
export function parseDate(value: DateString): Date {
  const [y, m, d] = value.split('-').map(Number)
  return new Date(y, m - 1, d, 12, 0, 0, 0)
}

/** Hôm nay. Tham số `now` chỉ dùng cho kiểm thử. */
export function today(now: Date = new Date()): DateString {
  return toDateString(now)
}

/** Cộng (hoặc trừ, nếu âm) số ngày. */
export function addDays(value: DateString, days: number): DateString {
  const date = parseDate(value)
  date.setDate(date.getDate() + days)
  return toDateString(date)
}

/** Thứ Hai của tuần chứa ngày này. */
export function startOfWeek(value: DateString): DateString {
  const date = parseDate(value)
  const weekday = date.getDay() // 0 = Chủ nhật
  const sinceMonday = (weekday + 6) % 7
  return addDays(value, -sinceMonday)
}

/** So sánh: âm nếu a trước b, 0 nếu cùng ngày, dương nếu a sau b. */
export function compareDates(a: DateString, b: DateString): number {
  return a < b ? -1 : a > b ? 1 : 0
}

export function isBefore(a: DateString, b: DateString): boolean {
  return a < b
}

export function isSameDay(a: DateString, b: DateString): boolean {
  return a === b
}

/** Số ngày từ a đến b (b − a). */
export function diffDays(a: DateString, b: DateString): number {
  const ms = parseDate(b).getTime() - parseDate(a).getTime()
  return Math.round(ms / 86_400_000)
}

export function isValidDateString(value: unknown): value is DateString {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  return toDateString(parseDate(value)) === value
}
