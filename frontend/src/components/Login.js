import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Buffer } from 'buffer'

const Login = ({ setJwt, setUser, jwt }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const login = async (event) => {
        event.preventDefault()
        const response = await fetch('api/user/login', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ email: email, password: password }),
            mode: 'cors'
        })
        const data = await response.json()
        if (data.token) {
            localStorage.setItem('auth_token', data.token)
            setJwt(data.token)
            setUser(JSON.parse(new Buffer.from(data.token.split('.')[1], 'base64').toString()))
            window.location.href = '/'
        }
    }
    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={login}>
                <input type='email' onChange={(event) => setEmail(event.target.value)} />
                <input type='password' onChange={(event) => setPassword(event.target.value)} />
                <input type='submit' value='Login' />
            </form>
            <Link to='/register'>New around here? Sign up</Link>
        </div>
    )
}

export default Login