import React, { useEffect, useState } from 'react'

interface QrGeneratorProps {
  defaultValue: string
  label?: string
}

const buildQrUrl = (value: string) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(value)}`

const QrGenerator: React.FC<QrGeneratorProps> = ({ defaultValue, label = 'Asset or URL' }) => {
  const [inputValue, setInputValue] = useState(defaultValue)
  const [qrUrl, setQrUrl] = useState<string>('')

  useEffect(() => {
    if (defaultValue) {
      setQrUrl(buildQrUrl(defaultValue))
    }
  }, [defaultValue])

  const refreshQr = () => {
    if (!inputValue.trim()) return
    setQrUrl(buildQrUrl(inputValue.trim()))
  }

  return (
    <div className="space-y-4 rounded-3xl border border-slate-200 bg-white/80 p-6">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-900" htmlFor="qr-generator-input">
          {label}
        </label>
        <input
          id="qr-generator-input"
          value={inputValue}
          onChange={event => setInputValue(event.target.value)}
          placeholder="algorand://asset/103451726"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm"
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button className="btn btn-primary" onClick={refreshQr}>
          Generate QR
        </button>
        <span className="text-xs text-slate-500">Mobile wallets scan this to open the passport instantly.</span>
      </div>
      {qrUrl ? (
        <div className="flex flex-col items-center gap-3">
          <img src={qrUrl} alt="QR code" className="h-40 w-40 rounded-xl border border-slate-200 bg-white p-2" />
          <a download href={qrUrl} className="btn btn-outline">
            Download QR PNG
          </a>
        </div>
      ) : (
        <div className="text-sm text-slate-500">Enter an Algorand asset ID or deep link to create a QR.</div>
      )}
    </div>
  )
}

export default QrGenerator
