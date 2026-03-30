import React, { useState, useRef } from 'react'
import { Scan, ChevronRight, Loader2 } from 'lucide-react'

// Quick-access list of pre-seeded Indian products
const QUICK_SCAN = [
    { label: 'Parle-G', barcode: '8901719110085' },
    { label: 'Maaza', barcode: '8901499000025' },
    { label: 'Kurkure', barcode: '8901063196804' },
    { label: "Haldiram's Bhujia", barcode: '8906003480101' },
    { label: 'Britannia Good Day', barcode: '8901058004506' },
    { label: 'Frooti', barcode: '8901063100046' },
    { label: "Lay's", barcode: '8901030693206' },
    { label: 'Amul Kool Koko', barcode: '8901207002878' },
]

export default function BarcodeInput({ onSubmit, loading }) {
    const [barcode, setBarcode] = useState('')
    const [servings, setServings] = useState(1)
    const [scanning, setScanning] = useState(false)
    const inputRef = useRef(null)

    const handleSubmit = (e) => {
        e?.preventDefault()
        if (!barcode.trim() || loading) return
        onSubmit(barcode.trim(), servings)
    }

    const handleQuickScan = (b) => {
        setBarcode(b)
        // simulate scanning flash
        setScanning(true)
        setTimeout(() => {
            setScanning(false)
            onSubmit(b, servings)
        }, 600)
    }

    return (
        <div className="flex flex-col gap-6">

            {/* Scanner box */}
            <div
                className={`relative rounded-2xl border-2 overflow-hidden transition-all duration-300 ${scanning ? 'border-sugar-accent' : 'border-sugar-border'
                    }`}
                style={{ height: 180, background: '#0a0a0a' }}
            >
                {/* Corner markers */}
                {['top-3 left-3', 'top-3 right-3', 'bottom-3 left-3', 'bottom-3 right-3'].map((pos, i) => (
                    <div key={i} className={`absolute ${pos} w-5 h-5`}>
                        <div className={`absolute ${i === 0 ? 'top-0 left-0 border-t-2 border-l-2' :
                                i === 1 ? 'top-0 right-0 border-t-2 border-r-2' :
                                    i === 2 ? 'bottom-0 left-0 border-b-2 border-l-2' :
                                        'bottom-0 right-0 border-b-2 border-r-2'
                            } w-full h-full rounded-sm border-sugar-accent`} />
                    </div>
                ))}

                {/* Scan line animation */}
                <div
                    className={`absolute left-4 right-4 h-px transition-opacity duration-300 ${scanning ? 'opacity-100' : 'opacity-60'}`}
                    style={{
                        background: `linear-gradient(90deg, transparent, #E8F54A, transparent)`,
                        animation: 'scan-line 2s ease-in-out infinite',
                        boxShadow: '0 0 8px #E8F54A',
                    }}
                />

                {/* Center icon / loading */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    {loading || scanning ? (
                        <>
                            <Loader2 size={28} className="text-sugar-accent animate-spin" />
                            <span className="font-mono text-xs text-sugar-accent">
                                {scanning ? 'Scanning...' : 'Looking up product...'}
                            </span>
                        </>
                    ) : (
                        <>
                            <Scan size={28} className="text-sugar-muted" />
                            <span className="font-mono text-xs text-sugar-textDim">Enter barcode below or pick a product</span>
                        </>
                    )}
                </div>
            </div>

            {/* Barcode input form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="flex gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        inputMode="numeric"
                        placeholder="Barcode number (e.g. 8901719110085)"
                        value={barcode}
                        onChange={e => setBarcode(e.target.value)}
                        disabled={loading}
                        className="flex-1 bg-sugar-card border border-sugar-border rounded-xl px-4 py-3
                       font-mono text-sm text-sugar-text placeholder-sugar-muted
                       focus:outline-none focus:border-sugar-accent transition-colors"
                    />
                    <button
                        type="submit"
                        disabled={!barcode.trim() || loading}
                        className="btn-primary flex items-center gap-1 shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <ChevronRight size={16} />}
                    </button>
                </div>

                {/* Servings control */}
                <div className="flex items-center justify-between card px-4 py-3">
                    <span className="font-body text-sm text-sugar-textDim">Servings consumed</span>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setServings(s => Math.max(0.5, parseFloat((s - 0.5).toFixed(1))))}
                            className="w-7 h-7 rounded-lg border border-sugar-border text-sugar-textDim hover:border-sugar-muted flex items-center justify-center font-mono transition-colors"
                        >−</button>
                        <span className="font-mono text-sm text-sugar-text w-8 text-center">{servings}</span>
                        <button
                            type="button"
                            onClick={() => setServings(s => parseFloat((s + 0.5).toFixed(1)))}
                            className="w-7 h-7 rounded-lg border border-sugar-border text-sugar-textDim hover:border-sugar-muted flex items-center justify-center font-mono transition-colors"
                        >+</button>
                    </div>
                </div>
            </form>

            {/* Quick scan chips */}
            <div>
                <div className="text-xs font-mono text-sugar-textDim mb-2 uppercase tracking-widest">Quick scan</div>
                <div className="flex flex-wrap gap-2">
                    {QUICK_SCAN.map(({ label, barcode: b }) => (
                        <button
                            key={b}
                            onClick={() => handleQuickScan(b)}
                            disabled={loading}
                            className="text-xs font-body bg-sugar-card border border-sugar-border text-sugar-textDim
                         rounded-lg px-3 py-1.5 hover:border-sugar-accent hover:text-sugar-accent
                         transition-all duration-150 disabled:opacity-40"
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}