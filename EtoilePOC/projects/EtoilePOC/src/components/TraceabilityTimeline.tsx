import React from 'react'
import type { TraceabilityStep } from '../data/demoPassportData'

interface TraceabilityTimelineProps {
  steps: TraceabilityStep[]
}

const TraceabilityTimeline: React.FC<TraceabilityTimelineProps> = ({ steps }) => {
  return (
    <ol className="grid gap-4 md:grid-cols-2">
      {steps.map((step, index) => (
        <li
          key={`${step.step}-${step.date}`}
          className="relative rounded-2xl border border-slate-200 bg-white/80 p-5 text-sm text-slate-600"
        >
          <div className="absolute -top-4 left-5 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-sm font-semibold text-white shadow">
            {index + 1}
          </div>
          <p className="mt-4 text-sm font-semibold text-slate-900">{step.step}</p>
          <p className="mt-2">{step.org}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">{step.country}</p>
          <p className="mt-1 text-xs text-slate-500">Date: {step.date}</p>
          <a href={step.evidenceUrl} className="mt-3 inline-flex text-xs font-semibold text-emerald-700 hover:text-emerald-900">
            View evidence →
          </a>
        </li>
      ))}
    </ol>
  )
}

export default TraceabilityTimeline
