import api, { wrapGetResponse } from '../helpers/api'

export const generateRandomAnimal = async () => {
    return wrapGetResponse(
        await api.get('/animals/draw', {
            timeout: 10_000,
        })
    )
}
