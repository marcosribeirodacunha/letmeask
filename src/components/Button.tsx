import { ButtonHTMLAttributes } from "react"

import '../styles/button.scss'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ className, type = 'button', children, ...rest }: ButtonProps) {
  return (
    <button type={type} className={`button ${className}`} {...rest}>
      {children}
    </button>
  )
}