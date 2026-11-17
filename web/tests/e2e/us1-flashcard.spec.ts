/**
 * Kịch bản 1 trong quickstart.md (US1 — học từ mới bằng flashcard).
 * Chạy ở mọi project trong playwright.config.ts (360 / 768 / 1280, giảm chuyển động, Safari, Firefox).
 */
import { expect, test, type Page } from '@playwright/test'

const STORAGE_KEY = 'hoc-tieng-trung:v1'
/** Không chờ font Google tải xong (mạng chậm làm test chờ quá lâu); chỉ chờ HTML sẵn sàng. */
const OPEN = { waitUntil: 'domcontentloaded' } as const

async function flipAndRate(page: Page, label: RegExp) {
  await page.getByRole('button', { name: 'Lật thẻ' }).click()
  await page.getByRole('button', { name: label }).click()
}

test.beforeEach(async ({ page }) => {
  await page.goto('/', OPEN)
  await page.evaluate(() => localStorage.clear())
})

test('mở / được đưa tới HSK 1, vào thẻ đầu tiên trong ≤ 2 lần bấm', async ({ page }) => {
  await page.goto('/', OPEN)
  await expect(page).toHaveURL(/\/lo-trinh\/hsk1$/)
  await expect(page.getByRole('heading', { name: 'HSK 1' })).toBeVisible()

  let clicks = 0
  await page.getByRole('link', { name: /Chào hỏi/ }).click()
  clicks++
  await expect(page.getByTestId('flashcard')).toBeVisible()
  expect(clicks).toBeLessThanOrEqual(2)
})

test('học hết bài: lật thẻ, thấy pinyin, nghĩa, mẹo nhớ, câu ví dụ, chấm 3 mức, thấy tổng kết có con dấu', async ({
  page,
}) => {
  await page.goto('/bai/hsk1-l01', OPEN)
  const card = page.getByTestId('flashcard')

  // Mặt trước: chữ Hán đủ lớn (≥ 72px)
  const front = page.getByTestId('card-front-hanzi')
  await expect(front).toHaveText('你')
  const size = await front.evaluate((el) => parseFloat(getComputedStyle(el).fontSize))
  expect(size).toBeGreaterThanOrEqual(72)

  // Lật bằng phím cách
  await page.keyboard.press('Space')
  await expect(card).toHaveAttribute('data-flipped', 'true')
  await expect(card.getByText('nǐ', { exact: true })).toBeVisible()
  await expect(card.getByText('bạn, anh, chị')).toBeVisible()
  await expect(card.getByRole('region', { name: 'Mẹo nhớ' })).toBeVisible()
  await expect(card.getByRole('region', { name: 'Câu ví dụ' })).toContainText('你好！')
  await expect(page.getByRole('button', { name: 'Nghe phát âm từ 你' })).toBeVisible()

  // Bấm loa không làm lật thẻ, không làm hỏng trang
  await page.getByRole('button', { name: 'Nghe phát âm từ 你' }).click()
  await expect(card).toHaveAttribute('data-flipped', 'true')

  // Chấm đủ 3 mức
  await page.getByRole('button', { name: /Chưa nhớ/ }).click()
  await flipAndRate(page, /Hơi nhớ/)
  for (let i = 0; i < 8; i++) await flipAndRate(page, /Đã nhớ/)

  // Thẻ "Chưa nhớ" quay lại cuối buổi
  await expect(page.getByTestId('lesson-progress')).toContainText('Xem lại từ chưa nhớ')
  await expect(page.getByTestId('card-front-hanzi')).toHaveText('你')
  await flipAndRate(page, /Đã nhớ/)

  // Tổng kết
  await expect(page.getByRole('heading', { name: /Xong bài/ })).toBeVisible()
  await expect(page.getByRole('img', { name: /Con dấu đỏ/ })).toBeVisible()
  await expect(page.getByTestId('summary-remembered')).toHaveText('10')
  await expect(page.getByTestId('summary-not-remembered')).toHaveText('0')
  await expect(page.getByRole('link', { name: /Học bài tiếp theo/ })).toBeVisible()
})

test('đóng tab giữa bài, mở lại thì được hỏi học tiếp', async ({ page, context }) => {
  await page.goto('/bai/hsk1-l01', OPEN)
  await flipAndRate(page, /Đã nhớ/)
  await flipAndRate(page, /Chưa nhớ/)
  await flipAndRate(page, /Hơi nhớ/)
  await expect(page.getByTestId('lesson-progress')).toHaveText('Thẻ 4/10')

  const saved = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? '{}'), STORAGE_KEY)
  expect(saved.schemaVersion).toBe(1)
  expect(saved.settings.lastLessonPosition).toEqual({ lessonId: 'hsk1-l01', cardIndex: 3 })
  await page.close()

  const again = await context.newPage()
  await again.goto('/bai/hsk1-l01', OPEN)
  const dialog = again.getByRole('dialog', { name: 'Học tiếp từ thẻ đang dở?' })
  await expect(dialog).toContainText('thẻ 4/10')
  await dialog.getByRole('button', { name: 'Học tiếp' }).click()
  await expect(dialog).toBeHidden()
  await expect(again.getByTestId('lesson-progress')).toHaveText('Thẻ 4/10')
})

test('đổi hướng học: nhìn nghĩa đoán chữ', async ({ page }) => {
  await page.goto('/bai/hsk1-l01', OPEN)
  await page.getByRole('button', { name: /Đổi hướng học/ }).click()
  await expect(page.getByTestId('flashcard')).toContainText('bạn, anh, chị')
  await expect(page.getByTestId('card-front-hanzi')).toHaveCount(0)
})

test('không cuộn ngang và nút đủ lớn', async ({ page }) => {
  for (const path of ['/lo-trinh/hsk1', '/bai/hsk1-l01']) {
    await page.goto(path, OPEN)
    await expect(page.locator('main')).toBeVisible()
    const width = await page.evaluate(() => window.innerWidth)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
  }
  await page.getByRole('button', { name: 'Lật thẻ' }).click()
  for (const name of [/Chưa nhớ/, /Hơi nhớ/, /Đã nhớ/]) {
    const box = await page.getByRole('button', { name }).boundingBox()
    expect(box?.height).toBeGreaterThanOrEqual(44)
    expect(box?.width).toBeGreaterThanOrEqual(44)
  }
})
