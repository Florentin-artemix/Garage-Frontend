import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MachineTable.css';

function StockForm() {
  const [stocks, setStocks] = useState([]);
  const [stockToEdit, setStockToEdit] = useState(null);
  const [formData, setFormData] = useState({
    nomProduit: '',
    quantite: '',
    fournisseur: '',
    prixUnitaire: '',
    seuilAlerte: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // ✅ message du backend

  useEffect(() => {
    chargerStocks();
  }, []);

  const chargerStocks = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/stock`);
      setStocks(res.data);
    } catch (err) {
      console.error("Erreur chargement stocks :", err);
      setMessage("Erreur lors du chargement du stock.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const dataToSend = {
      ...formData,
      quantite: parseFloat(formData.quantite),
      prixUnitaire: parseFloat(formData.prixUnitaire),
      seuilAlerte: parseInt(formData.seuilAlerte)
    };

    const url = stockToEdit
       ? `${process.env.REACT_APP_API_URL}/api/stock/${stockToEdit.id}`
      : `${process.env.REACT_APP_API_URL}/api/stock`;

    try {
      if (stockToEdit) {
        const response= await axios.put(url, dataToSend);
        alert(response.data);
       
      } else {
        const response=await axios.post(url, dataToSend);
        alert(response.data);
      }
      resetForm();
      chargerStocks();
    } catch (err) {
      console.error("Erreur enregistrement :", err);
      setMessage("❌ Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (stock) => {
    setFormData({
      nomProduit: stock.nomProduit,
      quantite: stock.quantite,
      fournisseur: stock.fournisseur,
      prixUnitaire: stock.prixUnitaire,
      seuilAlerte: stock.seuilAlerte
    });
    setStockToEdit(stock);
    setMessage(null);
  };

  const supprimerStock = async (id) => {
    if (!window.confirm("Confirmer la suppression ?")) return;
    try {
      const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/stock/${id}/desactiver`);
      alert(response.data);
      chargerStocks();
    } catch (err) {
      console.error("Erreur suppression :", err);
      alert("❌ Erreur lors de la suppression");
    }
  };

  const resetForm = () => {
    setFormData({
      nomProduit: '',
      quantite: '',
      fournisseur: '',
      prixUnitaire: '',
      seuilAlerte: ''
    });
    setStockToEdit(null);
    setMessage(null);
  };

  return (
    <div className="page-container">
      <h2>Gestion du Stock</h2>
      <form className="contenu-form" onSubmit={handleSubmit}>
        <label>Nom du produit :</label><br />
        <input name="nomProduit" value={formData.nomProduit} onChange={handleChange} required /><br /><br />

        <label>Quantité :</label><br />
        <input type="number" name="quantite" value={formData.quantite} onChange={handleChange} step="0.01" required /><br /><br />

        <label>Fournisseur :</label><br />
        <input name="fournisseur" value={formData.fournisseur} onChange={handleChange} required /><br /><br />

        <label>Prix unitaire :</label><br />
        <input type="number" name="prixUnitaire" value={formData.prixUnitaire} onChange={handleChange} step="0.01" required /><br /><br />

        <label>Seuil d’alerte :</label><br />
        <input type="number" name="seuilAlerte" value={formData.seuilAlerte} onChange={handleChange} required /><br /><br />

        <button type="submit" disabled={loading}>
          {stockToEdit ? "Modifier" : "Ajouter"}
        </button>
        {stockToEdit && <button type="button" onClick={resetForm}>Annuler</button>}
      </form>

      <h3>Liste des Produits en Stock</h3>
      {stocks.length === 0 ? (
        <p>Aucun produit en stock</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nom</th>
              <th>Quantité</th>
              <th>Fournisseur</th>
              <th>Prix Unitaire</th>
              <th>Seuil</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((s, i) => (
              <tr key={s.id} style={{ backgroundColor: s.quantite <= s.seuilAlerte ? '#ffe6e6' : 'transparent' }}>
                <td>{i + 1}</td>
                <td>{s.nomProduit}</td>
                <td>{s.quantite}</td>
                <td>{s.fournisseur}</td>
                <td>{s.prixUnitaire}</td>
                <td>{s.seuilAlerte}</td>
                <td>
                  <button onClick={() => handleEdit(s)}>Modifier</button>{' '}
                  <button onClick={() => supprimerStock(s.id)} style={{ backgroundColor: 'red', color: 'white' }}>
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

export default StockForm;