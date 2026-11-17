import { ButtonLink } from '../components/ui/Button.tsx'

/** Trang không tìm thấy. */
export default function NotFoundPage() {
  return (
    <section className="mx-auto max-w-xl px-4 py-16 text-center">
      <p
        aria-hidden="true"
        lang="zh"
        className="text-7xl text-ink-wash"
        style={{ fontFamily: 'var(--font-display)', color: 'rgb(30 27 24 / 0.25)' }}
      >
        迷路
      </p>
      <h1 className="mt-4 text-2xl">Không tìm thấy trang này</h1>
      <p className="mt-3 text-ink-soft">
        Đường dẫn có thể đã gõ sai hoặc trang đã được chuyển đi. Bạn quay về trang chủ để học tiếp nhé.
      </p>
      <ButtonLink to="/" className="mt-6">
        Về trang chủ
      </ButtonLink>
    </section>
  )
}
