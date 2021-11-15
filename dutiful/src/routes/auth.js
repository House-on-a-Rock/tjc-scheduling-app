import { Navigate, Route, Routes } from 'react-router-dom';
import { Login } from '@features/auth';

export const Auth = () => {
  return (
    <Routes>
      <Route path={'login'} element={<Login />} />
      <Route path={'/'} element={<Navigate to={`/login`} />} />
    </Routes>
  );
};

// const example = () => {
//   return (
//     <>
//       <Route path={`${path}/forgotPassword`}>
//         <AuthEmail
//           data={{
//             history: true,
//             title: 'Forgot Password',
//             description:
//               'Lost your password? Please enter your email address. You will receive a link to create a new password via email.',
//             button: 'Reset Password',
//           }}
//         />
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
