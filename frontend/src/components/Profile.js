import { useState, useEffect } from 'react'
import { Buffer } from 'buffer'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap/dist/css/bootstrap.min.css'

const Profile = () => {
    const [user, setUser] = useState({})
    const [username, setUsername] = useState('')
    const [title, setTitle] = useState('')
    const [information, setInformation] = useState('')
    const [photo, setPhoto] = useState(null)
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
            data.photos.forEach((image) => {
                const img = document.createElement('img')
                img.src = `data:image/${image.type};base64,${image.path}`
                img.id = image.name
                document.getElementById('photos').appendChild(img)
            })
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
    const uploadPhoto = async (event) => {
        event.preventDefault()
        const formData = new FormData()
        formData.append('photo', photo)
        const jwt = localStorage.getItem('auth_token')
        const response = await fetch(`/api/user/${user.id}/photo`, {
            method: 'POST',
            headers: {
                'Authorization': `bearer ${jwt}`,
                'enctype': 'multipart/form-data'
            },
            body: formData
        })
        const data = await response.json()
        if (data.message === 'File uploaded successfully.') {
            const photoSrc = URL.createObjectURL(photo)
            const image = document.createElement('img')
            image.src = photoSrc
            image.id = photo.name
            document.getElementById('photos').appendChild(image)
        }
    }
    return (
        <div>
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
            <form className='row row-cols-1 g-3' onSubmit={uploadPhoto}>
                <div className='col'>
                    <input className='form-control' type='file' name='photo' accept='image/*' onChange={(event) => setPhoto(event.target.files[0])} />
                    <button className='btn-btn-primary' type='submit'>Upload</button>
                </div>
            </form>
            <div id='photos'></div>
        </div>
    )
}

export default Profile