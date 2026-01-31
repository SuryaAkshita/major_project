import { Scale, FileText, Search, Shield } from 'lucide-react'
import { motion } from 'framer-motion'

export default function EmptyState() {
  const features = [
    { icon: FileText, text: 'Upload legal documents' },
    { icon: Search, text: 'Analyze contract clauses' },
    { icon: Shield, text: 'Risk assessment' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto text-center px-6"
    >
      <div className="mb-8">
        <div className="relative">
          <div className="absolute inset-0 bg-legal-gold/10 blur-3xl rounded-full"></div>
          <div className="relative p-6 bg-legal-slate/30 rounded-2xl border border-legal-slate/50">
            <Scale className="w-16 h-16 text-legal-gold mx-auto" />
          </div>
        </div>
      </div>

      <h2 className="text-3xl font-serif text-legal-off-white mb-4">
        Legal Risk Analyzer
      </h2>
      <p className="text-lg text-legal-gray mb-8 max-w-md">
        Professional AI-powered analysis for legal documents, contracts, and compliance review.
      </p>

      <div className="grid grid-cols-3 gap-6 w-full max-w-lg mb-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="flex flex-col items-center gap-2 p-4 bg-legal-slate/20 rounded-lg border border-legal-slate/30"
          >
            <feature.icon className="w-6 h-6 text-legal-steel" />
            <p className="text-xs text-legal-gray text-center">{feature.text}</p>
          </motion.div>
        ))}
      </div>

      <p className="text-sm text-legal-gray">
        Begin by uploading a document or entering a legal query below.
      </p>
    </motion.div>
  )
}

