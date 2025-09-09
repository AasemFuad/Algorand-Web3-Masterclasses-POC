import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { useWallet } from '@txnlab/use-wallet-react'
import { useSnackbar } from 'notistack'
import { useMemo, useState } from 'react'
import { getAlgodConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'

interface TokenmintProps {
  openModal: boolean
  setModalState: (value: boolean) => void
}

const Tokenmint = ({ openModal, setModalState }: TokenmintProps) => {
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('Étoile Token')
  const [unit, setUnit] = useState('ETL')
  const [supply, setSupply] = useState<number>(1000)
  const [decimals, setDecimals] = useState<number>(0)
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

    try {
      enqueueSnackbar('Creating your token on Algorand TestNet…', { variant: 'info' })

      const result = await algorand.send.assetCreate({
        sender: activeAddress,
        signer: transactionSigner,
        total: BigInt(supply),
        decimals,
        assetName: name,
        unitName: unit,
        defaultFrozen: false,
      })

      enqueueSnackbar(`✅ Token created! Tx: ${result.txIds[0]}`, { variant: 'success' })
      const created = result.confirmations?.[0]?.assetIndex
      if (created) setAssetId(created)
    } catch {
      enqueueSnackbar('❌ Failed to create token', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <dialog id="tokenmint_modal" className={`modal ${openModal ? 'modal-open' : ''}`}>
      <form method="dialog" className="modal-box bg-white shadow-card">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display text-lg text-etoile-ink">Create a Fungible Token</h3>
          <button
            type="button"
            className="btn btn-sm btn-ghost"
            onClick={() => setModalState(false)}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <label className="form-control">
            <span className="label-text font-body">Asset name</span>
            <input
              type="text"
              className="input input-bordered w-full font-body"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <label className="form-control">
            <span className="label-text font-body">Unit name</span>
            <input
              type="text"
              className="input input-bordered w-full font-body"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            />
          </label>

          <label className="form-control">
            <span className="label-text font-body">Total supply</span>
            <input
              type="number"
              min={1}
              className="input input-bordered w-full font-body"
              value={supply}
              onChange={(e) => setSupply(Number(e.target.value))}
            />
          </label>

          <label className="form-control">
            <span className="label-text font-body">Decimals</span>
            <input
              type="number"
              min={0}
              max={6}
              className="input input-bordered w-full font-body"
              value={decimals}
              onChange={(e) => setDecimals(Number(e.target.value))}
            />
          </label>
        </div>

        {assetId && (
          <div className="alert alert-success mt-3">
            <span>
              🎉 Created Asset ID: <code>{assetId}</code>
            </span>
          </div>
        )}

        <div className="modal-action">
          <button type="button" className="btn" onClick={() => setModalState(false)}>
            Close
          </button>
          <button
            type="button"
            className="btn bg-etoile-green text-white border-none"
            onClick={handleMint}
          >
            {loading ? <span className="loading loading-spinner" /> : 'Create Token'}
          </button>
        </div>
      </form>
    </dialog>
  )
}

export default Tokenmint
