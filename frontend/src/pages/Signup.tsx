import { useState } from 'react'
import { api } from '../api/client'
import { useNavigate } from 'react-router-dom'

export default function Signup() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await api.post('/auth/signup', { username, password, email })
        navigate('/confirm-email?username=' + username)
    }

    return (
        <form onSubmit={handleSubmit} className='p-4 max-w-md mx-auto'>
            <h2 className='text-xl mb-4'>회원가입</h2>
            <input placeholder='아이디' value={username} onChange={(e) => setUsername(e.target.value)} className='border p-2 w-full mb-2' />
            <input
                type='password'
                placeholder='비밀번호'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='border p-2 w-full mb-2'
            />
            <input placeholder='이메일' value={email} onChange={(e) => setEmail(e.target.value)} className='border p-2 w-full mb-2' />
            <button className='bg-green-500 text-white px-4 py-2'>회원가입</button>
        </form>
    )
}
