import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MachineTable.css';

const MachineTable = () => {
  const [machines, setMachines] = useState([]);
  const [formData, setFormData] = useState({
    type: '',
    modele: '',
    numeroImmatriculation: '',
    dateMiseEnService: '',
    heureServiceMoteur: '',
    dateProchainVidange: '',
    statutActuel: 'EN_SERVICE'
  });
  const [machineToEdit, setMachineToEdit] = useState(null);

  const fetchMachines = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/machine`);
      setMachines(res.data);
    } catch (err) {
      console.error('Erreur lors du chargement des machines', err);
    }
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (machineToEdit) {
        await axios.put(`${process.env.REACT_APP_API_URL}/api/machine/${machineToEdit.id}`, formData);
        alert('Machine modifiée avec succès');
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/machine`, formData);
        alert('Machine ajoutée avec succès');
      }
      resetForm();
      fetchMachines();
    } catch (err) {
      alert("Erreur lors de l'enregistrement");
      console.error(err);
    }
  };

  const handleEdit = (machine) => {
    setFormData({ ...machine });
    setMachineToEdit(machine);
  };

  const cancelEdit = () => {
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      type: '',
      modele: '',
      numeroImmatriculation: '',
      dateMiseEnService: '',
      heureServiceMoteur: '',
      dateProchainVidange: '',
      statutActuel: 'EN_SERVICE'
    });
    setMachineToEdit(null);
  };

  const declasserMachine = async (id) => {
    try {
      const res = await axios.delete(`${process.env.REACT_APP_API_URL}/api/machine/${id}/declasser`);
      alert(res.data);
      fetchMachines();
    } catch (err) {
      alert("Échec de déclassement");
      console.error(err);
    }
  };

  const machinesActives = machines.filter(m => m.statutActuel !== 'DECLASSEE');

  const renderStatutLabel = (statut) => {
    return <span className={`statut-label ${statut.toLowerCase()}`}>{statut.replace('_', ' ')}</span>;
  };

  return (
    <div className="table-container">
      <h2>Formulaire Machine</h2>
      <form className="contenu-form" onSubmit={handleSubmit}>
        <label>Type :</label><br />
        <input type="text" name="type" value={formData.type} onChange={handleChange} required /><br /><br />

        <label>Modèle :</label><br />
        <input type="text" name="modele" value={formData.modele} onChange={handleChange} required /><br /><br />

        <label>Immatriculation :</label><br />
        <input type="text" name="numeroImmatriculation" value={formData.numeroImmatriculation} onChange={handleChange} required /><br /><br />

        <label>Date de mise en service :</label><br />
        <input type="date" name="dateMiseEnService" value={formData.dateMiseEnService} onChange={handleChange} required /><br /><br />

        <label>Heure service moteur :</label><br />
        <input type="number" name="heureServiceMoteur" value={formData.heureServiceMoteur} onChange={handleChange} required /><br /><br />

        <label>Date prochain vidange :</label><br />
        <input type="date" name="dateProchainVidange" value={formData.dateProchainVidange} onChange={handleChange} required /><br /><br />

        <label>Statut actuel :</label><br />
        <select name="statutActuel" value={formData.statutActuel} onChange={handleChange}>
          <option value="EN_SERVICE">En service</option>
          <option value="EN_PANNE">En panne</option>
          <option value="EN_ATTENTE">En attente</option>
        </select><br /><br />

        <button type="submit">{machineToEdit ? 'Modifier' : 'Ajouter'}</button>
        {machineToEdit && (
          <>
            &nbsp;
            <button type="button" onClick={cancelEdit}>Annuler modification</button>
          </>
        )}
      </form>

      <h2>Liste des machines</h2>
      <table className="machine-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Modèle</th>
            <th>Immatriculation</th>
            <th>Date mise en service</th>
            <th>Heure service moteur</th>
            <th>Date prochain vidange</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {machinesActives.map((machine) => (
            <tr key={machine.id}>
              <td>{machine.type}</td>
              <td>{machine.modele}</td>
              <td>{machine.numeroImmatriculation}</td>
              <td>{machine.dateMiseEnService}</td>
              <td>{machine.heureServiceMoteur}</td>
              <td>{machine.dateProchainVidange}</td>
              <td>{renderStatutLabel(machine.statutActuel)}</td>
              <td>
                <button onClick={() => handleEdit(machine)}>Modifier</button>
                &nbsp;
                <button onClick={() => declasserMachine(machine.id)} className="btn-declasser">Déclasser</button>
              </td>
            </tr>
          ))}
          {machinesActives.length === 0 && (
            <tr>
              <td colSpan="8" className="no-machine-row">
                Aucune machine active à afficher.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MachineTable;