import api, { wrapGetResponse } from '../helpers/api'

export const generateRandomAnimal = async () => {
    return wrapGetResponse(
        await api.post('/animals/draw', { format: 'base64' })
    )
}
