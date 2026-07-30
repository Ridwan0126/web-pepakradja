export default function Badge({ children, variant = "primary", className = "", ...props }) {
  const variants = {
    primary: "bg-gradient-to-r from-blue-500 to-cyan-600 text-white",
    secondary: "bg-white/90 backdrop-blur-sm text-gray-700",
    success: "bg-green-100 text-green-800",
  }

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  )
}
