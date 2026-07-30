"use client"

import { X } from "lucide-react"

export default function Input({
  type = "text",
  placeholder,
  value,
  onChange,
  onClear,
  icon,
  className = "",
  showClearButton = false,
  ...props
}) {
  const handleClear = () => {
    if (onClear) {
      onClear()
    } else if (onChange) {
      onChange({ target: { value: "" } })
    }
  }

  return (
    <div className="relative">
      {icon && <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">{icon}</div>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full ${icon ? "pl-10" : "pl-4"} ${
          showClearButton && value ? "pr-10" : "pr-4"
        } py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
        {...props}
      />
      {showClearButton && value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
          aria-label="Clear input"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}
