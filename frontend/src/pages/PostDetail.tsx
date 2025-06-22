import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../auth/AuthContext'

export default function PostDetail() {
    const [post, setPost] = useState<{ title: string; content: string } | null>(null)
    const { id } = useParams()
    const navigate = useNavigate()
    const { accessToken } = useAuth()

    useEffect(() => {
        api.get(`/posts/${id}`).then((res) => setPost(res.data))
    }, [id])

    const handleDelete = async () => {
        await api.delete(`/posts/${id}`)
        navigate('/')
    }

    if (!post) return <div className='p-4'>로딩 중...</div>

    return (
        <div className='p-4 max-w-xl mx-auto'>
            <h2 className='text-2xl font-bold mb-2'>{post.title}</h2>
            <p className='mb-4 whitespace-pre-wrap'>{post.content}</p>
            {accessToken && (
                <div className='flex gap-2'>
                    <Link to={`/posts/edit/${id}`} className='text-blue-500'>
                        수정
                    </Link>
                    <button onClick={handleDelete} className='text-red-500'>
                        삭제
                    </button>
                </div>
            )}
        </div>
    )
}
