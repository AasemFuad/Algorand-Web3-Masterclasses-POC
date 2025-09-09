// src/Home.tsx
import hero from './assets/hero.jpg'
import React, { useState } from 'react'
import { useWallet } from '@txnlab/use-wallet-react'

// existing modals/components
import ConnectWallet from './components/ConnectWallet'
import Transact from './components/Transact'
import NFTmint from './components/NFTmint'
import Tokenmint from './components/Tokenmint'

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const { activeAddress } = useWallet()

  // modal state
  const [openWalletModal, setOpenWalletModal] = useState(false)
  const [openDemoModal, setOpenDemoModal] = useState(false)
  const [openNFTModal, setOpenNFTModal] = useState(false)
  const [openTokenModal, setOpenTokenModal] = useState(false)

  const toggleWalletModal = () => setOpenWalletModal(v => !v)
  const toggleDemoModal = () => setOpenDemoModal(v => !v)
  const toggleNFTModal = () => setOpenNFTModal(v => !v)
  const toggleTokenModal = () => setOpenTokenModal(v => !v)

  const truncate = (addr?: string) => (addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : '')

  return (
    // Soft cream/pink gradient to match your deck (no extra config needed)
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-amber-50 to-rose-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur bg-white/60 border-b border-black/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          <a href="#" className="font-black tracking-tight text-lg flex items-center gap-2">
            <span className="inline-block h-5 w-5 rounded-sm bg-amber-300" /> Étoile
          </a>
          <nav className="hidden sm:flex items-center gap-6 text-sm">
            <a href="#problem" className="hover:opacity-80">Problem</a>
            <a href="#solution" className="hover:opacity-80">Solution</a>
            <a href="#roadmap" className="hover:opacity-80">Roadmap</a>
            <a href="#collections" className="hover:opacity-80">Collections</a>
            <a href="#involved" className="hover:opacity-80">Get involved</a>
          </nav>
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-medium ${
              activeAddress ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
            }`}
            title={activeAddress || 'Not connected'}
          >
            {activeAddress ? `● ${truncate(activeAddress)}` : '○ Not connected'}
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 py-10 md:py-14 space-y-16">
        {/* Hero */}
        <section
          className="rounded-2xl overflow-hidden shadow-xl border border-black/5"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.92), rgba(255,255,255,0.92)), url(${hero})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="p-6 md:p-10 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Welcome to <span className="font-black">Étoile</span> ✨
            </h1>
            <p className="mt-4 text-slate-700 max-w-3xl mx-auto">
              The blockchain-based fashion marketplace. Connect your wallet, explore collections,
              and verify provenance &amp; impact on Algorand TestNet.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <button className="btn btn-neutral" onClick={toggleWalletModal}>
                Connect Wallet
              </button>

              <a className="btn" href="#collections">
                Explore Collections
              </a>

              <button
                className="btn btn-outline"
                onClick={() =>
                  window.open('https://testnet.explorer.perawallet.app/', '_blank', 'noopener,noreferrer')
                }
              >
                Verify on-chain
              </button>

              <button
                className={`btn ${activeAddress ? '' : 'btn-disabled'}`}
                onClick={toggleDemoModal}
                title={activeAddress ? '' : 'Connect your wallet first'}
              >
                Send Test Payment
              </button>

              <button
                className={`btn btn-primary ${activeAddress ? '' : 'btn-disabled'}`}
                onClick={toggleNFTModal}
                title={activeAddress ? '' : 'Connect your wallet first'}
              >
                Get Your Étoile Pass
              </button>

              {/* Re-added: Token mint demo */}
              <button
                className={`btn ${activeAddress ? '' : 'btn-disabled'}`}
                onClick={toggleTokenModal}
                title={activeAddress ? '' : 'Connect your wallet first'}
              >
                Create Sample Token
              </button>
            </div>
          </div>
        </section>

        {/* Collections (placeholder grid for the demo) */}
        <section id="collections" className="scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-bold">Featured collections (demo)</h2>
          <p className="mt-2 text-slate-600 max-w-3xl">
            Placeholder gallery to show the marketplace layout. In the MVP, each product links to a
            QR-backed, verifiable record on Algorand (provenance, labor, and impact).
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="aspect-[4/3] rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-black/5 shadow-sm"
              />
            ))}
          </div>
        </section>

        {/* Problem */}
        <section id="problem" className="scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-bold">Fashion has a trust problem.</h2>
          <ul className="mt-4 grid gap-3 md:grid-cols-3">
            <li className="rounded-xl bg-white p-4 shadow border border-black/5">
              <p className="font-medium">Greenwashing</p>
              <p className="text-sm text-slate-600 mt-1">Claims without proof.</p>
            </li>
            <li className="rounded-xl bg-white p-4 shadow border border-black/5">
              <p className="font-medium">No transparency</p>
              <p className="text-sm text-slate-600 mt-1">Origins &amp; labor conditions are opaque.</p>
            </li>
            <li className="rounded-xl bg-white p-4 shadow border border-black/5">
              <p className="font-medium">Environmental impact</p>
              <p className="text-sm text-slate-600 mt-1">Water, carbon and waste are hard to verify.</p>
            </li>
          </ul>
        </section>

        {/* Solution */}
        <section id="solution" className="scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-bold">Radical transparency, powered by blockchain.</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-xl bg-white p-4 shadow border border-black/5">
              <p className="font-medium">1) Scan the code</p>
              <p className="text-sm text-slate-600 mt-1">Each garment reveals its story.</p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow border border-black/5">
              <p className="font-medium">2) Trace the journey</p>
              <p className="text-sm text-slate-600 mt-1">Fabric → factory → logistics → store.</p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow border border-black/5">
              <p className="font-medium">3) Shop with confidence</p>
              <p className="text-sm text-slate-600 mt-1">Tamper-proof, verifiable data.</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-600">
            Outcomes: Trust • Authenticity • Sustainability • Brand advantage.
          </p>
        </section>

        {/* Roadmap */}
        <section id="roadmap" className="scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-bold">Roadmap</h2>
          <ol className="mt-4 grid gap-3 md:grid-cols-2">
            <li className="rounded-xl bg-white p-4 shadow border border-black/5">
              <span className="font-medium">Phase 1 — MVP:</span> Core platform + QR/traceability on Algorand TestNet.
            </li>
            <li className="rounded-xl bg-white p-4 shadow border border-black/5">
              <span className="font-medium">Phase 2 — Pilot:</span> First sustainable brand partners.
            </li>
            <li className="rounded-xl bg-white p-4 shadow border border-black/5">
              <span className="font-medium">Phase 3 — Expansion:</span> Marketplace for physical &amp; digital fashion.
            </li>
            <li className="rounded-xl bg-white p-4 shadow border border-black/5">
              <span className="font-medium">Phase 4 — Scale:</span> Global growth and richer experiences.
            </li>
          </ol>
        </section>

        {/* Get involved */}
        <section id="involved" className="scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-bold">Join the fashion revolution.</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-xl bg-white p-4 shadow border border-black/5">
              <p className="font-medium">Consumers</p>
              <p className="text-sm text-slate-600 mt-1">Get early access to our first drop.</p>
              <a className="btn btn-primary mt-3" href="mailto:hello@example.com">Get early access</a>
            </div>
            <div className="rounded-xl bg-white p-4 shadow border border-black/5">
              <p className="font-medium">Brands &amp; partners</p>
              <p className="text-sm text-slate-600 mt-1">Build trust with verifiable provenance.</p>
              <a className="btn mt-3" href="mailto:partners@example.com">Partner with us</a>
            </div>
            <div className="rounded-xl bg-white p-4 shadow border border-black/5">
              <p className="font-medium">Investors &amp; mentors</p>
              <p className="text-sm text-slate-600 mt-1">We’re seeking strategic guidance.</p>
              <a className="btn btn-outline mt-3" href="mailto:invest@example.com">Let’s connect</a>
            </div>
          </div>
        </section>
      </main>

      {/* Modals (logic unchanged) */}
      <ConnectWallet openModal={openWalletModal} closeModal={toggleWalletModal} />
      <Transact openModal={openDemoModal} setModalState={setOpenDemoModal} />
      <NFTmint openModal={openNFTModal} setModalState={setOpenNFTModal} />
      <Tokenmint openModal={openTokenModal} setModalState={setOpenTokenModal} />
    </div>
  )
}

export default Home
