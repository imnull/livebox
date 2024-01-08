import './app.scss'
import routes from './routes'

import { NavLink, HashRouter, Routes, Route } from 'react-router-dom'

export default () => {
    return <>
        <h1 className='top-title'>WebRTC</h1>
        <HashRouter>
            <div className='top-menu'>
                {routes.map(({ path, text }, i) => text ? <NavLink className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`} to={path} key={i}>{text}</NavLink> : null)}
            </div>
            <div className='top-content'>
                <Routes>
                    {routes.map(({ path, element }, i) => <Route path={path} element={element} key={i} />)}
                </Routes>
            </div>
        </HashRouter>
    </>
}