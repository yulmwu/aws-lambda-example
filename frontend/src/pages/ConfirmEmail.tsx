import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../api/client'

export default function ConfirmEmail() {
    const [code, setCode] = useState('')
    const [params] = useSearchParams()
    const username = params.get('username') || ''

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await api.post('/auth/confirmEmail', { username, code })
        alert('인증 완료')
    }

    return (
        <form onSubmit={handleSubmit} className='p-4 max-w-md mx-auto'>
            <h2 className='text-xl mb-4'>이메일 인증</h2>
            <input placeholder='코드' value={code} onChange={(e) => setCode(e.target.value)} className='border p-2 w-full mb-2' />
            <button className='bg-purple-500 text-white px-4 py-2'>확인</button>
        </form>
    )
}
