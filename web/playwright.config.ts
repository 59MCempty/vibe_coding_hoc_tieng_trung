import { defineConfig, devices } from '@playwright/test'

// Constitution: mỗi tính năng phải dùng được ở 360 / 768 / 1280px, có một lượt
// với prefers-reduced-motion, và chạy trên Chrome, Safari, Edge, Firefox.
export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4173',
    locale: 'vi-VN',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: true,
    timeout: 180_000,
  },
  projects: [
    { name: 'mobile-360', use: { ...devices['Desktop Chrome'], viewport: { width: 360, height: 800 } } },
    { name: 'tablet-768', use: { ...devices['Desktop Chrome'], viewport: { width: 768, height: 1024 } } },
    { name: 'desktop-1280', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } } },
    {
      name: 'reduced-motion',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 360, height: 800 },
        contextOptions: { reducedMotion: 'reduce' },
      },
    },
    { name: 'webkit-360', use: { ...devices['Desktop Safari'], viewport: { width: 360, height: 800 } } },
    { name: 'firefox-1280', use: { ...devices['Desktop Firefox'], viewport: { width: 1280, height: 800 } } },
  ],
})
