import { useState, useEffect } from 'react'
import { Buffer } from 'buffer'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import Chat from './Chat'

const Chats = () => {
    const [chats, setChats] = useState([])
    const [id, setId] = useState('')
    useEffect(() => {
        const fetchChats = async () => {
            const jwt = localStorage.getItem('auth_token')
            const loggedUser = JSON.parse(new Buffer.from(jwt.split('.')[1], 'base64').toString())
            const response = await fetch(`/api/chats/${loggedUser.id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `bearer ${jwt}`
                },
                mode: 'cors'
            })
            const data = await response.json()
            const sortedData = data.chats.sort((chat1, chat2) => {
                const lastMessage1 = chat1.lastDate
                const lastMessage2 = chat2.lastDate
                return new Date(lastMessage2) - new Date(lastMessage1)
            })
            setChats(sortedData)
        }
        fetchChats()
    }, [])
    const chatSelect = (chatId) => {
        console.log(chatId)
        setId(chatId)
    }
    if (chats.length !== 0) {
        return (
            <div className='container'>
                <div className='row'>
                    <div className='col-4'>
                        <ul className='list-group'>
                            {chats.map((chat) => {
                                return (
                                    <div className='list-group-item' key={chat.id} onClick={() => chatSelect(chat.id)}>
                                        {chat.user.username}
                                    </div>
                                )
                            })}
                        </ul>
                    </div>
                    <div className='col-8'>
                        {id.length !== 0 &&
                            <Chat chat={chats.find((chat) => chat.id === id)} />
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default Chats