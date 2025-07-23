import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './dasboard.css';

function Historique() {
  const [historiques, setHistoriques] = useState([]);
  const [filtreEntite, setFiltreEntite] = useState('TOUT');

  useEffect(() => {
    chargerHistorique();
  }, []);

  const chargerHistorique = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/historique");
      setHistoriques(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement de l'historique :", error);
    }
  };

  const entitesDisponibles = [...new Set(historiques.map(h => h.entite))];

  const historiquesFiltres = filtreEntite === 'TOUT'
    ? historiques
    : historiques.filter(h => h.entite === filtreEntite);

  return (
    <div className="dashboard-container">
      <h2>📜 Historique complet des modifications</h2>

      <div style={{ marginBottom: 20 }}>
        <label style={{ marginRight: 10 }}>Filtrer par entité :</label>
        <select onChange={(e) => setFiltreEntite(e.target.value)} value={filtreEntite}>
          <option value="TOUT">Toutes</option>
          {entitesDisponibles.map(entite => (
            <option key={entite} value={entite}>{entite}</option>
          ))}
        </select>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Entité</th>
              <th>ID</th>
              <th>Champ</th>
              <th>Ancienne valeur</th>
              <th>Nouvelle valeur</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {historiquesFiltres.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", fontStyle: "italic" }}>
                  Aucune donnée
                </td>
              </tr>
            ) : (
              historiquesFiltres.map((h, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{h.entite}</td>
                  <td>{h.entiteId}</td>
                  <td>{h.champModifie}</td>
                  <td>{h.ancienneValeur}</td>
                  <td>{h.nouvelleValeur}</td>
                  <td>{h.dateModification}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Historique;