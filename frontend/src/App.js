import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Buffer } from 'buffer'
import Home from './components/Home'
import Register from './components/Register'
import Login from './components/Login'
import Header from './components/Header'
import Chats from './components/Chats'
import Profile from './components/Profile'

const App = () => {
  const [jwt, setJwt] = useState('')
  const [user, setUser] = useState({})
  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      setJwt(token)
      const loggedUser = JSON.parse(new Buffer.from(token.split('.')[1], 'base64').toString())
      setUser(loggedUser)
    }
  }, [])
  return (
    <Router>
      <div className='App'>
        {user?.id?.length > 0 &&
          <Header jwt={jwt} />
        }
        <Routes>
          <Route path='/' element={<Home />} />
          {user?.id?.length > 0 &&
            <Route path='/chats' element={<Chats />} />
          }
          {user?.id?.length > 0 &&
            <Route path='/profile' element={<Profile />} />
          }
          {!user?.id?.length > 0 &&
            <Route path='/register' element={<Register />} />
          }
          {!user?.id?.length > 0 &&
            <Route path='/login' element={<Login setJwt={setJwt} setUser={setUser} jwt={jwt} />} />
          }
        </Routes>
      </div>
    </Router>
  )
}

export default App