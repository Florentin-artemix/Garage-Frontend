import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import './register.css'; // ✅ N'oublie pas d'importer ce fichier

function RegisterUser() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nom: '',
    prenom: '',
    role: 'technicien',
    contact: '',
    age: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const uid = userCredential.user.uid;

      await setDoc(doc(db, 'Users', uid), {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        role: formData.role,
        contact: formData.contact,
        age: Number(formData.age),
      });

      setMessage('Utilisateur créé avec succès 🎉');
    } catch (error) {
      console.error(error);
      setMessage("Erreur : " + error.message);
    }
  };

  return (
    <div className="register-container">
      <h3>Créer un utilisateur</h3>
      <form onSubmit={handleSubmit}>
        <input name="nom" placeholder="Nom" onChange={handleChange} required />
        <input name="prenom" placeholder="Prénom" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Mot de passe" onChange={handleChange} required />
        <input name="contact" placeholder="Contact" onChange={handleChange} required />
        <input name="age" type="number" placeholder="Âge" onChange={handleChange} required />
        
        <select name="role" onChange={handleChange} required>
          <option value="technicien">Technicien</option>
          <option value="chef">Chef</option>
        </select>

        <button type="submit">Créer l'utilisateur</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default RegisterUser;