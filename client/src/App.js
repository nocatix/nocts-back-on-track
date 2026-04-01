import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import apiClient from './api/axiosConfig';
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
import Mood from './pages/Mood';
import Weight from './pages/Weight';
import Memories from './pages/Memories';
import Whyusethis from './pages/Whyusethis';
import HowToSucceed from './pages/HowToSucceed';
import Crisis from './pages/Crisis';
import WithdrawalSymptoms from './pages/WithdrawalSymptoms';
import Header from './components/Header';
import Footer from './components/Footer';
import AchievementNotification from './components/AchievementNotification';
import ScrollToTopButton from './components/ScrollToTopButton';
import Sidebar from './components/Sidebar.js';

// Configure API URL (already configured in apiClient)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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
              <Route
                path="/mood"
                element={
                  <ProtectedRoute isAuthenticated={!!token}>
                    <Mood />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/weight"
                element={
                  <ProtectedRoute isAuthenticated={!!token}>
                    <Weight />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/memories"
                element={
                  <ProtectedRoute isAuthenticated={!!token}>
                    <Memories />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/why-use-this"
                element={
                  <ProtectedRoute isAuthenticated={!!token}>
                    <Whyusethis />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/how-to-succeed"
                element={
                  <ProtectedRoute isAuthenticated={!!token}>
                    <HowToSucceed />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/crisis"
                element={
                  <ProtectedRoute isAuthenticated={!!token}>
                    <Crisis />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/withdrawal-symptoms"
                element={
                  <ProtectedRoute isAuthenticated={!!token}>
                    <WithdrawalSymptoms />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
        {token && <Footer />}
        <ScrollToTopButton />
      </div>
    </Router>
  );
}
