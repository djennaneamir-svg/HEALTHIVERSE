// === HEALTHIVERSE — PROFILE & BOOKING LOGIC ===

document.addEventListener('DOMContentLoaded', async () => {
  // 1. INIT FIREBASE
  if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(HEALTHIVERSE_CONFIG.firebase);
  }
  const db = firebase.firestore();

  // 2. GET DOCTOR ID FROM URL (or default to Sarah Martin for demo)
  const params = new URLSearchParams(window.location.search);
  const docId = params.get('id') || 'sarah_martin'; // Fallback for testing

  // 3. LOAD DOCTOR DATA FROM FIRESTORE
  const docRef = db.collection('professionnels').doc(docId);
  try {
    const docSnap = await docRef.get();
    if (docSnap.exists()) {
      const data = docSnap.data();
      updateProfileUI(data);
    }
  } catch (err) {
    console.error("Error loading doctor data:", err);
  }

  // 4. BOOKING LOGIC
  const btnBook = document.getElementById('btnBookNow');
  const slotsContainer = document.querySelector('.slots');
  let selectedSlot = null;
  let selectedDay = 'JEU 07 Mai'; // Mocked day

  // Day selection
  document.querySelectorAll('.cal-day').forEach(day => {
    day.addEventListener('click', () => {
      document.querySelectorAll('.cal-day').forEach(d => d.classList.remove('active'));
      day.classList.add('active');
      selectedDay = day.querySelector('strong').textContent + ' ' + day.querySelector('span').textContent;
      loadSlots(selectedDay);
    });
  });

  function loadSlots(day) {
    // In a real app, we would query Firestore for taken slots on this day
    // For now, we use the UI slots
    document.querySelectorAll('.slot').forEach(s => {
      s.classList.remove('selected');
      s.style.background = '';
      s.style.color = '';
    });
    selectedSlot = null;
  }

  // Slot selection
  slotsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('slot') && !e.target.classList.contains('taken')) {
      document.querySelectorAll('.slot').forEach(s => {
        s.style.background = '';
        s.style.color = '';
      });
      e.target.style.background = 'var(--teal)';
      e.target.style.color = '#fff';
      selectedSlot = e.target.textContent;
    }
  });

  btnBook.addEventListener('click', async () => {
    // 🔒 Security: Check if user is logged in
    const user = firebase.auth().currentUser;
    if (!user) {
      alert('Veuillez vous connecter pour prendre rendez-vous.');
      window.location.href = 'login.html';
      return;
    }

    if (!selectedSlot) {
      alert('Veuillez choisir un créneau horaire.');
      return;
    }

    btnBook.textContent = '⏳ Confirmation...';
    btnBook.disabled = true;

    try {
      // Create Appointment in Firestore
      const rdvData = {
        doctorId: docId,
        doctorName: document.querySelector('.p-title h1').textContent,
        patientId: user.uid,
        patientName: user.displayName || user.email,
        date: selectedDay,
        time: selectedSlot,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        status: 'confirmé'
      };

      // Use a transaction to avoid double bookings (Advanced)
      const rdvId = `${docId}_${selectedDay.replace(/\s/g, '')}_${selectedSlot.replace(':', '')}`;
      await db.collection('rdv').doc(rdvId).set(rdvData);

      // Success
      showToast('✅ Rendez-vous confirmé !', 'success');
      setTimeout(() => {
        window.location.href = 'mon-compte.html';
      }, 2000);

    } catch (err) {
      console.error("Booking error:", err);
      alert("Erreur lors de la réservation. Veuillez réessayer.");
      btnBook.textContent = 'Confirmer le rendez-vous';
      btnBook.disabled = false;
    }
  });

  function updateProfileUI(data) {
    if (data.fullName) document.querySelector('.p-title h1').textContent = data.fullName;
    if (data.specialite) document.querySelector('.p-spec').textContent = `${data.specialite} · ${data.ville || ''}`;
    if (data.initials) document.querySelector('.p-av').textContent = data.initials;
    // Map update if coords exist
    if (data.lat && data.lng && typeof L !== 'undefined') {
      // Re-init map
    }
  }

  function showToast(msg, type) {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed; bottom: 20px; right: 20px;
      background: ${type === 'success' ? '#0d9488' : '#ef4444'};
      color: white; padding: 16px 24px; border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      z-index: 10000; font-weight: 600;
      transition: all 0.3s ease;
    `;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }
});
