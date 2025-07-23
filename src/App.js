// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './HomePage';
import Login from './login';
import UserProfile from './usersprofils';
import ChefLayout from './ChefLayout';
import TechnicienLayout from './TechnicienLayout';
import ProtectedRoute from './protectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Page d'accueil */}
        <Route path="/" element={<HomePage />} />

        {/* Page de connexion */}
        <Route path="/login" element={<Login />} />

        {/* Page optionnelle de redirection */}
        <Route path="/profil" element={<UserProfile />} />

        {/* Layout Chef protégé */}
        <Route
          path="/chef/*"
          element={
            <ProtectedRoute role="chef">
              <ChefLayout />
            </ProtectedRoute>
          }
        />

        {/* Layout Technicien protégé */}
        <Route
          path="/technicien/*"
          element={
            <ProtectedRoute role="technicien">
              <TechnicienLayout />
            </ProtectedRoute>
          }
        />

        {/* Page non trouvée */}
        <Route path="*" element={<p style={{ padding: '2rem' }}>Page non trouvée.</p>} />
      </Routes>
    </Router>
  );
}

export default App;