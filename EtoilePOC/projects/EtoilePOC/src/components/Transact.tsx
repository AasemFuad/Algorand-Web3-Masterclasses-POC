import { algo, AlgorandClient } from '@algorandfoundation/algokit-utils'
import { useWallet } from '@txnlab/use-wallet-react'
import { useSnackbar } from 'notistack'
import { useMemo, useState } from 'react'
import { getAlgodConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'

interface TransactInterface {
  openModal: boolean
  setModalState: (value: boolean) => void
}

const Transact = ({ openModal, setModalState }: TransactInterface) => {
  const [loading, setLoading] = useState(false)
  const [receiverAddress, setReceiverAddress] = useState('')

  const algodConfig = getAlgodConfigFromViteEnvironment()
  const algorand = useMemo(() => AlgorandClient.fromConfig({ algodConfig }), [algodConfig])

  const { enqueueSnackbar } = useSnackbar()
  const { transactionSigner, activeAddress } = useWallet()

  const handleSubmitAlgo = async () => {
    setLoading(true)

    if (!transactionSigner || !activeAddress) {
      enqueueSnackbar('Please connect your wallet first.', { variant: 'warning' })
      setLoading(false)
      return
    }

    try {
      enqueueSnackbar('Sending 1 ALGO on TestNet…', { variant: 'info' })
      const result = await algorand.send.payment({
        signer: transactionSigner,
        sender: activeAddress,
        receiver: receiverAddress,
        amount: algo(1),
      })
      enqueueSnackbar(`✅ Transaction sent: ${result.txIds[0]}`, { variant: 'success' })
      setReceiverAddress('')
    } catch {
      enqueueSnackbar('❌ Failed to send transaction', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <dialog id="transact_modal" className={`modal ${openModal ? 'modal-open' : ''}`}>
      <form method="dialog" className="modal-box bg-white shadow-card">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display text-lg text-etoile-ink">Send Test Payment</h3>
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
          Send <strong>1 ALGO</strong> to any Algorand TestNet address to demo payments.
        </p>

        <label className="form-control">
          <span className="label-text font-body">Receiver address</span>
          <input
            type="text"
            data-test-id="receiver-address"
            placeholder="Paste a TestNet address"
            className="input input-bordered w-full font-body"
            value={receiverAddress}
            onChange={(e) => setReceiverAddress(e.target.value)}
          />
        </label>

        <div className="modal-action">
          <button type="button" className="btn" onClick={() => setModalState(false)}>
            Close
          </button>
          <button
            type="button"
            data-test-id="send-algo"
            className={`btn bg-etoile-green text-white border-none ${receiverAddress.length === 58 ? '' : 'btn-disabled'}`}
            onClick={handleSubmitAlgo}
          >
            {loading ? <span className="loading loading-spinner" /> : 'Send 1 ALGO'}
          </button>
        </div>
      </form>
    </dialog>
  )
}

export default Transact
