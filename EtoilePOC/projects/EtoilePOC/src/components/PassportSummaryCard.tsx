import React from 'react'
import type { PassportNFT, Product } from '../data/demoPassportData'

interface PassportSummaryCardProps {
  passport: PassportNFT
  product: Product
  isOwner: boolean
  networkLabel?: string
}

const truncate = (value: string, lead = 6, tail = 4) =>
  value.length > lead + tail ? `${value.slice(0, lead)}…${value.slice(-tail)}` : value

const PassportSummaryCard: React.FC<PassportSummaryCardProps> = ({
  passport,
  product,
  isOwner,
  networkLabel = 'Algorand TestNet',
}) => {
  return (
    <article className="rounded-3xl border border-black/5 bg-white/80 p-6 shadow-sm backdrop-blur">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Passport #{passport.assetId}</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">{passport.name}</h3>
          <p className="text-sm text-slate-600">Linked product: {product.title}</p>
        </div>
        <div className="flex flex-col items-end gap-2 text-xs font-semibold">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> On-chain
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-amber-800">
            {networkLabel}
          </span>
          {isOwner && (
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-white">
              Owner verified
            </span>
          )}
        </div>
      </header>

      <div className="mt-6 grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-black/5 bg-white/70">
            <img
              src={passport.image}
              alt={passport.name}
              className="h-full w-full object-cover"
            />
          </div>
          <dl className="grid gap-2 text-xs text-slate-600">
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white/90 px-3 py-2">
              <dt className="font-semibold text-slate-900">Creator</dt>
              <dd>{truncate(passport.creator)}</dd>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white/90 px-3 py-2">
              <dt className="font-semibold text-slate-900">Reserve</dt>
              <dd>{truncate(passport.reserve)}</dd>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white/90 px-3 py-2">
              <dt className="font-semibold text-slate-900">Batch</dt>
              <dd>{passport.properties.batch}</dd>
            </div>
          </dl>
        </div>
        <div className="space-y-4 text-sm text-slate-600">
          <div className="rounded-2xl border border-slate-200 bg-white/90 p-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Properties</h4>
            <ul className="mt-3 space-y-2">
              <li>
                Size <span className="font-semibold text-slate-900">{passport.properties.size}</span>
              </li>
              <li>
                Color <span className="font-semibold text-slate-900">{passport.properties.color}</span>
              </li>
              <li>
                Serial <span className="font-semibold text-slate-900">{passport.properties.serial}</span>
              </li>
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/90 p-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">On-chain proof</h4>
            <ul className="mt-3 space-y-2">
              <li>
                Creation tx: <span className="font-semibold text-slate-900">{passport.events.creationTx}</span>
              </li>
              <li>
                Last transfer: <span className="font-semibold text-slate-900">{passport.events.lastTransfer}</span>
              </li>
              <li>
                Current holder:{' '}
                <span className="font-semibold text-slate-900">
                  {truncate(passport.events.currentHolder)}
                </span>
              </li>
            </ul>
            <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold text-emerald-700">
              <a href={passport.explorerUrl} target="_blank" rel="noreferrer" className="hover:text-emerald-900">
                View on Algorand Explorer →
              </a>
              <a href={passport.peraUrl} target="_blank" rel="noreferrer" className="hover:text-emerald-900">
                View in Pera Wallet →
              </a>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export default PassportSummaryCard
