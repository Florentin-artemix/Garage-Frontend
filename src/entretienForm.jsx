import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MachineTable.css';

function EntretienForm() {
  const [entretiens, setEntretiens] = useState([]);
  const [techniciens, setTechniciens] = useState([]);
  const [machines, setMachines] = useState([]);

  const [formData, setFormData] = useState({
    technicienId: '',
    machineId: '',
    dateEntretien: '',
    typeEntretien: '',
    description: ''
  });

  const [entretienToEdit, setEntretienToEdit] = useState(null);

  useEffect(() => {
    chargerDonnees();
  }, []);

  const chargerDonnees = async () => {
    try {
      const [resEntretiens, resTech, resMachines] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/api/entretien`),
        axios.get(`${process.env.REACT_APP_API_URL}/api/technicien`),
        axios.get(`${process.env.REACT_APP_API_URL}/api/machine`)
      ]);
      setEntretiens(resEntretiens.data);
      setTechniciens(resTech.data);
      setMachines(resMachines.data);
    } catch (err) {
      console.error("Erreur chargement données :", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      technicienId: '',
      machineId: '',
      dateEntretien: '',
      typeEntretien: '',
      description: ''
    });
    setEntretienToEdit(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      technicien: { id: Number(formData.technicienId) },
      machine: { id: Number(formData.machineId) },
      dateEntretien: formData.dateEntretien,
      typeEntretien: formData.typeEntretien,
      description: formData.description
    };

    const url = entretienToEdit
      ? `${process.env.REACT_APP_API_URL}/api/entretien/${entretienToEdit.id}`
      : `${process.env.REACT_APP_API_URL}/api/entretien`;
    const method = entretienToEdit ? 'put' : 'post';

    try {
      await axios[method](url, dataToSend);
      alert(entretienToEdit ? "Entretien modifié" : "Entretien ajouté");
      chargerDonnees();
      resetForm();
    } catch (err) {
      console.error("Erreur enregistrement :", err);
      alert("Échec de l'enregistrement");
    }
  };

  const handleEdit = (entretien) => {
    const tech = techniciens.find(t => t.nom === entretien.nomTechnicien && t.prenom === entretien.prenomTechnicien);
    const mach = machines.find(m => m.type === entretien.typeMachine && m.modele === entretien.modeleMachine);
    setFormData({
      technicienId: tech?.id || '',
      machineId: mach?.id || '',
      dateEntretien: entretien.dateEntretien,
      typeEntretien: entretien.typeEntretien,
      description: entretien.description
    });
    setEntretienToEdit(entretien);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet entretien ?")) return;
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/entretien/${id}/desactiver`);
      alert("Supprimé avec succès");
      chargerDonnees();
    } catch (err) {
      console.error("Erreur suppression :", err);
      alert("Échec de la suppression");
    }
  };

  return (
    <div className="page-container">
      <h2>Formulaire Entretien</h2>
      <form className="contenu-form" onSubmit={handleSubmit}>
        <label>Technicien :</label><br />
        <select name="technicienId" value={formData.technicienId} onChange={handleChange} required>
          <option value="">-- Choisir un technicien --</option>
          {techniciens.map(t => (
            <option key={t.id} value={t.id}>{t.nom} {t.prenom}</option>
          ))}
        </select><br />

        <label>Machine :</label><br />
        <select name="machineId" value={formData.machineId} onChange={handleChange} required>
          <option value="">-- Choisir une machine --</option>
          {machines.map(m => (
            <option key={m.id} value={m.id}>{m.type} {m.modele}</option>
          ))}
        </select><br />

        <label>Date d'entretien :</label><br />
        <input type="date" name="dateEntretien" value={formData.dateEntretien} onChange={handleChange} required /><br />

        <label>Type d'entretien :</label><br />
        <input type="text" name="typeEntretien" value={formData.typeEntretien} onChange={handleChange} required /><br />

        <label>Description :</label><br />
        <textarea name="description" value={formData.description} onChange={handleChange} required /><br /><br />

        <button type="submit">{entretienToEdit ? "Modifier" : "Ajouter"}</button>
        {entretienToEdit && <button type="button" onClick={resetForm}>Annuler</button>}
      </form>

      <h2>Liste des Entretiens</h2>
      {entretiens.length === 0 ? (
        <p>Aucun entretien enregistré</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nom Technicien</th>
              <th>Prénom Technicien</th>
              <th>Type Machine</th>
              <th>Modèle Machine</th>
              <th>Date Entretien</th>
              <th>Type Entretien</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entretiens.map((e, index) => (
              <tr key={e.id}>
                <td>{index + 1}</td>
                <td>{e.nomTechnicien}</td>
                <td>{e.prenomTechnicien}</td>
                <td>{e.typeMachine}</td>
                <td>{e.modeleMachine}</td>
                <td>{e.dateEntretien}</td>
                <td>{e.typeEntretien}</td>
                <td>{e.description}</td>
                <td>
                  <button onClick={() => handleEdit(e)}>Modifier</button>{' '}
                  <button onClick={() => handleDelete(e.id)} style={{ backgroundColor: 'red', color: 'white' }}>
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

export default EntretienForm;