import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api/client'

export default function PostForm() {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const { id } = useParams()
    const navigate = useNavigate()

    const isEdit = !!id

    useEffect(() => {
        if (isEdit) {
            api.get(`/posts/${id}`).then((res) => {
                setTitle(res.data.title)
                setContent(res.data.content)
            })
        }
    }, [id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (isEdit) {
            await api.put(`/posts/${id}`, { title, content })
        } else {
            await api.post(`/posts`, { title, content })
        }
        navigate('/')
    }

    return (
        <form onSubmit={handleSubmit} className='p-4 max-w-xl mx-auto'>
            <h2 className='text-xl mb-4'>{isEdit ? '게시글 수정' : '게시글 작성'}</h2>
            <input placeholder='제목' value={title} onChange={(e) => setTitle(e.target.value)} className='border p-2 w-full mb-2' />
            <textarea placeholder='내용' value={content} onChange={(e) => setContent(e.target.value)} className='border p-2 w-full mb-2 h-40' />
            <button className='bg-blue-600 text-white px-4 py-2'>저장</button>
        </form>
    )
}
