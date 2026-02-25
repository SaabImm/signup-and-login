import { Routes, Route } from "react-router-dom";
import MainLayout from './Layouts/MainLayout';
import AuthLayout from './Layouts/AuthLayout';
import DashLayout from './Layouts/DashLayout';

import ProtectedRoute from './Layouts/ProtectedRoute';
import AdminRoute from './Layouts/AdminRoute';

import LoginForm from './Pages/Login';
import FormulaireCNOA from './Pages/Sign-up';
import ProfilePage from './Pages/ProfilePage';
import ResetPassword from './Pages/DashBoard/Users/resetPassword';
import OnboardingPage from './Pages/OnboardingPage';
import VerifyPage from './Pages/VerificationPage';
import VerifyPendingPage from './Pages/VerifyPending';

import AdminDashboard from './Pages/DashBoard/Admin Dashboard';
import GetUsers from './Pages/DashBoard/Users/getUsers';
import CreateUser from './Pages/DashBoard/Users/createUser';
import UpdateUser from './Pages/DashBoard/Users/updateUser';
import DeleteUser from './Components/deleteUser';
import AdminUserView from './Pages/DashBoard/Users/AdminView/AdminUserView';

export default function App() {
  return (
    <Routes>

      {/* PUBLIC / MAIN LAYOUT */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<LoginForm />} />
        <Route path="signup" element={<FormulaireCNOA />} />
      </Route>

      {/* AUTH LAYOUT (logged in pages) */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="verify-pending" element={<VerifyPendingPage />} />
        <Route path="verify" element={<VerifyPage />} />

        {/* Pages accessible to any logged-in user */}
        <Route path="profile" element={
          <ProtectedRoute><ProfilePage /></ProtectedRoute>
        } />
        <Route path="resetPsw" element={
          <ProtectedRoute><ResetPassword /></ProtectedRoute>
        } />
        <Route path="update/:id" element={
          <ProtectedRoute> <UpdateUser /> </ProtectedRoute>} />
        <Route path="onboarding" element={
          <ProtectedRoute><OnboardingPage /></ProtectedRoute>
        } /> 
      </Route>

      {/* DASHBOARD / ADMIN LAYOUT */}
      <Route path="/dash" element={
        <AdminRoute><DashLayout /></AdminRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="allUsers" element={<GetUsers />} />
        <Route path="create" element={<CreateUser />} />
        <Route path="delete/:id" element={<DeleteUser />} />
        <Route path="adminUser/:id" element={<AdminUserView />} />
      </Route>

    </Routes>
  );
}
