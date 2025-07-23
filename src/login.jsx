import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import './login.css'; // ✅ Assure-toi que ce fichier existe

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Connexion à Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Récupération du rôle depuis Firestore
      const userDoc = await getDoc(doc(db, 'Users', user.uid));
      if (userDoc.exists()) {
        const role = userDoc.data().role;

        if (role === 'chef') {
          navigate('/chef/dashboard');
        } else if (role === 'technicien') {
          navigate('/technicien/accueil');
        } else {
          setError("Rôle non reconnu. Accès refusé.");
        }
      } else {
        setError("Aucune donnée trouvée pour cet utilisateur.");
      }
    } catch (err) {
      console.error(err);
      setError("Email ou mot de passe incorrect.");
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <h2>Connexion</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Adresse email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Connexion en cours...' : 'Se connecter'}
        </button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}

export default Login;