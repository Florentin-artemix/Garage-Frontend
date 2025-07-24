import React, { useEffect, useState } from 'react';
import './dasboard.css';
import './MachineTable.css';

function Dashboard() {
  const [techniciens, setTechniciens] = useState([]);
  const [machines, setMachines] = useState([]);
  const [machinesDeclassees, setMachinesDeclassees] = useState([]);
  const [interventions, setInterventions] = useState([]);
  const [entretiens, setEntretiens] = useState([]);
  const [travaux, setTravaux] = useState([]);
  const [produits, setProduits] = useState([]);
  const [vidanges, setVidanges] = useState([]);
  const [historiques, setHistoriques] = useState([]);
  const [techniciensDeclassees, setTechniciensDeclassees] = useState([]);
  const [entretiensDeclassees, setEntretiensDeclassees] = useState([]);
  const [interventionsDeclassees, setInterventionsDeclassees] = useState([]);
  const [travauxDeclassees, setTravauxDeclassees] = useState([]);
  const [produitsDeclassees, setProduitsDeclassees] = useState([]);
  const [suivieVidangeDeclassees, setSuivieVidangeDeclassees] = useState([]);
  const [stocksDeclassees, setStocksDeclassees] = useState([]);

  useEffect(() => {
    chargerToutesLesDonnees();
    const interval = setInterval(() => {
      chargerToutesLesDonnees();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const chargerToutesLesDonnees = () => {
    fetch(`${process.env.REACT_APP_API_URL}/api/technicien`).then(r => r.json()).then(setTechniciens);
    fetch(`${process.env.REACT_APP_API_URL}/api/machine`).then(r => r.json()).then(setMachines);
    fetch(`${process.env.REACT_APP_API_URL}/api/machine/declassees`).then(r => r.json()).then(setMachinesDeclassees);
    fetch(`${process.env.REACT_APP_API_URL}/api/intervention`).then(r => r.json()).then(setInterventions);
    fetch(`${process.env.REACT_APP_API_URL}/api/entretien`).then(r => r.json()).then(setEntretiens);
    fetch(`${process.env.REACT_APP_API_URL}/api/travail`).then(r => r.json()).then(setTravaux);
    fetch(`${process.env.REACT_APP_API_URL}/api/produit`).then(r => r.json()).then(setProduits);
    fetch(`${process.env.REACT_APP_API_URL}/api/suivieVidange`).then(r => r.json()).then(setVidanges);
    fetch(`${process.env.REACT_APP_API_URL}/api/historique`)
      .then(r => r.json())
      .then(data => {
        const deuxJours = 2 * 24 * 60 * 60 * 1000;
        const maintenant = new Date();
        const recents = data.filter(h => {
          const d = new Date(h.dateModification);
          return maintenant - d <= deuxJours;
        });
        setHistoriques(recents);
      });
    fetch(`${process.env.REACT_APP_API_URL}/api/technicien/desactiver`).then(r => r.json()).then(setTechniciensDeclassees);
    fetch(`${process.env.REACT_APP_API_URL}/api/entretien/desactiver`).then(r => r.json()).then(setEntretiensDeclassees);
    fetch(`${process.env.REACT_APP_API_URL}/api/intervention/desactiver`).then(r => r.json()).then(setInterventionsDeclassees);
    fetch(`${process.env.REACT_APP_API_URL}/api/travail/desactiver`).then(r => r.json()).then(setTravauxDeclassees);
    fetch(`${process.env.REACT_APP_API_URL}/api/produit/desactiver`).then(r => r.json()).then(setProduitsDeclassees);
    fetch(`${process.env.REACT_APP_API_URL}/api/suivieVidange/desactiver`).then(r => r.json()).then(setSuivieVidangeDeclassees);
    fetch(`${process.env.REACT_APP_API_URL}/api/stock/desactiver`).then(r => r.json()).then(setStocksDeclassees);
  };

  const heuresParTechnicien = {};
  travaux.forEach(t => {
    const nom = t.nomTechnicien + " " + t.prenomTechnicien;
    heuresParTechnicien[nom] = (heuresParTechnicien[nom] || 0) + parseFloat(t.heureTravail || 0);
  });
  const topTechnicien = Object.entries(heuresParTechnicien).sort((a, b) => b[1] - a[1])[0];

  const pannesParMachine = {};
  interventions.forEach(i => {
    if (i.typeIntervention === "depannage" && i.modeleMachine) {
      const nom = i.modeleMachine;
      pannesParMachine[nom] = (pannesParMachine[nom] || 0) + 1;
    }
  });
  const machinePanne = Object.entries(pannesParMachine).sort((a, b) => b[1] - a[1])[0];

  const maintenant = new Date();
  const alertesVidange = vidanges.filter(v => {
    return (v.prochaineVidangeDate && new Date(v.prochaineVidangeDate) < maintenant)
      || (v.prochaineVidangeKm && v.kilometrageActuel > v.prochaineVidangeKm);
  });

  const machinesEnService = machines.filter(m => m.statutActuel === "EN_SERVICE").length;
  const machineEnPanne = machines.filter(m => m.statutActuel === "EN_PANNE").length;
  const machineEnAttente = machines.filter(m => m.statutActuel === "EN_ATTENTE").length;
  const machineDeclasee = machinesDeclassees.filter(m => m.statutActuel === "DECLASSEE").length;

  const nbInterventionsValidees = interventions.filter(i => i.validationChefGarage === true).length;
  const nbInterventionsInvalidees = interventions.filter(i => i.validationChefGarage === false);


  function validerIntervention(id) {
    fetch(`${process.env.REACT_APP_API_URL}/api/intervention/${id}/valider`, { method: "PUT" })
      .then(() => {
        fetch(`${process.env.REACT_APP_API_URL}/api/intervention`).then(res => res.json()).then(setInterventions);
      })
      .catch(err => console.error("Erreur de validation :", err));
  }

  return (
    <div className="dashboard-container">
      <h2>📊 Tableau de bord - Chef de Garage</h2>

      <div className="kpi-grid">
        <Kpi label="👷 Techniciens" value={techniciens.length} />
        <Kpi label="🚜 Machines" value={machines.length} />
        <Kpi label="🛠️ Interventions" value={interventions.length} />
        <Kpi label="🔧 Entretiens" value={entretiens.length} />
        <Kpi label="📋 Travaux" value={travaux.length} />
        <Kpi label="🧴 Produits utilisés" value={produits.length} />
      </div>

      <div style={{ marginTop: 40 }}>
        <h3>📈 Analyse rapide</h3>
        <ul className="analysis-list">
          <li>🏅 Technicien le plus actif : <b>{topTechnicien?.[0] || "N/A"}</b> ({topTechnicien?.[1]?.toFixed(2)} h)</li>
          <li>⚙️ Machine la plus en panne : <b>{machinePanne?.[0] || "Aucune"}</b> ({machinePanne?.[1] || 0} fois)</li>
          <li>⛽️ Machines à vidanger : <b>{alertesVidange.length}</b></li>
          <li>✅ Interventions validées : <b>{nbInterventionsValidees} / {interventions.length}</b></li>
          <li>🚀 Machines en service : <b>{machinesEnService}</b></li>
          <li>🛑 Machines en panne : <b>{machineEnPanne}</b></li>
          <li>⏳ Machines en attente : <b>{machineEnAttente}</b></li>
          <li>🗑️ Machines décl./hors-service : <b>{machineDeclasee}</b></li>
        </ul>
      </div>
 
      <div className="table-wrapper">
        <h3 className="section-title">✔ Interventions à Valider</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Modèle</th>
              <th>Type</th>
              <th>Description</th>
              <th>Km/Heure</th>
              <th>Preuve Photo</th>
              <th>Signature</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {nbInterventionsInvalidees.length === 0 ? (
              <tr><td colSpan="11" style={{ textAlign: "center" }}>Aucune intervention à valider</td></tr>
            ) : (
              nbInterventionsInvalidees.map((m, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{m.nomTechnicien}</td>
                  <td>{m.prenomTechnicien}</td>
                  <td>{m.modeleMachine}</td>
                  <td>{m.typeMachine}</td>
                  <td>{m.description}</td>
                  <td>{m.kmOuHeureMoteur}</td>
                  <td>{m.photoIntervention ? <img src={`data:image/jpeg;base64,${m.photoIntervention}`} alt="preuve" width="50" /> : "Aucune"}</td>
                  <td>{m.signatures ? <img src={`data:image/jpeg;base64,${m.signatures}`} alt="signature" width="50" /> : "Aucune"}</td>
                  <td>{m.dateIntervention}</td>
                  <td><button onClick={()=> {validerIntervention(m.id)}}>Valider</button></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>     

      <div className="table-wrapper">
        <h3 className="section-title">🗑️ Techniciens déclassés</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nom</th>
              <th>Post-nom</th>
              <th>Prénom</th>
              <th>Âge</th>
              <th>Rôle</th>
            </tr>
          </thead>
          <tbody>
            {techniciensDeclassees.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: "center" }}>Aucun technicien déclassé</td></tr>
            ) : (
              techniciensDeclassees.map((t, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{t.nom}</td>
                  <td>{t.postNom}</td>
                  <td>{t.prenom}</td>
                  <td>{t.age}</td>
                  <td>{t.role}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="table-wrapper">
        <h3 className="section-title">🗑️ Machines déclassées</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Modèle</th>
              <th>Immatriculation</th>
              <th>Date mise en service</th>
              <th>Heure moteur</th>
              <th>Date vidange</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {machinesDeclassees.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: "center" }}>Aucune machine déclassée</td></tr>
            ) : (
              machinesDeclassees.map((m, i) => (
                <tr key={i}>
                  <td>{m.type}</td>
                  <td>{m.modele}</td>
                  <td>{m.numeroImmatriculation}</td>
                  <td>{m.dateMiseEnService}</td>
                  <td>{m.heureServiceMoteur}</td>
                  <td>{m.dateProchainVidange}</td>
                  <td>{m.statutActuel}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="table-wrapper">
        <h3 className="section-title">🗑️ Interventions déclassées</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Modèle</th>
              <th>Type</th>
              <th>Description</th>
              <th>Km/Heure</th>
              <th>Preuve Photo</th>
              <th>Signature</th>
              <th>Date</th>
              <th>Validée</th>
            </tr>
          </thead>
          <tbody>
            {interventionsDeclassees.length === 0 ? (
              <tr><td colSpan="11" style={{ textAlign: "center" }}>Aucune intervention déclassée</td></tr>
            ) : (
              interventionsDeclassees.map((m, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{m.nomTechnicien}</td>
                  <td>{m.prenomTechnicien}</td>
                  <td>{m.modeleMachine}</td>
                  <td>{m.typeMachine}</td>
                  <td>{m.description}</td>
                  <td>{m.kmOuHeureMoteur}</td>
                  <td>{m.photoIntervention ? <img src={`data:image/jpeg;base64,${m.photoIntervention}`} alt="preuve" width="50" /> : "Aucune"}</td>
                  <td>{m.signatures ? <img src={`data:image/jpeg;base64,${m.signatures}`} alt="signature" width="50" /> : "Aucune"}</td>
                  <td>{m.dateIntervention}</td>
                  <td>{m.validationChefGarage ? "✅" : "❌"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="table-wrapper">
        <h3 className="section-title">📜 Historique des modifications (2 derniers jours)</h3>
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
            {historiques.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: "center" }}>Aucune modification récente</td></tr>
            ) : (
              historiques.map((h, i) => (
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

      <div className="table-wrapper">
        <h3 className="section-title">🗑️ Techniciens déclassés</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nom</th>
              <th>Post-nom</th>
              <th>Prénom</th>
              <th>Âge</th>
              <th>Rôle</th>
            </tr>
          </thead>
          <tbody>
            {techniciensDeclassees.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: "center" }}>Aucun technicien déclassé</td></tr>
            ) : (
              techniciensDeclassees.map((t, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{t.nom}</td>
                  <td>{t.postNom}</td>
                  <td>{t.prenom}</td>
                  <td>{t.age}</td>
                  <td>{t.role}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="table-wrapper">
        <h3 className="section-title">🗑️ Machines déclassées</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Modèle</th>
              <th>Immatriculation</th>
              <th>Date mise en service</th>
              <th>Heure moteur</th>
              <th>Date vidange</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {machinesDeclassees.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: "center" }}>Aucune machine déclassée</td></tr>
            ) : (
              machinesDeclassees.map((m, i) => (
                <tr key={i}>
                  <td>{m.type}</td>
                  <td>{m.modele}</td>
                  <td>{m.numeroImmatriculation}</td>
                  <td>{m.dateMiseEnService}</td>
                  <td>{m.heureServiceMoteur}</td>
                  <td>{m.dateProchainVidange}</td>
                  <td>{m.statutActuel}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="table-wrapper">
        <h3 className="section-title">🗑️ Interventions déclassées</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Modèle</th>
              <th>Type</th>
              <th>Description</th>
              <th>Km/Heure</th>
              <th>Preuve Photo</th>
              <th>Signature</th>
              <th>Date</th>
              <th>Validée</th>
            </tr>
          </thead>
          <tbody>
            {interventionsDeclassees.length === 0 ? (
              <tr><td colSpan="11" style={{ textAlign: "center" }}>Aucune intervention déclassée</td></tr>
            ) : (
              interventionsDeclassees.map((m, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{m.nomTechnicien}</td>
                  <td>{m.prenomTechnicien}</td>
                  <td>{m.modeleMachine}</td>
                  <td>{m.typeMachine}</td>
                  <td>{m.description}</td>
                  <td>{m.kmOuHeureMoteur}</td>
                  <td>{m.photoIntervention ? <img src={`data:image/jpeg;base64,${m.photoIntervention}`} alt="preuve" width="50" /> : "Aucune"}</td>
                  <td>{m.signatures ? <img src={`data:image/jpeg;base64,${m.signatures}`} alt="signature" width="50" /> : "Aucune"}</td>
                  <td>{m.dateIntervention}</td>
                  <td>{m.validationChefGarage ? "✅" : "❌"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="table-wrapper">
        <h3 className="section-title">🗑️ Produits utilisés déclassés</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nom Technicien</th>
              <th>Type Intervention</th>
              <th>Produit</th>
              <th>Quantité</th>
            </tr>
          </thead>
          <tbody>
            {produitsDeclassees.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: "center" }}>Aucun produit utilisé déclassé</td></tr>
            ) : (
              produitsDeclassees.map((p, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{p.nomTechnicien}</td>
                  <td>{p.typeIntervention}</td>
                  <td>{p.nomProduit}</td>
                  <td>{p.quantiteUtilisee}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="table-wrapper">
        <h3 className="section-title">🗑️ Stocks déclassés</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Produit</th>
              <th>Quantité</th>
              <th>Fournisseur</th>
              <th>Prix Unitaire</th>
              <th>Seuil</th>
            </tr>
          </thead>
          <tbody>
            {stocksDeclassees.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: "center" }}>Aucun stock déclassé</td></tr>
            ) : (
              stocksDeclassees.map((s, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{s.nomProduit}</td>
                  <td>{s.quantite}</td>
                  <td>{s.fournisseur}</td>
                  <td>{s.prixUnitaire}</td>
                  <td>{s.seuilAlerte}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Tu peux ajouter ici tous les tableaux comme tu les as faits (techniciens déclassés, interventions, etc.) */}
    </div>
  );
}

function Kpi({ label, value }) {
  return (
    <div className="kpi-card">
      <div style={{ fontSize: 22, fontWeight: 'bold' }}>{value}</div>
      <div style={{ fontSize: 14 }}>{label}</div>
    </div>
  );
}

export default Dashboard;