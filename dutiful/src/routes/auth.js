import { Route, Routes, Navigate } from 'react-router-dom';
import { ErrorPage, ForgotPassword, Login } from 'features/auth';

export const AuthRoutes = () => {
  return (
    <Routes>
      {/* <Route path="register" element={<Register />} /> */}
      <Route path="login" element={<Login />} />
      <Route path="forgotPassword" element={<ForgotPassword />} />
      <Route path={'expiredAccess'} element={<ErrorPage />} />
      <Route path="*" element={<Navigate to="login" />} />
    </Routes>
  );
};

// const example = () => {
//   return (
//     <>
//       </Route>
//       <Route path={`${path}/expiredAccess`}>
//         <ErrorPage />
//       </Route>
//       <Route path={`${path}/resetPassword`}>
//         <ResetPassword />
//       </Route>{' '}
//     </>
//   );
// };
