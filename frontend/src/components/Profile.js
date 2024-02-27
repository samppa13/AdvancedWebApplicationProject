import { useState, useEffect } from 'react'
import { Buffer } from 'buffer'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap/dist/css/bootstrap.min.css'

const Profile = () => {
    const [user, setUser] = useState({})
    const [username, setUsername] = useState('')
    const [title, setTitle] = useState('')
    const [information, setInformation] = useState('')
    useEffect(() => {
        const fetchUser = async () => {
            const jwt = localStorage.getItem('auth_token')
            const loggedUser = JSON.parse(new Buffer.from(jwt.split('.')[1], 'base64').toString())
            setUser(loggedUser)
            const response = await fetch(`/api/user/${loggedUser.id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `bearer ${jwt}`
                },
                mode: 'cors'
            })
            const data = await response.json()
            setUsername(data.username)
            if (data.title) {
                setTitle(data.title)
            }
            if (data.information) {
                setInformation(data.information)
            }
        }
        fetchUser()
    }, [])
    const updateUser = async (event) => {
        event.preventDefault()
        const jwt = localStorage.getItem('auth_token')
        const response = await fetch(`/api/user/${user.id}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `bearer ${jwt}`
            },
            body: JSON.stringify({ username: username, title: title, information: information }),
            mode: 'cors'
        })
    }
    return (
        <form className='row row-cols-1 g-3' onSubmit={updateUser}>
            <div className='col'>
                <label className='form-label'>Username</label>
                <input type='text' className='form-control' value={username} onChange={(event) => setUsername(event.target.value)} />
            </div>
            <div className='col'>
                <label className='form-label'>Title</label>
                <input type='text' className='form-control' value={title} onChange={(event) => setTitle(event.target.value)} />
            </div>
            <div className='col'>
                <label className='form-label'>Information</label>
                <textarea className='form-control' value={information} onChange={(event) => setInformation(event.target.value)} />
            </div>
            <div className='col'>
                <button type='submit' className='btn-btn-primary'>Save</button>
            </div>
        </form>
    )
}

export default Profile