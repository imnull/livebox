import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './store'
import App from './app'

const root = document.getElementById('root')
if (root) {
    createRoot(root).render(
        // <Provider store={store}>
        //     <App />
        // </Provider>
        <App />
    )
}