import React,{useState,useEffect} from 'react';
import './dasboard.css';
function AfficherSuivieVidange(){
  const [suivieVidange,setSuivieVidange]=useState([]);
  useEffect(()=>{
    afficherSuivie();
  },[]);
  const afficherSuivie=()=>{
    fetch("http://localhost:8080/api/suivieVidange")
    .then(res=>res.json())
    .then(data => setSuivieVidange(data))
    .catch(err =>console.log("erreur lors de l'affichage des Suivies Vidanges :",err));
  };

  return(
    <div className="page-container">
    <h3 className="section-title">Liste des Suivies Des Vidange</h3>
    {suivieVidange.length === 0 ? (<p>Aucune Suivie Vidange Enregistrer</p>):(
      <table className="data-table">
      <thead>
      <tr>
      <th>#</th>
      <th>Type Machine</th>
      <th>Modele Machine</th>
      <th>Dernier Sceance en Km</th>
      <th>Frequence</th>
      <th>Prochaine Sceance</th>
      <th>Produit Utiliser</th>
      <th>Quantiter Utilisée</th>
      <th>Alerte Vidange</th>
      </tr>
      </thead>
      <tbody>
      {suivieVidange.map((m,index) =>(
        <tr key={index}>
          <td>{index +1}</td>
          <td>{m.typeMachine}</td>
          <td>{m.modeleMachine}</td>
          <td>{m.dernierSceanceKm}</td>
          <td>{m.frequence}</td>
          <td>{m.prochainSceance}</td>
          <td>{m.produitUtiliser}</td>
          <td>{m.quantiteUtiliser}</td>
          <td>{m.alerteVidange?("Oui"):("Non")}</td>
          </tr>
      ))}
      </tbody>
      </table>
    )
    }
    </div> 
    );
}
export default AfficherSuivieVidange;