import React, { useState, useEffect } from 'react';
import './MachineTable.css';

function InterventionForm() {
  const [interventions, setInterventions] = useState([]);
  const [techniciens, setTechniciens] = useState([]);
  const [machines, setMachines] = useState([]);
  const [formData, setFormData] = useState({
    technicienId: '',
    machineId: '',
    typeIntervention: '',
    description: '',
    kmOuHeureMoteur: '',
    photoIntervention: null,
    signatures: null,
    dateIntervention: '',
    validationChefGarage: false
  });
  const [interventionToEdit, setInterventionToEdit] = useState(null);

  useEffect(() => {
    afficherIntervention();
    fetch("http://localhost:8080/api/technicien")
      .then(res => res.json())
      .then(setTechniciens)
      .catch(err => console.error("Erreur chargement techniciens :", err));
    fetch("http://localhost:8080/api/machine")
      .then(res => res.json())
      .then(setMachines)
      .catch(err => console.error("Erreur chargement machines :", err));
  }, []);

  const afficherIntervention = () => {
    fetch("http://localhost:8080/api/intervention")
      .then(res => res.json())
      .then(setInterventions)
      .catch(err => console.error("Erreur lors de l'affichage :", err));
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          [name]: reader.result.split(',')[1]
        }));
      };
      if (file) reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      technicien: { id: Number(formData.technicienId) },
      machine: { id: Number(formData.machineId) },
      typeIntervention: formData.typeIntervention,
      description: formData.description,
      kmOuHeureMoteur: parseInt(formData.kmOuHeureMoteur),
      photoIntervention: formData.photoIntervention,
      signatures: formData.signatures,
      validationChefGarage: false,
      dateIntervention: formData.dateIntervention
    };

    const url = interventionToEdit
      ? `http://localhost:8080/api/intervention/${interventionToEdit.id}`
      : "http://localhost:8080/api/intervention";

    const method = interventionToEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend)
      });
      if (res.ok) {
        alert(interventionToEdit ? "Modifiée avec succès" : "Ajoutée avec succès");
        resetForm();
        afficherIntervention();
      } else {
        alert("Erreur lors de l'enregistrement");
      }
    } catch (err) {
      console.error("Erreur :", err);
    }
  };

  const handleEdit = (intervention) => {
    const technicien = techniciens.find(t =>
      t.nom === intervention.nomTechnicien &&
      t.prenom === intervention.prenomTechnicien
    );
    const machine = machines.find(m =>
      m.modele === intervention.modeleMachine &&
      m.type === intervention.typeMachine
    );

    setFormData({
      technicienId: technicien?.id || '',
      machineId: machine?.id || '',
      typeIntervention: intervention.typeIntervention,
      description: intervention.description,
      kmOuHeureMoteur: intervention.kmOuHeureMoteur,
      photoIntervention: intervention.photoIntervention,
      signatures: intervention.signatures,
      dateIntervention: intervention.dateIntervention,
      validationChefGarage: intervention.validationChefGarage
    });
    setInterventionToEdit(intervention);
  };

  const resetForm = () => {
    setFormData({
      technicienId: '',
      machineId: '',
      typeIntervention: '',
      description: '',
      kmOuHeureMoteur: '',
      photoIntervention: null,
      signatures: null,
      dateIntervention: '',
      validationChefGarage: false
    });
    setInterventionToEdit(null);
  };

  const supprimerIntervention = async (id) => {
    if (!window.confirm("Supprimer cette intervention ?")) return;
    try {
      const res = await fetch(`http://localhost:8080/api/intervention/${id}/desactiver`, {
        method: 'DELETE',
      });
      if (res.ok) {
        alert("Supprimée !");
        afficherIntervention();
      } else {
        alert("Erreur lors de la suppression");
      }
    } catch (err) {
      console.error("Erreur de suppression :", err);
    }
  };

  return (
    <div className="page-container">
      <h2>Formulaire Intervention</h2>
      <form className="contenu-form" onSubmit={handleSubmit}>

        <label>Technicien :</label><br />
        <select name="technicienId" value={formData.technicienId} onChange={handleChange} required>
          <option value="">-- Choisir un technicien --</option>
          {techniciens.map(t => (
            <option key={t.id} value={t.id}>{t.nom} {t.prenom}</option>
          ))}
        </select><br /><br />

        <label>Machine :</label><br />
        <select name="machineId" value={formData.machineId} onChange={handleChange} required>
          <option value="">-- Choisir une machine --</option>
          {machines.map(m => (
            <option key={m.id} value={m.id}>{m.type} - {m.modele}</option>
          ))}
        </select><br /><br />

        <label>Type d'intervention :</label><br />
        <input type="text" name="typeIntervention" value={formData.typeIntervention} onChange={handleChange} required /><br /><br />

        <label>Description :</label><br />
        <textarea name="description" value={formData.description} onChange={handleChange}></textarea><br /><br />

        <label>Heure moteur ou KM :</label><br />
        <input type="number" name="kmOuHeureMoteur" value={formData.kmOuHeureMoteur} onChange={handleChange} required /><br /><br />

        <label>Photo intervention :</label><br />
        <input type="file" name="photoIntervention" accept="image/*" onChange={handleChange} /><br /><br />

        <label>Signature :</label><br />
        <input type="file" name="signatures" accept="image/*" onChange={handleChange} /><br /><br />

        <label>Date intervention :</label><br />
        <input type="date" name="dateIntervention" value={formData.dateIntervention} onChange={handleChange} required /><br /><br />

        <button type="submit">{interventionToEdit ? "Modifier" : "Ajouter"}</button>
        {interventionToEdit && <button type="button" onClick={resetForm}>Annuler</button>}
      </form>

      <h2>Liste des interventions</h2>
      {interventions.length === 0 ? (
        <p>Aucune intervention enregistrée</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Modèle</th>
              <th>Type</th>
              <th>Intervention</th>
              <th>Description</th>
              <th>Heure/KM</th>
              <th>Photo</th>
              <th>Signature</th>
              <th>Date</th>
              <th>Validée ?</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {interventions.map((m, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{m.nomTechnicien}</td>
                <td>{m.prenomTechnicien}</td>
                <td>{m.modeleMachine}</td>
                <td>{m.typeMachine}</td>
                <td>{m.typeIntervention}</td>
                <td>{m.description}</td>
                <td>{m.kmOuHeureMoteur}</td>
                <td>{m.photoIntervention ? <img src={`data:image/jpeg;base64,${m.photoIntervention}`} alt="preuve" width="50" /> : "Aucune"}</td>
                <td>{m.signatures ? <img src={`data:image/jpeg;base64,${m.signatures}`} alt="signature" width="50" /> : "Aucune"}</td>
                <td>{m.dateIntervention}</td>
                <td>{m.validationChefGarage ? "✅" : "❌"}</td>
                <td>
                  <button onClick={() => handleEdit(m)}>Modifier</button>{' '}
                  <button onClick={() => supprimerIntervention(m.id)} style={{ backgroundColor: 'red', color: 'white' }}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default InterventionForm;