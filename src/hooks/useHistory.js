import { useState, useEffect } from 'react'

const STORAGE_KEY = 'sugarscan_history'
const MAX_ITEMS = 50

export const useHistory = () => {
    const [history, setHistory] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
        } catch {
            return []
        }
    })

    const addEntry = (result) => {
        const entry = {
            id: Date.now(),
            scannedAt: new Date().toISOString(),
            date: new Date().toLocaleDateString('en-IN'),
            ...result,
        }
        setHistory(prev => {
            const updated = [entry, ...prev].slice(0, MAX_ITEMS)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
            return updated
        })
        return entry
    }

    const clearHistory = () => {
        localStorage.removeItem(STORAGE_KEY)
        setHistory([])
    }

    // Daily totals
    const todayStr = new Date().toLocaleDateString('en-IN')
    const todayEntries = history.filter(e => e.date === todayStr)
    const todayTotalG = todayEntries.reduce((s, e) => s + (e.sugar?.perServing?.grams || 0), 0)
    const todayTotalTsp = parseFloat((todayTotalG / 4.2).toFixed(2))
    const todayPct = parseFloat(((todayTotalG / 25) * 100).toFixed(1))

    return { history, addEntry, clearHistory, todayEntries, todayTotalG, todayTotalTsp, todayPct }
}