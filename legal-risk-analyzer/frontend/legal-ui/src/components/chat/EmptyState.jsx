import { Scale, FileText, Search, Shield, Languages, AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function EmptyState({ onTryPrompt, demoMode }) {
  const features = [
    { icon: FileText, text: 'Upload legal documents' },
    { icon: Search, text: 'Analyze contract clauses' },
    { icon: Shield, text: 'Risk assessment' },
  ]

  const tryPrompts = [
    { label: 'Analyze liability clause', text: 'Analyze the liability cap and limitation of liability clauses in this agreement.', Icon: Scale },
    { label: 'Translate to Hindi', text: 'Translate the confidentiality section to Hindi.', Icon: Languages },
    { label: 'Check compliance', text: 'Is this contract compliant with DPDP 2023 and data protection requirements?', Icon: Shield },
    { label: 'Full risk analysis', text: 'Give me a full risk analysis of the payment and termination terms.', Icon: AlertTriangle },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto text-center px-6"
    >
      <div className="mb-10">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-legal-gold/20 blur-3xl rounded-full scale-150" />
          <div className="relative p-8 rounded-2xl bg-legal-slate/30 border border-legal-slate/50 shadow-card">
            <Scale className="w-20 h-20 text-legal-gold" />
          </div>
        </div>
      </div>

      <h2 className="text-4xl font-serif text-legal-off-white mb-3 tracking-tight">
        Legal Risk Analyzer
      </h2>
      <p className="text-lg text-legal-gray mb-8 max-w-md leading-relaxed">
        Professional AI-powered analysis for legal documents, contracts, and compliance review.
      </p>

      {demoMode && onTryPrompt && (
        <div className="w-full max-w-2xl mb-8">
          <p className="text-xs font-semibold text-legal-gray uppercase tracking-wider mb-3">Try these — one click demo</p>
          <div className="flex flex-wrap justify-center gap-2">
            {tryPrompts.map((prompt, index) => (
              <motion.button
                key={prompt.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25 + index * 0.05 }}
                onClick={() => onTryPrompt(prompt.text)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-legal-steel/15 border border-legal-steel/40 text-legal-off-white text-sm font-medium hover:bg-legal-steel/25 hover:border-legal-steel/60 hover:shadow-glow transition-all duration-200"
              >
                <prompt.Icon className="w-4 h-4 text-legal-steel" />
                {prompt.label}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 w-full max-w-lg mb-10">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + index * 0.1 }}
            className="flex flex-col items-center gap-3 p-5 rounded-xl bg-legal-slate/25 border border-legal-slate/40 hover:border-legal-steel/30 hover:bg-legal-slate/35 transition-colors duration-200"
          >
            <div className="p-2.5 rounded-lg bg-legal-steel/10 border border-legal-steel/20">
              <feature.icon className="w-6 h-6 text-legal-steel" />
            </div>
            <p className="text-sm text-legal-gray text-center font-medium">{feature.text}</p>
          </motion.div>
        ))}
      </div>

      <p className="text-sm text-legal-gray/90">
        {demoMode ? 'Use the buttons above or type / upload below.' : 'Begin by uploading a document or entering a legal query below.'}
      </p>
    </motion.div>
  )
}

