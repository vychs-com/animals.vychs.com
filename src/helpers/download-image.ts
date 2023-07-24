const MIMETYPE = 'image/png'
const PREFIX = `data:${MIMETYPE};base64,`

export const downloadImage = (base64: string, fileName = 'photo.png') => {
    const a = document.createElement('a')
    a.href = PREFIX + base64
    a.download = fileName
    a.click()
    a.remove()
}
