import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MachineTable.css';

function TravailForm() {
  const [travails, setTravails] = useState([]);
  const [techniciens, setTechniciens] = useState([]);
  const [machines, setMachines] = useState([]);
  const [formData, setFormData] = useState({
    technicienId: '',
    machineId: '',
    heureDebut: '',
    heureFin: '',
    preuvePhoto: null,
  });
  const [travailToEdit, setTravailToEdit] = useState(null);

  useEffect(() => {
    chargerDonnees();
  }, []);

  const chargerDonnees = async () => {
    try {
      const [resTravails, resTech, resMachines] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/api/travail`),
        axios.get(`${process.env.REACT_APP_API_URL}/api/technicien`),
        axios.get(`${process.env.REACT_APP_API_URL}/api/machine`)
      ]);
      setTravails(resTravails.data);
      setTechniciens(resTech.data);
      setMachines(resMachines.data);
    } catch (err) {
      console.error("Erreur chargement :", err);
    }
  };

  const resetForm = () => {
    setFormData({
      technicienId: '',
      machineId: '',
      heureDebut: '',
      heureFin: '',
      preuvePhoto: null,
    });
    setTravailToEdit(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        preuvePhoto: reader.result.split(',')[1]
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = {
      technicien: { id: Number(formData.technicienId) },
      machine: { id: Number(formData.machineId) },
      heureDebut: formData.heureDebut,
      heureFin: formData.heureFin,
      preuvePhotoBase64: formData.preuvePhoto
    };
    const url = travailToEdit
      ? `${process.env.REACT_APP_API_URL}/api/travail/${travailToEdit.id}`
      : `${process.env.REACT_APP_API_URL}/api/travail`;
    const method = travailToEdit ? 'put' : 'post';

    try {
      await axios[method](url, dataToSend);
      alert(travailToEdit ? "Travail modifié" : "Travail ajouté");
      chargerDonnees();
      resetForm();
    } catch (err) {
      console.error("Erreur enregistrement :", err);
      alert("Échec de l'enregistrement");
    }
  };

  const handleEdit = (t) => {
    const tech = techniciens.find(te => te.nom === t.nomTechnicien && te.prenom === t.prenomTechnicien);
    const mach = machines.find(m => m.type === t.typeMachine && m.modele === t.modeleMachine);
    setFormData({
      technicienId: tech?.id || '',
      machineId: mach?.id || '',
      heureDebut: t.heureDebut ? t.heureDebut.substring(0, 16) : '',
      heureFin: t.heureFin ? t.heureFin.substring(0, 16) : '',
      preuvePhoto: null
    });
    setTravailToEdit(t);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce travail ?")) return;
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/travail/${id}/desactiver`);
      alert("Supprimé avec succès");
      chargerDonnees();
    } catch (err) {
      console.error("Erreur suppression :", err);
    }
  };

  return (
    <div className="page-container">
      <h2>Formulaire Travail</h2>
      <form className="contenu-form" onSubmit={handleSubmit}>
        <label>Technicien :</label>
        <select name="technicienId" value={formData.technicienId} onChange={handleChange} required>
          <option value="">-- Choisir un technicien --</option>
          {techniciens.map(t => (
            <option key={t.id} value={t.id}>{t.nom} {t.prenom}</option>
          ))}
        </select>

        <label>Machine :</label>
        <select name="machineId" value={formData.machineId} onChange={handleChange} required>
          <option value="">-- Choisir une machine --</option>
          {machines.map(m => (
            <option key={m.id} value={m.id}>{m.type} {m.modele}</option>
          ))}
        </select>

        <label>Heure de début :</label>
        <input type="datetime-local" name="heureDebut" value={formData.heureDebut} onChange={handleChange} required />

        <label>Heure de fin :</label>
        <input type="datetime-local" name="heureFin" value={formData.heureFin} onChange={handleChange} required />

        <label>Preuve photo :</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />

        <button type="submit">{travailToEdit ? "Modifier" : "Ajouter"}</button>
        {travailToEdit && <button type="button" onClick={resetForm}>Annuler</button>}
      </form>

      <h2>Liste des Travaux</h2>
      {travails.length === 0 ? (
        <p>Aucun travail enregistré</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Technicien</th>
              <th>Machine</th>
              <th>Heure Début</th>
              <th>Heure Fin</th>
              <th>Heure Travail</th>
              <th>Preuve</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {travails.map((t, index) => (
              <tr key={t.id}>
                <td>{index + 1}</td>
                <td>{t.nomTechnicien} {t.prenomTechnicien}</td>
                <td>{t.typeMachine} {t.modeleMachine}</td>
                <td>{t.heureDebut}</td>
                <td>{t.heureFin}</td>
                <td>{t.heureTravail}</td>
                <td>
                  {t.preuvePhotoBase64 ? (
                    <img
                      src={`data:image/jpeg;base64,${t.preuvePhotoBase64}`}
                      alt="preuve"
                      width="60"
                      height="60"
                    />
                  ) : "Aucune"}
                </td>
                <td>
                  <button onClick={() => handleEdit(t)}>Modifier</button>
                  <button onClick={() => handleDelete(t.id)} style={{ backgroundColor: 'red', color: 'white' }}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TravailForm;