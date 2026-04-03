import React, { useState } from 'react'
import { Camera, Barcode, FileText } from 'lucide-react'
import BarcodeInput from '../components/BarcodeInput'
import LabelInput from '../components/LabelInput'
import ScanResult from '../components/ScanResult'
import DailySummary from '../components/DailySummary'
import { scanBarcode, scanLabelImage } from '../services/api'
import { useHistory } from '../hooks/useHistory'

export default function ScanPage() {
    const [mode, setMode] = useState('label') // label is now PRIMARY
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [error, setError] = useState(null)
    const { addEntry } = useHistory()

    // Label scan — receives a File from LabelInput camera capture
    const handleLabelSubmit = async (imageFile, servings) => {
        setLoading(true)
        setError(null)
        setResult(null)
        try {
            console.log('[ScanPage] submitting label image — size:', imageFile?.size, 'type:', imageFile?.type)
            if (!imageFile || imageFile.size === 0) {
                setError({ type: 'error', message: 'No image captured. Please try taking the photo again.' })
                return
            }
            const data = await scanLabelImage(imageFile, servings)
            setResult(data)
            addEntry(data)
        } catch (err) {
            console.error('[ScanPage] label scan error:', err)
            if (err.status === 422) {
                setError({
                    type: 'parse_fail',
                    message: 'AI could not read the nutrition values from this photo.',
                    hint: 'Try again with better lighting, or make sure the nutrition facts panel fills the frame.',
                })
            } else if (err.status === 400) {
                setError({
                    type: 'error',
                    message: err.error || 'Image could not be processed.',
                    hint: 'Please try taking the photo again.',
                })
            } else if (err.status === 429) {
                setError({
                    type: 'error',
                    message: 'AI quota exceeded. Please try again in a few minutes.',
                })
            } else {
                setError({
                    type: 'error',
                    message: err.error || err.message || 'Something went wrong.',
                    hint: err.hint || null,
                })
            }
        } finally {
            setLoading(false)
        }
    }

    // Barcode scan — secondary option
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
                    message: 'Product not found anywhere.',
                    hint: 'Switch to label scan — point your camera at the nutrition facts panel instead.',
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

    return (
        <div className="flex flex-col gap-5">
            <DailySummary />

            {result ? (
                <ScanResult result={result} onReset={handleReset} />
            ) : (
                <>
                    {/* Tabs — label first */}
                    <div className="flex gap-1 p-1 rounded-xl"
                        style={{ background: '#141414', border: '1px solid #222' }}>
                        <TabBtn
                            active={mode === 'label'}
                            onClick={() => { setMode('label'); setError(null) }}
                            icon={<Camera size={14} />}
                            isPrimary
                        >
                            Scan Label
                        </TabBtn>
                        <TabBtn
                            active={mode === 'barcode'}
                            onClick={() => { setMode('barcode'); setError(null) }}
                            icon={<Barcode size={14} />}
                        >
                            Barcode
                        </TabBtn>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="p-4 rounded-2xl animate-fade-in"
                            style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.3)' }}>
                            <p className="font-body text-sm" style={{ color: '#F87171' }}>{error.message}</p>
                            {error.hint && (
                                <p className="font-body text-xs mt-1" style={{ color: '#888' }}>{error.hint}</p>
                            )}
                            {error.type === 'not_found' && mode === 'barcode' && (
                                <button
                                    onClick={() => { setError(null); setMode('label') }}
                                    className="mt-3 flex items-center gap-1.5 font-mono text-xs"
                                    style={{ color: '#E8F54A' }}
                                >
                                    <Camera size={12} /> Switch to label scan
                                </button>
                            )}
                        </div>
                    )}

                    {mode === 'label'
                        ? <LabelInput onSubmit={handleLabelSubmit} loading={loading} />
                        : <BarcodeInput onSubmit={handleBarcodeSubmit} loading={loading} />
                    }
                </>
            )}
        </div>
    )
}

function TabBtn({ active, onClick, icon, children, isPrimary }) {
    return (
        <button
            onClick={onClick}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-body transition-all duration-200"
            style={{
                background: active ? '#E8F54A' : 'transparent',
                color: active ? '#0D0D0D' : '#888',
                fontWeight: active ? 500 : 400,
                position: 'relative',
            }}
        >
            {icon}
            {children}
            {isPrimary && !active && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
                    style={{ background: '#E8F54A' }} />
            )}
        </button>
    )
}