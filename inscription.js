// ============================================================
//  HEALTHIVERSE — Inscription JS
//  Firebase Firestore (DB) + EmailJS (notifications admin)
// ============================================================

// ── Initialise Firebase ─────────────────────────────────────
function initFirebase() {
  if (typeof firebase === 'undefined') return null;
  if (!firebase.apps.length) {
    try {
      firebase.initializeApp(HEALTHIVERSE_CONFIG.firebase);
    } catch(e) {
      console.warn('Firebase init error:', e);
      return null;
    }
  }
  return firebase.firestore();
}

// ── Créer un compte Firebase Auth ───────────────────────────
async function createFirebaseAuthUser(email, password, displayName) {
  if (typeof firebase === 'undefined' || !firebase.auth) return null;
  try {
    const cred = await firebase.auth().createUserWithEmailAndPassword(email, password);
    if (cred.user && displayName) {
      await cred.user.updateProfile({ displayName: displayName });
    }
    return cred.user;
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') {
      throw new Error('⚠️ Un compte existe déjà avec cet email. Essayez de vous connecter.');
    } else if (err.code === 'auth/weak-password') {
      throw new Error('⚠️ Le mot de passe est trop faible. Utilisez au moins 6 caractères.');
    } else if (err.code === 'auth/invalid-email') {
      throw new Error('⚠️ Adresse email invalide.');
    }
    throw err;
  }
}

// ── Initialise EmailJS ──────────────────────────────────────
function initEmailJS() {
  if (typeof emailjs === 'undefined') return false;
  emailjs.init(HEALTHIVERSE_CONFIG.emailjs.publicKey);
  return true;
}

// ── Sauvegarde dans Firestore ───────────────────────────────
async function saveToFirestore(db, collection, data) {
  try {
    const docRef = await db.collection(collection).add({
      ...data,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      status: 'pending_review'
    });
    console.log('✅ Firestore — ID:', docRef.id);
    return docRef.id;
  } catch (err) {
    console.error('❌ Firestore error:', err);
    return null;
  }
}

// ── Fallback localStorage ───────────────────────────────────
function saveToLocalStorage(type, data) {
  const key = `healthiverse_${type}s`;
  const existing = JSON.parse(localStorage.getItem(key) || '[]');
  existing.push({ ...data, id: Date.now(), createdAt: new Date().toISOString() });
  localStorage.setItem(key, JSON.stringify(existing));
  console.log(`💾 LocalStorage — ${existing.length} ${type}(s) saved`);
}

// ── Notification email admin ────────────────────────────────
async function sendAdminNotification(type, userData) {
  if (typeof emailjs === 'undefined') {
    console.warn('EmailJS non disponible — notification ignorée');
    return;
  }
  try {
    await emailjs.send(
      HEALTHIVERSE_CONFIG.emailjs.serviceId,
      HEALTHIVERSE_CONFIG.emailjs.inscriptionTemplateId,
      {
        to_email: HEALTHIVERSE_CONFIG.adminEmail,
        type:    type === 'pro' ? 'Professionnel de santé' : 'Patient',
        nom:     userData.fullName,
        email:   userData.email,
        details: type === 'pro'
          ? `Spécialité: ${userData.specialite} | RPPS: ${userData.rpps} | Ville: ${userData.ville} | Tél: ${userData.telephone}`
          : `Téléphone: ${userData.telephone || 'non renseigné'}`
      }
    );
    console.log('📧 Notification admin envoyée');
  } catch (err) {
    console.error('❌ EmailJS error:', err);
  }
}

// ── Afficher message de feedback ────────────────────────────
function showMsg(divId, text, isSuccess) {
  const div = document.getElementById(divId);
  if (!div) return;
  div.textContent = text;
  div.style.display = 'block';
  div.style.padding = '12px 16px';
  div.style.borderRadius = '10px';
  div.style.fontWeight = '600';
  div.style.fontSize = '0.9rem';
  div.style.marginTop = '12px';
  if (isSuccess) {
    div.style.background = '#d1fae5';
    div.style.color = '#065f46';
    div.style.borderLeft = '4px solid #10b981';
  } else {
    div.style.background = '#fee2e2';
    div.style.color = '#991b1b';
    div.style.borderLeft = '4px solid #ef4444';
  }
}

// ── Validation d'un champ ───────────────────────────────────
function validateField(el) {
  if (!el) return true;
  const ok = el.value.trim().length > 0;
  el.style.borderColor = ok ? 'var(--brd)' : '#ef4444';
  return ok;
}

// ════════════════════════════════════════════════════════════
//  NAVIGATION
// ════════════════════════════════════════════════════════════
function selectType(type) {
  document.getElementById('step-choice').classList.remove('active');
  document.getElementById('form-patient').classList.remove('active');
  document.getElementById('form-pro').classList.remove('active');
  document.getElementById(type === 'patient' ? 'form-patient' : 'form-pro').classList.add('active');
}

function goBack() {
  document.getElementById('form-patient').classList.remove('active');
  document.getElementById('form-pro').classList.remove('active');
  document.getElementById('step-choice').classList.add('active');
}

// ════════════════════════════════════════════════════════════
//  INIT
// ════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  const db = initFirebase();
  initEmailJS();

  // ────────────────────────────────────────────────────────
  //  FORMULAIRE PATIENT
  // ────────────────────────────────────────────────────────
  const patientForm = document.getElementById('patientForm');
  if (patientForm) {
    patientForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const prenom = document.getElementById('p-prenom');
      const nom    = document.getElementById('p-nom');
      const email  = document.getElementById('p-email');
      const tel    = document.getElementById('p-tel');
      const pass   = document.getElementById('p-pass');
      const terms  = document.getElementById('terms-p');
      const btn    = patientForm.querySelector('.btn-auth-submit');

      // Validation
      const valid = [validateField(prenom), validateField(nom), validateField(email), validateField(pass)];
      if (valid.includes(false)) {
        showMsg('patient-msg', '⚠️ Veuillez remplir tous les champs obligatoires.', false);
        return;
      }
      if (!terms.checked) {
        showMsg('patient-msg', '⚠️ Veuillez accepter les conditions d\'utilisation.', false);
        return;
      }
      if (pass.value.length < 8) {
        pass.style.borderColor = '#ef4444';
        showMsg('patient-msg', '⚠️ Le mot de passe doit contenir au moins 8 caractères.', false);
        return;
      }

      btn.textContent = '⏳ Création en cours...';
      btn.disabled = true;

      const userData = {
        type:      'patient',
        prenom:    prenom.value.trim(),
        nom:       nom.value.trim(),
        fullName:  `${prenom.value.trim()} ${nom.value.trim()}`,
        email:     email.value.trim(),
        telephone: tel?.value.trim() || '',
      };

      try {
        // 0️⃣ Créer un vrai compte Firebase Auth
        const authUser = await createFirebaseAuthUser(
          email.value.trim(), pass.value, userData.fullName
        );

        // 1️⃣ Sauvegarder dans Firestore (ou localStorage si non configuré)
        let savedId = null;
        if (db) {
          if (authUser) userData.uid = authUser.uid;
          savedId = await saveToFirestore(db, 'patients', userData);
        }
        if (!savedId) saveToLocalStorage('patient', userData);

        // 2️⃣ Notifier l'admin
        await sendAdminNotification('patient', userData);

        // 3️⃣ Session locale
        localStorage.setItem('userAuth', 'true');
        localStorage.setItem('userType', 'patient');
        localStorage.setItem('userName', userData.fullName);
        localStorage.setItem('userEmail', userData.email);

        // 4️⃣ Feedback + redirection
        btn.textContent = '✅ Compte créé !';
        btn.style.background = '#10b981';
        showMsg('patient-msg', `✅ Bienvenue ${userData.prenom} ! Redirection vers votre espace...`, true);

        setTimeout(() => { window.location.href = 'mon-compte.html'; }, 1500);
      } catch (regErr) {
        showMsg('patient-msg', regErr.message || '❌ Erreur lors de la création du compte.', false);
        btn.textContent = 'Créer mon compte patient';
        btn.disabled = false;
      }
    });
  }

  // ────────────────────────────────────────────────────────
  //  FORMULAIRE PROFESSIONNEL
  // ────────────────────────────────────────────────────────
  const proForm = document.getElementById('proForm');
  if (proForm) {
    proForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const prenom = document.getElementById('pro-prenom');
      const nom    = document.getElementById('pro-nom');
      const spec   = document.getElementById('pro-spec');
      const rpps   = document.getElementById('pro-rpps');
      const email  = document.getElementById('pro-email');
      const tel    = document.getElementById('pro-tel');
      const ville  = document.getElementById('pro-ville');
      const pass   = document.getElementById('pro-pass');
      const btn    = proForm.querySelector('.btn-auth-submit');

      // Validation
      const valid = [
        validateField(prenom), validateField(nom), validateField(rpps),
        validateField(email),  validateField(tel),  validateField(ville), validateField(pass)
      ];
      if (spec.value === '' || !spec.value) {
        spec.style.borderColor = '#ef4444';
        valid.push(false);
      } else {
        spec.style.borderColor = 'var(--brd)';
      }

      if (valid.includes(false)) {
        showMsg('pro-msg', '⚠️ Veuillez remplir tous les champs obligatoires.', false);
        return;
      }
      if (pass.value.length < 8) {
        pass.style.borderColor = '#ef4444';
        showMsg('pro-msg', '⚠️ Le mot de passe doit contenir au moins 8 caractères.', false);
        return;
      }

      btn.textContent = '⏳ Validation en cours...';
      btn.disabled = true;

      const userData = {
        type:       'professionnel',
        prenom:     prenom.value.trim(),
        nom:        nom.value.trim(),
        fullName:   `Dr. ${prenom.value.trim()} ${nom.value.trim()}`,
        specialite: spec.value,
        rpps:       rpps.value.trim(),
        email:      email.value.trim(),
        telephone:  tel.value.trim(),
        ville:      ville.value.trim(),
        verified:   false
      };

      try {
        // 0️⃣ Créer un vrai compte Firebase Auth
        const authUser = await createFirebaseAuthUser(
          email.value.trim(), pass.value, userData.fullName
        );

        // 1️⃣ Sauvegarder dans Firestore (ou localStorage si non configuré)
        let savedId = null;
        if (db) {
          if (authUser) userData.uid = authUser.uid;
          savedId = await saveToFirestore(db, 'professionnels', userData);
        }
        if (!savedId) saveToLocalStorage('professionnel', userData);

        // 2️⃣ Notifier l'admin
        await sendAdminNotification('pro', userData);

        // 3️⃣ Session locale
        localStorage.setItem('userAuth', 'true');
        localStorage.setItem('userType', 'pro');
        localStorage.setItem('userName', userData.fullName);
        localStorage.setItem('userEmail', userData.email);

        // 4️⃣ Feedback + redirection
        btn.textContent = '✅ Demande soumise !';
        btn.style.background = '#10b981';
        showMsg('pro-msg', `✅ Demande envoyée ! Notre équipe va vérifier votre dossier. Redirection...`, true);

      setTimeout(() => { window.location.href = 'dashboard.html'; }, 1500);
    });
  }
});
