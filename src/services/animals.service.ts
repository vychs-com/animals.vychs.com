import api, { wrapGetResponse } from '../helpers/api'

export const generateRandomAnimal = async ({
    animal,
    color,
    background,
}: {
    animal?: string
    color?: string
    background?: string
}) => {
    return wrapGetResponse(
        await api.get('/animals/draw', {
            timeout: 10_000,
            params: {
                ...(animal ? { animal } : {}),
                ...(color ? { color } : {}),
                ...(background ? { background } : {}),
            },
        })
    )
}

export const getSpeciesList = async () => {
    return wrapGetResponse(await api.get('/animals'))
}
