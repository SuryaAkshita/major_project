export const overviewMetrics = [
  { label: 'Avg Latency', value: '1.42s', delta: '-11.8%', trend: 'up', hint: 'P95: 2.31s' },
  { label: 'Quality Score', value: '91.3', delta: '+6.4%', trend: 'up', hint: 'Rubric-based' },
  { label: 'Hallucination Rate', value: '3.1%', delta: '-2.2%', trend: 'up', hint: 'Lower is better' },
  { label: 'Cost / Analysis', value: '$0.032', delta: '-14.7%', trend: 'up', hint: 'Token + retrieval cost' },
]

export const comparisonGroups = [
  {
    title: 'Baseline vs Current',
    subtitle: 'Core stack improvement after pipeline update',
    metrics: [
      { name: 'Quality', baseline: 85, current: 91, unit: '/100', better: 'higher' },
      { name: 'P95 Latency', baseline: 2.9, current: 2.31, unit: 's', better: 'lower' },
      { name: 'Error Rate', baseline: 4.8, current: 2.1, unit: '%', better: 'lower' },
      { name: 'Cost', baseline: 0.038, current: 0.032, unit: '$', better: 'lower' },
    ],
  },
  {
    title: 'RAG vs No-RAG',
    subtitle: 'Grounded responses versus direct LLM answering',
    metrics: [
      { name: 'Citation Coverage', baseline: 58, current: 88, unit: '%', better: 'higher' },
      { name: 'Hallucination Rate', baseline: 8.4, current: 3.1, unit: '%', better: 'lower' },
      { name: 'Risk Recall', baseline: 71, current: 90, unit: '%', better: 'higher' },
      { name: 'Latency', baseline: 1.18, current: 1.42, unit: 's', better: 'lower' },
    ],
    labels: { baseline: 'No-RAG', current: 'RAG' },
  },
  {
    title: 'Single vs Multi-Agent',
    subtitle: 'Performance when specialist agents collaborate',
    metrics: [
      { name: 'Risk Coverage', baseline: 74, current: 92, unit: '%', better: 'higher' },
      { name: 'Consistency', baseline: 78, current: 89, unit: '%', better: 'higher' },
      { name: 'Latency', baseline: 1.05, current: 1.42, unit: 's', better: 'lower' },
      { name: 'Token Usage', baseline: 1980, current: 2340, unit: '', better: 'lower' },
    ],
    labels: { baseline: 'Single Agent', current: 'Multi Agent' },
  },
]

export const kValueData = [
  { k: 1, quality: 79, latency: 0.86, cost: 0.019, citation: 52, hallucination: 9.2 },
  { k: 3, quality: 87, latency: 1.15, cost: 0.025, citation: 74, hallucination: 5.3 },
  { k: 5, quality: 91, latency: 1.42, cost: 0.032, citation: 88, hallucination: 3.1 },
  { k: 8, quality: 92, latency: 1.78, cost: 0.041, citation: 92, hallucination: 2.7 },
  { k: 10, quality: 92, latency: 2.05, cost: 0.047, citation: 93, hallucination: 2.6 },
]

export const agentPerformance = [
  { agent: 'Clause Agent', latencyMs: 320, successRate: 97, contribution: 86 },
  { agent: 'Risk Agent', latencyMs: 410, successRate: 95, contribution: 93 },
  { agent: 'Compliance Agent', latencyMs: 355, successRate: 96, contribution: 89 },
  { agent: 'Multilingual Agent', latencyMs: 280, successRate: 98, contribution: 81 },
]

export const uxMetrics = [
  { label: 'Time to First Token', value: 0.62, unit: 's', target: '< 0.8s' },
  { label: 'Full Response Time', value: 1.42, unit: 's', target: '< 2.0s' },
  { label: 'UI Render Delay', value: 0.11, unit: 's', target: '< 0.2s' },
]
