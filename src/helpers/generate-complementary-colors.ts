import convert from 'color-convert'
import randomColor from 'randomcolor'

export const generateComplementaryColors = (): {
    primaryColor: string
    complementaryColor: string
} => {
    const primaryColor = randomColor()

    const primaryHSL = convert.hex.hsl(primaryColor)

    const complementaryHue = (primaryHSL[0] + 180) % 360
    const complementaryColor =
        '#' + convert.hsl.hex([complementaryHue, primaryHSL[1], primaryHSL[2]])

    return { primaryColor, complementaryColor }
}
