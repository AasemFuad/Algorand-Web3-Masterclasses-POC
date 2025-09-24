import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { useWallet } from '@txnlab/use-wallet-react'
import { useSnackbar } from 'notistack'
import React, { useMemo, useState } from 'react'
import { sha512_256 } from 'js-sha512'
import { getAlgodConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'

interface Props {
  openModal: boolean
  setModalState: (value: boolean) => void
  onMintSuccess?: (assetId: string) => void
}

const NFTmint: React.FC<Props> = ({ openModal, setModalState, onMintSuccess }) => {
  const { activeAddress, transactionSigner } = useWallet()
  const { enqueueSnackbar } = useSnackbar()

  const algorand = useMemo(() => {
    const algodConfig = getAlgodConfigFromViteEnvironment()
    return AlgorandClient.fromConfig({ algodConfig })
  }, [])

  const [metadataUrl, setMetadataUrl] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [assetId, setAssetId] = useState<string | null>(null)

  const handleMint = async () => {
    if (!activeAddress || !transactionSigner) {
      enqueueSnackbar('Please connect your wallet first', { variant: 'warning' })
      return
    }
    if (!metadataUrl.trim()) {
      enqueueSnackbar('Please paste your metadata URL (IPFS / Pinata)', { variant: 'warning' })
      return
    }

    try {
      setLoading(true)
      enqueueSnackbar('Minting NFT…', { variant: 'info' })

      const hashBytes = new Uint8Array(sha512_256.array(metadataUrl))

      const result = await algorand.send.assetCreate({
        sender: activeAddress,
        signer: transactionSigner,
        total: 1n,
        decimals: 0,
        assetName: 'Étoile Pass',
        unitName: 'ETOILE',
        url: metadataUrl,
        metadataHash: hashBytes,
        defaultFrozen: false,
      })

      const created = result.confirmation?.assetIndex
      if (created !== undefined) {
        const createdId = created.toString()
        setAssetId(createdId)
        onMintSuccess?.(createdId)
        enqueueSnackbar(`NFT minted! Asset ID: ${createdId}`, { variant: 'success' })
      } else {
        enqueueSnackbar('Mint succeeded but asset ID not found in confirmation', { variant: 'warning' })
      }
    } catch (err) {
      console.error(err)
      enqueueSnackbar('Failed to mint NFT', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <dialog id="nft_mint_modal" className={`modal ${openModal ? 'modal-open' : ''} bg-slate-200`}>
      <form method="dialog" className="modal-box">
        <h3 className="font-bold text-lg">Mint your Étoile Pass (NFT)</h3>
        <p className="mb-4 text-sm text-slate-600">Paste the metadata URL you uploaded to IPFS (Pinata).</p>

        <input
          type="url"
          placeholder="ipfs://…  or  https://gateway.pinata.cloud/ipfs/…"
          className="input input-bordered w-full"
          value={metadataUrl}
          onChange={event => setMetadataUrl(event.target.value)}
        />

        {assetId && (
          <div className="alert alert-success mt-4 break-words">
            <span>
              ✅ Minted! Asset:&nbsp;
              <a
                className="link"
                href={`https://testnet.explorer.perawallet.app/asset/${assetId}`}
                target="_blank"
                rel="noreferrer"
              >
                {assetId}
              </a>
            </span>
          </div>
        )}

        <div className="modal-action">
          <button className="btn" onClick={() => setModalState(false)}>
            Close
          </button>
          <button className={`btn btn-primary ${loading ? 'btn-disabled' : ''}`} onClick={handleMint}>
            {loading ? <span className="loading loading-spinner" /> : 'Mint NFT'}
          </button>
        </div>
      </form>
    </dialog>
  )
}

export default NFTmint
