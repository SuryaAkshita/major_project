import { useMemo, useState } from 'react'
import { Sparkles, Wand2, SlidersHorizontal, Activity } from 'lucide-react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { getPerformanceDashboard } from '@/lib/api'
import {
  overviewMetrics,
  comparisonGroups,
  kValueData,
  agentPerformance,
  uxMetrics,
} from '@/lib/performanceData'

export default function PerformanceDashboard() {
  const [simK, setSimK] = useState(5)
  const [strictness, setStrictness] = useState(65)
  const [mode, setMode] = useState('balanced')
  const [activeComparison, setActiveComparison] = useState(0)

  const { data } = useQuery({
    queryKey: ['performance-dashboard'],
    queryFn: getPerformanceDashboard,
    refetchInterval: 10000,
  })

  const currentOverview = data?.overviewMetrics || overviewMetrics
  const currentComparisons = data?.comparisonGroups || comparisonGroups
  const currentKValues = data?.kValueData || kValueData
  const currentAgents = data?.agentPerformance || agentPerformance
  const currentUxMetrics = data?.uxMetrics || uxMetrics

  const bestSpeed = [...currentKValues].sort((a, b) => a.latency - b.latency)[0]
  const bestQuality = [...currentKValues].sort((a, b) => b.quality - a.quality)[0]
  const bestBalanced = [...currentKValues]
    .map((row) => ({
      ...row,
      score: row.quality * 0.5 + row.citation * 0.3 - row.latency * 12 - row.cost * 150,
    }))
    .sort((a, b) => b.score - a.score)[0]

  const simulated = useMemo(() => {
    const selected = currentKValues.find((row) => row.k === Number(simK)) || currentKValues[0]
    const strictBoost = strictness / 100
    const modeAdjust = {
      speed: { quality: -4, latency: -0.22, cost: -0.008, citation: -6, hallucination: 1.2 },
      balanced: { quality: 0, latency: 0, cost: 0, citation: 0, hallucination: 0 },
      quality: { quality: 3, latency: 0.18, cost: 0.006, citation: 5, hallucination: -0.8 },
    }[mode]

    const quality = Math.max(60, Math.min(99, selected.quality + modeAdjust.quality + strictBoost * 2))
    const latency = Math.max(0.4, Number((selected.latency + modeAdjust.latency + strictBoost * 0.16).toFixed(2)))
    const cost = Math.max(0.01, Number((selected.cost + modeAdjust.cost + strictBoost * 0.004).toFixed(3)))
    const citation = Math.max(40, Math.min(99, selected.citation + modeAdjust.citation + strictBoost * 3))
    const hallucination = Math.max(1.5, Number((selected.hallucination + modeAdjust.hallucination - strictBoost * 0.5).toFixed(1)))

    return { quality, latency, cost, citation, hallucination }
  }, [currentKValues, mode, simK, strictness])

  const coach = useMemo(() => {
    if (mode === 'speed') {
      return `Use k=${bestSpeed.k} with low-to-mid strictness for quickest responses and lower spend.`
    }
    if (mode === 'quality') {
      return `Use k=${bestQuality.k} with higher strictness for stronger grounding and better legal confidence.`
    }
    return `Balanced choice today is k=${bestBalanced.k}; it gives the best quality-speed-cost tradeoff.`
  }, [bestBalanced.k, bestQuality.k, bestSpeed.k, mode])

  const comparison = currentComparisons[activeComparison] || currentComparisons[0]

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-8">
      <div className="max-w-6xl mx-auto space-y-5 animate-fade-in">
        <section className="rounded-2xl border border-legal-slate/50 bg-legal-charcoal/60 p-5 shadow-card">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-legal-gray">Performance Observatory</p>
              <h3 className="text-2xl font-serif text-legal-off-white mt-1">Visual Performance Storyboard</h3>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-legal-gold/10 border border-legal-gold/30 text-legal-gold text-sm">
              <Sparkles className="w-4 h-4" />
              Simplified and visual
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
            <GraphicStatRing
              title={currentOverview[0]?.label || 'Avg Latency'}
              value={currentOverview[0]?.value || '0.00s'}
              progress={74}
              color="rgba(59,130,246,0.9)"
            />
            <GraphicStatRing
              title={currentOverview[1]?.label || 'Quality Score'}
              value={currentOverview[1]?.value || '0'}
              progress={91}
              color="rgba(212,168,83,0.9)"
            />
            <GraphicStatRing
              title={currentOverview[2]?.label || 'Error Rate'}
              value={currentOverview[2]?.value || '0%'}
              progress={86}
              color="rgba(52,211,153,0.9)"
            />
          </div>
        </section>

        <section className="rounded-2xl border border-legal-slate/50 bg-legal-charcoal/60 p-5 shadow-card">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h4 className="text-lg font-serif text-legal-off-white">Comparison Stage</h4>
              <p className="text-xs text-legal-gray">One focused comparison at a time</p>
            </div>
            <div className="flex items-center gap-1 p-1 rounded-xl border border-legal-slate/50 bg-legal-slate/20">
              {currentComparisons.map((group, i) => (
                <button
                  key={group.title}
                  type="button"
                  onClick={() => setActiveComparison(i)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs border transition-colors ${
                    activeComparison === i
                      ? 'bg-legal-steel/20 border-legal-steel/40 text-legal-steel'
                      : 'bg-transparent border-transparent text-legal-gray hover:text-legal-off-white'
                  }`}
                >
                  {group.title}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <ComparisonStage group={comparison} />
          </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2 rounded-2xl border border-legal-slate/50 bg-legal-charcoal/60 p-5 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <SlidersHorizontal className="w-4 h-4 text-legal-steel" />
              <h4 className="text-lg font-serif text-legal-off-white">What-if Simulator</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="rounded-xl border border-legal-slate/40 bg-legal-slate/20 p-3">
                <p className="text-xs text-legal-gray uppercase tracking-wider">Analysis Mode</p>
                <div className="mt-2 grid grid-cols-3 gap-1">
                  {['speed', 'balanced', 'quality'].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMode(m)}
                      className={`px-2 py-1.5 rounded-lg text-xs border transition-colors ${
                        mode === m
                          ? 'bg-legal-steel/20 border-legal-steel/40 text-legal-steel'
                          : 'bg-legal-slate/20 border-legal-slate/50 text-legal-gray hover:text-legal-off-white'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-legal-slate/40 bg-legal-slate/20 p-3">
                <p className="text-xs text-legal-gray uppercase tracking-wider">K Value</p>
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={simK}
                  onChange={(e) => setSimK(Number(e.target.value))}
                  className="w-full mt-3 accent-blue-500"
                />
                <p className="text-sm text-legal-off-white mt-2 font-medium">k = {simK}</p>
              </div>
              <div className="rounded-xl border border-legal-slate/40 bg-legal-slate/20 p-3">
                <p className="text-xs text-legal-gray uppercase tracking-wider">Strictness</p>
                <input
                  type="range"
                  min={20}
                  max={100}
                  step={5}
                  value={strictness}
                  onChange={(e) => setStrictness(Number(e.target.value))}
                  className="w-full mt-3 accent-amber-500"
                />
                <p className="text-sm text-legal-off-white mt-2 font-medium">{strictness}%</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2">
              <MiniStat label="Quality" value={`${simulated.quality.toFixed(1)}/100`} />
              <MiniStat label="Latency" value={`${simulated.latency}s`} />
              <MiniStat label="Cost" value={`$${simulated.cost.toFixed(3)}`} />
              <MiniStat label="Citation" value={`${simulated.citation.toFixed(1)}%`} />
              <MiniStat label="Hallucination" value={`${simulated.hallucination}%`} />
            </div>
          </div>

          <div className="rounded-2xl border border-legal-slate/50 bg-legal-charcoal/60 p-5 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <Wand2 className="w-4 h-4 text-legal-gold" />
              <h4 className="text-lg font-serif text-legal-off-white">Decision Coach</h4>
            </div>
            <div className="rounded-xl border border-legal-gold/35 bg-legal-gold/10 p-3 text-sm text-legal-off-white leading-relaxed">
              {coach}
            </div>
            <div className="mt-3 space-y-2 text-xs">
              <p className="text-legal-gray">Best speed: <span className="text-legal-steel font-medium">k={bestSpeed.k}</span></p>
              <p className="text-legal-gray">Best quality: <span className="text-legal-gold font-medium">k={bestQuality.k}</span></p>
              <p className="text-legal-gray">Best balanced: <span className="text-legal-mint font-medium">k={bestBalanced.k}</span></p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-legal-slate/50 bg-legal-charcoal/60 p-5 shadow-card">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-legal-steel" />
              <h4 className="text-lg font-serif text-legal-off-white">Agent Pulse</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentAgents.map((agent, idx) => (
                <PulseCard key={agent.agent} agent={agent} delay={idx * 0.15} />
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-legal-slate/50 bg-legal-charcoal/60 p-5 shadow-card">
            <h4 className="text-lg font-serif text-legal-off-white">UX Radar</h4>
            <p className="text-xs text-legal-gray mb-3">Quick visual on responsiveness</p>
            <div className="space-y-2.5">
              {currentUxMetrics.map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-legal-gray">{item.label}</span>
                    <span className="text-legal-off-white">
                      {item.value}
                      {item.unit}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-legal-slate/50 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(8, 100 - Number(item.value) * 40)}%` }}
                      transition={{ duration: 0.6 }}
                      className="h-full bg-gradient-to-r from-legal-mint to-legal-steel"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-lg border border-legal-slate/40 bg-legal-slate/20 p-2.5">
      <p className="text-[11px] text-legal-gray uppercase tracking-wide">{label}</p>
      <p className="text-sm text-legal-off-white font-medium mt-1">{value}</p>
    </div>
  )
}

function ComparisonStage({ group }) {
  const baselineLabel = group.labels?.baseline || 'Baseline'
  const currentLabel = group.labels?.current || 'Current'
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {group.metrics.map((metric) => {
        const max = Math.max(metric.baseline, metric.current, 1)
        const baselineWidth = (metric.baseline / max) * 100
        const currentWidth = (metric.current / max) * 100
        return (
          <div key={metric.name} className="rounded-xl border border-legal-slate/30 bg-legal-slate/20 p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-legal-off-white">{metric.name}</span>
              <span className="text-legal-gray">{metric.better === 'higher' ? 'Higher better' : 'Lower better'}</span>
            </div>
            <div className="mt-2 space-y-2">
              <div>
                <div className="flex justify-between text-[11px] text-legal-gray">
                  <span>{baselineLabel}</span>
                  <span>{metric.baseline}{metric.unit}</span>
                </div>
                <div className="h-2 rounded-full bg-legal-slate/50 overflow-hidden mt-1">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${baselineWidth}%` }} className="h-full bg-legal-gray/80" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] text-legal-gray">
                  <span>{currentLabel}</span>
                  <span>{metric.current}{metric.unit}</span>
                </div>
                <div className="h-2 rounded-full bg-legal-slate/50 overflow-hidden mt-1">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${currentWidth}%` }} className="h-full bg-legal-steel" />
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function GraphicStatRing({ title, value, progress, color }) {
  const circleSize = 132
  const stroke = 8
  const radius = (circleSize - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="rounded-xl border border-legal-slate/40 bg-legal-slate/20 p-3">
      <p className="text-xs text-legal-gray uppercase tracking-wider">{title}</p>
      <div className="mt-2 flex items-center justify-center relative">
        <svg width={circleSize} height={circleSize} className="-rotate-90">
          <circle
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={radius}
            fill="none"
            stroke="rgba(51,65,85,0.65)"
            strokeWidth={stroke}
          />
          <motion.circle
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.8 }}
          />
        </svg>
        <p className="absolute text-lg font-semibold text-legal-off-white">{value}</p>
      </div>
    </div>
  )
}

function PulseCard({ agent, delay }) {
  const bars = [
    Math.max(8, Math.min(95, Number(agent.successRate))),
    Math.max(8, Math.min(95, Number(agent.contribution))),
    Math.max(8, Math.min(95, 100 - Number(agent.latencyMs) / 6)),
  ]
  return (
    <div className="rounded-xl border border-legal-slate/40 bg-legal-slate/20 p-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-legal-off-white">{agent.agent}</p>
        <p className="text-[11px] text-legal-gray">{agent.latencyMs} ms</p>
      </div>
      <div className="mt-2 flex items-end gap-1 h-10">
        {bars.map((h, i) => (
          <motion.div
            key={`${agent.agent}-${i}`}
            className="flex-1 rounded-sm bg-gradient-to-t from-legal-steel to-legal-mint/90"
            initial={{ height: 6 }}
            animate={{ height: `${h}%` }}
            transition={{ duration: 0.7, delay: delay + i * 0.08 }}
          />
        ))}
      </div>
    </div>
  )
}
