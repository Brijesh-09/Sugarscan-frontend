import React from 'react'
import { Clock, AlertTriangle, CheckCircle, Trash2 } from 'lucide-react'
import { useHistory } from '../hooks/useHistory'

const STATUS_COLOR = { low: 'text-sugar-low', moderate: 'text-sugar-moderate', high: 'text-sugar-high' }
const STATUS_BG = {
    low: 'bg-sugar-low/10 border-sugar-low/20',
    moderate: 'bg-sugar-moderate/10 border-sugar-moderate/20',
    high: 'bg-sugar-high/10 border-sugar-high/20',
}

export default function HistoryPage() {
    const { history, clearHistory } = useHistory()

    if (history.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
                <Clock size={32} className="text-sugar-muted" />
                <p className="font-display font-semibold text-sugar-textDim">No scans yet</p>
                <p className="font-body text-sm text-sugar-muted">Scanned products will appear here</p>
            </div>
        )
    }

    // Group by date
    const grouped = history.reduce((acc, entry) => {
        if (!acc[entry.date]) acc[entry.date] = []
        acc[entry.date].push(entry)
        return acc
    }, {})

    return (
        <div className="flex flex-col gap-6 pb-8">
            <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-lg text-sugar-text">Scan history</h2>
                <button
                    onClick={clearHistory}
                    className="flex items-center gap-1.5 text-xs font-mono text-sugar-muted hover:text-sugar-high transition-colors"
                >
                    <Trash2 size={13} />
                    Clear all
                </button>
            </div>

            {Object.entries(grouped).map(([date, entries]) => {
                const dayTotal = entries.reduce((s, e) => s + (e.sugar?.perServing?.grams || 0), 0)
                const dayTsp = (dayTotal / 4.2).toFixed(1)

                return (
                    <div key={date} className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <span className="font-mono text-xs text-sugar-textDim uppercase tracking-widest">{date}</span>
                            <span className="font-mono text-xs text-sugar-muted">{dayTsp} tsp total</span>
                        </div>
                        {entries.map(entry => (
                            <HistoryCard key={entry.id} entry={entry} />
                        ))}
                    </div>
                )
            })}
        </div>
    )
}

function HistoryCard({ entry }) {
    const { product, sugar, hiddenSugars } = entry
    const status = sugar?.dailyLimitStatus || 'low'
    const time = new Date(entry.scannedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })

    return (
        <div className="card p-4 flex items-center gap-4">
            {/* Status indicator */}
            <div className={`w-1 self-stretch rounded-full ${STATUS_BG[status].split(' ')[0].replace('bg-', 'bg-').replace('/10', '/60')}`}
                style={{
                    background: status === 'low' ? '#4ADE8040' : status === 'moderate' ? '#FACC1540' : '#F8717140'
                }}
            />
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <p className="font-display font-semibold text-sm text-sugar-text truncate">{product?.name || 'Unknown'}</p>
                        <p className="font-body text-xs text-sugar-textDim">{product?.brand}</p>
                    </div>
                    <div className="text-right shrink-0">
                        <p className={`font-mono text-sm font-bold ${STATUS_COLOR[status]}`}>
                            {sugar?.perServing?.teaspoons} tsp
                        </p>
                        <p className="font-mono text-xs text-sugar-muted">{time}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 mt-1.5">
                    <span className="font-mono text-xs text-sugar-muted">{sugar?.perServing?.grams}g sugar</span>
                    <span className="font-mono text-xs text-sugar-muted">{sugar?.dailyLimitPct}% daily</span>
                    {hiddenSugars?.length > 0 ? (
                        <span className="flex items-center gap-0.5 text-xs font-mono text-sugar-high">
                            <AlertTriangle size={10} /> {hiddenSugars.length} hidden
                        </span>
                    ) : (
                        <span className="flex items-center gap-0.5 text-xs font-mono text-sugar-low">
                            <CheckCircle size={10} /> clean
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}