import { Hammer } from 'lucide-react'
import { ButtonLink } from '../components/ui/Button.tsx'

interface PlaceholderPageProps {
  title: string
  /** Trang này sẽ có gì khi làm xong */
  description: string
}

/** Trang tạm cho các đường dẫn chưa làm tới. */
export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <section className="mx-auto max-w-xl px-4 py-12 text-center">
      <Hammer size={32} strokeWidth={1.75} className="mx-auto text-ink-soft" aria-hidden="true" />
      <h1 className="mt-4 text-2xl">{title}</h1>
      <p className="mt-2 font-semibold text-gold-text">Đang xây dựng</p>
      <p className="mt-3 text-ink-soft">{description}</p>
      <p className="mt-6 text-ink-soft">Trong lúc chờ, bạn học từ mới HSK 1 được rồi.</p>
      <ButtonLink to="/lo-trinh/hsk1" className="mt-4">
        Vào học HSK 1
      </ButtonLink>
    </section>
  )
}
