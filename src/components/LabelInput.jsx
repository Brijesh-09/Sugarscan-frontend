import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Camera, X, ChevronRight, Loader2, RefreshCw, ZoomIn, Upload, ImagePlus } from 'lucide-react'

export default function LabelInput({ onSubmit, loading }) {
    const [servings, setServings] = useState(1)
    const [cameraOpen, setCameraOpen] = useState(false)
    const [capturedImage, setCapturedImage] = useState(null)
    const [capturedFile, setCapturedFile] = useState(null)
    const [cameraError, setCameraError] = useState(null)
    const [stream, setStream] = useState(null)

    const videoRef = useRef(null)
    const canvasRef = useRef(null)
    const fileInputRef = useRef(null)

    // ── Camera ───────────────────────────────────────────────────────────────────
    const startCamera = async () => {
        setCameraError(null)
        setCapturedImage(null)
        setCapturedFile(null)
        setCameraOpen(true)
    }

    useEffect(() => {
        if (!cameraOpen) return
        let localStream = null

        const init = async () => {
            try {
                localStream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } },
                    audio: false,
                })
                if (videoRef.current) videoRef.current.srcObject = localStream
                setStream(localStream)
            } catch (err) {
                if (err.name === 'NotAllowedError') setCameraError('Camera permission denied. Please allow camera access.')
                else if (err.name === 'NotFoundError') setCameraError('No camera found on this device.')
                else setCameraError('Could not start camera: ' + err.message)
            }
        }

        init()
        return () => { if (localStream) localStream.getTracks().forEach(t => t.stop()) }
    }, [cameraOpen])

    const stopCamera = useCallback(() => {
        if (stream) stream.getTracks().forEach(t => t.stop())
        setStream(null)
        setCameraOpen(false)
    }, [stream])

    const capturePhoto = () => {
        const video = videoRef.current
        const canvas = canvasRef.current
        if (!video || !canvas) return
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        canvas.getContext('2d').drawImage(video, 0, 0)
        canvas.toBlob((blob) => {
            const file = new File([blob], 'label.jpg', { type: 'image/jpeg' })
            setCapturedFile(file)
            setCapturedImage(URL.createObjectURL(blob))
            stopCamera()
        }, 'image/jpeg', 0.92)
    }

    // ── Gallery upload ───────────────────────────────────────────────────────────
    const handleFileUpload = (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Accept images only
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file.')
            return
        }

        setCapturedFile(file)
        setCapturedImage(URL.createObjectURL(file))
        // Reset input so same file can be re-selected
        e.target.value = ''
    }

    // ── Retake / clear ───────────────────────────────────────────────────────────
    const retake = () => {
        if (capturedImage) URL.revokeObjectURL(capturedImage)
        setCapturedImage(null)
        setCapturedFile(null)
    }

    const handleSubmit = () => {
        if (!capturedFile || loading) return
        onSubmit(capturedFile, servings)
    }

    // ── Servings widget (shared across views) ────────────────────────────────────
    const ServingsControl = () => (
        <div className="flex items-center justify-between px-4 py-3"
            style={{ background: '#141414', border: '1px solid #222', borderRadius: '1rem' }}>
            <span className="font-body text-sm" style={{ color: '#888' }}>Servings consumed</span>
            <div className="flex items-center gap-3">
                {['-', '+'].map((sym, i) => (
                    <button key={sym} type="button"
                        onClick={() => setServings(s =>
                            i === 0 ? Math.max(0.5, parseFloat((s - 0.5).toFixed(1)))
                                : parseFloat((s + 0.5).toFixed(1))
                        )}
                        style={{
                            width: 28, height: 28, borderRadius: '0.5rem',
                            border: '1px solid #222', color: '#888',
                            background: 'transparent', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontFamily: 'DM Mono, monospace',
                        }}>{sym}</button>
                ))}
                <span className="font-mono text-sm w-8 text-center" style={{ color: '#EFEFEF' }}>{servings}</span>
            </div>
        </div>
    )

    // ── Camera view ──────────────────────────────────────────────────────────────
    if (cameraOpen) {
        return (
            <div className="flex flex-col gap-4">
                <div className="relative rounded-2xl overflow-hidden" style={{ background: '#000', aspectRatio: '4/3' }}>
                    <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />

                    {!cameraError && (
                        <>
                            <div className="absolute inset-0 pointer-events-none"
                                style={{ background: 'radial-gradient(ellipse 70% 45% at center, transparent 0%, rgba(0,0,0,0.55) 100%)' }} />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="border-2 rounded-xl"
                                    style={{ width: '80%', height: '55%', borderColor: '#E8F54A', boxShadow: '0 0 0 9999px rgba(0,0,0,0.45)' }} />
                            </div>
                            <div className="absolute bottom-20 left-0 right-0 flex justify-center">
                                <span className="font-mono text-xs px-3 py-1.5 rounded-lg"
                                    style={{ background: 'rgba(0,0,0,0.65)', color: '#E8F54A' }}>
                                    Align nutrition panel inside the box
                                </span>
                            </div>
                            <div className="absolute bottom-5 left-0 right-0 flex justify-center">
                                <button onClick={capturePhoto}
                                    className="w-16 h-16 rounded-full flex items-center justify-center border-4"
                                    style={{ background: '#E8F54A', borderColor: '#fff' }}>
                                    <Camera size={24} style={{ color: '#0D0D0D' }} />
                                </button>
                            </div>
                        </>
                    )}

                    {cameraError && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center"
                            style={{ background: 'rgba(0,0,0,0.85)' }}>
                            <p className="font-body text-sm" style={{ color: '#F87171' }}>{cameraError}</p>
                            <button onClick={stopCamera}
                                className="font-mono text-xs px-4 py-2 rounded-lg"
                                style={{ background: '#222', color: '#888' }}>
                                Go back
                            </button>
                        </div>
                    )}

                    <button onClick={stopCamera}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(0,0,0,0.6)', color: '#EFEFEF' }}>
                        <X size={16} />
                    </button>
                </div>
                <canvas ref={canvasRef} className="hidden" />
            </div>
        )
    }

    // ── Preview + confirm ────────────────────────────────────────────────────────
    if (capturedImage) {
        return (
            <div className="flex flex-col gap-4">
                <div className="relative rounded-2xl overflow-hidden" style={{ background: '#000' }}>
                    <img src={capturedImage} alt="Label" className="w-full object-contain max-h-72" />
                    <div className="absolute top-3 right-3 flex gap-2">
                        <button onClick={retake}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs"
                            style={{ background: 'rgba(0,0,0,0.75)', color: '#EFEFEF' }}>
                            <RefreshCw size={12} /> Change
                        </button>
                    </div>
                    <div className="absolute bottom-3 left-3">
                        <span className="font-mono text-xs px-2 py-1 rounded"
                            style={{ background: 'rgba(232,245,74,0.15)', color: '#E8F54A', border: '1px solid rgba(232,245,74,0.3)' }}>
                            Ready to analyse
                        </span>
                    </div>
                </div>

                <ServingsControl />

                <button onClick={handleSubmit} disabled={loading}
                    className="btn-primary flex items-center justify-center gap-2 w-full"
                    style={{ opacity: loading ? 0.6 : 1 }}>
                    {loading
                        ? <><Loader2 size={16} className="animate-spin" /> Reading label with AI...</>
                        : <><ChevronRight size={16} /> Analyse this label</>
                    }
                </button>
            </div>
        )
    }

    // ── Default: camera + upload options ─────────────────────────────────────────
    return (
        <div className="flex flex-col gap-4">

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
            />

            {/* Camera — primary, large */}
            <button
                onClick={startCamera}
                disabled={loading}
                className="relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 w-full transition-all duration-200"
                style={{ height: 200, background: 'linear-gradient(135deg, #0f0f0f 0%, #141414 100%)', borderColor: '#222', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#E8F54A'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#222'}
            >
                {/* Corner markers */}
                {[
                    { top: 14, left: 14, bt: true, bl: true },
                    { top: 14, right: 14, bt: true, br: true },
                    { bottom: 14, left: 14, bb: true, bl: true },
                    { bottom: 14, right: 14, bb: true, br: true },
                ].map((c, i) => (
                    <div key={i} className="absolute w-5 h-5" style={{
                        top: c.top, left: c.left, right: c.right, bottom: c.bottom,
                        borderTop: c.bt ? '2px solid #E8F54A' : 'none',
                        borderLeft: c.bl ? '2px solid #E8F54A' : 'none',
                        borderBottom: c.bb ? '2px solid #E8F54A' : 'none',
                        borderRight: c.br ? '2px solid #E8F54A' : 'none',
                        borderRadius: 3,
                    }} />
                ))}

                <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ background: 'rgba(232,245,74,0.1)', border: '1px solid rgba(232,245,74,0.25)' }}>
                    <Camera size={26} style={{ color: '#E8F54A' }} />
                </div>
                <div className="text-center px-6">
                    <p className="font-display font-semibold" style={{ color: '#EFEFEF' }}>
                        Open Camera
                    </p>
                    <p className="font-mono text-xs mt-1" style={{ color: '#555' }}>
                        Point at the nutrition facts panel
                    </p>
                </div>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
                <div className="flex-1 h-px" style={{ background: '#222' }} />
                <span className="font-mono text-xs" style={{ color: '#555' }}>or</span>
                <div className="flex-1 h-px" style={{ background: '#222' }} />
            </div>

            {/* Upload from gallery — secondary */}
            <button
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="flex items-center justify-center gap-3 w-full rounded-2xl border transition-all duration-200"
                style={{
                    height: 64,
                    background: '#141414',
                    borderColor: '#222',
                    cursor: 'pointer',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#555'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#222'}
            >
                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: '#1e1e1e', border: '1px solid #333' }}>
                    <ImagePlus size={16} style={{ color: '#888' }} />
                </div>
                <div className="text-left">
                    <p className="font-body text-sm" style={{ color: '#EFEFEF' }}>Upload from gallery</p>
                    <p className="font-mono text-xs" style={{ color: '#555' }}>JPG, PNG, HEIC supported</p>
                </div>
            </button>

            {/* Feature pills */}
            <div className="grid grid-cols-3 gap-2">
                {[
                    { label: 'Any format', sub: 'English, Hindi, regional' },
                    { label: 'All values', sub: 'Sugar, carbs, calories' },
                    { label: 'Hidden sugars', sub: 'From ingredients list' },
                ].map(({ label, sub }) => (
                    <div key={label} className="rounded-xl p-3 text-center"
                        style={{ background: '#141414', border: '1px solid #222' }}>
                        <p className="font-mono text-xs font-medium" style={{ color: '#EFEFEF' }}>{label}</p>
                        <p className="font-mono text-xs mt-0.5" style={{ color: '#555' }}>{sub}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}