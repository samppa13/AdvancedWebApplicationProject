import { useState, useEffect } from 'react'
import { Buffer } from 'buffer'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap/dist/css/bootstrap.min.css'

const Chat = ({ chat }) => {
    const [messages, setMessages] = useState(chat.messages)
    const [text, setText] = useState('')
    useEffect(() => {
        const fetchChat = async () => {
            const jwt = localStorage.getItem('auth_token')
            const response = await fetch(`/api/chat/${chat.id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `bearer ${jwt}`
                },
                mode: 'cors'
            })
            const data = await response.json()
            setMessages(data.chat.messages)
        }
        fetchChat()
    }, [chat])
    const sendMessage = async (event) => {
        event.preventDefault()
        const jwt = localStorage.getItem('auth_token')
        const loggedUser = JSON.parse(new Buffer.from(jwt.split('.')[1], 'base64').toString())
        const response = await fetch(`/api/chat/${chat.id}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `bearer ${jwt}`
            },
            body: JSON.stringify({ sender: loggedUser.id, message: text }),
            mode: 'cors'
        })
        const data = await response.json()
        setMessages(data.messages)
        setText('')
    }
    return (
        <div className='container'>
            <div className='row'>
                <div className='col'>
                    <ul className='list-group'>
                        <h1 className='list-group-item'>
                            {chat.user.username}
                        </h1>
                        <div className='list-group-item'>
                            <div className='overflow-auto'>
                                {messages.map((message) => {
                                    if (message.sender !== chat.user._id) {
                                        return (
                                            <p className='text-end' key={message._id}>
                                                {message.message}
                                            </p>
                                        )
                                    }
                                    if (message.sender === chat.user._id) {
                                        return (
                                            <p className='text-start' key={message._id}>
                                                {message.message}
                                            </p>
                                        )
                                    }
                                })}
                            </div>
                        </div>
                        <div className='list-group-item'>
                            <form onSubmit={sendMessage}>
                                <div className='input-group'>
                                    <textarea className='form-control' aria-label='With textarea' onChange={(event) => setText(event.target.value)} value={text}></textarea>
                                    <button className='btn btn-outline-secondary' type='submit'>Send</button>
                                </div>
                            </form>
                        </div>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Chat