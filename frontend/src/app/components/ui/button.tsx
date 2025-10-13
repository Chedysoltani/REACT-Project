import React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline"
}

export const Button: React.FC<ButtonProps> = ({
  variant = "default",
  children,
  className,
  ...props
}) => {
  const baseStyle =
    "px-4 py-2 rounded-lg font-medium transition focus:outline-none focus:ring-2"
  const variantStyle =
    variant === "outline"
      ? "border border-gray-400 text-gray-700 hover:bg-gray-100 focus:ring-gray-300"
      : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300"

  return (
    <button className={`${baseStyle} ${variantStyle} ${className || ""}`} {...props}>
      {children}
    </button>
  )
}
