import './app.scss'
import routes from './routes'

import { NavLink, HashRouter as Router, Routes, Route } from 'react-router-dom'

export default () => {
    return <>
        <h1 className='top-title'>WebRTC</h1>
        <Router>
            <div className='top-menu'>
                {routes.map(({ path, text }, i) => <NavLink className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`} to={path} key={i}>{text}</NavLink>)}
            </div>
            <div className='top-content'>
                <Routes>
                    {routes.map(({ path, element }, i) => <Route path={path} element={element} key={i} />)}
                </Routes>
            </div>
        </Router>
    </>
}