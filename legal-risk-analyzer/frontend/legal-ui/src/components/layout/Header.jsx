import { Shield, FlaskConical, MessageSquare, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Header({ demoMode, onDemoModeChange, activeView, onViewChange }) {
  return (
    <header className="h-16 border-b border-legal-slate/60 flex items-center justify-between px-6 bg-legal-charcoal/80 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-legal-steel/10 border border-legal-steel/20">
          <Shield className="w-5 h-5 text-legal-steel" />
        </div>
        <h2 className="text-lg font-serif text-legal-off-white tracking-tight">
          Legal Document Analysis
        </h2>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 p-1 rounded-xl border border-legal-slate/50 bg-legal-slate/20">
          <button
            onClick={() => onViewChange?.('chat')}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              activeView === 'chat'
                ? "bg-legal-steel/20 border border-legal-steel/40 text-legal-steel"
                : "text-legal-gray hover:text-legal-off-white"
            )}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Chat
          </button>
          <button
            onClick={() => onViewChange?.('performance')}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              activeView === 'performance'
                ? "bg-legal-gold/15 border border-legal-gold/35 text-legal-gold"
                : "text-legal-gray hover:text-legal-off-white"
            )}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Performance
          </button>
        </div>
        <button
          onClick={() => onDemoModeChange?.(!demoMode)}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-sm font-medium",
            demoMode
              ? "bg-legal-gold/15 border-legal-gold/40 text-legal-gold"
              : "bg-legal-slate/30 border-legal-slate/50 text-legal-gray hover:text-legal-off-white"
          )}
          title={demoMode ? "Demo mode: using sample responses" : "Switch to demo mode (no backend)"}
        >
          <FlaskConical className="w-4 h-4" />
          <span>{demoMode ? 'Demo mode' : 'Live'}</span>
        </button>
        <div className={cn(
          "flex items-center gap-2.5 px-3 py-1.5 rounded-full border",
          demoMode ? "bg-legal-gold/10 border-legal-gold/30" : "bg-legal-mint/10 border-legal-mint/30"
        )}>
          <div className={cn(
            "h-2 w-2 rounded-full",
            demoMode ? "bg-legal-gold shadow-[0_0_8px_rgba(212,168,83,0.6)]" : "bg-legal-mint shadow-[0_0_8px_rgba(52,211,153,0.6)]"
          )} />
          <span className={cn(
            "text-sm font-medium",
            demoMode ? "text-legal-gold" : "text-legal-mint"
          )}>
            {demoMode ? 'Demo' : 'System Active'}
          </span>
        </div>
      </div>
    </header>
  )
}

