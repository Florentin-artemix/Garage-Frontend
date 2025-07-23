import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';

const ChefNavbar = () => {
  return (
    <nav className="navbar">
      <Link to="/chef/accueil"><h2>Chef - Garage</h2></Link>
      <ul>
        <li><Link to="/chef/dashboard">Dashboard</Link></li>
        <li><Link to="/chef/machine">Machines</Link></li>
        <li><Link to="/chef/vidange">Suivie Vidange</Link></li>
        <li><Link to="/chef/technicien">Techniciens</Link></li>
        <li><Link to="/chef/intervention">Intervention</Link></li>
        <li><Link to="/chef/travail">Travail</Link></li>
        <li><Link to="/chef/entretien">Historique Entretien</Link></li>
        <li><Link to="/chef/stock">Stock</Link></li>
        <li><Link to="/chef/produit">Produits Utilisées</Link></li>
        <li><Link to="/chef/historique">Historique Modification</Link></li>
        <li><Link to="/chef/ajouter-utilisateur">Ajouter un Utlisateur</Link></li>
      </ul>
    </nav>
  );
};

export default ChefNavbar;
