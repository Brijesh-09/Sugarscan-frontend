import React, { useEffect, useState } from 'react'

const STATUS_COLORS = {
    low: '#4ADE80',
    moderate: '#FACC15',
    high: '#F87171',
}

export default function SugarMeter({ pct, status, teaspoons, grams, animate = true }) {
    const [displayed, setDisplayed] = useState(animate ? 0 : pct)
    const clampedPct = Math.min(pct, 150)

    useEffect(() => {
        if (!animate) return
        let start = null
        const duration = 900
        const from = 0
        const to = clampedPct

        const step = (ts) => {
            if (!start) start = ts
            const progress = Math.min((ts - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
            setDisplayed(from + (to - from) * eased)
            if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
    }, [pct])

    const color = STATUS_COLORS[status] || STATUS_COLORS.low
    const radius = 80
    const stroke = 8
    const normalizedRadius = radius - stroke / 2
    const circumference = 2 * Math.PI * normalizedRadius
    // Arc covers 270deg (from 135deg to 405deg)
    const arcRatio = (displayed / 100) * 0.75
    const strokeDash = circumference * Math.min(arcRatio, 0.75)

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="relative" style={{ width: radius * 2, height: radius * 2 }}>
                {/* Track */}
                <svg width={radius * 2} height={radius * 2} className="absolute inset-0">
                    <circle
                        cx={radius} cy={radius}
                        r={normalizedRadius}
                        fill="none"
                        stroke="#222222"
                        strokeWidth={stroke}
                        strokeDasharray={`${circumference * 0.75} ${circumference}`}
                        strokeDashoffset={0}
                        strokeLinecap="round"
                        transform={`rotate(135 ${radius} ${radius})`}
                    />
                    {/* Fill */}
                    <circle
                        cx={radius} cy={radius}
                        r={normalizedRadius}
                        fill="none"
                        stroke={color}
                        strokeWidth={stroke}
                        strokeDasharray={`${strokeDash} ${circumference}`}
                        strokeDashoffset={0}
                        strokeLinecap="round"
                        transform={`rotate(135 ${radius} ${radius})`}
                        style={{ transition: 'stroke 0.3s ease' }}
                    />
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-mono text-xs text-sugar-textDim">WHO limit</span>
                    <span className="font-display font-bold text-2xl" style={{ color }}>
                        {Math.round(displayed)}%
                    </span>
                    <span className="font-mono text-xs text-sugar-textDim">{teaspoons} tsp</span>
                </div>
            </div>
            <div className="text-center">
                <span className="font-mono text-sm" style={{ color }}>
                    {grams}g sugar
                </span>
                <span className="text-sugar-textDim font-body text-xs ml-1">per serving</span>
            </div>
        </div>
    )
}