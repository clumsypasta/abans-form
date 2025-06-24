typescript jsx
"use client"

import { forwardRef } from "react"
import { cn } from "@/lib/utils"

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ className, label, error, type = "text", ...props }, ref) => {
    return (
      <div className="relative">
        <input
          type={type}
          ref={ref}
          placeholder=" "
          className={cn(
            "block w-full px-4 pt-6 pb-2 text-sm text-gray-900 dark:text-white bg-transparent border border-gray-300 dark:border-gray-600 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer h-12",
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          {...props}
        />
        <label
          className={cn(
            "absolute text-sm text-blue-500 dark:text-blue-400 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:top-4 peer-focus:text-blue-500 peer-focus:dark:text-blue-400",
            error && "text-red-500 peer-focus:text-red-500"
          )}
        >
          {label}
        </label>
        {error && (
          <p className="mt-1 text-xs text-red-500">{error}</p>
        )}
      </div>
    )
  }
)

FloatingInput.displayName = "FloatingInput"