import React from 'react'
import { AlertTriangle, CheckCircle, RotateCcw, Globe, Cpu, BadgeCheck, ScanLine } from 'lucide-react'
import SugarMeter from './SugarMeter'

const STATUS_LABEL = { low: 'Low sugar', moderate: 'Moderate sugar', high: 'High sugar' }

const STATUS_COLORS = {
    low: { bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.25)', text: '#4ADE80' },
    moderate: { bg: 'rgba(250,204,21,0.08)', border: 'rgba(250,204,21,0.25)', text: '#FACC15' },
    high: { bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.25)', text: '#F87171' },
}

const SEVERITY_COLOR = { low: '#4ADE80', medium: '#FACC15', high: '#F87171' }

// Source badge config
const SOURCE_BADGE = {
    verified: { label: 'Verified', color: '#E8F54A', icon: <BadgeCheck size={11} /> },
    openfoodfacts: { label: 'Open Food Facts', color: '#60A5FA', icon: <Globe size={11} /> },
    web_sourced: { label: 'Web sourced', color: '#A78BFA', icon: <Globe size={11} /> },
    label_scan: { label: 'Label scan', color: '#34D399', icon: <ScanLine size={11} /> },
    label_parse: { label: 'Label parse', color: '#34D399', icon: <ScanLine size={11} /> },
}

export default function ScanResult({ result, onReset }) {
    const { product, sugar, hiddenSugars, note, confidence } = result
    const { perServing, dailyLimitPct, dailyLimitStatus, per100g } = sugar
    const sc = STATUS_COLORS[dailyLimitStatus] || STATUS_COLORS.low
    const badge = SOURCE_BADGE[product.source] || SOURCE_BADGE.openfoodfacts

    return (
        <div className="flex flex-col gap-4 animate-slide-up">

            {/* Product header */}
            <div className="card p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-mono text-xs uppercase tracking-widest" style={{ color: '#555' }}>
                                {product.category}
                            </span>
                            {/* Source badge */}
                            <span
                                className="flex items-center gap-1 font-mono text-xs rounded px-2 py-0.5"
                                style={{
                                    background: badge.color + '15',
                                    color: badge.color,
                                    border: `1px solid ${badge.color}25`,
                                }}
                            >
                                {badge.icon}
                                {badge.label}
                            </span>
                        </div>
                        <h2 className="font-display font-bold text-xl leading-tight" style={{ color: '#EFEFEF' }}>
                            {product.name}
                        </h2>
                        <p className="font-body text-sm mt-0.5" style={{ color: '#888' }}>{product.brand}</p>
                    </div>
                    {/* Status badge */}
                    <div
                        className="shrink-0 rounded-xl px-3 py-1.5 font-mono text-xs border"
                        style={{ background: sc.bg, borderColor: sc.border, color: sc.text }}
                    >
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
                    <div className="flex-1 w-full grid grid-cols-2 gap-3">
                        <Stat label="Per 100g" value={`${per100g}g`} sub="sugar" />
                        <Stat label="This serving" value={`${perServing.teaspoons} tsp`} sub={`${perServing.servingSizeG}g serving`} />
                        <Stat label="Sugar grams" value={`${perServing.grams}g`} sub="per serving" />
                        <Stat label="Daily limit" value={`${dailyLimitPct}%`} sub="WHO 25g/day" highlight={dailyLimitStatus} />
                        {sugar.totalCarbs > 0 && (
                            <Stat label="Total carbs" value={`${sugar.totalCarbs}g`} sub="per 100g" />
                        )}
                        {sugar.calories > 0 && (
                            <Stat label="Calories" value={`${sugar.calories}`} sub="kcal per 100g" />
                        )}
                    </div>
                </div>
                <TeaspoonVisual teaspoons={perServing.teaspoons} status={dailyLimitStatus} />
            </div>

            {/* Hidden sugars */}
            {hiddenSugars && hiddenSugars.length > 0 && (
                <div className="card p-5" style={{ borderColor: 'rgba(248,113,113,0.3)', background: 'rgba(248,113,113,0.04)' }}>
                    <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle size={16} style={{ color: '#F87171' }} />
                        <span className="font-display font-semibold text-sm" style={{ color: '#F87171' }}>
                            {hiddenSugars.length} hidden sugar{hiddenSugars.length > 1 ? 's' : ''} found
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {hiddenSugars.map((h, i) => (
                            <div key={i}
                                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5"
                                style={{ background: '#141414', border: '1px solid #222' }}>
                                <span className="w-1.5 h-1.5 rounded-full shrink-0"
                                    style={{ background: SEVERITY_COLOR[h.severity] || '#888' }} />
                                <span className="font-body text-xs" style={{ color: '#EFEFEF' }}>{h.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* No hidden sugars */}
            {(!hiddenSugars || hiddenSugars.length === 0) && (
                <div className="card p-4" style={{ borderColor: 'rgba(74,222,128,0.25)', background: 'rgba(74,222,128,0.04)' }}>
                    <div className="flex items-center gap-2">
                        <CheckCircle size={16} style={{ color: '#4ADE80' }} />
                        <span className="font-body text-sm" style={{ color: '#4ADE80' }}>
                            No hidden sugars detected in ingredients
                        </span>
                    </div>
                </div>
            )}

            {/* Low confidence note */}
            {(note || confidence === 'low') && (
                <div className="card p-4" style={{ borderColor: 'rgba(250,204,21,0.2)', background: 'rgba(250,204,21,0.05)' }}>
                    <p className="font-body text-xs" style={{ color: '#888' }}>
                        {note || 'Low confidence read — please verify values on the pack.'}
                    </p>
                </div>
            )}

            {/* Web sourced note */}
            {product.source === 'web_sourced' && (
                <div className="card p-4" style={{ borderColor: 'rgba(167,139,250,0.2)', background: 'rgba(167,139,250,0.05)' }}>
                    <div className="flex items-center gap-2">
                        <Globe size={13} style={{ color: '#A78BFA' }} />
                        <p className="font-body text-xs" style={{ color: '#888' }}>
                            Nutrition data sourced from the web. Saved for future scans.
                        </p>
                    </div>
                </div>
            )}

            <button onClick={onReset} className="btn-ghost w-full flex items-center justify-center gap-2">
                <RotateCcw size={15} />
                Scan another product
            </button>
        </div>
    )
}

function Stat({ label, value, sub, highlight }) {
    const color = highlight
        ? { low: '#4ADE80', moderate: '#FACC15', high: '#F87171' }[highlight]
        : '#EFEFEF'
    return (
        <div className="rounded-xl p-3" style={{ background: '#0D0D0D', border: '1px solid #222' }}>
            <div className="font-mono text-xs mb-1" style={{ color: '#555' }}>{label}</div>
            <div className="font-display font-bold text-lg" style={{ color }}>{value}</div>
            <div className="font-body text-xs" style={{ color: '#555' }}>{sub}</div>
        </div>
    )
}

function TeaspoonVisual({ teaspoons, status }) {
    const COLOR = { low: '#4ADE80', moderate: '#FACC15', high: '#F87171' }[status] || '#4ADE80'
    const filled = Math.round(teaspoons)
    const total = Math.max(filled, 6)

    return (
        <div className="mt-5 pt-4" style={{ borderTop: '1px solid #222' }}>
            <div className="font-mono text-xs mb-2" style={{ color: '#555' }}>Sugar as teaspoons</div>
            <div className="flex flex-wrap gap-2">
                {Array.from({ length: total }).map((_, i) => (
                    <div key={i} className="w-6 h-6 rounded-md flex items-center justify-center"
                        style={{
                            background: i < filled ? COLOR + '20' : 'transparent',
                            border: `1px solid ${i < filled ? COLOR + '60' : '#333'}`,
                        }}>
                        {i < filled && <div className="w-2 h-2 rounded-full" style={{ background: COLOR }} />}
                    </div>
                ))}
                {teaspoons > total && (
                    <span className="font-mono text-xs self-center" style={{ color: COLOR }}>
                        +{(teaspoons - total).toFixed(1)}
                    </span>
                )}
            </div>
        </div>
    )
}