import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MachineTable.css'; // utilisé pour l'uniformité

function TechnicienForm() {
  const [techniciens, setTechniciens] = useState([]);
  const [formData, setFormData] = useState({
    nom: '',
    postNom: '',
    prenom: '',
    age: '',
    role: ''
  });
  const [technicienToEdit, setTechnicienToEdit] = useState(null);

  useEffect(() => {
    chargerTechniciens();
  }, []);

  const chargerTechniciens = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/technicien`);
      setTechniciens(res.data);
    } catch (err) {
      console.error("Erreur chargement techniciens :", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      postNom: '',
      prenom: '',
      age: '',
      role: ''
    });
    setTechnicienToEdit(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = technicienToEdit
      ? `${process.env.REACT_APP_API_URL}/api/technicien/${technicienToEdit.id}`
      : `${process.env.REACT_APP_API_URL}/api/technicien`;
    const method = technicienToEdit ? 'put' : 'post';

    try {
      await axios[method](url, formData);
      alert(technicienToEdit ? "Technicien modifié" : "Technicien ajouté");
      chargerTechniciens();
      resetForm();
    } catch (err) {
      console.error("Erreur lors de l'enregistrement :", err);
      alert("Échec de l'enregistrement");
    }
  };

  const handleEdit = (technicien) => {
    setFormData({
      nom: technicien.nom,
      postNom: technicien.postNom,
      prenom: technicien.prenom,
      age: technicien.age,
      role: technicien.role
    });
    setTechnicienToEdit(technicien);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Confirmer la suppression ?")) return;
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/technicien/${id}/desactiver`);
      alert("Supprimé avec succès");
      chargerTechniciens();
    } catch (err) {
      console.error("Erreur suppression :", err);
      alert("Échec de la suppression");
    }
  };

  return (
    <div className="page-container">
      <h2>Formulaire Technicien</h2>
      <form className="contenu-form" onSubmit={handleSubmit}>
        <label>Nom :</label><br />
        <input type="text" name="nom" value={formData.nom} onChange={handleChange} required /><br />

        <label>Post Nom :</label><br />
        <input type="text" name="postNom" value={formData.postNom} onChange={handleChange} required /><br />

        <label>Prénom :</label><br />
        <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} required /><br />

        <label>Âge :</label><br />
        <input type="number" name="age" value={formData.age} onChange={handleChange} required /><br />

        <label>Rôle :</label><br />
        <input type="text" name="role" value={formData.role} onChange={handleChange} required /><br /><br />

        <button type="submit">{technicienToEdit ? "Modifier" : "Ajouter"}</button>
        {technicienToEdit && (
          <button type="button" onClick={resetForm}>Annuler</button>
        )}
      </form>

      <h2>Liste des Techniciens</h2>
      {techniciens.length === 0 ? (
        <p>Aucun technicien enregistré</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nom</th>
              <th>Post Nom</th>
              <th>Prénom</th>
              <th>Âge</th>
              <th>Rôle</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {techniciens.map((t, index) => (
              <tr key={t.id}>
                <td>{index + 1}</td>
                <td>{t.nom}</td>
                <td>{t.postNom}</td>
                <td>{t.prenom}</td>
                <td>{t.age}</td>
                <td>{t.role}</td>
                <td>
                  <button onClick={() => handleEdit(t)}>Modifier</button>{' '}
                  <button
                    onClick={() => handleDelete(t.id)}
                    style={{ backgroundColor: 'red', color: 'white' }}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TechnicienForm;