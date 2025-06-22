import { createContext, useState, useContext, useEffect } from 'react'
import { api } from '../api/client'

type AuthContextType = {
    accessToken: string | null
    setAccessToken: (token: string | null) => void
    loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    // ✅ 새로고침 시 /refresh 요청
    useEffect(() => {
        const tryRefresh = async () => {
            try {
                const res = await api.post('/auth/refresh', {}, { withCredentials: true })
                setAccessToken(res.data.accessToken)
            } catch {
                setAccessToken(null)
            } finally {
                setLoading(false)
            }
        }
        tryRefresh()
    }, [])

    return <AuthContext.Provider value={{ accessToken, setAccessToken, loading }}>{!loading && children}</AuthContext.Provider>
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within AuthProvider')
    return context
}
