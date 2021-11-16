import { Route, Routes, Navigate } from 'react-router-dom';
import { ErrorPage, ForgotPassword, Login, ResetPassword } from 'features/auth';

export const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="forgotPassword" element={<ForgotPassword />} />
      <Route path="expiredAccess" element={<ErrorPage />} />
      <Route path="resetPassword" element={<ResetPassword />} />
      <Route path="*" element={<Navigate to="login" />} />
    </Routes>
  );
};
