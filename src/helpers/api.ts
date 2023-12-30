import axios, { AxiosResponse } from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 5000,
    withCredentials: true,
})

const wrapGetResponse = (response: AxiosResponse) => {
    if (!response.data || !response.data.data || response.status !== 200)
        return null

    return {
        status: response.status,
        result: response.data.data,
    }
}

const wrapPostResponse = (response: AxiosResponse) => {
    if (response.status !== 200) return null

    return {
        status: response.status,
        ...(response.data?.data ? { result: response.data.data } : {}),
    }
}

export { wrapGetResponse, wrapPostResponse }
export default api
