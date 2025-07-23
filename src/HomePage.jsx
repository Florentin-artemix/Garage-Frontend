import React from 'react';
import { Link } from 'react-router-dom';
import './home.css';

const HomePage = () => {
  return (
    <div className="homepage">
      <header className="hero">
        <h1>🚘 Garage AutoSolution</h1>
        <p className="slogan">Votre partenaire de confiance depuis 2010</p>
        <div className="hero-buttons">
          <Link to="/login" className="btn-login">Se connecter</Link>
        </div>
      </header>

      <section className="section about">
        <h2>Qui sommes-nous ?</h2>
        <p>
          Fondé à Bukavu, Garage AutoSolution est un centre mécanique de référence. Nous allions expertise technique,
          passion pour l'automobile, et souci du client.
        </p>
        <p>
          Notre équipe est composée de techniciens hautement qualifiés, formés aux dernières technologies automobiles.
        </p>
      </section>

      <section className="section mission-vision">
        <h2>Notre Mission & Vision</h2>
        <p>
          🔧 <strong>Mission :</strong> Offrir un service de qualité, rapide et durable pour garantir la sécurité et la satisfaction de nos clients.
        </p>
        <p>
          🚀 <strong>Vision :</strong> Devenir le garage de référence en Afrique centrale pour la maintenance intelligente des véhicules.
        </p>
      </section>

      <section className="section values">
        <h2>Nos valeurs fondamentales</h2>
        <ul>
          <li>Professionnalisme</li>
          <li>Confiance</li>
          <li>Qualité</li>
          <li>Respect des délais</li>
          <li>Suivi client personnalisé</li>
        </ul>
      </section>

      <section className="section services">
        <h2>Nos services</h2>
        <div className="cards">
          <div className="card">
            <h3>🛠️ Entretien</h3>
            <p>Vidange, contrôle technique, révision périodique, remplacement de filtres...</p>
          </div>
          <div className="card">
            <h3>⚡ Intervention rapide</h3>
            <p>Panne moteur, dépannage express, réparations électriques urgentes...</p>
          </div>
          <div className="card">
            <h3>📦 Gestion des stocks</h3>
            <p>Suivi des pièces détachées, inventaire automatisé, traçabilité des entrées/sorties...</p>
          </div>
          <div className="card">
            <h3>👷 Gestion des techniciens</h3>
            <p>Planification des tâches, performance individuelle, interventions affectées...</p>
          </div>
          <div className="card">
            <h3>📈 Statistiques et rapports</h3>
            <p>Analyse des performances, fréquence des entretiens, coûts par type de service...</p>
          </div>
        </div>
      </section>

      <section className="section pourquoi">
        <h2>Pourquoi nous choisir ?</h2>
        <ul>
          <li>🔍 Diagnostic précis avec des outils de pointe</li>
          <li>🧾 Transparence totale sur les prix</li>
          <li>📱 Application de suivi pour les clients</li>
          <li>💼 Service aux entreprises (flotte auto)</li>
          <li>🧑‍🔧 Techniciens certifiés et passionnés</li>
          <li>🌍 Engagement écologique (huiles recyclées, gestion des déchets)</li>
        </ul>
      </section>

      <section className="section temoignages">
        <h2>Témoignages de nos clients</h2>
        <div className="testimonials">
          <blockquote>
            "Service rapide et impeccable. Mon véhicule a retrouvé une seconde jeunesse !"<br /><cite>- A. Mwamba</cite>
          </blockquote>
          <blockquote>
            "Le seul garage où je n'ai jamais eu de mauvaise surprise. Merci pour votre professionnalisme."<br /><cite>- B. Nsimba</cite>
          </blockquote>
          <blockquote>
            "Une équipe au top ! Le suivi après intervention est un vrai plus."<br /><cite>- J. Byamungu</cite>
          </blockquote>
        </div>
      </section>

      <section className="section contact">
        <h2>Nous contacter</h2>
        <p><strong>Adresse :</strong> Panzi, Bukavu, RDC</p>
        <p><strong>Téléphone :</strong> +243 978 000 000</p>
        <p><strong>Email :</strong> contact@autosolution.cd</p>
        <p><strong>Horaires :</strong> Lun - Sam : 08h00 à 17h00</p>
      </section>

      <footer className="footer">
        <p>&copy; 2010 - {new Date().getFullYear()} Garage AutoSolution | Tous droits réservés</p>
      </footer>
    </div>
  );
};

export default HomePage;