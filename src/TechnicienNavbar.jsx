import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';

const TechnicienNavbar = () => {
  return (
    <nav className="navbar">
      <Link to="/technicien/accueil"><h2>Technicien</h2></Link>
      <ul>
        <li><Link to="/technicien/machine">Machines</Link></li>
        <li><Link to="/technicien/vidange">Suvies Vidange</Link></li>
        <li><Link to="/technicien/intervention">Intervention</Link></li>
        <li><Link to="/technicien/travail">Travail</Link></li>
        <li><Link to="/technicien/stock">Stock</Link></li>
        <li><Link to="/technicien/produit">Produits utilisés</Link></li>
        <li><Link to="/technicien/entretien">Entretien</Link></li>
      </ul>
    </nav>
  );
};

export default TechnicienNavbar;
