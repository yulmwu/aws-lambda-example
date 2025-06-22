import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../auth/AuthContext'

export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const { setAccessToken } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const res = await api.post('/auth/login', { username, password })
        setAccessToken(res.data.accessToken)
        navigate('/')
    }

    return (
        <form onSubmit={handleSubmit} className='p-4 max-w-md mx-auto'>
            <h2 className='text-xl mb-4'>로그인</h2>
            <input placeholder='아이디' value={username} onChange={(e) => setUsername(e.target.value)} className='border p-2 w-full mb-2' />
            <input
                type='password'
                placeholder='비밀번호'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='border p-2 w-full mb-2'
            />
            <button className='bg-blue-500 text-white px-4 py-2'>로그인</button>
        </form>
    )
}
