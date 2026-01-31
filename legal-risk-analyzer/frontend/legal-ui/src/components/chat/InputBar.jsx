import { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, Mic, X, MicOff } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function InputBar({ onSend, disabled }) {
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
          // Add space if there's existing text and the new transcript doesn't start with punctuation
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
    
    // Stop recording if active
    if (isRecording) {
      recognitionRef.current?.stop()
      setIsRecording(false)
    }
    
    // If file is selected, send only the file (ignore text)
    if (selectedFile) {
      onSend('', selectedFile)  // Empty string for text when file is present
      setSelectedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }
    
    // Otherwise send text only
    if (input.trim()) {
      onSend(input, null)
      setInput('')
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      // Optionally clear text input when file is selected
      setInput('')
      if (isRecording) {
        recognitionRef.current?.stop()
        setIsRecording(false)
      }
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="border-t border-legal-slate bg-legal-charcoal">
      <div className="max-w-4xl mx-auto px-6 py-4">
        {/* File Preview */}
        {selectedFile && (
          <div className="mb-3 flex items-center gap-3 px-4 py-3 bg-legal-slate/50 rounded-lg border border-legal-steel/30">
            <Paperclip className="w-4 h-4 text-legal-steel" />
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
              className="text-legal-gray hover:text-red-400 transition-colors p-1"
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
                  ? "File attached. Click Send to analyze..." 
                  : "Enter your legal query or paste contract text..."
              }
              disabled={disabled || selectedFile}  // Disable text input when file is selected
              rows={3}
              className={cn(
                "w-full px-4 py-3 bg-legal-slate border border-legal-slate/50 rounded-lg",
                "text-legal-off-white placeholder-legal-gray",
                "resize-none focus:outline-none focus:ring-2 focus:ring-legal-steel/50 focus:border-legal-steel/50",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "font-sans text-sm leading-relaxed"
              )}
            />
            {isRecording && (
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] text-red-400 font-medium uppercase tracking-wider">Recording</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* File Upload Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className={cn(
                "p-3 rounded-lg border border-legal-slate/50",
                "hover:bg-legal-slate/50 transition-colors",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                selectedFile && "bg-legal-steel/20 border-legal-steel/50",
                "text-legal-gray hover:text-legal-off-white"
              )}
              title="Attach document (PDF, DOCX)"
            >
              <Paperclip className={cn("w-5 h-5", selectedFile && "text-legal-steel")} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Voice Input Button */}
            <button
              type="button"
              onClick={toggleRecording}
              disabled={disabled || selectedFile}
              className={cn(
                "p-3 rounded-lg border border-legal-slate/50",
                "hover:bg-legal-slate/50 transition-colors",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                isRecording && "bg-red-500/20 border-red-500/50",
                "text-legal-gray hover:text-legal-off-white"
              )}
              title={isRecording ? "Stop recording" : "Voice input"}
            >
              {isRecording ? (
                <MicOff className="w-5 h-5 text-red-400 animate-pulse" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={disabled || (!input.trim() && !selectedFile)}
              className={cn(
                "px-6 py-3 bg-legal-steel hover:bg-legal-steel/90",
                "text-white rounded-lg font-medium transition-colors",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "flex items-center gap-2"
              )}
            >
              <Send className="w-4 h-4" />
              <span>{selectedFile ? 'Analyze' : 'Send'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
