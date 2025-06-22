import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { api } from '../api/client'

export default function Header() {
    const { accessToken, setAccessToken } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        await api.post('/auth/logout')
        setAccessToken(null)
        navigate('/login')
    }

    return (
        <header className='p-4 flex justify-between bg-gray-800 text-white'>
            <Link to='/' className='font-bold'>
                게시판
            </Link>
            <div>
                {accessToken ? (
                    <button onClick={handleLogout} className='text-sm'>
                        로그아웃
                    </button>
                ) : (
                    <Link to='/login' className='text-sm'>
                        로그인
                    </Link>
                )}
            </div>
        </header>
    )
}
