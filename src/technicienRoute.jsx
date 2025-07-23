import React from 'react';
import { Routes,Route } from 'react-router-dom';
import MachinePage from './machinePage';
import InterventionForm from './interventionForm';
import ProduitUtiliserForm from './produitForm';
import StockForm from './stockForm';
import SuivieVidangeForm from './suivieForm';
import TechnicienForm from './technicienForm';
import EntretienForm from './entretienForm';
import TravailForm from './travailForm';
import HomePage from './HomePage';
const TechnicienRoutes=() =>{
    return(
        <Routes>
            <Route path="accueil" element={<HomePage/>}/>
            <Route path="machine" element={<MachinePage/>}/>
            <Route path="intervention" element={<InterventionForm/>}/>
            <Route path="produit" element={<ProduitUtiliserForm/>}/>
            <Route path="stock" element={<StockForm/>}/>
            <Route path="vidange" element={<SuivieVidangeForm/>}/>
            <Route path="techniciens" element={<TechnicienForm/>}/>
            <Route path="entretien" element={<EntretienForm/>}/>
            <Route path="travail" element={<TravailForm/>}/>
        </Routes>
    );
};
export default TechnicienRoutes;