import { User, Scale, Volume2, Square, Copy, Check, Download } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import AnalysisSummaryCard from './AnalysisSummaryCard'

/** Renders text with **bold** as <strong> (no raw HTML from content) */
function renderContent(text) {
  if (!text || typeof text !== 'string') return null
  const parts = text.split(/\*\*(.*?)\*\*/g)
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  )
}

export default function MessageCard({ message }) {
  const isUser = message.role === 'user'
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!message.content) return
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    if (!message.content) return
    const blob = new Blob([message.content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `legal-analysis-${new Date().toISOString().slice(0, 10)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Stop speaking when component unmounts
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel()
    }
  }, [])

  const speak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    const utterance = new SpeechSynthesisUtterance(message.content)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    setIsSpeaking(true)
    window.speechSynthesis.speak(utterance)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex gap-3",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-legal-steel/15 border border-legal-steel/30 flex items-center justify-center shadow-card">
          <Scale className="w-4 h-4 text-legal-steel" />
        </div>
      )}

      <div className={cn(
        "flex flex-col max-w-[75%]",
        isUser && "items-end"
      )}>
        <div className={cn(
          "px-5 py-4 rounded-xl relative group shadow-card",
          isUser
            ? "bg-legal-steel/20 text-legal-off-white border border-legal-steel/30"
            : message.isError
              ? "bg-red-950/40 text-red-200 border border-red-800/50"
              : "bg-legal-slate/50 text-legal-off-white border border-legal-slate/50"
        )}>
          {!isUser && message.analysis && <AnalysisSummaryCard analysis={message.analysis} />}
          <div className="message-content text-sm leading-relaxed whitespace-pre-wrap">
            {renderContent(message.content)}
          </div>

          {!isUser && !message.isError && (
            <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleCopy}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  copied ? "bg-legal-mint/20 text-legal-mint" : "bg-legal-charcoal/60 text-legal-gray hover:text-legal-off-white hover:bg-legal-slate/80"
                )}
                title={copied ? "Copied!" : "Copy"}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={handleDownload}
                className="p-2 rounded-lg bg-legal-charcoal/60 text-legal-gray hover:text-legal-off-white hover:bg-legal-slate/80 transition-all"
                title="Download as .txt"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={speak}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  isSpeaking ? "bg-legal-steel text-white" : "bg-legal-charcoal/60 text-legal-gray hover:text-legal-off-white hover:bg-legal-slate/80"
                )}
                title={isSpeaking ? "Stop speaking" : "Read aloud"}
              >
                {isSpeaking ? <Square className="w-3.5 h-3.5 fill-current" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 mt-2 px-1">
          <span className="text-xs text-legal-gray">
            {formatTimestamp(message.timestamp)}
          </span>
          {isUser && (
            <User className="w-3 h-3 text-legal-gray" />
          )}
        </div>
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-legal-steel/15 border border-legal-steel/30 flex items-center justify-center shadow-card">
          <User className="w-4 h-4 text-legal-steel" />
        </div>
      )}
    </motion.div>
  )
}

function formatTimestamp(timestamp) {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date

  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

