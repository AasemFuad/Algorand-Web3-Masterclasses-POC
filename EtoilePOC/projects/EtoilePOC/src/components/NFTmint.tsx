import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { useWallet } from '@txnlab/use-wallet-react'
import { useSnackbar } from 'notistack'
import { useMemo, useState } from 'react'
import { sha512_256 } from 'js-sha512'
import { getAlgodConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'

interface NFTmintProps {
  openModal: boolean
  setModalState: (value: boolean) => void
}

const NFTmint = ({ openModal, setModalState }: NFTmintProps) => {
  const [loading, setLoading] = useState(false)
  const [metadataUrl, setMetadataUrl] = useState('')
  const [assetId, setAssetId] = useState<number | null>(null)

  const algodConfig = getAlgodConfigFromViteEnvironment()
  const algorand = useMemo(() => AlgorandClient.fromConfig({ algodConfig }), [algodConfig])

  const { enqueueSnackbar } = useSnackbar()
  const { transactionSigner, activeAddress } = useWallet()

  const handleMint = async () => {
    setLoading(true)

    if (!transactionSigner || !activeAddress) {
      enqueueSnackbar('Please connect your wallet first.', { variant: 'warning' })
      setLoading(false)
      return
    }
    if (!metadataUrl.trim()) {
      enqueueSnackbar('Please paste your metadata URL (IPFS via Pinata).', { variant: 'warning' })
      setLoading(false)
      return
    }

    try {
      enqueueSnackbar('Minting your Étoile Pass NFT…', { variant: 'info' })

      // Use a browser-safe way to compute the 32-byte metadata hash
      const hashBytes = new Uint8Array(sha512_256.array(metadataUrl))

      const createNFTResult = await algorand.send.assetCreate({
        sender: activeAddress,
        signer: transactionSigner,
        total: 1n,
        decimals: 0,
        assetName: 'Étoile Pass',
        unitName: 'ETLP',
        url: metadataUrl,
        metadataHash: hashBytes,
        defaultFrozen: false,
      })

      enqueueSnackbar(`✅ NFT minted! Tx: ${createNFTResult.txIds[0]}`, { variant: 'success' })

      // The AlgorandClient returns the created asset id inside the first group result
      const created = createNFTResult.confirmations?.[0]?.assetIndex
      if (created) setAssetId(created)
      setMetadataUrl('')
    } catch {
      enqueueSnackbar('❌ Failed to mint NFT', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <dialog id="nftmint_modal" className={`modal ${openModal ? 'modal-open' : ''}`}>
      <form method="dialog" className="modal-box bg-white shadow-card">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display text-lg text-etoile-ink">Mint Étoile Pass (NFT)</h3>
          <button
            type="button"
            className="btn btn-sm btn-ghost"
            onClick={() => setModalState(false)}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <p className="text-sm text-etoile-ink/70 mb-4">
          Paste the <strong>IPFS metadata URL</strong> (e.g., from Pinata). We’ll mint a 1/1 NFT to your wallet.
        </p>

        <label className="form-control">
          <span className="label-text font-body">Metadata URL (ipfs://… or https://…)</span>
          <input
            type="text"
            placeholder="ipfs://bafy… or https://gateway.pinata.cloud/ipfs/…"
            className="input input-bordered w-full font-body"
            value={metadataUrl}
            onChange={(e) => setMetadataUrl(e.target.value)}
          />
        </label>

        {assetId && (
          <div className="alert alert-success mt-3">
            <span>
              🎉 Minted Asset ID: <code>{assetId}</code>
            </span>
          </div>
        )}

        <div className="modal-action">
          <button type="button" className="btn" onClick={() => setModalState(false)}>
            Close
          </button>
          <button
            type="button"
            className={`btn bg-etoile-pink text-white border-none ${metadataUrl ? '' : 'btn-disabled'}`}
            onClick={handleMint}
          >
            {loading ? <span className="loading loading-spinner" /> : 'Mint NFT'}
          </button>
        </div>
      </form>
    </dialog>
  )
}

export default NFTmint
