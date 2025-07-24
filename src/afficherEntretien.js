import React,{useState,useEffect} from 'react';
import './dasboard.css';
function AfficherEntretien(){
  const [entretien,setEntretien]=useState([]);
  useEffect(()=>{
    afficherEntretien();
  },[]);
  const afficherEntretien=()=>{
    fetch(`${process.env.REACT_APP_API_URL}/api/entretien`)
    .then(res=>res.json())
    .then(data => setEntretien(data))
    .catch(err =>console.log("erreur lors de l'affichage des Entretien :",err));
  };

  return(
    <div className="page-container">
    <h3 className="section-title">Liste des Entretien</h3>
    {entretien.length === 0 ? (<p>Aucune Entretien Enregistrer</p>):(
      <table className="data-table">
      <thead>
      <tr>
      <th>#</th>
      <th>Nom Technicien</th>
      <th>Prenom Technicien</th>
      <th>Type Machine</th>
      <th>Modele Machine</th>
      <th>Date Entretien</th>
      <th>Type Entretien</th>
      <th>Description</th>
      </tr>
      </thead>
      <tbody>
      {entretien.map((m,index) =>(
        <tr key={index}>
          <td>{index +1}</td>
          <td>{m.nomTechnicien}</td>
          <td>{m.prenomTechnicien}</td>
          <td>{m.typeMachine}</td>
          <td>{m.modeleMachine}</td>
          <td>{m.dateEntretien}</td>
          <td>{m.typeEntretien}</td>
          <td>{m.description}</td>
          </tr>
      ))}
      </tbody>
      </table>
    )
    }
    </div> 
    );
}
export default AfficherEntretien;