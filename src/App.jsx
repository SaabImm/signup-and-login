import './App.css'
import FormulaireCNOA from './Pages/Sign-up'
import LoginForm from './Pages/Login'
import ProfilePage from './Pages/ProfilePage'
import VerifyPage from './Pages/VerificationPage'
import VerifyPendingPage from './Pages/VerifyPending'
import AdminDashboard from './Pages/DashBoard/Admin Dashboard'
import DashLayout from './Layouts/DashLayout'
import MainLayout from './Layouts/MainLayout'
import AuthLayout from './Layouts/AuthLayout'
import UsersPage from './Pages/DashBoard/Users/UsersPage'
import GetUsers from './Pages/DashBoard/Users/getUsers'
import CreateUser from './Pages/DashBoard/Users/createUser'
import UpdateUser from './Pages/DashBoard/Users/updateUser'
import { Routes, Route } from "react-router-dom";
export default function App() {
  return (
    <>
      <Routes>
          <Route path="/" element={<MainLayout/>}>
           <Route index element={<LoginForm/>} />
           <Route path="signup" element={<FormulaireCNOA/>} />
            <Route path="profile" element={<ProfilePage/>} />
          </Route>
          <Route path="/auth" element={<AuthLayout/>} >
            <Route path="verify-pending" element={<VerifyPendingPage />} />
            <Route path="verify" element={<VerifyPage/>} />
          </Route>

          <Route path="/dash" element={<DashLayout/>}>
            <Route index element={<AdminDashboard/>} />
            <Route path="user" element={<UsersPage/>} />
            <Route path="allUsers" element={<GetUsers/>} />
            <Route path="create" element={<CreateUser/>} />
            <Route path="update" element={<UpdateUser/>} />
          </Route>

      </Routes>
      
    </>
  )
}
