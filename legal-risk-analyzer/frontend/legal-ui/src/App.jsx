import { useState } from 'react'
import Sidebar from './components/layout/Sidebar'
import ChatContainer from './components/chat/ChatContainer'
import Header from './components/layout/Header'
import PerformanceDashboard from './components/performance/PerformanceDashboard'

function App() {
  const [currentAnalysis, setCurrentAnalysis] = useState(null)
  const [analyses, setAnalyses] = useState([])
  const [demoMode, setDemoMode] = useState(true) // default ON for presentation without backend
  const [activeView, setActiveView] = useState('chat')

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
    <div className="flex h-screen overflow-hidden bg-legal-navy bg-mesh">
      <Sidebar 
        onNewAnalysis={handleNewAnalysis}
        analyses={analyses}
        onSelectAnalysis={handleSelectAnalysis}
        currentAnalysis={currentAnalysis}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header
          demoMode={demoMode}
          onDemoModeChange={setDemoMode}
          activeView={activeView}
          onViewChange={setActiveView}
        />
        {activeView === 'chat' ? (
          <ChatContainer
            currentAnalysis={currentAnalysis}
            onAnalysisComplete={handleAnalysisComplete}
            demoMode={demoMode}
          />
        ) : (
          <PerformanceDashboard />
        )}
      </div>
    </div>
  )
}

export default App

