import React from 'react';
import { Routes,Route } from 'react-router-dom';
import AfficherMachine from './afficherMachine';
import AfficherTechnicien from './afficherTechnicien';
import AfficherIntervention from './intervention';
import AfficherTravail from './afficherTravail';
import AfficherEntretien from './afficherEntretien';
import AfficherSuivieVidange from './afficherSuivie';
import AfficherStock from './afficherStock';
import AfficherProduit from './afficherProduit';
import Dashboard from './dasbord';
import Historique from './historique';
import HomePage from './HomePage';
import RegisterUser from './RegisterUser';
const ChefRoutes=()=>{
    return(
        <Routes>
            <Route path="accueil" element={<HomePage/>}/>
            <Route path="machine" element={<AfficherMachine/>}/>
            <Route path="technicien" element={<AfficherTechnicien/>}/>
            <Route path="intervention" element={<AfficherIntervention/>}/>
            <Route path="travail" element={<AfficherTravail/>}/>
            <Route path="entretien" element={<AfficherEntretien/>}/>
            <Route path="vidange" element={<AfficherSuivieVidange/>}/>
            <Route path="stock" element={<AfficherStock/>}/>
            <Route path="produit" element={<AfficherProduit/>}/>
            <Route path="dashboard" element={<Dashboard/>}/>
            <Route path="historique" element={<Historique/>}/>
            <Route path="ajouter-utilisateur" element={<RegisterUser/>}/>
        </Routes>
    );
};
export default ChefRoutes;