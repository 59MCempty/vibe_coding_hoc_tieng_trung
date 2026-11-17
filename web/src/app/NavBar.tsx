import { BookOpen, Dumbbell, Library, RotateCcw, UserRound, type LucideIcon } from 'lucide-react'
import { Link, NavLink, useLocation } from 'react-router-dom'

interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  /** Các đường dẫn khác cũng thuộc mục này (để tô đậm đúng mục) */
  alsoActive?: string[]
}

/** Đúng 5 mục theo contracts/routes.md */
const ITEMS: NavItem[] = [
  { to: '/hoc', label: 'Học', icon: BookOpen, alsoActive: ['/lo-trinh', '/bai', '/pinyin'] },
  { to: '/on-tap', label: 'Ôn tập', icon: RotateCcw },
  { to: '/tu-vung', label: 'Từ vựng', icon: Library },
  { to: '/luyen-tap', label: 'Luyện tập', icon: Dumbbell },
  { to: '/toi', label: 'Tôi', icon: UserRound },
]

/**
 * Thanh điều hướng: nằm dưới đáy trên điện thoại, lên đầu trang từ 768px.
 * Trang chủ `/` không có thanh này.
 */
export function NavBar() {
  const { pathname } = useLocation()
  if (pathname === '/') return null

  return (
    <nav
      aria-label="Điều hướng chính"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm md:sticky md:top-0 md:bottom-auto md:border-t-0 md:border-b"
    >
      <div className="mx-auto flex max-w-5xl items-stretch md:items-center md:gap-6 md:px-6">
        <Link
          to="/"
          className="hidden items-center gap-2 py-2 font-heading text-lg font-bold text-ink md:flex"
        >
          <span
            aria-hidden="true"
            lang="zh"
            className="grid size-9 place-items-center rounded-control bg-cinnabar text-xl text-card"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            中
          </span>
          Học tiếng Trung
        </Link>
        <ul className="flex flex-1 items-stretch md:justify-end md:gap-1">
          {ITEMS.map(({ to, label, icon: Icon, alsoActive }) => {
            const inSection = alsoActive?.some((prefix) => pathname.startsWith(prefix)) ?? false
            return (
              <li key={to} className="flex-1 md:flex-none">
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    'flex min-h-14 flex-col items-center justify-center gap-0.5 px-1 text-xs font-medium ' +
                    'md:min-h-11 md:flex-row md:gap-2 md:rounded-control md:px-3 md:text-base ' +
                    (isActive || inSection
                      ? 'text-cinnabar'
                      : 'text-ink-soft hover:text-ink md:hover:bg-ink-wash')
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
                      <span className={isActive || inSection ? 'font-semibold' : ''}>{label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
