/**
 * ============================================================
 *  HEALTHIVERSE — CONFIGURATION DES SERVICES EXTERNES
 * ============================================================
 *
 *  ÉTAPE 1 — FIREBASE (Base de données gratuite)
 *  -----------------------------------------------
 *  1. Allez sur https://console.firebase.google.com
 *  2. Cliquez "Créer un projet" → nommez-le "healthiverse"
 *  3. Dans le projet : Paramètres ⚙️ → "Votre application web" → Ajouter une app web
 *  4. Copiez les valeurs de l'objet firebaseConfig dans FIREBASE ci-dessous
 *  5. Dans le menu gauche : Firestore Database → Créer base de données → Mode test
 *
 *  ÉTAPE 2 — EMAILJS (Envoi d'emails sans serveur)
 *  -----------------------------------------------
 *  1. Allez sur https://www.emailjs.com → créez un compte gratuit
 *  2. "Email Services" → "Add New Service" → choisissez Gmail → connectez djennane.amir@gmail.com
 *  3. "Email Templates" → "Create New Template" :
 *     - Template de contact : Subject = "Nouveau message - {{sujet}}"
 *       Body = "De: {{nom}} ({{email}})\nSujet: {{sujet}}\n\n{{message}}"
 *     - Template inscription : Subject = "Nouvelle inscription - {{type}}"
 *       Body = "Nouvel utilisateur:\nType: {{type}}\nNom: {{nom}}\nEmail: {{email}}\nDetails: {{details}}"
 *  4. "Account" → copiez votre Public Key
 *  5. Notez le Service ID et les deux Template IDs
 * ============================================================
 */

const HEALTHIVERSE_CONFIG = {

  // ─── FIREBASE CONFIG ───────────────────────────────────────
  firebase: {
    apiKey:            "AIzaSyC47tJbuiaQrLd9hDJUu8PliOo1oA026fc",
    authDomain:        "healthiverse-296e7.firebaseapp.com",
    projectId:         "healthiverse-296e7",
    storageBucket:     "healthiverse-296e7.firebasestorage.app",
    messagingSenderId: "143990006223",
    appId:             "1:143990006223:web:9a9b3629286f8769dbf2ba"
  },


  // ─── EMAILJS CONFIG ────────────────────────────────────────
  emailjs: {
    publicKey:            "REMPLACER_PAR_VOTRE_PUBLIC_KEY",
    serviceId:            "REMPLACER_PAR_VOTRE_SERVICE_ID",
    contactTemplateId:    "REMPLACER_PAR_VOTRE_TEMPLATE_CONTACT_ID",
    inscriptionTemplateId:"REMPLACER_PAR_VOTRE_TEMPLATE_INSCRIPTION_ID"
  },

  // ─── STRIPE CONFIG (PAIEMENTS) ─────────────────────────────
  stripe: {
    publicKey: "pk_test_REMPLACER_PAR_VOTRE_STRIPE_KEY"
  },

  // ─── EMAIL ADMIN ───────────────────────────────────────────
  adminEmail: "djennane.amir@gmail.com"
};
