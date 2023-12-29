export const downloadImage = (url: string) => {
    const downloadUrl = new URL(url)
    downloadUrl.searchParams.set('download', 'true')
    const a = document.createElement('a')
    a.href = downloadUrl.href
    a.click()
    a.remove()
}
