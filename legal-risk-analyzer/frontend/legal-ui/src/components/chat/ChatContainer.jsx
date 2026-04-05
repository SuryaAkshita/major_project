import { useState, useRef, useEffect } from 'react'
import MessageCard from './MessageCard'
import InputBar from './InputBar'
import EmptyState from './EmptyState'
import DocumentPreview from './DocumentPreview'
import { analyzeText, analyzeFile } from '@/lib/api'
import { getMockAnalysis, DEMO_DELAY_MS, DEMO_PROMPTS } from '@/lib/demoData'
import { motion, AnimatePresence } from 'framer-motion'

const LOADING_STEPS = [
  'Reading document...',
  'Identifying clauses...',
  'Preparing analysis...',
]

export default function ChatContainer({ currentAnalysis, onAnalysisComplete, demoMode }) {
    const [messages, setMessages] = useState(currentAnalysis?.messages || [])
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [loadingStep, setLoadingStep] = useState(0)
    const [uploadedFile, setUploadedFile] = useState(null)
    const [toast, setToast] = useState(null)
    const messagesEndRef = useRef(null)

    useEffect(() => {
        if (currentAnalysis?.messages) {
            setMessages(currentAnalysis.messages)
        } else {
            setMessages([])
        }
    }, [currentAnalysis])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isAnalyzing])

    // Staged loading animation during analysis
    useEffect(() => {
        if (!isAnalyzing) return
        const stepCount = LOADING_STEPS.length
        const interval = setInterval(() => {
            setLoadingStep((s) => (s + 1) % stepCount)
        }, 800)
        return () => clearInterval(interval)
    }, [isAnalyzing])

    const showToast = (message) => {
        setToast(message)
        setTimeout(() => setToast(null), 2500)
    }

    const handleSendMessage = async (text, file) => {
        if (!text.trim() && !file) return

        const userMessage = {
            id: Date.now(),
            role: 'user',
            content: text || `Uploaded: ${file?.name}`,
            timestamp: new Date().toISOString(),
        }

        setMessages(prev => [...prev, userMessage])

        if (file) {
            setUploadedFile(file)
        }

        setIsAnalyzing(true)
        setLoadingStep(0)

        try {
            let response
            if (demoMode) {
                await new Promise((r) => setTimeout(r, DEMO_DELAY_MS))
                const promptForMock = text || (file ? `Uploaded: ${file.name}` : '')
                response = getMockAnalysis(promptForMock)
            } else {
                if (file) {
                    response = await analyzeFile(file, text)
                } else {
                    response = await analyzeText(text)
                }
            }

            const aiMessage = {
                id: Date.now() + 1,
                role: 'assistant',
                content: formatAnalysisResponse(response),
                timestamp: new Date().toISOString(),
                analysis: response,
            }

            const newMessages = [...messages, userMessage, aiMessage]
            setMessages(newMessages)
            setIsAnalyzing(false)
            showToast('Analysis complete')

            if (!currentAnalysis) {
                onAnalysisComplete({
                    id: Date.now(),
                    title: text?.substring(0, 50) || file?.name || 'New Analysis',
                    messages: newMessages,
                    timestamp: new Date().toLocaleString(),
                })
            }
        } catch (error) {
            const errorMessage = {
                id: Date.now() + 1,
                role: 'assistant',
                content: `Error: ${error.message}. Please try again.`,
                timestamp: new Date().toISOString(),
                isError: true,
            }
            setMessages(prev => [...prev, errorMessage])
            setIsAnalyzing(false)
        }
    }

    const formatAnalysisResponse = (response) => {
        if (!response) return 'Analysis complete. Review the results above.'

        // Display error if returned from backend
        if (response.error) {
            return `SYSTEM ENCOUNTERED AN ISSUE\n\n**Error:** ${response.error}\n\nOur agents are currently regrouping. Please try again or rephrase your request.`
        }

        const agentName = response.triggered_agent || 'Legal Orchestrator'
        let formatted = `AGENT TRIGGERED: **${agentName.toUpperCase()}**\n\n`

        // Handle Translation
        if (response.translation) {
            formatted += `**TRANSLATION OUTPUT**\n\n`
            formatted += `**Translated Text:**\n${response.translation.translated_text || 'N/A'}\n\n`
            formatted += `**Summary:**\n${response.translation.summary || 'N/A'}\n\n`
            return formatted
        }

        if (response.clause_analysis) {
            formatted += `**CLAUSE TYPE:** ${response.clause_analysis.type || 'N/A'}\n`
            formatted += `**EXPLANATION:** ${response.clause_analysis.explanation || 'N/A'}\n\n`
        }

        if (response.risk_analysis) {
            formatted += `**RISK LEVEL:** ${response.risk_analysis.risk_level?.toUpperCase() || 'N/A'}\n`
            formatted += `**RISK ASSESSMENT:** ${response.risk_analysis.explanation || 'N/A'}\n\n`
            if (response.risk_analysis.mitigation) {
                formatted += `**MITIGATION:** ${response.risk_analysis.mitigation}\n\n`
            }
        }

        if (response.compliance_analysis) {
            formatted += `**COMPLIANCE STATUS:** ${response.compliance_analysis.compliance_status?.toUpperCase() || 'N/A'}\n`
            if (response.compliance_analysis.applicable_laws?.length > 0) {
                formatted += `**APPLICABLE LAWS:** ${response.compliance_analysis.applicable_laws.join(', ')}\n`
            }
            formatted += `**COMPLIANCE EXPLANATION:** ${response.compliance_analysis.explanation || 'N/A'}\n\n`
        }

        return formatted || 'Analysis completed successfully.'
    }

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-8">
                {messages.length === 0 ? (
                    <EmptyState onTryPrompt={(text) => handleSendMessage(text, null)} demoMode={demoMode} />
                ) : (
                    <div className="max-w-4xl mx-auto space-y-6">
                        {messages.map((message) => (
                            <MessageCard key={message.id} message={message} />
                        ))}
                        {isAnalyzing && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col gap-2 w-full max-w-md"
                            >
                                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-legal-slate/25 border border-legal-slate/40 text-legal-gray text-sm">
                                    <TypingIndicator />
                                    <AnimatePresence mode="wait">
                                        <motion.span
                                            key={loadingStep}
                                            initial={{ opacity: 0, y: 4 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -4 }}
                                            transition={{ duration: 0.2 }}
                                            className="font-medium"
                                        >
                                            {LOADING_STEPS[loadingStep]}
                                        </motion.span>
                                    </AnimatePresence>
                                </div>
                                <div className="flex gap-1.5">
                                    {LOADING_STEPS.map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className="h-1 flex-1 rounded-full bg-legal-slate/40 overflow-hidden"
                                            initial={false}
                                        >
                                            <motion.div
                                                className="h-full bg-legal-steel rounded-full"
                                                initial={{ width: 0 }}
                                                animate={{ width: i <= loadingStep ? '100%' : '0%' }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Document Preview */}
            {uploadedFile && (
                <DocumentPreview file={uploadedFile} onClose={() => setUploadedFile(null)} />
            )}

            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-legal-mint/20 border border-legal-mint/40 text-legal-mint text-sm font-medium shadow-lg"
                    >
                        {toast}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Suggested prompts (when conversation started, demo only) */}
            {demoMode && messages.length > 0 && !isAnalyzing && (
              <div className="px-6 pt-2 pb-0 max-w-4xl mx-auto w-full">
                <p className="text-xs text-legal-gray/90 mb-2">Try another:</p>
                <div className="flex flex-wrap gap-2">
                  {DEMO_PROMPTS.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => handleSendMessage(p.text, null)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-legal-slate/30 border border-legal-slate/50 text-legal-gray hover:text-legal-off-white hover:border-legal-steel/40 hover:bg-legal-steel/10 transition-colors"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Bar */}
            <InputBar onSend={handleSendMessage} disabled={isAnalyzing} demoMode={demoMode} />
        </div>
    )
}

function TypingIndicator() {
    return (
        <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    className="w-2 h-2 bg-legal-steel rounded-full"
                    animate={{
                        opacity: [0.4, 1, 0.4],
                        scale: [1, 1.15, 1],
                    }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.15,
                    }}
                />
            ))}
        </div>
    )
}
