import { User, Scale, Volume2, Square } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function MessageCard({ message }) {
  const isUser = message.role === 'user'
  const [isSpeaking, setIsSpeaking] = useState(false)

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
        "flex gap-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-legal-steel/20 flex items-center justify-center">
          <Scale className="w-4 h-4 text-legal-steel" />
        </div>
      )}

      <div className={cn(
        "flex flex-col max-w-[75%]",
        isUser && "items-end"
      )}>
        <div className={cn(
          "px-5 py-4 rounded-lg relative group",
          isUser
            ? "bg-legal-steel/20 text-legal-off-white"
            : message.isError
              ? "bg-red-900/20 text-red-200 border border-red-800/50"
              : "bg-legal-slate text-legal-off-white border border-legal-slate/50"
        )}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>

          {!isUser && !message.isError && (
            <button
              onClick={speak}
              className={cn(
                "absolute top-2 right-2 p-1.5 rounded-md transition-all opacity-0 group-hover:opacity-100",
                isSpeaking
                  ? "bg-legal-steel text-white opacity-100"
                  : "bg-legal-charcoal/50 text-legal-gray hover:text-legal-off-white hover:bg-legal-charcoal"
              )}
              title={isSpeaking ? "Stop speaking" : "Read aloud"}
            >
              {isSpeaking ? (
                <Square className="w-3.5 h-3.5 fill-current" />
              ) : (
                <Volume2 className="w-3.5 h-3.5" />
              )}
            </button>
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
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-legal-steel/20 flex items-center justify-center">
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

