import { Shield } from 'lucide-react'

export default function Header() {
  return (
    <header className="h-16 bg-legal-charcoal border-b border-legal-slate flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <Shield className="w-5 h-5 text-legal-steel" />
        <h2 className="text-lg font-serif text-legal-off-white">
          Legal Document Analysis
        </h2>
      </div>
      <div className="flex items-center gap-4">
        <div className="h-2 w-2 rounded-full bg-green-500"></div>
        <span className="text-sm text-legal-gray">System Active</span>
      </div>
    </header>
  )
}

