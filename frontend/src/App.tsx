import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './auth/AuthContext'
import { setupInterceptors } from './api/client'
import Header from './components/Header'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ConfirmEmail from './pages/ConfirmEmail'
import PostList from './pages/PostList'
import PostDetail from './pages/PostDetail'
import PostForm from './pages/PostForm'

function RouterSetup() {
    const { accessToken, setAccessToken } = useAuth()
    setupInterceptors(() => accessToken, setAccessToken)

    return (
        <>
            <Header />
            <Routes>
                <Route path='/' element={<PostList />} />
                <Route path='/posts/new' element={<PostForm />} />
                <Route path='/posts/edit/:id' element={<PostForm />} />
                <Route path='/posts/:id' element={<PostDetail />} />
                <Route path='/login' element={<Login />} />
                <Route path='/signup' element={<Signup />} />
                <Route path='/confirm-email' element={<ConfirmEmail />} />
            </Routes>
        </>
    )
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <RouterSetup />
            </BrowserRouter>
        </AuthProvider>
    )
}
