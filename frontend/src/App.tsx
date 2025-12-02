import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login';
import Home from './pages/Home';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
