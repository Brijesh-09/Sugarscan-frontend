import React from 'react'
import { TrendingUp, Trash2 } from 'lucide-react'
import { useHistory } from '../hooks/useHistory'

const WHO_LIMIT = 25

export default function DailySummary() {
    const { todayEntries, todayTotalG, todayTotalTsp, todayPct, clearHistory } = useHistory()

    const status = todayPct <= 40 ? 'low' : todayPct <= 100 ? 'moderate' : 'high'
    const barColor = { low: '#4ADE80', moderate: '#FACC15', high: '#F87171' }[status]
    const barWidth = `${Math.min(todayPct, 100)}%`

    if (todayEntries.length === 0) return null

    return (
        <div className="card p-4 animate-fade-in">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <TrendingUp size={14} className="text-sugar-textDim" />
                    <span className="font-mono text-xs text-sugar-textDim uppercase tracking-widest">Today</span>
                </div>
                <button onClick={clearHistory} className="text-sugar-muted hover:text-sugar-high transition-colors">
                    <Trash2 size={13} />
                </button>
            </div>

            {/* Bar */}
            <div className="h-2 bg-sugar-border rounded-full overflow-hidden mb-3">
                <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: barWidth, background: barColor }}
                />
            </div>

            <div className="flex items-end justify-between">
                <div>
                    <span className="font-display font-bold text-2xl" style={{ color: barColor }}>
                        {todayTotalTsp}
                    </span>
                    <span className="font-body text-sugar-textDim text-sm ml-1">tsp</span>
                    <span className="font-mono text-xs text-sugar-muted ml-2">({todayTotalG.toFixed(1)}g)</span>
                </div>
                <div className="text-right">
                    <div className="font-mono text-xs text-sugar-textDim">{todayPct}% of {WHO_LIMIT}g limit</div>
                    <div className="font-mono text-xs text-sugar-muted">{todayEntries.length} scan{todayEntries.length > 1 ? 's' : ''} today</div>
                </div>
            </div>
        </div>
    )
}