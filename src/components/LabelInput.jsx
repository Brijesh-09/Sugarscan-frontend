import React, { useState } from 'react'
import { FileText, ChevronRight, Loader2 } from 'lucide-react'

const EXAMPLES = [
    'Sugars 22g',
    'Total Sugars: 17.5g per 100g',
    'Energy 450kcal  Carbohydrates 68g  Sugars 22g  Protein 6g',
]

export default function LabelInput({ onSubmit, loading }) {
    const [labelText, setLabelText] = useState('')
    const [servings, setServings] = useState(1)

    const handleSubmit = (e) => {
        e?.preventDefault()
        if (!labelText.trim() || loading) return
        onSubmit(labelText.trim(), servings)
    }

    return (
        <div className="flex flex-col gap-5">

            {/* Info banner */}
            <div className="card p-4 border-sugar-accent/20 bg-sugar-accent/5 flex gap-3 items-start">
                <FileText size={16} className="text-sugar-accent shrink-0 mt-0.5" />
                <div>
                    <p className="font-body text-sm text-sugar-text">
                        Take a photo of the nutrition label, extract the text with your camera OCR, then paste it here.
                    </p>
                    <p className="font-body text-xs text-sugar-textDim mt-1">
                        Only the sugar value is needed — e.g. "Sugars 22g"
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <textarea
                    placeholder="Paste nutrition label text here..."
                    value={labelText}
                    onChange={e => setLabelText(e.target.value)}
                    disabled={loading}
                    rows={4}
                    className="w-full bg-sugar-card border border-sugar-border rounded-xl px-4 py-3
                     font-mono text-sm text-sugar-text placeholder-sugar-muted resize-none
                     focus:outline-none focus:border-sugar-accent transition-colors"
                />

                {/* Servings */}
                <div className="flex items-center justify-between card px-4 py-3">
                    <span className="font-body text-sm text-sugar-textDim">Servings consumed</span>
                    <div className="flex items-center gap-3">
                        <button type="button"
                            onClick={() => setServings(s => Math.max(0.5, parseFloat((s - 0.5).toFixed(1))))}
                            className="w-7 h-7 rounded-lg border border-sugar-border text-sugar-textDim hover:border-sugar-muted flex items-center justify-center font-mono transition-colors"
                        >−</button>
                        <span className="font-mono text-sm text-sugar-text w-8 text-center">{servings}</span>
                        <button type="button"
                            onClick={() => setServings(s => parseFloat((s + 0.5).toFixed(1)))}
                            className="w-7 h-7 rounded-lg border border-sugar-border text-sugar-textDim hover:border-sugar-muted flex items-center justify-center font-mono transition-colors"
                        >+</button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={!labelText.trim() || loading}
                    className="btn-primary flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    {loading
                        ? <><Loader2 size={16} className="animate-spin" /> Parsing...</>
                        : <><ChevronRight size={16} /> Parse label</>
                    }
                </button>
            </form>

            {/* Examples */}
            <div>
                <div className="text-xs font-mono text-sugar-textDim mb-2 uppercase tracking-widest">Try an example</div>
                <div className="flex flex-col gap-2">
                    {EXAMPLES.map((ex, i) => (
                        <button
                            key={i}
                            onClick={() => setLabelText(ex)}
                            className="text-left text-xs font-mono bg-sugar-card border border-sugar-border
                         text-sugar-muted rounded-lg px-3 py-2 hover:border-sugar-accent
                         hover:text-sugar-textDim transition-all duration-150 truncate"
                        >
                            {ex}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}