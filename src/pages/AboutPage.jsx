import React from 'react'
import { AlertTriangle, Zap, Eye, Heart } from 'lucide-react'

const SUGAR_FACTS = [
    { product: 'Maaza 250ml', tsp: 8.3, color: '#F87171' },
    { product: 'Frooti 250ml', tsp: 7.0, color: '#F87171' },
    { product: 'Hide & Seek (1 serve)', tsp: 2.0, color: '#FACC15' },
    { product: 'Parle-G (1 serve)', tsp: 1.7, color: '#FACC15' },
    { product: "Haldiram's Bhujia", tsp: 0.15, color: '#4ADE80' },
    { product: "Lay's Classic", tsp: 0.03, color: '#4ADE80' },
]

const WHO_LIMIT_TSP = 6 // ~25g

export default function AboutPage() {
    return (
        <div className="flex flex-col gap-6 pb-8 animate-slide-up">

            {/* Hero */}
            <div className="card p-5 border-sugar-accent/20 bg-sugar-accent/5">
                <h2 className="font-display font-bold text-xl text-sugar-text mb-2">
                    How much sugar are you really eating?
                </h2>
                <p className="font-body text-sm text-sugar-textDim leading-relaxed">
                    WHO recommends no more than <span className="text-sugar-accent font-mono">25g (6 tsp)</span> of free
                    sugar per day. Most Indians exceed this before lunch.
                </p>
            </div>

            {/* Visual comparison */}
            <div className="card p-5">
                <div className="flex items-center gap-2 mb-4">
                    <Zap size={14} className="text-sugar-accent" />
                    <span className="font-mono text-xs text-sugar-textDim uppercase tracking-widest">Sugar per product</span>
                </div>
                <div className="flex flex-col gap-3">
                    {SUGAR_FACTS.map(({ product, tsp, color }) => (
                        <div key={product}>
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-body text-sm text-sugar-textDim">{product}</span>
                                <span className="font-mono text-xs" style={{ color }}>{tsp} tsp</span>
                            </div>
                            <div className="h-1.5 bg-sugar-border rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all"
                                    style={{
                                        width: `${Math.min((tsp / WHO_LIMIT_TSP) * 100, 100)}%`,
                                        background: color,
                                    }}
                                />
                            </div>
                            {tsp > WHO_LIMIT_TSP && (
                                <div className="text-xs font-mono mt-0.5" style={{ color }}>
                                    {((tsp / WHO_LIMIT_TSP) * 100).toFixed(0)}% of your daily limit
                                </div>
                            )}
                        </div>
                    ))}
                    {/* WHO limit line label */}
                    <div className="flex items-center gap-2 pt-1 border-t border-sugar-border">
                        <div className="w-3 h-0.5 bg-sugar-accent" />
                        <span className="font-mono text-xs text-sugar-accent">WHO daily limit = 6 tsp</span>
                    </div>
                </div>
            </div>

            {/* Hidden sugars explained */}
            <div className="card p-5">
                <div className="flex items-center gap-2 mb-3">
                    <Eye size={14} className="text-sugar-moderate" />
                    <span className="font-mono text-xs text-sugar-textDim uppercase tracking-widest">Hidden sugars in India</span>
                </div>
                <p className="font-body text-sm text-sugar-textDim mb-3 leading-relaxed">
                    Indian labels hide sugar under names most people don't recognise. We flag all of them.
                </p>
                <div className="flex flex-wrap gap-2">
                    {['Jaggery', 'Khandsari', 'Shakkar', 'Mishri', 'Glucose syrup', 'Invert syrup', 'Dextrose', 'Corn syrup', 'Bura'].map(name => (
                        <span key={name} className="text-xs font-mono bg-sugar-moderate/10 border border-sugar-moderate/20 text-sugar-moderate rounded-lg px-2.5 py-1">
                            {name}
                        </span>
                    ))}
                </div>
            </div>

            {/* How it works */}
            <div className="card p-5">
                <div className="flex items-center gap-2 mb-4">
                    <Heart size={14} className="text-sugar-high" />
                    <span className="font-mono text-xs text-sugar-textDim uppercase tracking-widest">How SugarScan works</span>
                </div>
                <div className="flex flex-col gap-3">
                    {[
                        ['Scan barcode', 'We check 18 verified Indian products first, then Open Food Facts as a fallback.'],
                        ['Scan label', 'If the barcode fails, paste the nutrition label text — we parse the sugar value.'],
                        ['See the truth', 'Grams converted to teaspoons. Hidden sugars flagged. WHO limit shown clearly.'],
                    ].map(([title, desc], i) => (
                        <div key={i} className="flex gap-3">
                            <div className="w-6 h-6 rounded-full bg-sugar-accent/10 border border-sugar-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                                <span className="font-mono text-xs text-sugar-accent">{i + 1}</span>
                            </div>
                            <div>
                                <p className="font-display font-semibold text-sm text-sugar-text">{title}</p>
                                <p className="font-body text-xs text-sugar-textDim mt-0.5 leading-relaxed">{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <p className="font-mono text-xs text-sugar-muted text-center">
                SugarScan MVP · Data from Open Food Facts + verified Indian product labels
            </p>
        </div>
    )
}