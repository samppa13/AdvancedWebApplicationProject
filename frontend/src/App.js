import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Register from './components/Register'
import Login from './components/Login'

const App = () => {
  const [jwt, setJwt] = useState('')
  const [user, setUser] = useState({})
  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login setJwt={setJwt} setUser={setUser} jwt={jwt} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App