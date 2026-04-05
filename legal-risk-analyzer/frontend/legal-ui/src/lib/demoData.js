/**
 * Mock responses for demo/presentation mode (no backend required).
 * Realistic sample outputs for each analysis type.
 */

export const DEMO_PROMPTS = [
  {
    label: 'Analyze liability clause',
    text: 'Analyze the liability cap and limitation of liability clauses in this agreement.',
    icon: 'Scale',
  },
  {
    label: 'Translate to Hindi',
    text: 'Translate the confidentiality section to Hindi.',
    icon: 'Languages',
  },
  {
    label: 'Check compliance',
    text: 'Is this contract compliant with DPDP 2023 and data protection requirements?',
    icon: 'Shield',
  },
  {
    label: 'Full risk analysis',
    text: 'Give me a full risk analysis of the payment and termination terms.',
    icon: 'AlertTriangle',
  },
]

/** Simulates API delay (ms) for demo */
export const DEMO_DELAY_MS = 2200

/** Returns a mock analysis based on user message keywords */
export function getMockAnalysis(userText) {
  const t = (userText || '').toLowerCase()

  // Translation
  if (t.includes('translate') || t.includes('hindi') || t.includes('spanish') || t.includes('telugu')) {
    return {
      intent: 'translation',
      triggered_agent: 'MultilingualAgent',
      translation: {
        translated_text: 'यह खंड पक्षकारों के बीच गोपनीय जानकारी के संरक्षण और उपयोग को नियंत्रित करता है। 72 घंटे के भीतर डेटा उल्लंघन की सूचना देना अनिवार्य है।',
        summary: 'Confidentiality clause translated to Hindi. Key obligation: 72-hour breach notification as per DPDP 2023.',
      },
      clause_analysis: null,
      risk_analysis: null,
      compliance_analysis: null,
    }
  }

  // Compliance
  if (t.includes('compliance') || t.includes('compliant') || t.includes('dpdp') || t.includes('regulation')) {
    return {
      intent: 'compliance_analysis',
      triggered_agent: 'ComplianceAgent',
      clause_analysis: {
        type: 'Data Protection & Confidentiality',
        explanation: 'The clause aligns with standard data handling and breach notification requirements.',
      },
      compliance_analysis: {
        compliance_status: 'compliant',
        applicable_laws: ['DPDP 2023', 'IT Act 2000', 'Contract Act 1872'],
        explanation: 'The contract meets DPDP 2023 expectations: 72-hour breach notification is specified, data processing purpose is clear, and confidentiality duration (5 years) is defined. Recommend adding explicit consent mechanisms for personal data if not already in the main agreement.',
      },
      risk_analysis: null,
    }
  }

  // Risk or full
  if (t.includes('risk') || t.includes('full') || t.includes('payment') || t.includes('termination') || t.includes('liability')) {
    return {
      intent: 'full_analysis',
      triggered_agent: 'Legal Orchestrator',
      clause_analysis: {
        type: 'Liability & Indemnity',
        explanation: 'The clause limits liability to 12 months of fees and caps monetary exposure, which is common in B2B MSAs. Late payment interest at 1.5% is clearly stated.',
      },
      risk_analysis: {
        risk_level: 'medium',
        explanation: 'Payment terms carry moderate risk: 30-day net payment is standard; 1.5% late interest is enforceable. Termination for cause with 30-day cure is reasonable. Key exposure: liability cap may be low for high-value engagements.',
        mitigation: 'Consider negotiating a higher liability cap for critical deliverables; ensure termination notice is documented in writing.',
      },
      compliance_analysis: {
        compliance_status: 'compliant',
        applicable_laws: ['Contract Act 1872', 'DPDP 2023'],
        explanation: 'Payment and termination terms are consistent with Indian contract law. No obvious compliance gaps for the described scope.',
      },
    }
  }

  // Default: clause analysis
  return {
    intent: 'clause_analysis',
    triggered_agent: 'ClauseAgent',
    clause_analysis: {
      type: 'Confidentiality & Data Protection',
      explanation: 'This clause imposes a 5-year confidentiality obligation and requires breach notification within 72 hours, aligning with DPDP 2023. It defines what constitutes confidential information and permits disclosure where legally required.',
    },
    risk_analysis: null,
    compliance_analysis: null,
  }
}
