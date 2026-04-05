import { motion } from 'framer-motion'
import { Shield, AlertTriangle, CheckCircle, Scale, Languages } from 'lucide-react'

export default function AnalysisSummaryCard({ analysis }) {
  if (!analysis || analysis.error) return null

  const risk = analysis.risk_analysis?.risk_level
  const compliance = analysis.compliance_analysis?.compliance_status
  const agent = analysis.triggered_agent

  const riskConfig = {
    high: { label: 'High risk', color: 'text-red-400', bg: 'bg-red-500/15', border: 'border-red-500/40', icon: AlertTriangle },
    medium: { label: 'Medium risk', color: 'text-amber-400', bg: 'bg-amber-500/15', border: 'border-amber-500/40', icon: AlertTriangle },
    low: { label: 'Low risk', color: 'text-legal-mint', bg: 'bg-legal-mint/15', border: 'border-legal-mint/40', icon: Shield },
  }
  const riskStyle = risk ? riskConfig[risk.toLowerCase()] || riskConfig.medium : null

  const complianceConfig = {
    compliant: { label: 'Compliant', color: 'text-legal-mint', bg: 'bg-legal-mint/15', border: 'border-legal-mint/40', icon: CheckCircle },
    non_compliant: { label: 'Non-compliant', color: 'text-red-400', bg: 'bg-red-500/15', border: 'border-red-500/40', icon: AlertTriangle },
  }
  const complianceStyle = compliance ? complianceConfig[compliance.toLowerCase()] || { label: compliance, ...complianceConfig.compliant } : null

  const hasTranslation = !!analysis.translation

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      transition={{ duration: 0.35 }}
      className="mb-4 flex flex-wrap items-center gap-2"
    >
      {agent && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-legal-steel/15 border border-legal-steel/30 text-legal-steel text-xs font-medium">
          {hasTranslation ? <Languages className="w-3.5 h-3.5" /> : <Scale className="w-3.5 h-3.5" />}
          {agent}
        </span>
      )}
      {riskStyle && (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium ${riskStyle.bg} ${riskStyle.border} ${riskStyle.color}`}>
          <riskStyle.icon className="w-3.5 h-3.5" />
          {riskStyle.label}
        </span>
      )}
      {complianceStyle && (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium ${complianceStyle.bg} ${complianceStyle.border} ${complianceStyle.color}`}>
          <complianceStyle.icon className="w-3.5 h-3.5" />
          {complianceStyle.label}
        </span>
      )}
    </motion.div>
  )
}
