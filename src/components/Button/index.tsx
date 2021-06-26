import { ButtonHTMLAttributes } from "react"

import './styles.scss'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline-small' | 'danger' | 'neutral'
}

export function Button({
  className,
  type = 'button',
  children,
  variant = 'default',
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={`button ${variant} ${className}`} {...rest}>
      {children}
    </button>
  )
}