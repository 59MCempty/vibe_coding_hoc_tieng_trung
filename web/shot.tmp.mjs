import { chromium } from '@playwright/test'
const [,, url, out, w = '360', h = '800'] = process.argv
const browser = await chromium.launch({ channel: 'msedge' })
const page = await browser.newPage({ viewport: { width: +w, height: +h } })
const errors = []
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
page.on('pageerror', (e) => errors.push(String(e)))
await page.goto(url, { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)
await page.screenshot({ path: out })
console.log(out, 'scrollW', await page.evaluate(() => document.documentElement.scrollWidth), errors.join(' | '))
await browser.close()
