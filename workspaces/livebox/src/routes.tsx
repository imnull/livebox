import Home from '~/pages/home';
import RoomList from '~/pages/room-list';
import Room from '~/pages/room';
import RoomClient from '~/pages/room-client';
import LiveList from '~/pages/live-list';
import Live from '~/pages/live';

export default [
    { path: '/', text: 'Home', element: <Home /> },
    // { path: '/main', text: 'Main', element: <Main /> },
    // { path: '/show', text: 'Show', element: <Show /> },
    // { path: '/room-list', text: 'RoomList', element: <RoomList /> },
    // { path: '/room/:name', element: <Room /> },
    // { path: '/room-client/:name', element: <RoomClient /> },
    { path: '/live-list', text: 'LiveList', element: <LiveList /> },
    { path: '/live/:channel', element: <Live /> },
];