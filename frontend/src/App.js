import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Register from './components/Register'

const App = () => {
  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route path='/register' element={<Register />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App