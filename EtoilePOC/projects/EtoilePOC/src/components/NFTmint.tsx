// src/components/components/NFTmint.tsx
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { useWallet } from '@txnlab/use-wallet-react'
import { useSnackbar } from 'notistack'
import { sha512_256 } from 'js-sha512'
import { useState } from 'react'
import { getAlgodConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'

interface NFTMintProps {
  openModal: boolean
  setModalState: (value: boolean) => void
}

const NFTmint = ({ openModal, setModalState }: NFTMintProps) => {
  const [metadataUrl, setMetadataUrl] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [assetId, setAssetId] = useState<number | null>(null)

  const { enqueueSnackbar } = useSnackbar()
  const { transactionSigner, activeAddress } = useWallet()

  const algodConfig = getAlgodConfigFromViteEnvironment()
  const algorand = AlgorandClient.fromConfig({ algodConfig })

  const handleMint = async () => {
    if (!activeAddress || !transactionSigner) {
      enqueueSnackbar('Please connect your wallet first', { variant: 'warning' })
      return
    }
    if (!metadataUrl) {
      enqueueSnackbar('Please paste your IPFS/Pinata metadata URL', { variant: 'warning' })
      return
    }

    try {
      setLoading(true)
      setAssetId(null)
      enqueueSnackbar('Minting your MasterPass NFT…', { variant: 'info' })

      // sha512/256 hash of the metadata URL (32 bytes)
      const metadataHash = new Uint8Array(sha512_256.arrayBuffer(metadataUrl))

      const createNFTResult: any = await algorand.send.assetCreate({
        sender: activeAddress,
        signer: transactionSigner,
        total: 1n,
        decimals: 0,
        assetName: 'MasterPass Ticket',
        unitName: 'MTK', // ≤ 8 chars
        url: metadataUrl,
        metadataHash,
        defaultFrozen: false,
      })

      // Try a few common locations for the created asset id
      const createdId =
        createNFTResult?.assetId ??
        createNFTResult?.confirmation?.['asset-index'] ??
        createNFTResult?.confirmation?.assetIndex

      if (createdId) {
        setAssetId(createdId)
        enqueueSnackbar(`NFT minted! Asset ID: ${createdId}`, { variant: 'success' })
      } else {
        enqueueSnackbar('Minted, but could not read Asset ID from response', { variant: 'warning' })
      }
    } catch (e: any) {
      console.error(e)
      enqueueSnackbar(e?.message ?? 'Mint failed', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <dialog id="nft_mint_modal" className={`modal ${openModal ? 'modal-open' : ''} bg-slate-200`}>
      <form method="dialog" className="modal-box">
        <h3 className="font-bold text-lg">Mint MasterPass NFT</h3>
        <p className="text-sm mt-2">
          Paste your Pinata/IPFS metadata URL. We’ll hash it (sha512/256) and mint a single-supply NFT on Algorand TestNet.
        </p>

        <div className="mt-4">
          <input
            type="url"
            className="input input-bordered w-full"
            placeholder="ipfs://... or https://gateway.pinata.cloud/ipfs/..."
            value={metadataUrl}
            onChange={(e) => setMetadataUrl(e.target.value)}
          />
        </div>

        {assetId && (
          <div className="alert alert-success mt-4">
            <span>
              🎉 Minted! Asset ID: <b>{assetId}</b> —{' '}
              <a
                className="link"
                target="_blank"
                rel="noreferrer"
                href={`https://testnet.explorer.perawallet.app/asset/${assetId}`}
              >
                View in Explorer
              </a>
            </span>
          </div>
        )}

        <div className="modal-action">
          <button className="btn" onClick={() => setModalState(!openModal)} disabled={loading}>
            Close
          </button>
          <button className={`btn btn-primary ${loading ? 'loading' : ''}`} onClick={handleMint} disabled={loading}>
            {loading ? 'Minting…' : 'Mint NFT'}
          </button>
        </div>
      </form>
    </dialog>
  )
}

export default NFTmint
