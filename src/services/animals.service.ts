import api, { wrapGetResponse } from '../helpers/api'

export const generateRandomAnimal = async ({
    color,
    background,
}: {
    color?: string
    background?: string
}) => {
    return wrapGetResponse(
        await api.get('/animals/draw', {
            timeout: 10_000,
            params: {
                ...(color ? { color } : {}),
                ...(background ? { background } : {}),
            },
        })
    )
}
