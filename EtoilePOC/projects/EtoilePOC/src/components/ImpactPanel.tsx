import React from 'react'
import type { ImpactProfile } from '../data/demoPassportData'

interface ImpactPanelProps {
  impact: ImpactProfile
}

const ImpactPanel: React.FC<ImpactPanelProps> = ({ impact }) => {
  return (
    <section className="space-y-4">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-slate-900">Impact</h3>
          <p className="text-sm text-slate-600">{impact.methodologyNote}</p>
        </div>
        {impact.metrics.some(metric => metric.sourceUrl) && (
          <a
            href={impact.metrics.find(metric => metric.sourceUrl)?.sourceUrl}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 hover:text-emerald-900"
            target="_blank"
            rel="noreferrer"
          >
            Methodology
          </a>
        )}
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {impact.metrics.map(metric => (
          <div key={metric.name} className="rounded-2xl border border-slate-200 bg-white/80 p-5">
            <p className="text-sm font-semibold text-slate-900">{metric.name}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {metric.value}
              {metric.unit && <span className="ml-1 text-base font-semibold">{metric.unit}</span>}
            </p>
            {metric.comparison && (
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
                {metric.comparison}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

export default ImpactPanel
