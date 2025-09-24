import React, { useMemo, useState } from 'react'
import { useWallet } from '@txnlab/use-wallet-react'

import ConnectWallet from './components/ConnectWallet'
import Transact from './components/Transact'
import NFTmint from './components/NFTmint'
import Tokenmint from './components/Tokenmint'
import PassportSummaryCard from './components/PassportSummaryCard'
import TraceabilityTimeline from './components/TraceabilityTimeline'
import ImpactPanel from './components/ImpactPanel'
import ProofPoints from './components/ProofPoints'
import QrGenerator from './components/QrGenerator'
import hero from './assets/hero.jpg'
import {
  featuredDrops,
  lookupPresets,
  products,
  type LookupPreset,
  type Product,
  type PassportNFT,
} from './data/demoPassportData'

const socialProofBullets = [
  'EU Ecodesign for Sustainable Products Regulation mandates Digital Product Passports for textiles.',
  'Brands must supply machine-readable sustainability data to sell in the EU single market by 2026.',
  'Retailers demand verifiable provenance to meet CSRD disclosures and combat greenwashing.',
]

const microFaqs = [
  {
    question: "What’s an NFT here?",
    answer:
      'Étoile uses Algorand Standard Assets (ARC-3 compliant) as digital product passports anchoring authenticity and sustainability evidence.',
  },
  {
    question: 'Do I need crypto to view a passport?',
    answer: 'No. Passports are public—wallets are only needed to claim ownership or receive drops.',
  },
  {
    question: 'What data is on-chain vs off-chain?',
    answer:
      'Asset IDs, ownership, and tamper-proof hashes live on Algorand. Rich media and certificates stay off-chain but are referenced by immutable hashes.',
  },
]

const complianceFaqs = [
  {
    title: 'Digital Product Passports, simplified',
    content:
      'The EU is rolling out Digital Product Passports through the Ecodesign for Sustainable Products Regulation. Apparel brands will need machine-readable material, circularity, and care data to trade in the bloc.',
    linkLabel: 'Explore ESPR overview →',
    linkHref: 'https://environment.ec.europa.eu/strategy/ecodesign-sustainable-products_en',
  },
  {
    title: 'Tooling for teams',
    content:
      'Étoile ships schemas, PLM connectors, and Pera Connect examples so innovation teams can go from pilot to production without redesigning the journey.',
    linkLabel: 'View developer docs →',
    linkHref: 'https://developer.algorand.org',
  },
]

const quickLinks = [
  { href: '#how-it-works', label: 'How it works' },
  { href: '#collections', label: 'Collections' },
  { href: '#scan', label: 'Passport lookup' },
  { href: '#brands', label: 'For brands' },
  { href: '#admin', label: 'Admin' },
  { href: '#faq', label: 'FAQ' },
]

const truncate = (value: string, lead = 6, tail = 4) =>
  value.length > lead + tail ? `${value.slice(0, lead)}…${value.slice(-tail)}` : value

const findLookupPreset = (value: string): LookupPreset | undefined =>
  lookupPresets.find(preset => preset.passport.assetId === value || preset.product.masterAssetId === value)

const buildDynamicPassport = (product: Product, assetId: string, owner?: string): PassportNFT => {
  const preset = findLookupPreset(product.masterAssetId)
  if (preset) {
    return {
      ...preset.passport,
      assetId,
      events: {
        ...preset.passport.events,
        lastTransfer: new Date().toISOString(),
        currentHolder: owner ?? preset.passport.events.currentHolder,
      },
    }
  }

  return {
    assetId,
    name: `${product.title} Pass`,
    unitName: 'ETOILE',
    image: product.images[0] ?? hero,
    properties: {
      productId: product.productId,
      batch: 'FW24',
      size: 'M',
      color: 'Aurora',
      serial: '001/200',
    },
    reserve: owner ?? 'RESERVEADDR',
    creator: owner ?? 'CREATORADDR',
    explorerUrl: `https://testnet.explorer.perawallet.app/asset/${assetId}`,
    peraUrl: `https://testnet.perawallet.app/assets/${assetId}`,
    events: {
      creationTx: 'PENDING…',
      lastTransfer: new Date().toISOString(),
      currentHolder: owner ?? 'TBD',
    },
  }
}

const Home: React.FC = () => {
  const { activeAddress } = useWallet()

  const [openWalletModal, setOpenWalletModal] = useState(false)
  const [openDemoModal, setOpenDemoModal] = useState(false)
  const [openNFTModal, setOpenNFTModal] = useState(false)
  const [openTokenModal, setOpenTokenModal] = useState(false)

  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedMaterial, setSelectedMaterial] = useState('All')
  const [selectedImpact, setSelectedImpact] = useState('All')
  const [selectedClaim, setSelectedClaim] = useState('All')

  const heroProduct = products[0]
  const [selectedProductId, setSelectedProductId] = useState<string>(heroProduct.productId)
  const selectedProduct = useMemo(
    () => products.find(product => product.productId === selectedProductId) ?? heroProduct,
    [selectedProductId],
  )

  const [mintedAssetId, setMintedAssetId] = useState<string | null>(null)
  const [hasClaimedPassport, setHasClaimedPassport] = useState(false)

  const [lookupInput, setLookupInput] = useState('')
  const [lookupResult, setLookupResult] = useState<LookupPreset | null>(lookupPresets[0] ?? null)
  const [openFaq, setOpenFaq] = useState<string | null>(microFaqs[0]?.question ?? null)

  const filteredCollections = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
      const matchesMaterial = selectedMaterial === 'All' || product.materials.includes(selectedMaterial)
      const matchesImpact = selectedImpact === 'All' || product.impactRange === selectedImpact
      const matchesClaim =
        selectedClaim === 'All' || product.verifiedClaims.some(claim => claim === selectedClaim)
      return matchesCategory && matchesMaterial && matchesImpact && matchesClaim
    })
  }, [selectedCategory, selectedMaterial, selectedImpact, selectedClaim])

  const ownerVerified = Boolean(
    activeAddress &&
      (hasClaimedPassport || lookupResult?.passport.events.currentHolder === activeAddress),
  )

  const handleLookup = () => {
    const trimmed = lookupInput.trim()
    if (!trimmed) {
      setLookupResult(null)
      return
    }

    if (mintedAssetId && trimmed === mintedAssetId && selectedProduct) {
      const passport = buildDynamicPassport(selectedProduct, mintedAssetId, activeAddress ?? undefined)
      setLookupResult({ product: selectedProduct, passport })
      return
    }

    const preset = findLookupPreset(trimmed)
    if (preset) {
      setLookupResult({
        product: preset.product,
        passport: {
          ...preset.passport,
          events: {
            ...preset.passport.events,
            currentHolder: hasClaimedPassport && activeAddress ? activeAddress : preset.passport.events.currentHolder,
          },
        },
      })
    } else {
      setLookupResult(null)
    }
  }

  const handleMintSuccess = (assetId: string) => {
    setMintedAssetId(assetId)
    setHasClaimedPassport(true)
    if (selectedProduct) {
      const passport = buildDynamicPassport(selectedProduct, assetId, activeAddress ?? undefined)
      setLookupResult({ product: selectedProduct, passport })
    }
  }

  const categories = Array.from(new Set(products.map(product => product.category)))
  const materials = Array.from(new Set(products.flatMap(product => product.materials)))
  const claims = Array.from(new Set(products.flatMap(product => product.verifiedClaims)))

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-amber-50/80 to-rose-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <a href="#top" className="flex items-center gap-2 text-lg font-black tracking-tight">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-amber-300 text-slate-900">✦</span>
            Étoile
          </a>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
            <a href="#how-it-works" className="hover:text-slate-900">
              How it works
            </a>
            <a href="#collections" className="hover:text-slate-900">
              Collections
            </a>
            <a href="#scan" className="hover:text-slate-900">
              Passport lookup
            </a>
            <a href="#brands" className="hover:text-slate-900">
              For brands
            </a>
            <a href="#admin" className="hover:text-slate-900">
              Admin
            </a>
            <a href="#faq" className="hover:text-slate-900">
              FAQ
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Algorand TestNet
            </span>
            <button
              onClick={() => setOpenWalletModal(true)}
              className="rounded-full border border-slate-900/10 bg-slate-900 px-4 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-700"
            >
              {activeAddress ? truncate(activeAddress) : 'Connect wallet'}
            </button>
          </div>
        </div>
      </header>

      <main id="top" className="mx-auto max-w-6xl space-y-24 px-4 py-12">
        <section className="relative overflow-hidden rounded-3xl border border-black/5 bg-white/70 shadow-xl">
          <div
            className="absolute inset-0 opacity-40"
            style={{ backgroundImage: `url(${hero})`, backgroundPosition: 'center', backgroundSize: 'cover' }}
          />
          <div className="relative grid gap-10 px-8 py-14 md:grid-cols-[1.1fr_0.9fr] md:gap-16">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-600">Pilot demo</p>
              <h1 className="mt-3 text-4xl font-extrabold leading-tight md:text-5xl">
                Blockchain product passports for fashion
              </h1>
              <p className="mt-6 text-lg text-slate-700 md:max-w-xl">
                Étoile stitches verifiable sustainability claims, ownership, and provenance into every garment via Algorand-powered digital product passports.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a className="btn btn-primary" href="#collections">
                  Explore collections
                </a>
                <a className="btn" href="#scan">
                  Scan a QR / Lookup a Passport
                </a>
                <button className="btn btn-outline" onClick={() => setOpenWalletModal(true)}>
                  {activeAddress ? 'Switch wallet' : 'Connect wallet'}
                </button>
              </div>
            </div>
            <div className="rounded-2xl border border-white/40 bg-white/80 p-6 shadow-lg backdrop-blur">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">Demo pilot status</h2>
              <dl className="mt-4 space-y-3 text-sm text-slate-700">
                <div className="flex items-start justify-between gap-4">
                  <dt className="font-medium text-slate-900">Passport supply</dt>
                  <dd>200 limited pieces</dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="font-medium text-slate-900">Latest claim</dt>
                  <dd>Living-wage audit uploaded Apr 2024</dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="font-medium text-slate-900">Wallets connected</dt>
                  <dd>{activeAddress ? '1 (you)' : 'Ready for demo'}</dd>
                </div>
              </dl>
              <a
                href="https://developer.algorand.org/docs/get-started/algorand-standard-assets/"
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700 hover:text-emerald-900"
              >
                Built on Algorand ASAs
              </a>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="space-y-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">How it works</p>
              <h2 className="mt-2 text-3xl font-bold md:text-4xl">Three steps to radical transparency</h2>
            </div>
            <a
              href="https://testnet.explorer.perawallet.app/"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-emerald-700 underline decoration-dotted underline-offset-4"
            >
              View on Pera Explorer
            </a>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {[{ title: 'Scan the QR', description: 'Each garment carries a dynamic code tied to its Algorand asset.' },
              { title: 'View the digital passport', description: 'See provenance, certifications, and impact metrics anchored to tamper-proof hashes.' },
              { title: 'Mint / claim ownership', description: 'Customers receive their Étoile Pass NFT to unlock resale & repair.' },
            ].map(step => (
              <div key={step.title} className="rounded-2xl border border-black/5 bg-white/80 p-6 shadow-sm backdrop-blur">
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="featured" className="space-y-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Featured drop</p>
              <h2 className="mt-2 text-3xl font-bold md:text-4xl">FW24 capsule passports</h2>
            </div>
            <p className="text-sm text-slate-600 md:max-w-sm">
              Every tile represents a verifiable Algorand Standard Asset with provenance, traceability, and sustainability evidence bundled into an Étoile Pass.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredDrops.map(drop => {
              const product = products.find(item => item.productId === drop.productId)
              return (
                <button
                  type="button"
                  key={drop.productId}
                  onClick={() => product && setSelectedProductId(product.productId)}
                  className="group relative overflow-hidden rounded-3xl border border-black/5 bg-white shadow-lg text-left"
                >
                  <div
                    className={`relative aspect-[4/5] w-full overflow-hidden ${drop.gradient ? `bg-gradient-to-br ${drop.gradient}` : ''}`}
                  >
                    {drop.image && (
                      <img
                        src={drop.image}
                        alt={product?.title ?? drop.productId}
                        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/50 via-black/10 to-transparent p-4 text-white">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/80">{drop.model}</p>
                        <p className="text-lg font-semibold">{product?.title}</p>
                      </div>
                      <span className="rounded-full bg-emerald-100/90 px-3 py-1 text-xs font-semibold text-emerald-800">
                        On-chain verified
                      </span>
                    </div>
                    <div className="pointer-events-none absolute inset-0 hidden items-center justify-center group-hover:flex">
                      <div className="rounded-xl border border-slate-900/10 bg-white/90 p-3 text-center text-xs font-medium text-slate-700">
                        Simulated QR preview
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-6 py-4 text-sm text-slate-600">
                    <span>Asset #{truncate(drop.assetId)}</span>
                    <span className="text-emerald-700">View passport →</span>
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6 rounded-3xl border border-black/5 bg-white/80 p-8 shadow">
            <h2 className="text-2xl font-bold">Why Digital Product Passports now?</h2>
            <ul className="space-y-4 text-sm text-slate-600">
              {socialProofBullets.map(item => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1 inline-flex h-2 w-2 flex-shrink-0 rounded-full bg-emerald-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <a
              href="https://environment.ec.europa.eu/strategy/ecodesign-sustainable-products_en"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold text-emerald-700"
            >
              Learn more →
            </a>
          </div>
          <div className="rounded-3xl border border-black/5 bg-white/80 p-8 shadow">
            <h3 className="text-xl font-semibold">Micro-FAQ</h3>
            <dl className="mt-4 space-y-4">
              {microFaqs.map(faq => (
                <div key={faq.question} className="rounded-2xl border border-slate-200 bg-white/90">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === faq.question ? null : faq.question)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold"
                  >
                    {faq.question}
                    <span>{openFaq === faq.question ? '−' : '+'}</span>
                  </button>
                  {openFaq === faq.question && (
                    <p className="border-t border-slate-200 px-4 py-3 text-sm text-slate-600">{faq.answer}</p>
                  )}
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section id="collections" className="space-y-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Collections</p>
              <h2 className="mt-2 text-3xl font-bold md:text-4xl">Browse by impact filters</h2>
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              <select
                className="rounded-full border border-slate-200 bg-white px-4 py-2"
                value={selectedCategory}
                onChange={event => setSelectedCategory(event.target.value)}
              >
                <option value="All">Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <select
                className="rounded-full border border-slate-200 bg-white px-4 py-2"
                value={selectedMaterial}
                onChange={event => setSelectedMaterial(event.target.value)}
              >
                <option value="All">Material</option>
                {materials.map(material => (
                  <option key={material} value={material}>
                    {material}
                  </option>
                ))}
              </select>
              <select
                className="rounded-full border border-slate-200 bg-white px-4 py-2"
                value={selectedImpact}
                onChange={event => setSelectedImpact(event.target.value)}
              >
                <option value="All">Impact range</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <select
                className="rounded-full border border-slate-200 bg-white px-4 py-2"
                value={selectedClaim}
                onChange={event => setSelectedClaim(event.target.value)}
              >
                <option value="All">Verified claims</option>
                {claims.map(claim => (
                  <option key={claim} value={claim}>
                    {claim}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCollections.map(product => (
              <article
                key={product.productId}
                className="flex flex-col overflow-hidden rounded-3xl border border-black/5 bg-white/80 shadow"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img src={product.images[0]} alt={product.title} className="h-full w-full object-cover" />
                  <span className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-700">
                    Passport preview
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-4 p-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{product.category}</p>
                    <h3 className="mt-1 text-xl font-semibold">{product.title}</h3>
                  </div>
                  <p className="text-sm text-slate-600">Materials: {product.materials.join(', ')}</p>
                  <div className="flex flex-wrap gap-2 text-xs text-emerald-700">
                    {product.verifiedClaims.map(claim => (
                      <span key={claim} className="rounded-full bg-emerald-100 px-3 py-1">
                        {claim}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto flex items-center justify-between text-sm font-semibold">
                    <span>{product.msrp ?? 'On request'}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedProductId(product.productId)}
                      className="text-emerald-700 hover:text-emerald-900"
                    >
                      View details →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="product" className="space-y-10">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="grid gap-8 rounded-3xl border border-black/5 bg-white/90 p-8 shadow">
              <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-6">
                  <div className="aspect-square overflow-hidden rounded-2xl border border-black/5">
                    <img src={selectedProduct.images[0]} alt={selectedProduct.title} className="h-full w-full object-cover" />
                  </div>
                  <QrGenerator defaultValue={`https://testnet.explorer.perawallet.app/asset/${selectedProduct.masterAssetId}`} label="Generate product QR" />
                </div>
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold">{selectedProduct.title}</h2>
                    <p className="mt-2 text-sm text-slate-600">{selectedProduct.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm">
                    <span className="rounded-full bg-white px-3 py-1 font-medium text-slate-700">Sizes XS–XL</span>
                    <span className="rounded-full bg-white px-3 py-1 font-medium text-slate-700">Colors: Aurora, Noir, Cloud</span>
                  </div>
                  <div className="grid gap-3">
                    <button
                      className={`btn btn-primary ${activeAddress ? '' : 'btn-disabled'}`}
                      onClick={() => setOpenNFTModal(true)}
                    >
                      Mint / Claim Étoile Pass
                    </button>
                    <button className="btn">Add to bag</button>
                    {mintedAssetId && (
                      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                        <p className="font-semibold">Passport minted!</p>
                        <p className="mt-1 break-all text-xs">
                          Asset ID: <a href={`https://testnet.explorer.perawallet.app/asset/${mintedAssetId}`} className="text-emerald-700 underline" target="_blank" rel="noreferrer">{mintedAssetId}</a>
                        </p>
                      </div>
                    )}
                  </div>
                  <dl className="space-y-3 rounded-2xl border border-slate-200 bg-white/90 p-5 text-sm text-slate-600">
                    <div className="flex items-center justify-between">
                      <dt className="font-semibold text-slate-900">Asset standard</dt>
                      <dd>ARC-3</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="font-semibold text-slate-900">Master Asset ID</dt>
                      <dd>{selectedProduct.masterAssetId}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="font-semibold text-slate-900">Viewers</dt>
                      <dd>
                        <a
                          href={`https://testnet.explorer.perawallet.app/asset/${selectedProduct.masterAssetId}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-700 hover:text-emerald-900"
                        >
                          Algorand Explorer
                        </a>
                        {' · '}
                        <a
                          href={`https://testnet.perawallet.app/assets/${selectedProduct.masterAssetId}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-700 hover:text-emerald-900"
                        >
                          View in Pera Wallet
                        </a>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="space-y-10">
                <section>
                  <div className="border-b border-slate-200 pb-4">
                    <h3 className="text-xl font-semibold">Passport</h3>
                  </div>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white/80 p-5">
                      <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Materials</h4>
                      <ul className="mt-3 space-y-2 text-sm text-slate-600">
                        {selectedProduct.materials.map(material => (
                          <li key={material}>{material}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white/80 p-5">
                      <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Factories & dates</h4>
                      <ul className="mt-3 space-y-2 text-sm text-slate-600">
                        {selectedProduct.traceability.slice(0, 2).map(step => (
                          <li key={step.step}>{step.org} — {step.country}</li>
                        ))}
                        <li>Asset minted: Feb 2024</li>
                        <li>Batch production: Mar 2024</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section>
                  <div className="border-b border-slate-200 pb-4">
                    <h3 className="text-xl font-semibold">Traceability</h3>
                  </div>
                  <TraceabilityTimeline steps={selectedProduct.traceability} />
                </section>

                <ImpactPanel impact={selectedProduct.impact} />
              </div>
            </div>
            <ProofPoints claims={selectedProduct.proofPoints} />
          </div>
        </section>

        <section id="scan" className="space-y-8">
          <div className="rounded-3xl border border-black/5 bg-white/80 p-8 shadow">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Passport lookup</p>
                <h2 className="mt-2 text-3xl font-bold">Scan or enter an Algorand asset ID</h2>
                <p className="mt-3 max-w-xl text-sm text-slate-600">
                  Works without a wallet. Connect to claim ownership or mint a secondary pass.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 text-sm">
                <input
                  value={lookupInput}
                  onChange={event => setLookupInput(event.target.value)}
                  placeholder="103451726"
                  className="w-56 rounded-full border border-slate-200 bg-white px-4 py-2"
                />
                <button className="btn btn-primary" onClick={handleLookup}>
                  Lookup passport
                </button>
              </div>
            </div>
            <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-3xl border border-slate-200 bg-white/70 p-6">
                {lookupResult ? (
                  <div className="space-y-6">
                    <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-4">
                        <img
                          src={lookupResult.product.images[0]}
                          alt={lookupResult.product.title}
                          className="h-16 w-16 rounded-xl object-cover"
                        />
                        <div>
                          <h3 className="text-xl font-semibold">{lookupResult.product.title}</h3>
                          <p className="text-sm text-slate-600">Asset #{lookupResult.passport.assetId}</p>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-1 text-sm font-semibold ${
                          ownerVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {ownerVerified ? 'Owner verified' : 'Not owned'}
                      </span>
                    </header>
                    <PassportSummaryCard
                      passport={lookupResult.passport}
                      product={lookupResult.product}
                      isOwner={ownerVerified}
                    />
                    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm text-slate-600">
                      <h4 className="text-sm font-semibold text-slate-900">Traceability snapshot</h4>
                      <ul className="mt-3 space-y-2">
                        {lookupResult.product.traceability.slice(0, 3).map(step => (
                          <li key={step.step}>
                            {step.step}: {step.org} ({step.country})
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs">
                        <div>
                          <p className="text-slate-500">CO₂e</p>
                          <p className="text-lg font-semibold text-slate-900">{lookupResult.product.impact.metrics[0].value} {lookupResult.product.impact.metrics[0].unit}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Water</p>
                          <p className="text-lg font-semibold text-slate-900">{lookupResult.product.impact.metrics[1].value} {lookupResult.product.impact.metrics[1].unit}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Energy</p>
                          <p className="text-lg font-semibold text-slate-900">{lookupResult.product.impact.metrics[2].value}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-sm text-slate-500">
                    <div className="h-16 w-16 rounded-2xl border border-dashed border-slate-300 bg-white/70" />
                    <p>Enter 103451726 to preview the Aurora Overcoat passport.</p>
                  </div>
                )}
              </div>
              <div className="space-y-4 rounded-3xl border border-slate-200 bg-white/70 p-6 text-sm text-slate-600">
                <h3 className="text-lg font-semibold text-slate-900">No wallet? No problem.</h3>
                <p>
                  Anyone can scan the QR at retail to view provenance, certifications, and ownership history. When a shopper connects Pera Wallet, we surface a claim button to mint their Étoile Pass.
                </p>
                <p>
                  Email the passport to yourself for later or install Pera Wallet to claim on mobile.
                </p>
                <div className="flex flex-wrap gap-3 text-sm">
                  <a href="mailto:?subject=Étoile%20Passport&body=https://etoile.demo/lookup" className="btn btn-outline">
                    Email me this passport
                  </a>
                  <a
                    className="btn"
                    href="https://perawallet.app/download"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Install Pera Wallet
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="brands" className="grid gap-10 md:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-black/5 bg-white/80 p-8 shadow">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">For brands</p>
            <h2 className="mt-2 text-3xl font-bold">Launch a passport-enabled collection</h2>
            <div className="mt-6 space-y-4 text-sm text-slate-600">
              <p>
                Étoile equips sustainability & innovation teams with tools to comply with ESPR, delight consumers, and gather insights from on-chain engagement.
              </p>
              <ul className="space-y-3">
                <li>• Upload product data and certifications once; mint assets in batches.</li>
                <li>• Auto-generate QR kits and NFC tags linked to each asset.</li>
                <li>• Track claims, resale, and repair activity through Algorand analytics dashboards.</li>
              </ul>
            </div>
            <a
              href="mailto:manal.humedin@undp.org"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-slate-700"
            >
              Request access
            </a>
          </div>
          <div className="rounded-3xl border border-black/5 bg-white/70 p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">Pilot playbook</h3>
            <ol className="mt-4 space-y-3 text-sm text-slate-600">
              <li className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                <strong>1. Create product passport</strong> — ingest PLM data & certifications.
              </li>
              <li className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                <strong>2. Mint master asset</strong> — deploy Algorand ASA with ARC-3 metadata.
              </li>
              <li className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                <strong>3. Generate QR kits</strong> — print-ready packs for factories & stores.
              </li>
              <li className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                <strong>4. Batch upload</strong> — track production lots and ownership.
              </li>
              <li className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                <strong>5. Measure impact</strong> — dashboards for claims, reuse, and resale.
              </li>
            </ol>
          </div>
        </section>

        <section id="admin" className="space-y-8">
          <div className="rounded-3xl border border-black/5 bg-white/80 p-8 shadow">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Brand console (POC)</p>
            <h2 className="mt-2 text-3xl font-bold">Operate your pilot in one place</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="space-y-4 rounded-2xl border border-slate-200 bg-white/90 p-5">
                <h3 className="text-lg font-semibold">Create product</h3>
                <p className="text-sm text-slate-600">
                  Upload PLM data, sustainability documents, and pricing. Save drafts before minting.
                </p>
                <button className="btn btn-outline">Open form</button>
              </div>
              <div className="space-y-4 rounded-2xl border border-slate-200 bg-white/90 p-5">
                <h3 className="text-lg font-semibold">Mint master asset</h3>
                <p className="text-sm text-slate-600">
                  One click deploys the Algorand ASA with ARC-3 metadata pre-filled from your product record.
                </p>
                <button className="btn btn-primary" onClick={() => setOpenTokenModal(true)}>
                  Mint asset
                </button>
              </div>
              <div className="space-y-4 rounded-2xl border border-slate-200 bg-white/90 p-5">
                <h3 className="text-lg font-semibold">Generate QR kits</h3>
                <p className="text-sm text-slate-600">
                  Export printable QR sheets or CSVs for factory scanning stations.
                </p>
                <button className="btn btn-outline" onClick={() => setOpenDemoModal(true)}>
                  Download pack
                </button>
              </div>
              <div className="space-y-4 rounded-2xl border border-slate-200 bg-white/90 p-5">
                <h3 className="text-lg font-semibold">Batch import</h3>
                <p className="text-sm text-slate-600">
                  Upload CSVs of traceability steps and impact metrics; we validate and anchor hashes on Algorand.
                </p>
                <button className="btn btn-outline">Upload CSV</button>
              </div>
              <div className="space-y-4 rounded-2xl border border-slate-200 bg-white/90 p-5">
                <h3 className="text-lg font-semibold">Publish toggle</h3>
                <p className="text-sm text-slate-600">
                  Control draft vs live status per product for staging vs retail environments.
                </p>
                <label className="flex items-center gap-3 text-sm">
                  <input type="checkbox" defaultChecked className="toggle toggle-success" />
                  <span>Published to pilot store</span>
                </label>
              </div>
              <div className="space-y-4 rounded-2xl border border-slate-200 bg-white/90 p-5">
                <h3 className="text-lg font-semibold">Analytics</h3>
                <p className="text-sm text-slate-600">
                  Track claims, resales, repairs, and sustainability engagements by tapping Algorand Indexer data.
                </p>
                <button className="btn btn-outline">View dashboard</button>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="space-y-8">
          <div className="rounded-3xl border border-black/5 bg-white/80 p-8 shadow">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">FAQ & compliance</p>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {complianceFaqs.map(card => (
                <div key={card.title} className="space-y-4 text-sm text-slate-600">
                  <h3 className="text-xl font-semibold text-slate-900">{card.title}</h3>
                  <p>{card.content}</p>
                  <a
                    href={card.linkHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center text-sm font-semibold text-emerald-700"
                  >
                    {card.linkLabel}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-black/5 bg-white/80">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <a href="#top" className="inline-flex items-center gap-2 text-lg font-black tracking-tight">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-amber-300 text-slate-900">✦</span>
              Étoile
            </a>
            <p className="text-sm text-slate-600">
              Mission: give every garment a trusted digital passport so conscious choices become the default.
            </p>
            <p className="text-xs text-slate-500">© {new Date().getFullYear()} Étoile. manal.humedin@undp.org</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-900">Quick links</h3>
              <ul className="space-y-2">
                {quickLinks.map(link => (
                  <li key={link.href}>
                    <a href={link.href} className="hover:text-slate-900">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-900">Connect</h3>
              <ul className="space-y-2">
                <li>
                  <a href="mailto:manal.humedin@undp.org" className="hover:text-slate-900">
                    Email us
                  </a>
                </li>
                <li>
                  <a href="#brands" className="hover:text-slate-900">
                    Partner with Étoile
                  </a>
                </li>
                <li>
                  <a href="#scan" className="hover:text-slate-900">
                    Verify a passport
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      <ConnectWallet openModal={openWalletModal} closeModal={() => setOpenWalletModal(false)} />
      <Transact openModal={openDemoModal} setModalState={setOpenDemoModal} />
      <NFTmint openModal={openNFTModal} setModalState={setOpenNFTModal} onMintSuccess={handleMintSuccess} />
      <Tokenmint openModal={openTokenModal} setModalState={setOpenTokenModal} />
    </div>
  )
}

export default Home
