import React,{useState,useEffect} from 'react';
import './dasboard.css';
function AfficherTechnicien(){
  const [techniciens,setTechniciens]=useState([]);
  useEffect(()=>{
    afficherTechnicien();
  },[]);
  const afficherTechnicien=()=>{
    fetch(`${process.env.REACT_APP_API_URL}/api/technicien`)
    .then(res=>res.json())
    .then(data => setTechniciens(data))
    .catch(err =>console.log("erreur lors de l'affichage de Technicien :",err));
  };
  
  return(
    <div className="page-container">
    <h3 className="section-title">Liste des Technicien</h3>
    {techniciens.length === 0 ? (<p>Aucun Technicien Enregistrer</p>):(
      <table className="data-table">
      <thead>
      <tr>
      <th>#</th>
      <th>Nom</th>
      <th>Post Nom</th>
      <th>Prenom</th>
      <th>Age</th>
      <th>Role</th>
      </tr>
      </thead>
      <tbody>
      {techniciens.map((m,index) =>(
        <tr key={index}>
          <td>{index +1}</td>
          <td>{m.nom}</td>
          <td>{m.postNom}</td>
          <td>{m.prenom}</td>
          <td>{m.age}</td>
          <td>{m.role}</td>
          </tr>
      ))}
      </tbody>
      </table>
    )
    }
    </div> 
    );
}
export default AfficherTechnicien;