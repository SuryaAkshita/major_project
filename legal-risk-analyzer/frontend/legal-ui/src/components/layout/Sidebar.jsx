import { Scale, FileText, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Sidebar({ onNewAnalysis, analyses, onSelectAnalysis, currentAnalysis }) {
  return (
    <aside className="w-64 flex flex-col h-full bg-legal-charcoal/90 border-r border-legal-slate/60 backdrop-blur-sm">
      {/* Logo and Branding */}
      <div className="p-6 border-b border-legal-slate/50">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-legal-gold/15 border border-legal-gold/30 shadow-glow-gold">
            <Scale className="w-6 h-6 text-legal-gold" />
          </div>
          <div>
            <h1 className="text-xl font-serif text-legal-off-white tracking-tight">Legal Risk</h1>
            <p className="text-xs text-legal-gray font-sans font-medium">Analyzer</p>
          </div>
        </div>
      </div>

      {/* New Analysis Button */}
      <div className="p-4 border-b border-legal-slate/50">
        <button
          onClick={onNewAnalysis}
          className="w-full px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 bg-legal-steel hover:bg-legal-steel-light text-white shadow-lg hover:shadow-glow active:scale-[0.98]"
        >
          <FileText className="w-4 h-4" />
          New Analysis
        </button>
      </div>

      {/* Analysis History */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="p-4">
          <h2 className="text-xs font-semibold text-legal-gray uppercase tracking-wider mb-3">
            Recent Analyses
          </h2>
          {analyses.length === 0 ? (
            <div className="text-center py-10 text-legal-gray text-sm rounded-xl bg-legal-slate/20 border border-legal-slate/30">
              <Clock className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p>No analyses yet</p>
              <p className="text-xs mt-1 opacity-80">Start a new analysis above</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {analyses.map((analysis, index) => (
                <button
                  key={analysis.id || index}
                  onClick={() => onSelectAnalysis(analysis)}
                  className={cn(
                    "w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200",
                    "hover:bg-legal-slate/40 hover:border-legal-slate-light/50 border border-transparent",
                    currentAnalysis?.id === analysis.id && "bg-legal-steel/15 border-legal-steel/40 shadow-card"
                  )}
                >
                  <div className="flex items-start gap-2">
                    <FileText className={cn("w-4 h-4 mt-0.5 flex-shrink-0", currentAnalysis?.id === analysis.id ? "text-legal-steel" : "text-legal-gray")} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-legal-off-white truncate font-medium">
                        {analysis.title || `Analysis ${index + 1}`}
                      </p>
                      <p className="text-xs text-legal-gray mt-0.5">
                        {analysis.timestamp || 'Just now'}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-legal-slate/50">
        <p className="text-xs text-legal-gray/80 text-center">
          Version 1.0.0
        </p>
      </div>
    </aside>
  )
}

