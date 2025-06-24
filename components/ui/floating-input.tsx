
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ className, label, error, type, placeholder, ...props }, ref) => {
    const [focused, setFocused] = React.useState(false)
    const [hasValue, setHasValue] = React.useState(false)

    // Check for value on mount and when props.value changes
    React.useEffect(() => {
      setHasValue(Boolean(props.value))
    }, [props.value])

    const handleFocus = () => setFocused(true)

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false)
      setHasValue(Boolean(e.target.value))
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(Boolean(e.target.value))
      if (props.onChange) {
        props.onChange(e)
      }
    }

    // Always float label for date inputs, inputs with placeholders, or when there's content
    const shouldLabelFloat =
      focused ||
      hasValue ||
      Boolean(props.value) ||
      Boolean(props.defaultValue) ||
      type === "date" ||
      type === "time" ||
      type === "datetime-local" ||
      Boolean(placeholder)

    return (
      <div className="relative">
        <input
          type={type}
          className={cn(
            "peer w-full h-12 px-4 text-base bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100",
            shouldLabelFloat ? "pt-6 pb-2" : "py-3",
            error && "border-red-500 focus:ring-red-500",
            className,
          )}
          placeholder={shouldLabelFloat && focused ? placeholder : ""}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          ref={ref}
          {...props}
        />
        <label
          className={cn(
            "absolute left-4 transition-all duration-200 pointer-events-none select-none bg-white dark:bg-gray-800 px-1 rounded",
            shouldLabelFloat
              ? "top-0 -translate-y-1/2 text-xs font-medium text-blue-600 dark:text-blue-400 z-10"
              : "top-1/2 -translate-y-1/2 text-base text-gray-500 dark:text-gray-400",
          )}
        >
          {label}
        </label>
        {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
      </div>
    )
  },
)
FloatingInput.displayName = "FloatingInput"

export { FloatingInput }
