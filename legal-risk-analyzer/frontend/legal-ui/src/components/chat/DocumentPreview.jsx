import { X, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

export default function DocumentPreview({ file, onClose }) {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      className="border-t border-legal-slate/60 bg-legal-charcoal/80 backdrop-blur-sm px-6 py-4"
    >
      <div className="max-w-4xl mx-auto flex items-center gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0 px-4 py-2.5 rounded-xl bg-legal-slate/25 border border-legal-slate/40">
          <div className="p-2.5 bg-legal-steel/15 rounded-lg flex-shrink-0 border border-legal-steel/25">
            <FileText className="w-5 h-5 text-legal-steel" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-legal-off-white truncate">
              {file.name}
            </p>
            <p className="text-xs text-legal-gray">
              {formatFileSize(file.size)} • {file.type || 'Document'}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className={cn(
            "p-2.5 rounded-xl hover:bg-legal-slate/50 transition-colors",
            "text-legal-gray hover:text-legal-off-white"
          )}
          title="Remove file"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}

