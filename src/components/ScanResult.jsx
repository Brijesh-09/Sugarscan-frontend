import React from 'react'
import { AlertTriangle, CheckCircle, ChevronRight, RotateCcw } from 'lucide-react'
import SugarMeter from './SugarMeter'

const STATUS_LABEL = {
    low: 'Low sugar',
    moderate: 'Moderate sugar',
    high: 'High sugar',
}

const STATUS_BG = {
    low: 'bg-sugar-low/10 border-sugar-low/30',
    moderate: 'bg-sugar-moderate/10 border-sugar-moderate/30',
    high: 'bg-sugar-high/10 border-sugar-high/30',
}

const SEVERITY_DOT = {
    low: 'bg-sugar-low',
    medium: 'bg-sugar-moderate',
    high: 'bg-sugar-high',
}

export default function ScanResult({ result, onReset }) {
    const { product, sugar, hiddenSugars, warning } = result
    const { perServing, dailyLimitPct, dailyLimitStatus, per100g } = sugar

    return (
        <div className="flex flex-col gap-4 animate-slide-up">

            {/* Product header */}
            <div className="card p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono uppercase tracking-widest text-sugar-textDim">
                                {product.category}
                            </span>
                            {product.source === 'verified' && (
                                <span className="text-xs font-mono bg-sugar-accent/10 text-sugar-accent border border-sugar-accent/20 rounded px-2 py-0.5">
                                    verified
                                </span>
                            )}
                        </div>
                        <h2 className="font-display font-bold text-xl text-sugar-text leading-tight">
                            {product.name}
                        </h2>
                        <p className="font-body text-sugar-textDim text-sm mt-0.5">{product.brand}</p>
                    </div>
                    {/* Status badge */}
                    <div className={`shrink-0 border rounded-xl px-3 py-1.5 text-xs font-mono ${STATUS_BG[dailyLimitStatus]}`}>
                        {STATUS_LABEL[dailyLimitStatus]}
                    </div>
                </div>
            </div>

            {/* Sugar meter + stats */}
            <div className="card p-6">
                <div className="flex flex-col sm:flex-row items-center gap-8">
                    <SugarMeter
                        pct={dailyLimitPct}
                        status={dailyLimitStatus}
                        teaspoons={perServing.teaspoons}
                        grams={perServing.grams}
                    />
                    {/* Stats grid */}
                    <div className="flex-1 w-full grid grid-cols-2 gap-3">
                        <Stat label="Per 100g" value={`${per100g}g`} sub="sugar" />
                        <Stat label="This serving" value={`${perServing.teaspoons} tsp`} sub={`${perServing.servingSizeG}g serving`} />
                        <Stat label="Sugar grams" value={`${perServing.grams}g`} sub="per serving" />
                        <Stat label="Daily limit" value={`${dailyLimitPct}%`} sub="WHO 25g/day" highlight={dailyLimitStatus} />
                    </div>
                </div>

                {/* Teaspoon visual */}
                <TeaspoonVisual teaspoons={perServing.teaspoons} status={dailyLimitStatus} />
            </div>

            {/* Hidden sugars */}
            {hiddenSugars && hiddenSugars.length > 0 && (
                <div className="card p-5 border-sugar-high/30 bg-sugar-high/5">
                    <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle size={16} className="text-sugar-high shrink-0" />
                        <span className="font-display font-semibold text-sugar-high text-sm">
                            {hiddenSugars.length} hidden sugar{hiddenSugars.length > 1 ? 's' : ''} found
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {hiddenSugars.map((h, i) => (
                            <div key={i} className="flex items-center gap-1.5 bg-sugar-card border border-sugar-border rounded-lg px-3 py-1.5">
                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${SEVERITY_DOT[h.severity] || 'bg-sugar-muted'}`} />
                                <span className="font-body text-xs text-sugar-text">{h.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* No hidden sugars */}
            {(!hiddenSugars || hiddenSugars.length === 0) && (
                <div className="card p-4 border-sugar-low/30 bg-sugar-low/5">
                    <div className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-sugar-low" />
                        <span className="font-body text-sm text-sugar-low">No hidden sugars detected in ingredients</span>
                    </div>
                </div>
            )}

            {/* Source note for label parse */}
            {product.source === 'label_parse' && (
                <div className="card p-4 border-sugar-moderate/20 bg-sugar-moderate/5">
                    <p className="font-body text-xs text-sugar-textDim">
                        Parsed from nutrition label text. Hidden sugar detection unavailable. Accuracy depends on OCR quality.
                    </p>
                </div>
            )}

            {/* Scan again */}
            <button onClick={onReset} className="btn-ghost w-full flex items-center justify-center gap-2">
                <RotateCcw size={15} />
                Scan another product
            </button>
        </div>
    )
}

function Stat({ label, value, sub, highlight }) {
    const valueColor = highlight
        ? { low: 'text-sugar-low', moderate: 'text-sugar-moderate', high: 'text-sugar-high' }[highlight]
        : 'text-sugar-text'

    return (
        <div className="bg-sugar-bg rounded-xl p-3 border border-sugar-border">
            <div className="text-xs font-mono text-sugar-textDim mb-1">{label}</div>
            <div className={`font-display font-bold text-lg ${valueColor}`}>{value}</div>
            <div className="text-xs font-body text-sugar-muted">{sub}</div>
        </div>
    )
}

function TeaspoonVisual({ teaspoons, status }) {
    const COLOR = { low: '#4ADE80', moderate: '#FACC15', high: '#F87171' }[status] || '#4ADE80'
    const filled = Math.round(teaspoons)
    const total = Math.max(filled, 6)

    return (
        <div className="mt-5 pt-4 border-t border-sugar-border">
            <div className="text-xs font-mono text-sugar-textDim mb-2">Sugar visualised as teaspoons</div>
            <div className="flex flex-wrap gap-2">
                {Array.from({ length: total }).map((_, i) => (
                    <div
                        key={i}
                        className="w-6 h-6 rounded-md border transition-all duration-300"
                        style={
                            i < filled
                                ? { background: COLOR + '25', borderColor: COLOR + '60' }
                                : { background: 'transparent', borderColor: '#333' }
                        }
                    >
                        {i < filled && (
                            <div className="w-full h-full flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full" style={{ background: COLOR }} />
                            </div>
                        )}
                    </div>
                ))}
                {teaspoons > total && (
                    <span className="text-xs font-mono self-center" style={{ color: COLOR }}>
                        +{(teaspoons - total).toFixed(1)}
                    </span>
                )}
            </div>
        </div>
    )
}