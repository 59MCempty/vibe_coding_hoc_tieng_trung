import { Download, TriangleAlert, X } from 'lucide-react'
import { Suspense, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Button } from '../components/ui/Button.tsx'
import { getLoadProblem } from '../store/index.ts'
import { NavBar } from './NavBar.tsx'

/** Tải bản sao dữ liệu hỏng về máy dưới dạng file. */
function downloadBackup(backupKey: string) {
  const raw = localStorage.getItem(backupKey)
  if (raw === null) return
  const link = document.createElement('a')
  link.href = URL.createObjectURL(new Blob([raw], { type: 'application/json' }))
  link.download = `${backupKey.replace(/:/g, '-')}.json`
  link.click()
  URL.revokeObjectURL(link.href)
}

/** Báo khi dữ liệu tiến độ bị hỏng (contracts/storage-schema.md). */
function LoadProblemBanner() {
  const [problem, setProblem] = useState(getLoadProblem)
  if (!problem) return null
  return (
    <div role="alert" className="border-b border-line bg-paper-deep px-4 py-3 text-sm text-ink">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-3">
        <TriangleAlert size={20} strokeWidth={1.75} className="shrink-0 text-cinnabar" aria-hidden="true" />
        <p className="min-w-0 flex-1 basis-60">
          Dữ liệu tiến độ cũ bị lỗi nên không đọc được. Website đã cất một bản sao và bắt đầu lại từ đầu. Bạn
          có thể tải bản sao về để giữ.
        </p>
        <Button variant="secondary" onClick={() => downloadBackup(problem.backupKey)}>
          <Download size={18} strokeWidth={1.75} aria-hidden="true" />
          Tải bản sao
        </Button>
        <Button variant="ghost" aria-label="Đóng thông báo" onClick={() => setProblem(null)}>
          <X size={18} strokeWidth={1.75} aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}

export function PageLoading() {
  return (
    <p role="status" className="px-4 py-16 text-center text-ink-soft">
      Đang tải…
    </p>
  )
}

/** Khung chung của mọi trang: thanh điều hướng + nội dung trang. */
export function Layout() {
  const { pathname } = useLocation()
  const hasNav = pathname !== '/'
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#noi-dung"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-control focus:bg-card focus:px-4 focus:py-2"
      >
        Bỏ qua điều hướng
      </a>
      <NavBar />
      <LoadProblemBanner />
      {/* pb-24: chừa chỗ cho thanh điều hướng dưới đáy trên điện thoại */}
      <main id="noi-dung" className={`flex-1 ${hasNav ? 'pb-24 md:pb-10' : ''}`}>
        <Suspense fallback={<PageLoading />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  )
}
