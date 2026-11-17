import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'

/**
 * Nút bấm chung. Vùng bấm luôn ≥ 44×44px; focus có viền son 2px (đặt ở global.css).
 *  - primary: hành động chính của màn hình (đỏ son)
 *  - secondary: hành động phụ (viền mực)
 *  - ghost: hành động nhẹ (chỉ chữ)
 */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost'

const BASE =
  'inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-control px-4 py-2 ' +
  'text-base font-semibold leading-tight select-none transition-colors duration-150 ' +
  'disabled:cursor-not-allowed disabled:opacity-50'

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-cinnabar text-white hover:bg-cinnabar-deep active:bg-cinnabar-deep',
  secondary:
    'border border-ink/70 bg-card text-ink hover:bg-paper-deep active:bg-paper-deep',
  ghost: 'text-ink hover:bg-ink-wash active:bg-ink-wash',
}

function buttonClass(variant: ButtonVariant = 'primary', extra = ''): string {
  return `${BASE} ${VARIANTS[variant]} ${extra}`.trim()
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  children: ReactNode
}

export function Button({ variant = 'primary', className = '', type = 'button', ...rest }: ButtonProps) {
  return <button type={type} className={buttonClass(variant, className)} {...rest} />
}

interface ButtonLinkProps extends LinkProps {
  variant?: ButtonVariant
  children: ReactNode
}

/** Đường dẫn có hình dạng nút. */
export function ButtonLink({ variant = 'primary', className = '', ...rest }: ButtonLinkProps) {
  return <Link className={buttonClass(variant, className)} {...rest} />
}
