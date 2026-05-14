// === HEALTHIVERSE — PATIENT ACCOUNT LOGIC ===

document.addEventListener('DOMContentLoaded', async () => {
  // 1. INIT FIREBASE
  if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(HEALTHIVERSE_CONFIG.firebase);
  }
  const db = firebase.firestore();

  // 2. SECURITY GUARD (CHECK AUTH)
  firebase.auth().onAuthStateChanged(async (user) => {
    if (!user) {
      window.location.href = 'login.html';
      return;
    }

    // Check if patient
    const patientDoc = await db.collection('patients').doc(user.uid).get();
    if (!patientDoc.exists) {
      // Maybe it's a pro?
      const proDoc = await db.collection('professionnels').doc(user.uid).get();
      if (proDoc.exists) {
        window.location.href = 'dashboard.html';
        return;
      }
      window.location.href = 'login.html';
      return;
    }

    const userData = patientDoc.data();
    updateHeaderUI(userData);
    loadAppointments(user.uid);
  });

  function updateHeaderUI(data) {
    document.querySelector('.patient-header-bg h1').textContent = `Bonjour, ${data.prenom || 'Patient'}`;
    document.querySelector('.user-name').textContent = data.fullName || data.email;
    if (data.prenom && data.nom) {
      document.querySelector('.user-av').textContent = `${data.prenom.charAt(0)}${data.nom.charAt(0)}`.toUpperCase();
    }
  }

  async function loadAppointments(uid) {
    const listContainer = document.getElementById('appointmentsList');
    const emptyState = document.getElementById('emptyState');
    
    listContainer.querySelectorAll('.appointment-card').forEach(el => el.remove());
    
    try {
      const snapshot = await db.collection('rdv')
        .where('patientId', '==', uid)
        .orderBy('timestamp', 'desc')
        .get();

      if (snapshot.empty) {
        emptyState.style.display = 'block';
      } else {
        emptyState.style.display = 'none';
        snapshot.forEach(doc => {
          const apt = doc.data();
          const aptId = doc.id;
          
          // Render card
          const card = document.createElement('div');
          card.className = 'appointment-card fade-in';
          card.innerHTML = `
            <div class="apt-date">
              <strong>${apt.date || '??'}</strong>
              <span style="font-size:0.8rem; margin-top:4px; display:block;">${apt.time || '--:--'}</span>
            </div>
            <div class="apt-info">
              <div class="apt-doc">${apt.doctorName || 'Médecin'}</div>
              <div class="apt-spec">Consultation médicale</div>
              <div class="apt-status">✓ ${apt.status || 'Confirmé'}</div>
            </div>
            <div class="apt-actions">
              <button class="btn-cancel" onclick="cancelAppointment('${aptId}', this)">Annuler</button>
            </div>
          `;
          listContainer.appendChild(card);
        });
      }
    } catch (err) {
      console.error("Error loading appointments:", err);
      // Fallback to local storage if firestore fails or index is missing
      loadFromLocalStorage();
    }
  }

  function loadFromLocalStorage() {
    const listContainer = document.getElementById('appointmentsList');
    const emptyState = document.getElementById('emptyState');
    let appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    if (appointments.length > 0) {
      emptyState.style.display = 'none';
      // ... existing rendering logic
    }
  }

  // Define globally for onclick
  window.cancelAppointment = async (aptId, btn) => {
    if (confirm("Êtes-vous sûr de vouloir annuler ce rendez-vous ?")) {
      try {
        await db.collection('rdv').doc(aptId).update({ status: 'annulé' });
        const card = btn.closest('.appointment-card');
        card.style.opacity = '0.5';
        card.querySelector('.apt-status').textContent = 'Annulé';
        btn.remove();
        alert("Rendez-vous annulé.");
      } catch (err) {
        console.error("Cancel error:", err);
        alert("Erreur lors de l'annulation.");
      }
    }
  };

  // Logout listener
  document.querySelector('.btn-logout').addEventListener('click', (e) => {
    e.preventDefault();
    firebase.auth().signOut().then(() => {
      localStorage.clear();
      window.location.href = 'index.html';
    });
  });

});
