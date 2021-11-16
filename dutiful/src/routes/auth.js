import { Container } from '@material-ui/core';
import { Login, Register } from 'features/auth';
import { Route, Routes } from 'react-router-dom';

export const AuthRoutes = () => {
  return (
    <Container style={{ height: '100vh', marginTop: '20%' }}>
      <Routes>
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
      </Routes>
    </Container>
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
