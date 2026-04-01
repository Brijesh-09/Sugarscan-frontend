const BASE = `${import.meta.env.VITE_BACKEND_URI}/api`

export const scanBarcode = async (barcode, servings = 1) => {
    const res = await fetch(`${BASE}/scan/barcode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ barcode, servings }),
    })
    const data = await res.json()
    if (!res.ok) throw { status: res.status, ...data }
    return data
}

export const scanLabel = async (labelText, servings = 1) => {
    const res = await fetch(`${BASE}/scan/label`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ labelText, servings }),
    })
    const data = await res.json()
    if (!res.ok) throw { status: res.status, ...data }
    return data
}