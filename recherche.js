// === HEALTHIVERSE — GEOLOCATION SEARCH LOGIC ===

document.addEventListener('DOMContentLoaded', async () => {
  // 1. INIT FIREBASE
  if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(HEALTHIVERSE_CONFIG.firebase);
  }
  const db = firebase.firestore();

  // 2. INIT MAP
  const map = L.map('resultsMap', { scrollWheelZoom: false }).setView([36.7538, 3.0588], 13);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // 3. GET USER LOCATION
  let userCoords = null;
  try {
    const pos = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
    });
    userCoords = [pos.coords.latitude, pos.coords.longitude];
    map.setView(userCoords, 13);
    L.circle(userCoords, { radius: 500, color: 'var(--teal)', fillOpacity: 0.2 }).addTo(map)
      .bindPopup("Votre position approximative");
  } catch (err) {
    console.warn("Browser geolocation failed, using IP-based location fallback.");
    const res = await fetch('https://ipapi.co/json/');
    const json = await res.json();
    userCoords = [json.latitude, json.longitude];
    map.setView(userCoords, 13);
  }

  // 4. LOAD DOCTORS FROM FIRESTORE
  const params = new URLSearchParams(window.location.search);
  const specQuery = params.get('spec') || '';
  const locQuery = params.get('loc') || '';

  const resultsList = document.getElementById('resultsList');
  const resultsCount = document.getElementById('resultsCount');

  async function loadDoctors() {
    resultsCount.textContent = 'Recherche en cours...';
    resultsList.innerHTML = '';

    let query = db.collection('professionnels');
    const snapshot = await query.get();
    let doctors = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      data.id = doc.id;
      
      const matchSpec = !specQuery || data.specialite?.toLowerCase().includes(specQuery.toLowerCase());
      const matchLoc = !locQuery || data.ville?.toLowerCase().includes(locQuery.toLowerCase());

      if (matchSpec && matchLoc) {
        if (data.lat && data.lng && userCoords) {
          data.distance = calculateDistance(userCoords[0], userCoords[1], data.lat, data.lng);
        } else {
          data.distance = 9999;
        }
        doctors.push(data);

        // Add marker to map
        if (data.lat && data.lng) {
          L.marker([data.lat, data.lng]).addTo(map)
            .bindPopup(`<b>${data.fullName}</b><br>${data.specialite}<br><a href="profil.html?id=${doc.id}">Voir le profil</a>`);
        }
      }
    });

    doctors.sort((a, b) => a.distance - b.distance);
    renderResults(doctors);
  }

  function renderResults(doctors) {
    resultsCount.innerHTML = `<h3 style="font-weight:800; color:#1e293b;">${doctors.length} professionnels trouvés</h3>`;
    
    if (doctors.length === 0) {
      resultsList.innerHTML = '<p style="padding:40px; text-align:center; color:#64748b;">Aucun professionnel ne correspond à votre recherche.</p>';
      return;
    }

    doctors.forEach((d, i) => {
      const distText = d.distance < 9999 ? `· 📍 à ${d.distance.toFixed(1)} km` : '';
      const item = document.createElement('div');
      item.className = 'result-item fade-in';
      item.style.transitionDelay = `${i * 100}ms`;
      item.innerHTML = `
        <div class="res-av-circle">${d.initials || d.fullName?.charAt(0) || 'D'}</div>
        <div style="flex:1;">
          <div style="display:flex; justify-content:space-between; align-items:start;">
            <div>
              <div style="font-size:1.3rem; font-weight:800; color:#0f172a;">${d.fullName}</div>
              <div style="color:var(--teal); font-weight:700;">${d.specialite}</div>
            </div>
            <div style="font-weight:700; color:#b45309;">★ ${d.rating || '4.8'}</div>
          </div>
          <div style="color:#64748b; margin:10px 0;">📍 ${d.ville} ${distText}</div>
          <div style="display:flex; gap:10px; margin-top:15px;">
            <a href="profil.html?id=${d.id}" class="btn-res" style="background:var(--teal); color:#fff; flex:1; text-align:center; padding:12px; border-radius:12px; font-weight:700;">Prendre RDV</a>
            <a href="profil.html?id=${d.id}" class="btn-res" style="border:2px solid var(--teal); color:var(--teal); padding:12px; border-radius:12px; font-weight:700;">Profil</a>
          </div>
        </div>
      `;
      resultsList.appendChild(item);
    });
  }

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  loadDoctors();
});
