import { Scale, FileText, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Sidebar({ onNewAnalysis, analyses, onSelectAnalysis, currentAnalysis }) {
  return (
    <aside className="w-64 bg-legal-charcoal border-r border-legal-slate flex flex-col h-full">
      {/* Logo and Branding */}
      <div className="p-6 border-b border-legal-slate">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-legal-gold/10 rounded-lg">
            <Scale className="w-6 h-6 text-legal-gold" />
          </div>
          <div>
            <h1 className="text-xl font-serif text-legal-off-white">Legal Risk</h1>
            <p className="text-xs text-legal-gray font-sans">Analyzer</p>
          </div>
        </div>
      </div>

      {/* New Analysis Button */}
      <div className="p-4 border-b border-legal-slate">
        <button
          onClick={onNewAnalysis}
          className="w-full px-4 py-3 bg-legal-steel hover:bg-legal-steel/90 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
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
            <div className="text-center py-8 text-legal-gray text-sm">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No analyses yet</p>
            </div>
          ) : (
            <div className="space-y-1">
              {analyses.map((analysis, index) => (
                <button
                  key={analysis.id || index}
                  onClick={() => onSelectAnalysis(analysis)}
                  className={cn(
                    "w-full text-left px-3 py-2.5 rounded-lg transition-colors duration-150",
                    "hover:bg-legal-slate/50",
                    currentAnalysis?.id === analysis.id && "bg-legal-slate/70 border border-legal-steel/30"
                  )}
                >
                  <div className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-legal-gray mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-legal-off-white truncate">
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
      <div className="p-4 border-t border-legal-slate">
        <p className="text-xs text-legal-gray text-center">
          Version 1.0.0
        </p>
      </div>
    </aside>
  )
}

