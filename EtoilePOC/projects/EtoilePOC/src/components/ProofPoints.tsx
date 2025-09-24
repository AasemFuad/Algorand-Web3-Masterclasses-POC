import React from 'react'
import type { ProofPoint } from '../data/demoPassportData'

interface ProofPointsProps {
  claims: ProofPoint[]
}

const ProofPoints: React.FC<ProofPointsProps> = ({ claims }) => {
  return (
    <aside className="flex flex-col gap-6 rounded-3xl border border-black/5 bg-white/80 p-8 shadow">
      <div className="space-y-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
          Proof points
        </span>
        <h3 className="text-2xl font-bold">Verified claims</h3>
        <p className="text-sm text-slate-600">
          Independent certifications and attested data anchored via Algorand smart signatures.
        </p>
      </div>
      <ul className="space-y-4 text-sm text-slate-600">
        {claims.map(claim => (
          <li key={claim.claim} className="rounded-2xl border border-slate-200 bg-white/90 p-5">
            <p className="font-semibold text-slate-900">{claim.claim}</p>
            <p className="mt-1 text-slate-600">{claim.standardOrCert}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">{claim.issuer}</p>
            <a href={claim.link} className="mt-3 inline-flex items-center text-xs font-semibold text-emerald-700">
              View evidence →
            </a>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default ProofPoints
