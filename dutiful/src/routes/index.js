import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

export const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<div>Authentication Page</div>}></Route>
        <Route path="/" element={<div>Landing Page</div>}></Route>
      </Routes>
    </Router>
  );
};
