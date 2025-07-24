import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MachineTable.css';

function ProduitUtiliserForm() {
  const [produitsUtilises, setProduitsUtilises] = useState([]);
  const [interventions, setInterventions] = useState([]);
  const [stocks, setStocks] = useState([]);

  const [formData, setFormData] = useState({
    interventionId: '',
    stockId: '',
    quantiteUtilisee: ''
  });

  const [produitToEdit, setProduitToEdit] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    chargerDonnees();
  }, []);

  const chargerDonnees = async () => {
    try {
      const [resProduits, resInterventions, resStocks] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/api/produit`),
        axios.get(`${process.env.REACT_APP_API_URL}/api/intervention`),
        axios.get(`${process.env.REACT_APP_API_URL}/api/stock`)
      ]);
      setProduitsUtilises(resProduits.data);
      setInterventions(resInterventions.data);
      setStocks(resStocks.data);
    } catch (err) {
      console.error("Erreur lors du chargement :", err);
      alert("Erreur lors du chargement des données");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dataToSend = {
      intervention: { id: Number(formData.interventionId) },
      stock: { id: Number(formData.stockId) },
      quantiteUtiliser: Number(formData.quantiteUtilisee)
    };

    const url = produitToEdit
       ? `${process.env.REACT_APP_API_URL}/api/produit/${produitToEdit.id}`
      : `${process.env.REACT_APP_API_URL}/api/produit`;

    try {
      if (produitToEdit) {
        await axios.put(url, dataToSend);
        alert("Produit utilisé modifié avec succès");
      } else {
        await axios.post(url, dataToSend);
        alert("Produit utilisé ajouté avec succès");
      }
      resetForm();
      chargerDonnees();
    } catch (err) {
      console.error("Erreur lors de l'enregistrement :", err);
      alert("Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (produit) => {
    const intervention = interventions.find(i =>
      i.typeIntervention === produit.typeIntervention
    );
    const stock = stocks.find(s =>
      s.nomProduit === produit.nomProduit
    );

    setFormData({
      interventionId: intervention?.id || '',
      stockId: stock?.id || '',
      quantiteUtilisee: produit.quantiteUtilisee
    });

    setProduitToEdit(produit);
  };

  const resetForm = () => {
    setFormData({ interventionId: '', stockId: '', quantiteUtilisee: '' });
    setProduitToEdit(null);
  };

  const supprimerProduit = async (id) => {
    if (!window.confirm("Supprimer ce produit utilisé ?")) return;
    try {
       await axios.delete(`${process.env.REACT_APP_API_URL}/api/produit/${id}/desactiver`);
      alert("Produit utilisé supprimé");
      chargerDonnees();
    } catch (err) {
      console.error("Erreur suppression :", err);
      alert("Erreur lors de la suppression");
    }
  };

  return (
    <div className="page-container">
      <h2>Formulaire Produit Utilisé</h2>
      <form className="contenu-form" onSubmit={handleSubmit}>
        <label>Type d'intervention :</label><br />
        <select
          name="interventionId"
          value={formData.interventionId}
          onChange={handleChange}
          required
        >
          <option value="">-- Choisir une intervention --</option>
          {interventions.map(i => (
            <option key={i.id} value={i.id}>
              {i.typeIntervention} ({i.dateIntervention}) ({i.nomTechnicien})
            </option>
          ))}
        </select><br /><br />

        <label>Produit utilisé :</label><br />
        <select
          name="stockId"
          value={formData.stockId}
          onChange={handleChange}
          required
        >
          <option value="">-- Choisir un produit --</option>
          {stocks.map(s => (
            <option key={s.id} value={s.id}>
              {s.nomProduit} (Stock: {s.quantite}, Seuil: {s.seuilAlerte})
            </option>
          ))}
        </select><br /><br />

        <label>Quantité utilisée :</label><br />
        <input
          type="number"
          name="quantiteUtilisee"
          value={formData.quantiteUtilisee}
          onChange={handleChange}
          step="0.01"
          min="0"
          required
        /><br /><br />

        <button type="submit" disabled={loading}>
          {produitToEdit ? "Modifier" : "Ajouter"}
        </button>
        {produitToEdit && (
          <button type="button" onClick={resetForm}>Annuler</button>
        )}
      </form>

      <h2>Liste des Produits Utilisés</h2>
      {produitsUtilises.length === 0 ? (
        <p>Aucun produit utilisé</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nom Technicien</th>
              <th>Type Intervention</th>
              <th>Produit</th>
              <th>Quantité Utilisée</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {produitsUtilises.map((p, index) => (
              <tr key={p.id}>
                <td>{index + 1}</td>
                <td>{p.nomTechnicien}</td>
                <td>{p.typeIntervention}</td>
                <td>{p.nomProduit}</td>
                <td>{p.quantiteUtilisee}</td>
                <td>
                  <button onClick={() => handleEdit(p)}>Modifier</button>{' '}
                  <button
                    onClick={() => supprimerProduit(p.id)}
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

export default ProduitUtiliserForm;