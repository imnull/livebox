import Home from '~/pages/home';
import Main from '~/pages/main';
import Show from '~/pages/show';
import RoomList from '~/pages/room-list';
import Room from '~/pages/room';
import RoomClient from '~/pages/room-client';

export default [
    { path: '/', text: 'Home', element: <Home /> },
    { path: '/main', text: 'Main', element: <Main /> },
    { path: '/show', text: 'Show', element: <Show /> },
    { path: '/room-list', text: 'RoomList', element: <RoomList /> },
    { path: '/room/:name', element: <Room /> },
    { path: '/room-client/:name', element: <RoomClient /> },
];