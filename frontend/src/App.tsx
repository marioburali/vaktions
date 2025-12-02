import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login';
import Home from './pages/Home';
import PrivateRoute from './components/PrivateRoute';
import './App.css';
import VacationList from './pages/VacationsList';
import VacationDetails from './pages/VacationDetails';
import MyRequests from './pages/MyRequests';

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
      <Route
        path="/admin/requests"
        element={
          <PrivateRoute>
            <VacationList />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/requests/:id"
        element={
          <PrivateRoute>
            <VacationDetails />
          </PrivateRoute>
        }
      />
      <Route
        path="vacations/me"
        element={
          <PrivateRoute>
            <MyRequests />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
