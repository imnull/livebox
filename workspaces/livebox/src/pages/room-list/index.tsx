import { useState } from 'react'
import { NavLink } from 'react-router-dom'

import '~/pages/chat-room.scss'

export default () => {

    const [rooms] = useState([
        {
            text: 'Room1',
            name: 'room1',
        },
        {
            text: 'Room2',
            name: 'room2',
        },
        {
            text: 'Room3',
            name: 'room3',
        },
    ])


    return <div className='room-list'>
        <h1>RoomList</h1>
        <ul>{
            rooms.map((room, index) => <li key={index}>
                <h3>{room.text}</h3>
                <NavLink to={`/room/${room.name}`}>admin</NavLink>
                <NavLink to={`/room-client/${room.name}`}>user</NavLink>
            </li>)
        }
        </ul>
    </div>
}