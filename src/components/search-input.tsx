import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
}

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="검색어 입력..."
        className="w-full pl-9 bg-background/50 border-input focus-visible:ring-primary backdrop-blur-sm transition-all duration-300 hover:bg-background/80 focus:bg-background"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
