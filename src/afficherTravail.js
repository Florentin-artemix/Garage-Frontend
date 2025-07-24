import React,{useState,useEffect} from 'react';
import './dasboard.css';
function AfficherTravail(){
  const [travails,setTravails]=useState([]);
  useEffect(()=>{
    afficherTravail();
  },[]);
  const afficherTravail=()=>{
     fetch(`${process.env.REACT_APP_API_URL}/api/travail`)
    .then(res=>res.json())
    .then(data => setTravails(data))
    .catch(err =>console.log("erreur lors de l'affichage de travail :",err));;
  };
  
  return(
    <div className="page-container">
    <h3 className="section-title">Liste des travaux</h3>
    {travails.length === 0 ? (<p>Aucune travail Enregistrer</p>):(
      <table className="data-table">
      <thead>
      <tr>
      <th>#</th>
      <th>Nom Technicien</th>
      <th>Prenom Technicien</th>
      <th>Type Machine</th>
      <th>Modele Machine</th>
      <th>Heure Debut</th>
      <th>Heure Fin</th>
      <th>Heure Travail</th>
      <th>Preuve Photo</th>
      </tr>
      </thead>
      <tbody>
      {travails.map((m,index) =>(
        <tr key={index}>
          <td>{index +1}</td>
          <td>{m.nomTechnicien}</td>
          <td>{m.prenomTechnicien}</td>
          <td>{m.typeMachine}</td>
          <td>{m.modeleMachine}</td>
          <td>{m.heureDebut}</td>
          <td>{m.heureFin}</td>
          <td>{m.heureTravail}</td>
          <td>{m.preuvePhotoBase64?(<img src={`data:image/jpeg;base64,${m.preuvePhotoBase64}`}alt="preuve" width="60"/>):("Aucune")}</td>
          </tr>
      ))}
      </tbody>
      </table>
    )
    }
    </div> 
    );
}
export default AfficherTravail;