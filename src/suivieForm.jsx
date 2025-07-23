import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './dasboard.css';

function SuivieVidangeForm() {
  const [formData, setFormData] = useState({
    machineId: '',
    stockId: '',
    dernierSceanceKm: '',
    frequence: 2500,
    quantiteUtiliser: ''
  });

  const [machines, setMachines] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [suivies, setSuivies] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    chargerDonnees();
  }, []);

  const chargerDonnees = async () => {
    try {
      const [resMachines, resStocks, resSuivies] = await Promise.all([
        axios.get("http://localhost:8080/api/machine"),
        axios.get("http://localhost:8080/api/stock"),
        axios.get("http://localhost:8080/api/suivieVidange")
      ]);
      setMachines(resMachines.data);
      setStocks(resStocks.data);
      setSuivies(resSuivies.data);
    } catch (err) {
      console.error("Erreur chargement données :", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculerProchainKm = () => {
    const d = parseInt(formData.dernierSceanceKm);
    const f = parseInt(formData.frequence);
    return isNaN(d) || isNaN(f) ? '' : d + f;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = {
      machine: { id: Number(formData.machineId) },
      stock: { id: Number(formData.stockId) },
      dernierSceanceKm: Number(formData.dernierSceanceKm),
      frequence: Number(formData.frequence),
      quantiteUtiliser: Number(formData.quantiteUtiliser),
      prochainSceance: calculerProchainKm(),
      alerteVidange: false
    };

    const url = editId
      ? `http://localhost:8080/api/suivieVidange/${editId}`
      : `http://localhost:8080/api/suivieVidange`;
    const method = editId ? 'put' : 'post';

    try {
      await axios[method](url, dataToSend);
      alert(editId ? "Modifié avec succès" : "Ajouté avec succès");
      resetForm();
      chargerDonnees();
    } catch (err) {
      console.error("Erreur soumission :", err);
      alert("Erreur d'enregistrement");
    }
  };

  const handleEdit = (s) => {
    const machine = machines.find(m => m.type === s.typeMachine && m.modele === s.modeleMachine);
    const stock = stocks.find(p => p.nomProduit === s.produitUtiliser);

    setFormData({
      machineId: machine?.id || '',
      stockId: stock?.id || '',
      dernierSceanceKm: s.dernierSceanceKm,
      frequence: s.frequence,
      quantiteUtiliser: s.quantiteUtiliser
    });
    setEditId(s.id);
  };

  const resetForm = () => {
    setFormData({
      machineId: '',
      stockId: '',
      dernierSceanceKm: '',
      frequence: '',
      quantiteUtiliser: ''
    });
    setEditId(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette suivie ?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/suivieVidange/${id}/desactiver`);
      alert("Supprimée !");
      chargerDonnees();
    } catch (err) {
      console.error("Erreur suppression :", err);
    }
  };

  return (
    <div className="page-container">
      <h2>Formulaire Suivie Vidange</h2>
      <form className="contenu-form" onSubmit={handleSubmit}>
        <label>Machine :</label><br />
        <select name="machineId" value={formData.machineId} onChange={handleChange} required>
          <option value="">-- Choisir une machine --</option>
          {[...new Map(machines.map(m => [`${m.type}_${m.modele}`, m])).values()].map(m => (
            <option key={m.id} value={m.id}>
              {m.type} - {m.modele}
            </option>
          ))}
        </select><br /><br />

        <label>Produit utilisé :</label><br />
        <select name="stockId" value={formData.stockId} onChange={handleChange} required>
          <option value="">-- Choisir un produit --</option>
          {stocks.map(s => (
            <option key={s.id} value={s.id}>
              {s.nomProduit} (Stock: {s.quantite})
            </option>
          ))}
        </select><br /><br />

        <label>Dernier Sceance Km :</label><br />
        <input type="number" name="dernierSceanceKm" value={formData.dernierSceanceKm} onChange={handleChange} required /><br /><br />

        <label>Fréquence :</label><br />
        <input type="number" name="frequence" value={formData.frequence} onChange={handleChange} readOnly required /><br /><br />

        <label>Quantité utilisée :</label><br />
        <input type="number" name="quantiteUtiliser" value={formData.quantiteUtiliser} onChange={handleChange} required /><br /><br />

        <label>Prochaine Sceance (km) :</label><br />
        <input type="number" value={calculerProchainKm()} readOnly /><br /><br />

        <button type="submit">{editId ? "Modifier" : "Ajouter"}</button>
        {editId && <button type="button" onClick={resetForm}>Annuler</button>}
      </form>

      <h2>Liste des Suivies Vidanges</h2>
      {suivies.length === 0 ? (
        <p>Aucune suivie enregistrée</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Type Machine</th>
              <th>Modèle</th>
              <th>Dernier Km</th>
              <th>Fréquence</th>
              <th>Prochaine Sceance</th>
              <th>Produit</th>
              <th>Quantité</th>
              <th>Alerte</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {suivies.map((s, i) => (
              <tr key={s.id}>
                <td>{i + 1}</td>
                <td>{s.typeMachine}</td>
                <td>{s.modeleMachine}</td>
                <td>{s.dernierSceanceKm}</td>
                <td>{s.frequence}</td>
                <td>{s.prochainSceance}</td>
                <td>{s.produitUtiliser}</td>
                <td>{s.quantiteUtiliser}</td>
                <td>{s.alerteVidange ? "Oui" : "Non"}</td>
                <td>
                  <button onClick={() => handleEdit(s)}>Modifier</button>
                  <button onClick={() => handleDelete(s.id)} style={{ backgroundColor: "red", color: "white" }}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SuivieVidangeForm;