"use client"

import { Search } from "lucide-react"
import Input from "../atoms/Input"

export default function SearchBar({ value, onChange, placeholder = "Search...", className = "", ...props }) {
  return (
    <div className={`${className}`} {...props}>
      <Input type="text" placeholder={placeholder} value={value} onChange={onChange} icon={<Search size={20} />} />
    </div>
  )
}
