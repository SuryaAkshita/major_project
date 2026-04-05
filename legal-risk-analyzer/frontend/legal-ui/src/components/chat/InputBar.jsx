import { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, Mic, X, MicOff } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function InputBar({ onSend, disabled, demoMode }) {
  const [input, setInput] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const fileInputRef = useRef(null)
  const recognitionRef = useRef(null)

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event) => {
        let transcript = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript
        }
        setInput(prev => {
          const prefix = prev.trim() ? (prev.endsWith(' ') ? '' : ' ') : ''
          return prev + prefix + transcript
        })
      }

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsRecording(false)
      }

      recognitionRef.current.onend = () => {
        setIsRecording(false)
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser.')
      return
    }

    if (isRecording) {
      recognitionRef.current.stop()
      setIsRecording(false)
    } else {
      try {
        recognitionRef.current.start()
        setIsRecording(true)
      } catch (err) {
        console.error('Failed to start recognition:', err)
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (isRecording) {
      recognitionRef.current?.stop()
      setIsRecording(false)
    }

    // Send both text and file if present
    if (selectedFile || input.trim()) {
      onSend(input, selectedFile)
      setInput('')
      setSelectedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      // Do NOT clear input anymore
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="border-t border-legal-slate/60 bg-legal-charcoal/80 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-6 py-4">
        {/* File Preview */}
        {selectedFile && (
          <div className="mb-3 flex items-center gap-3 px-4 py-3 rounded-xl bg-legal-slate/30 border border-legal-steel/40 shadow-card">
            <div className="p-2 rounded-lg bg-legal-steel/15">
              <Paperclip className="w-4 h-4 text-legal-steel" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-legal-off-white font-medium truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-legal-gray">
                {(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.type || 'application/pdf'}
              </p>
            </div>
            <button
              onClick={removeFile}
              className="p-2 rounded-lg text-legal-gray hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
              placeholder={
                selectedFile
                  ? "Add instructions for this file (e.g., 'Translate to Hindi')..."
                  : "Enter your legal query or paste contract text..."
              }
              disabled={disabled}
              rows={3}
              className={cn(
                "w-full px-4 py-3 rounded-xl bg-legal-slate/40 border border-legal-slate/50",
                "text-legal-off-white placeholder-legal-gray",
                "resize-none focus:outline-none focus:ring-2 focus:ring-legal-steel/40 focus:border-legal-steel/50",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "font-sans text-sm leading-relaxed transition-shadow duration-200"
              )}
            />
            {isRecording && (
              <div className="absolute top-3 right-3 flex items-center gap-2 px-2 py-1 rounded-lg bg-red-500/15 border border-red-500/30">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] text-red-400 font-medium uppercase tracking-wider">Recording</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className={cn(
                "p-3 rounded-xl border border-legal-slate/50 hover:bg-legal-slate/40 transition-all",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                selectedFile && "bg-legal-steel/20 border-legal-steel/50 text-legal-steel",
                "text-legal-gray hover:text-legal-off-white"
              )}
              title="Attach document (PDF, DOCX)"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileSelect}
              className="hidden"
            />

            <button
              type="button"
              onClick={toggleRecording}
              disabled={disabled}
              className={cn(
                "p-3 rounded-xl border transition-all",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                isRecording ? "bg-red-500/20 border-red-500/50 text-red-400" : "border-legal-slate/50 hover:bg-legal-slate/40 text-legal-gray hover:text-legal-off-white"
              )}
              title={isRecording ? "Stop recording" : "Voice input"}
            >
              {isRecording ? (
                <MicOff className="w-5 h-5 animate-pulse" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>

            <button
              type="submit"
              disabled={disabled || (!input.trim() && !selectedFile)}
              className={cn(
                "px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2",
                "bg-legal-steel hover:bg-legal-steel-light text-white shadow-lg hover:shadow-glow",
                "disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              )}
            >
              <Send className="w-4 h-4" />
              <span>Analyze</span>
            </button>
          </div>
        </form>
        <p className="mt-2 text-center text-xs text-legal-gray/80">
          {demoMode && 'Demo mode — sample responses, no backend required · '}
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}
