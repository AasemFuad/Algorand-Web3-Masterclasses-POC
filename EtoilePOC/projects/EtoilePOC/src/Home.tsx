// src/components/Home.tsx
import React, { useState } from 'react'
import { useWallet } from '@txnlab/use-wallet-react'

import ConnectWallet from './components/ConnectWallet'
import Transact from './components/Transact'
import NFTmint from './components/NFTmint'

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const { activeAddress } = useWallet()

  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false)
  const [openDemoModal, setOpenDemoModal] = useState<boolean>(false)
  const [openNFTModal, setOpenNFTModal] = useState<boolean>(false)

  const toggleWalletModal = () => setOpenWalletModal((v) => !v)
  const toggleDemoModal = () => setOpenDemoModal((v) => !v)
  const toggleNFTModal = () => setOpenNFTModal((v) => !v)

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-300 via-teal-400 to-emerald-400 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl p-6 md:p-8 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Welcome to <span className="font-black">Étoile</span> ✨
        </h1>

        <p className="mt-4 text-slate-600">
          The blockchain-based fashion marketplace. Connect your wallet, explore collections,
          and verify provenance &amp; impact on Algorand TestNet.
        </p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <button className="btn btn-neutral" onClick={toggleWalletModal}>
            Connect Wallet
          </button>

          <a
            className="btn"
            href="#collections"
            onClick={(e) => {
              // placeholder anchor for the demo
              if (document?.getElementById('collections') == null) e.preventDefault()
            }}
          >
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
        </div>

        {/* Optional success banner – you can show this after minting if you later add a callback */}
        {/* <div className="mt-4 alert alert-success justify-center">
          <span>🎉 You&apos;ve claimed your Étoile pass!</span>
        </div> */}
      </div>

      {/* Modals */}
      <ConnectWallet openModal={openWalletModal} closeModal={toggleWalletModal} />
      <Transact openModal={openDemoModal} setModalState={setOpenDemoModal} />
      <NFTmint openModal={openNFTModal} setModalState={setOpenNFTModal} />
    </div>
  )
}

export default Home
