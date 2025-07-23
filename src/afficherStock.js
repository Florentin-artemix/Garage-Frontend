import React,{useState,useEffect} from 'react';
import './dasboard.css';
function AfficherStock(){
  const [stock,setStock]=useState([]);
  useEffect(()=>{
    afficherStock();
  },[]);
  const afficherStock=()=>{
    fetch("http://localhost:8080/api/stock")
    .then(res=>res.json())
    .then(data => {setStock(data);console.log(data)})
    .catch(err =>console.log("erreur lors de l'affichage du Stock :",err));
  };

  return(
    <div className="page-container">
    <h3 className="section-title">Liste de Stock</h3>
    {stock.length === 0 ? (<p>Aucun stock Enregistrer</p>):(
      <table className="data-table">
      <thead>
      <tr>
      <th>#</th>
      <th>Nom du Produit</th>
      <th>Quantiter</th>
      <th>Fournisseur</th>
      <th>Prix Unitaire</th>
      <th>Seuil Alerte</th>
      </tr>
      </thead>
      <tbody>
      {stock.map((m,index) =>(
        <tr key={index}>
          <td>{index +1}</td>
          <td>{m.nomProduit}</td>
          <td>{m.quantite}</td>
          <td>{m.fournisseur}</td>
          <td>{m.prixUnitaire}</td>
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
export default AfficherStock;