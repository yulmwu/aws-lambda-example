import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

type Post = { id: string; title: string }

export default function PostList() {
    const [posts, setPosts] = useState<Post[]>([])
    const { accessToken } = useAuth()

    useEffect(() => {
        api.get('/posts').then((res) => setPosts(res.data))
    }, [])

    return (
        <div className='p-4 max-w-xl mx-auto'>
            <h2 className='text-2xl font-bold mb-4'>게시글 목록</h2>
            {accessToken && (
                <Link to='/posts/new' className='text-blue-500'>
                    글쓰기
                </Link>
            )}
            <ul>
                {posts.map((post) => (
                    <li key={post.id} className='border-b py-2'>
                        <Link to={`/posts/${post.id}`}>{post.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}
