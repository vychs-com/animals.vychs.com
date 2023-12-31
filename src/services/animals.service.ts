import api, { wrapGetResponse } from '../helpers/api'

export const generateRandomAnimal = async function ({
    animal,
    color,
    background,
}: {
    animal?: string
    color?: string
    background?: string
}) {
    return wrapGetResponse(
        await api.get('/animals/draw', {
            timeout: 10_000,
            params: arguments[0] || {},
        })
    )
}

export const getAnimalsList = async () => {
    return wrapGetResponse(await api.get('/animals'))
}

export const updateUsage = async () => {
    return wrapGetResponse(await api.get('/animals/usage'))
}
