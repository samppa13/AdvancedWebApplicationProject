import { useState, useEffect } from 'react'
import { useSwipeable } from 'react-swipeable'
import { Buffer } from 'buffer'
import UserCard from './UserCard'

const UserCards = () => {
    const [users, setUsers] = useState([])
    const [user, setUser] = useState({})
    useEffect(() => {
        const fetchUsers = async () => {
            const jwt = localStorage.getItem('auth_token')
            const loggedUser = JSON.parse(new Buffer.from(jwt.split('.')[1], 'base64').toString())
            setUser(loggedUser)
            const response = await fetch(`/api/users/${loggedUser.id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `bearer ${jwt}`
                },
                mode: 'cors'
            })
            const data = await response.json()
            const userList = data.users.filter((user1) => user1.id !== loggedUser.id)
            setUsers(userList)
        }
        fetchUsers()
    }, [])
    const swipe = useSwipeable({
        onSwipedLeft: () => dislikeUser(),
        onSwipedRight: () => likeUser(),
        swipeDuration: 500,
        preventScrollOnSwipe: true,
        trackMouse: true
    })
    const likeUser = async () => {
        const jwt = localStorage.getItem('auth_token')
        await fetch(`/api/like/user/${user.id}`, {
            method: 'POST',
            headers:{
                'Content-type': 'application/json',
                'Authorization': `bearer ${jwt}`
            },
            body: JSON.stringify({ likeUserId: users[0].id }),
            mode: 'cors'
        })
        setUsers(users.filter((user1) => user1.id !== users[0].id))
    }
    const dislikeUser = async () => {
        const jwt = localStorage.getItem('auth_token')
        await fetch(`/api/dislike/user/${user.id}`, {
            method: 'POST',
            headers:{
                'Content-type': 'application/json',
                'Authorization': `bearer ${jwt}`
            },
            body: JSON.stringify({ dislikeUserId: users[0].id }),
            mode: 'cors'
        })
        setUsers(users.filter((user1) => user1.id !== users[0].id))
    }
    if (users.length > 0) {
        return (
            <div {...swipe}>
                <UserCard user={users[0]} />
            </div>
        )
    }
    if (users.length === 0) {
        return (
            <h1>
                Empty
            </h1>
        )
    }
}

export default UserCards