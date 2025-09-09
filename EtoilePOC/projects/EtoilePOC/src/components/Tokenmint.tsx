import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { useWallet } from '@txnlab/use-wallet-react'
import { useSnackbar } from 'notistack'
import React, { useMemo, useState } from 'react'
import { getAlgodConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'

interface Props {
  openModal: boolean
  setModalState: (value: boolean) => void
}

const Tokenmint: React.FC<Props> = ({ openModal, setModalState }) => {
  const { activeAddress, transactionSigner } = useWallet()
  const { enqueueSnackbar } = useSnackbar()

  const algorand = useMemo(() => {
    const algodConfig = getAlgodConfigFromViteEnvironment()
    return AlgorandClient.fromConfig({ algodConfig })
  }, [])

  const [name, setName] = useState('Étoile Token')
  const [unit, setUnit] = useState('ETO')
  const [supply, setSupply] = useState<number>(1000)
  const [decimals, setDecimals] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [assetId, setAssetId] = useState<string | null>(null)

  const handleCreate = async () => {
    if (!activeAddress || !transactionSigner) {
      enqueueSnackbar('Please connect your wallet first', { variant: 'warning' })
      return
    }

    try {
      setLoading(true)
      enqueueSnackbar('Creating token…', { variant: 'info' })

      const result = await algorand.send.assetCreate({
        sender: activeAddress,
        signer: transactionSigner,
        total: BigInt(supply) * BigInt(10 ** decimals),
        decimals,
        assetName: name,
        unitName: unit,
        defaultFrozen: false,
      })

      const created = result.confirmation?.assetIndex
      if (created !== undefined) {
        setAssetId(created.toString())
        enqueueSnackbar(`Token created! Asset ID: ${created.toString()}`, { variant: 'success' })
      } else {
        enqueueSnackbar('Token created but asset ID not found in confirmation', { variant: 'warning' })
      }
    } catch (e) {
      console.error(e)
      enqueueSnackbar('Failed to create token', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <dialog id="token_mint_modal" className={`modal ${openModal ? 'modal-open' : ''} bg-slate-200`}>
      <form method="dialog" className="modal-box">
        <h3 className="font-bold text-lg">Create a fungible token</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          <input className="input input-bordered w-full" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="input input-bordered w-full" value={unit} onChange={(e) => setUnit(e.target.value)} />
          <input
            type="number"
            min={1}
            className="input input-bordered w-full"
            value={supply}
            onChange={(e) => setSupply(Number(e.target.value || 0))}
          />
          <input
            type="number"
            min={0}
            max={6}
            className="input input-bordered w-full"
            value={decimals}
            onChange={(e) => setDecimals(Number(e.target.value || 0))}
          />
        </div>

        {assetId && (
          <div className="alert alert-success mt-4 break-words">
            <span>
              ✅ Created! Asset:&nbsp;
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
          <button className={`btn btn-primary ${loading ? 'btn-disabled' : ''}`} onClick={handleCreate}>
            {loading ? <span className="loading loading-spinner" /> : 'Create Token'}
          </button>
        </div>
      </form>
    </dialog>
  )
}

export default Tokenmint
