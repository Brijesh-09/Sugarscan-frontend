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

// Accepts a File or Blob from the camera, converts to base64, sends to backend
export const scanLabelImage = async (imageFile, servings = 1) => {
    const base64 = await fileToBase64(imageFile)
    const mimeType = imageFile.type || 'image/jpeg'

    const res = await fetch(`${BASE}/scan/label`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, mimeType, servings }),
    })
    const data = await res.json()
    if (!res.ok) throw { status: res.status, ...data }
    return data
}

const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result.split(',')[1]) // strip data:...;base64,
        reader.onerror = reject
        reader.readAsDataURL(file)
    })