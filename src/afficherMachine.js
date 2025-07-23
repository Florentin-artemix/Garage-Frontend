import React,{useState,useEffect} from 'react';
import './dasboard.css';
function AfficherMachine(){
  const [machines,setMachines]=useState([]);
  useEffect(()=>{
    afficherMachine();
  },[]);
  const afficherMachine=()=>{
    fetch("http://localhost:8080/api/machine")
    .then(res=>res.json())
    .then(data => setMachines(data))
    .catch(err =>console.log("erreur lors de l'affichage de machine :",err));
  };

  return(
    <div className="page-container">
    <h3 className="section-title">Liste des Machines</h3>
    {machines.length === 0 ? (<p>Aucune machine Enregistrer</p>):(
      <table className="data-table">
      <thead>
      <tr>
      <th>#</th>
      <th>Type</th>
      <th>Modele</th>
      <th>Numéro Immatriculation</th>
      <th>Date Mise En Service</th>
      <th>Heure service Moteur</th>
      <th>Date Prochain Vidange</th>
      <th>Service Actuel</th>
      </tr>
      </thead>
      <tbody>
      {machines.map((m,index) =>(
        <tr key={index}>
          <td>{index +1}</td>
          <td>{m.type}</td>
          <td>{m.modele}</td>
          <td>{m.numeroImmatriculation}</td>
          <td>{m.dateMiseEnService}</td>
          <td>{m.heureServiceMoteur}</td>
          <td>{m.dateProchainVidange}</td>
          <td>{m.statutActuel}</td>
          </tr>
      ))}
      </tbody>
      </table>
    )
    }
    </div> 
    );
}
export default AfficherMachine;