import React,{useState,useEffect} from 'react';
import './dasboard.css';
function AfficherIntervention(){
  const [interventions,setInterventions]=useState([]);
  useEffect(()=>{
    afficherIntervention();
  },[]);
  const afficherIntervention=()=>{
    fetch(`${process.env.REACT_APP_API_URL}/api/intervention`)
    .then(res=>res.json())
    .then(data => setInterventions(data))
    .catch(err =>console.log("erreur lors de l'affichage de interventions :",err));;
  };
  
  return(
    <div className="page-container">
    <h3 className="section-title">Liste des intervention</h3>
    {interventions.length === 0 ? (<p>Aucune intervention Enregistrer</p>):(
      <table className="data-table">
      <thead>
      <tr>
      <th>#</th>
      <th>Nom Technicien</th>
      <th>Prenom Technicien</th>
      <th>Modele Machine</th>
      <th>Type Machine</th>
      <th>Type intervention</th>
      <th>Descripion</th>
      <th>Heure Moteur Ou Km</th>
      <th>Photo intervention</th>
      <th>Signature</th>
      <th>Date d'Intervention</th>
      <th>Validation Chef Garage</th>
      </tr>
      </thead>
      <tbody>
      {interventions.map((m,index) =>(
        <tr key={index}>
          <td>{index +1}</td>
          <td>{m.nomTechnicien}</td>
          <td>{m.prenomTechnicien}</td>
          <td>{m.modeleMachine}</td>
          <td>{m.typeMachine}</td>
          <td>{m.typeIntervention}</td>
          <td>{m.description}</td>
          <td>{m.kmOuHeureMoteur}</td>
          <td>{m.photoIntervention?(<img src={`data:image/jpeg;base64,${m.photoIntervention}`}alt="preuve" width="60"/>):("Aucune")}</td>
          <td>{m.signatures?(<img src={`data:image/jpeg;base64,${m.signatures}`}alt="sinatures" width="60"/>):("Aucune")}</td>
          <td>{m.dateIntervention}</td>
          <td>{m.validationChefGarage?("Oui"):("Non")}</td>
          </tr>
      ))}
      </tbody>
      </table>
    )
    }
    </div> 
    );
}
export default AfficherIntervention;