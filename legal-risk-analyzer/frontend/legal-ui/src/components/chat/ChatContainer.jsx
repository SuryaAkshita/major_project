import { useState, useRef, useEffect } from 'react'
import MessageCard from './MessageCard'
import InputBar from './InputBar'
import EmptyState from './EmptyState'
import DocumentPreview from './DocumentPreview'
import { analyzeText, analyzeFile } from '@/lib/api'
import { motion } from 'framer-motion'

export default function ChatContainer({ currentAnalysis, onAnalysisComplete }) {
    const [messages, setMessages] = useState(currentAnalysis?.messages || [])
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [uploadedFile, setUploadedFile] = useState(null)
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

        try {
            let response
            if (file) {
                response = await analyzeFile(file)
            } else {
                response = await analyzeText(text)
            }

            // Format the response based on backend structure
            const aiMessage = {
                id: Date.now() + 1,
                role: 'assistant',
                content: formatAnalysisResponse(response),
                timestamp: new Date().toISOString(),
                analysis: response, // Store full analysis data
            }

            const newMessages = [...messages, userMessage, aiMessage]
            setMessages(newMessages)
            setIsAnalyzing(false)

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
            return `### System Encountered an Issue\n\n**Error:** ${response.error}\n\nOur agents are currently regrouping. Please try again or rephrase your request.`
        }

        const agentName = response.triggered_agent || 'Legal Orchestrator'
        let formatted = `### Triggered ${agentName}\n\n`

        // Handle Translation
        if (response.translation) {
            formatted += `#### Translation Output\n\n`
            formatted += `**Translated Text:**\n${response.translation.translated_text || 'N/A'}\n\n`
            formatted += `**Summary:**\n${response.translation.summary || 'N/A'}\n\n`
            return formatted
        }

        if (response.clause_analysis) {
            formatted += `**Clause Type:** ${response.clause_analysis.type || 'N/A'}\n`
            formatted += `**Explanation:** ${response.clause_analysis.explanation || 'N/A'}\n\n`
        }

        if (response.risk_analysis) {
            formatted += `**Risk Level:** ${response.risk_analysis.risk_level || 'N/A'}\n`
            formatted += `**Risk Assessment:** ${response.risk_analysis.explanation || 'N/A'}\n\n`
            if (response.risk_analysis.mitigation) {
                formatted += `**Mitigation:** ${response.risk_analysis.mitigation}\n\n`
            }
        }

        if (response.compliance_analysis) {
            formatted += `**Compliance Status:** ${response.compliance_analysis.compliance_status || 'N/A'}\n`
            if (response.compliance_analysis.applicable_laws?.length > 0) {
                formatted += `**Applicable Laws:** ${response.compliance_analysis.applicable_laws.join(', ')}\n`
            }
            formatted += `**Compliance Explanation:** ${response.compliance_analysis.explanation || 'N/A'}\n\n`
        }

        return formatted || 'Analysis completed successfully.'
    }

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-legal-navy">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-8">
                {messages.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="max-w-4xl mx-auto space-y-6">
                        {messages.map((message) => (
                            <MessageCard key={message.id} message={message} />
                        ))}
                        {isAnalyzing && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 text-legal-gray text-sm"
                            >
                                <span>Analyzing legal context</span>
                                <TypingIndicator />
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

            {/* Input Bar */}
            <InputBar onSend={handleSendMessage} disabled={isAnalyzing} />
        </div>
    )
}

function TypingIndicator() {
    return (
        <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    className="w-1.5 h-1.5 bg-legal-gray rounded-full"
                    animate={{
                        opacity: [0.3, 1, 0.3],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: i * 0.2,
                    }}
                />
            ))}
        </div>
    )
}
