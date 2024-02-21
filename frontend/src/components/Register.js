import { useState } from 'react'

const Register = () => {
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const register = async (event) => {
        event.preventDefault()
        const response = await fetch('/api/user/register/', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ email: email, username: username, password: password }),
            mode: 'cors'
        })
        const data = await response.json()
        if (data.email) {
            window.location.href = '/login'
        }
    }
    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={register}>
                <input type='email' onChange={(event) => setEmail(event.target.value)} />
                <input type='text' onChange={(event) => setUsername(event.target.value)} />
                <input type='password' onChange={(event) => setPassword(event.target.value)} />
                <input type='submit' value='Register' />
            </form>
        </div>
    )
}

export default Register