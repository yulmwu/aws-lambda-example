import axios from 'axios'

const BASEURL = 'https://b5y3alv6e4.execute-api.ap-northeast-2.amazonaws.com'

export const api = axios.create({
    baseURL: BASEURL,
    withCredentials: true,
})

export const setupInterceptors = (getAccessToken: () => string | null, setAccessToken: (token: string | null) => void) => {
    api.interceptors.request.use((config) => {
        const token = getAccessToken()
        if (token) config.headers.Authorization = `Bearer ${token}`
        return config
    })

    api.interceptors.response.use(
        (res) => res,
        async (err) => {
            const original = err.config
            if (err.response?.status === 401 && !original._retry) {
                original._retry = true
                try {
                    const res = await axios.post(`${BASEURL}/refresh`, {}, { withCredentials: true })
                    const newToken = res.data.accessToken
                    setAccessToken(newToken)
                    original.headers.Authorization = `Bearer ${newToken}`
                    return axios(original)
                } catch {
                    setAccessToken(null)
                    window.location.href = '/login'
                }
            }
            return Promise.reject(err)
        }
    )
}
