import Home from '~/pages/home';
import Main from '~/pages/main';
import Show from '~/pages/show';

export default [
    { path: '/', text: 'Home', element: <Home /> },
    { path: 'main', text: 'Main', element: <Main /> },
    { path: 'show', text: 'Show', element: <Show /> },
];