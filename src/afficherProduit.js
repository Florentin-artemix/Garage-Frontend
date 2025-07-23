import React,{useState,useEffect} from 'react';
import './dasboard.css';
function AfficherProduit(){
  const [produit,setProduit]=useState([]);
  useEffect(()=>{
    afficherProduit();
  },[]);
  const afficherProduit=()=>{
    fetch("http://localhost:8080/api/produit")
    .then(res=>res.json())
    .then(data => {setProduit(data);console.log(data)})
    .catch(err =>console.log("erreur lors de l'affichage des Produits Utilisé:",err));
  };

  return(
    <div className="page-container">
    <h3 className="section-title">Liste des Produits Utiliser</h3>
    {produit.length === 0 ? (<p>Aucun produit Enregistrer</p>):(
      <table className="data-table">
      <thead>
      <tr>
      <th>#</th>
      <th>Nom Technicien</th>
      <th>Type Intervention</th>
      <th>Nom du Produit</th>
      <th>Quantite Utilisée</th>
      </tr>
      </thead>
      <tbody>
      {produit.map((m,index) =>(
        <tr key={index}>
          <td>{index +1}</td>
          <td>{m.nomTechnicien}</td>
          <td>{m.typeIntervention}</td>
          <td>{m.nomProduit}</td>
          <td>{m.quantiteUtilisee}</td>
          <td>{m.seuilAlerte}</td>
          </tr>
      ))}
      </tbody>
      </table>
    )
    }
    </div> 
    );
}
export default AfficherProduit;