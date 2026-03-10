import { createRoot } from 'react-dom/client'
import  UserProvider  from "./Context/dataCont.jsx"
import InputContexte from './Context/searchContext.jsx'
import DataProvider from './Context/userDataCont.jsx'
import LogoutProvider from './Context/logoutContext.jsx'
import { CotisationProvider } from './Context/CotisationContext.jsx'
import { BrowserRouter } from "react-router-dom";
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
    <UserProvider>
        <DataProvider>
            <LogoutProvider>
                <InputContexte>
                <CotisationProvider>
                <App />
                </CotisationProvider>
                </InputContexte>
            </LogoutProvider>
        </DataProvider>
    </UserProvider>
    </BrowserRouter>

)
