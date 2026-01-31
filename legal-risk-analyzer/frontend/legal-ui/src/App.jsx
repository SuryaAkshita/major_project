import { useState } from 'react'
import Sidebar from './components/layout/Sidebar'
import ChatContainer from './components/chat/ChatContainer'
import Header from './components/layout/Header'

function App() {
  const [currentAnalysis, setCurrentAnalysis] = useState(null)
  const [analyses, setAnalyses] = useState([])

  const handleNewAnalysis = () => {
    setCurrentAnalysis(null)
  }

  const handleSelectAnalysis = (analysis) => {
    setCurrentAnalysis(analysis)
  }

  const handleAnalysisComplete = (analysis) => {
    setAnalyses(prev => [analysis, ...prev])
    setCurrentAnalysis(analysis)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-legal-navy">
      <Sidebar 
        onNewAnalysis={handleNewAnalysis}
        analyses={analyses}
        onSelectAnalysis={handleSelectAnalysis}
        currentAnalysis={currentAnalysis}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <ChatContainer 
          currentAnalysis={currentAnalysis}
          onAnalysisComplete={handleAnalysisComplete}
        />
      </div>
    </div>
  )
}

export default App

