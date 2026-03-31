import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import MainMenu from './pages/MainMenu';
import AddNewAddiction from './pages/AddNewAddiction';
import AddictionDetail from './pages/AddictionDetail';
import Meditation from './pages/Meditation';
import Diary from './pages/Diary';
import CravingGame from './pages/CravingGame';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Profile from './pages/Profile';
import Achievements from './pages/Achievements';
import Header from './components/Header';
import Footer from './components/Footer';
import AchievementNotification from './components/AchievementNotification';
import Sidebar from './components/Sidebar.js';

function ProtectedRoute({ children, isAuthenticated }) {
  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default function App() {
  const { token } = useContext(AuthContext);

  return (
    <Router>
      <div className="App">
        {token && <Header />}
        {token && <AchievementNotification />}
        <div className="content-wrapper">
          {token && <Sidebar />}
          <main>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute isAuthenticated={!!token}>
                    <MainMenu />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-addiction"
                element={
                  <ProtectedRoute isAuthenticated={!!token}>
                    <AddNewAddiction />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/addiction/:id"
                element={
                  <ProtectedRoute isAuthenticated={!!token}>
                    <AddictionDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/meditation"
                element={
                  <ProtectedRoute isAuthenticated={!!token}>
                    <Meditation />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/diary"
                element={
                  <ProtectedRoute isAuthenticated={!!token}>
                    <Diary />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/craving-game"
                element={
                  <ProtectedRoute isAuthenticated={!!token}>
                    <CravingGame />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/privacy"
                element={
                  <ProtectedRoute isAuthenticated={!!token}>
                    <PrivacyPolicy />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute isAuthenticated={!!token}>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/achievements"
                element={
                  <ProtectedRoute isAuthenticated={!!token}>
                    <Achievements />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
        {token && <Footer />}
      </div>
    </Router>
  );
}
