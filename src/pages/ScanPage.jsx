import React, { useState } from 'react'
import { Barcode, FileText, ArrowLeft } from 'lucide-react'
import BarcodeInput from '../components/BarcodeInput'
import LabelInput from '../components/LabelInput'
import ScanResult from '../components/ScanResult'
import DailySummary from '../components/DailySummary'
import { scanBarcode, scanLabel } from '../services/api'
import { useHistory } from '../hooks/useHistory'

export default function ScanPage() {
    const [mode, setMode] = useState('barcode') // 'barcode' | 'label'
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [error, setError] = useState(null)
    const { addEntry } = useHistory()

    const handleBarcodeSubmit = async (barcode, servings) => {
        setLoading(true)
        setError(null)
        setResult(null)
        try {
            const data = await scanBarcode(barcode, servings)
            setResult(data)
            addEntry(data)
        } catch (err) {
            if (err.status === 404) {
                setError({
                    type: 'not_found',
                    message: 'Product not found in database or Open Food Facts.',
                    hint: 'Try scanning the nutrition label instead.',
                })
            } else {
                setError({ type: 'error', message: err.error || 'Something went wrong.' })
            }
        } finally {
            setLoading(false)
        }
    }

    const handleLabelSubmit = async (labelText, servings) => {
        setLoading(true)
        setError(null)
        setResult(null)
        try {
            const data = await scanLabel(labelText, servings)
            setResult(data)
            addEntry(data)
        } catch (err) {
            if (err.status === 422) {
                setError({
                    type: 'parse_fail',
                    message: 'Could not extract sugar value from that text.',
                    hint: err.hint || 'Make sure the text includes something like "Sugars 17g"',
                })
            } else {
                setError({ type: 'error', message: err.error || 'Something went wrong.' })
            }
        } finally {
            setLoading(false)
        }
    }

    const handleReset = () => {
        setResult(null)
        setError(null)
    }

    const switchToLabel = () => {
        setError(null)
        setMode('label')
    }

    return (
        <div className="flex flex-col gap-5">
            {/* Daily summary strip */}
            <DailySummary />

            {/* Result view */}
            {result ? (
                <ScanResult result={result} onReset={handleReset} />
            ) : (
                <>
                    {/* Mode tabs */}
                    <div className="flex gap-1 p-1 bg-sugar-card border border-sugar-border rounded-xl">
                        <TabBtn active={mode === 'barcode'} onClick={() => { setMode('barcode'); setError(null) }} icon={<Barcode size={14} />}>
                            Barcode
                        </TabBtn>
                        <TabBtn active={mode === 'label'} onClick={() => { setMode('label'); setError(null) }} icon={<FileText size={14} />}>
                            Scan label
                        </TabBtn>
                    </div>

                    {/* Error state */}
                    {error && (
                        <div className="card p-4 border-sugar-high/30 bg-sugar-high/5 animate-fade-in">
                            <p className="font-body text-sm text-sugar-high">{error.message}</p>
                            {error.hint && <p className="font-body text-xs text-sugar-textDim mt-1">{error.hint}</p>}
                            {error.type === 'not_found' && (
                                <button
                                    onClick={switchToLabel}
                                    className="mt-3 flex items-center gap-1.5 text-xs font-mono text-sugar-accent hover:underline"
                                >
                                    <FileText size={12} /> Switch to label scan
                                </button>
                            )}
                        </div>
                    )}

                    {/* Input */}
                    {mode === 'barcode'
                        ? <BarcodeInput onSubmit={handleBarcodeSubmit} loading={loading} />
                        : <LabelInput onSubmit={handleLabelSubmit} loading={loading} />
                    }
                </>
            )}
        </div>
    )
}

function TabBtn({ active, onClick, icon, children }) {
    return (
        <button
            onClick={onClick}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-body transition-all duration-200 ${active
                    ? 'bg-sugar-accent text-sugar-bg font-medium'
                    : 'text-sugar-textDim hover:text-sugar-text'
                }`}
        >
            {icon}
            {children}
        </button>
    )
}