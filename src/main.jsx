import { createRoot } from 'react-dom/client'
import  UserProvider  from "./Context/dataCont.jsx"
import DataProvider from './Context/userDataCont.jsx'
import LogoutProvider from './Context/logoutContext.jsx'
import { BrowserRouter } from "react-router-dom";
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
    <UserProvider>
        <DataProvider>
            <LogoutProvider>
                <App />
            </LogoutProvider>
        </DataProvider>
    </UserProvider>
    </BrowserRouter>

)
