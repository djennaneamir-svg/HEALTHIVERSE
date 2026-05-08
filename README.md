# 🚀 Healthiverse

> **Trouvez le bon médecin, au bon moment.**
> Healthiverse est une plateforme santé de nouvelle génération, conçue pour simplifier la prise de rendez-vous médical et améliorer la relation patient-praticien.

![Healthiverse Banner](https://images.unsplash.com/photo-1576091160399-11cbbe35278c?auto=format&fit=crop&w=1200&q=80)

## 🌟 Fonctionnalités Clés

### Pour les Patients 🧑‍⚕️
- **Recherche Avancée** : Trouvez des médecins par spécialité, ville, ou disponibilité.
- **Auto-complétion Intelligente** : Suggestions en temps réel pour les métiers et les villes.
- **Réservation en Ligne (24/7)** : Calendrier interactif et prise de RDV instantanée (connectée au Dashboard).
- **Carte Interactive** : Visualisez les praticiens autour de vous avec Leaflet.js.
- **Avis Vérifiés** : Lisez et laissez des avis pour aider la communauté.

### Pour les Professionnels 🩺
- **Tableau de Bord Premium** : Gérez vos rendez-vous, vos patients et visualisez vos statistiques (Chiffre d'affaires, visites).
- **Visibilité Accrue** : Profil détaillé avec bio, expertises, et accès facilité pour vos patients.
- **Outils d'Alerte** : Fiche patient complète avec alertes médicales (allergies, etc.).

## 🛠️ Technologies Utilisées
- **Front-end** : HTML5, CSS3 (Variables natives, Flexbox, Grid), JavaScript (Vanilla)
- **Design System** : Mode Sombre (Dark Mode) global, interface "Glassmorphism", polices *Plus Jakarta Sans* et *Inter*.
- **Cartographie** : Leaflet.js / OpenStreetMap
- **Web App (PWA)** : Fichier Manifest intégré pour installation sur mobile.

## 🚀 Installation & Utilisation locale

Ce projet ne nécessite aucun serveur backend complexe pour être visualisé (Base de données simulée via `localStorage`).

1. **Cloner le dépôt** :
   ```bash
   git clone https://github.com/djennaneamir-svg/HEALTHIVERSE.git
   ```
2. **Ouvrir le projet** :
   Ouvrez simplement `index.html` dans votre navigateur web préféré (Chrome, Firefox, Safari).

## 🗺️ Architecture du Projet

- `index.html` : Page d'accueil / Landing Page.
- `recherche.html` : Moteur de recherche et résultats filtrés.
- `profil.html` : Page détaillée d'un praticien avec widget de réservation.
- `patient.html` / `dashboard.html` : Tableaux de bord (Patient & Professionnel).
- `login.html` / `inscription.html` : Tunnel d'authentification intelligent.
- `style.css` : Feuille de style principale (incluant le mode sombre).
- `script.js` : Logique applicative (recherche, map, dark mode, etc.).

## 🤝 Contribuer

Healthiverse est actuellement en phase Bêta (v0.9). Vos retours et contributions sont les bienvenus !

1. Forkez le projet.
2. Créez une branche (`git checkout -b feature/NouvelleFonctionnalite`).
3. Commitez vos changements (`git commit -m 'Ajout d'une nouvelle fonctionnalité'`).
4. Pushez vers la branche (`git push origin feature/NouvelleFonctionnalite`).
5. Ouvrez une Pull Request.

---
*© 2026 Healthiverse. Tous droits réservés.*
