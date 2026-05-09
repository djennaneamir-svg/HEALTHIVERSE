document.addEventListener('DOMContentLoaded', () => {
  // === NAVBAR SCROLL ===
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  });

  // === REGIONAL DATA & AUTO-DETECTION ===
  const regionalData = {
    'DZ': { lang: 'ar', flag: '🇩🇿', label: 'Algérie', emergency: [
      { label: 'Protection Civile', num: '14' },
      { label: 'Police', num: '17' },
      { label: 'SAMU', num: '3016' }
    ]},
    'MA': { lang: 'ar', flag: '🇲🇦', label: 'Maroc', emergency: [
      { label: 'Ambulance', num: '150' },
      { label: 'Police', num: '190' },
      { label: 'Gendarmerie', num: '177' }
    ]},
    'TN': { lang: 'ar', flag: '🇹🇳', label: 'Tunisie', emergency: [
      { label: 'SAMU', num: '190' },
      { label: 'Protection Civile', num: '198' },
      { label: 'Police', num: '197' }
    ]},
    'TR': { lang: 'tr', flag: '🇹🇷', label: 'Turquie', emergency: [
      { label: 'Urgences', num: '112' },
      { label: 'Police', num: '155' }
    ]}
  };

  function applyRegion(cc) {
    const data = regionalData[cc] || regionalData['DZ'];
    const topUrgences = document.getElementById('emergencyNumbers');
    if (topUrgences) {
      const nums = data.emergency.map(e => `<strong>${e.label}:</strong> <a href="tel:${e.num}" style="color:inherit;text-decoration:none">${e.num}</a>`).join(' | ');
      topUrgences.innerHTML = `🚨 Urgences (${data.flag}): ${nums}`;
    }
  }

  async function detectLocation() {
    try {
      const res = await fetch('https://ipapi.co/json/');
      const json = await res.json();
      if (regionalData[json.country_code]) applyRegion(json.country_code);
    } catch(e) { applyRegion('DZ'); }
  }
  detectLocation();

  // === SEARCH AUTOCOMPLETE ===
  const allSpecialties = [
    "Acupuncteur", "Addictologue", "Allergologue", "Anesthésiste", "Angiologue", "Cardiologue", "Chirurgien-dentiste",
    "Chirurgien-plastique", "Chirurgien-vasculaire", "Dermatologue", "Diététicien", "Endocrinologue", "Gastro-entérologue", 
    "Gériatre", "Gynécologue", "Hématologue", "Hépatologue", "Infirmier", "Kinésithérapeute", "Médecin généraliste", 
    "Neurologue", "Nutritionniste", "Ophtalmologue", "ORL", "Orthodontiste", "Orthophoniste", "Orthoptiste",
    "Ostéopathe", "Pédiatre", "Pédicure-podologue", "Pneumologue", "Psychiatre", "Psychologue", "Radiologue", 
    "Rhumatologue", "Sage-femme", "Sophrologue", "Stomatologue", "Urologue"
  ].sort((a, b) => a.localeCompare(b));

  const allCities = [
    // Afrique
    "Alger", "Oran", "Constantine", "Casablanca", "Rabat", "Marrakech", "Tunis", "Sousse", "Dakar", "Abidjan", 
    "Le Caire", "Alexandrie", "Lagos", "Nairobi", "Johannesburg", "Addis-Abeba", "Accra", "Luanda", "Khartoum", 
    "Bamako", "Niamey", "Nouakchott", "Tripoli", "Kinshasa", "Brazzaville", "Libreville", "Yaoundé", "Douala",
    // Moyen-Orient
    "Dubaï", "Abou Dabi", "Riyad", "Djeddah", "Doha", "Manama", "Mascate", "Koweït City", "Beyrouth", "Amman", 
    "Bagdad", "Téhéran", "Tel Aviv", "Jérusalem",
    // Turquie
    "Istanbul", "Ankara", "Izmir", "Bursa", "Antalya", "Adana", "Gaziantep", "Konya", "Kayseri"
  ].sort((a, b) => a.localeCompare(b));

  function setupAutocomplete(inputId, dropdownId, dataList) {
    const input = document.getElementById(inputId);
    const dropdown = document.getElementById(dropdownId);
    if (!input || !dropdown) return;

    function renderDropdown(filter = "") {
      const filtered = filter ? dataList.filter(item => item.toLowerCase().includes(filter.toLowerCase())) : dataList;
      dropdown.innerHTML = "";
      if (filtered.length > 0) {
        filtered.forEach(item => {
          const div = document.createElement("div");
          div.className = "auto-item";
          div.textContent = item;
          div.addEventListener("click", () => {
            input.value = item;
            dropdown.style.display = "none";
          });
          dropdown.appendChild(div);
        });
        dropdown.style.display = "block";
      } else {
        dropdown.style.display = "none";
      }
    }

    input.addEventListener("focus", () => renderDropdown(input.value));
    input.addEventListener("input", () => renderDropdown(input.value));
    input.addEventListener("click", (e) => {
      e.stopPropagation();
      renderDropdown(input.value);
    });

    document.addEventListener("click", (e) => {
      if (!input.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.style.display = "none";
      }
    });
  }

  setupAutocomplete('searchSpec', 'autoDropdown', allSpecialties);
  setupAutocomplete('searchLoc', 'autoDropdownLoc', allCities);

  // === SPECIALITES GRID ===
  const specs = [
    { emoji: '🫀', name: 'Cardiologie', desc: 'Cœur et vaisseaux' },
    { emoji: '🧠', name: 'Neurologie', desc: 'Cerveau et nerfs' },
    { emoji: '🦴', name: 'Orthopédie', desc: 'Os et articulations' },
    { emoji: '👁️', name: 'Ophtalmologie', desc: 'Yeux et vision' },
    { emoji: '🩺', name: 'Médecine générale', desc: 'Soins courants' },
    { emoji: '🦷', name: 'Dentaire', desc: 'Dents et gencives' },
    { emoji: '👶', name: 'Pédiatrie', desc: 'Enfants et nourrissons' },
    { emoji: '🧬', name: 'Dermatologie', desc: 'Peau et allergies' },
  ];
  const specGrid = document.getElementById('specGrid');
  if (specGrid) {
    specs.forEach((s, i) => {
      const card = document.createElement('div');
      card.className = 'spec-item fade-in';
      card.style.transitionDelay = `${i * 80}ms`;
      card.style.cursor = 'pointer';
      card.innerHTML = `<div class="sc-emoji">${s.emoji}</div><h3>${s.name}</h3><p>${s.desc}</p>`;
      card.addEventListener('click', () => {
        window.location.href = `recherche.html?spec=${encodeURIComponent(s.name)}&loc=`;
      });
      specGrid.appendChild(card);
    });
  }

  // === DOCTORS GRID ===
  const doctors = [
    { name: 'Dr. Sarah Martin', spec: 'Cardiologue', city: 'Alger', rating: 4.9, reviews: 312, filter: 'cardiologue', color: 'teal', initials: 'SM' },
    { name: 'Dr. Thomas Petit', spec: 'Médecin généraliste', city: 'Casablanca', rating: 4.8, reviews: 245, filter: 'generaliste', color: 'emerald', initials: 'TP' },
    { name: 'Dr. Claire Dubois', spec: 'Dermatologue', city: 'Tunis', rating: 4.9, reviews: 189, filter: 'dermatologue', color: 'indigo', initials: 'CD' },
    { name: 'Dr. Marc Laurent', spec: 'Pédiatre', city: 'Dakar', rating: 4.7, reviews: 276, filter: 'pediatre', color: 'teal', initials: 'ML' },
    { name: 'Dr. Sophie Bernard', spec: 'Psychiatre', city: 'Dubaï', rating: 4.8, reviews: 198, filter: 'psychiatre', color: 'indigo', initials: 'SB' },
    { name: 'Dr. Lucas Moreau', spec: 'Cardiologue', city: 'Istanbul', rating: 4.9, reviews: 321, filter: 'cardiologue', color: 'emerald', initials: 'LM' },
  ];
  const doctorsGrid = document.getElementById('doctorsGrid');
  function renderDoctors(filter) {
    if (!doctorsGrid) return;
    doctorsGrid.innerHTML = '';
    const list = filter === 'all' ? doctors : doctors.filter(d => d.filter === filter);
    list.forEach((d, i) => {
      const card = document.createElement('div');
      card.className = 'doctor-card fade-in';
      card.style.transitionDelay = `${i * 100}ms`;
      card.innerHTML = `
        <div class="doc-top ${d.color}"><div class="fc-avatar doc-av">${d.initials}</div></div>
        <div class="doc-body">
          <div class="doc-name">${d.name}</div>
          <div class="doc-spec">${d.spec} · ${d.city}</div>
          <div class="doc-meta"><span class="doc-stars">★ ${d.rating}</span><span>${d.reviews} avis</span></div>
          <a href="profil.html" class="doc-btn">Prendre rendez-vous</a>
        </div>`;
      doctorsGrid.appendChild(card);
    });
    observeFadeIns();
  }
  renderDoctors('all');

  // === TESTIMONIALS ===
  const testimonials = [
    { name: 'Amine R.', role: 'Patient', text: "Grâce à Healthiverse, j'ai trouvé un spécialiste à Alger en quelques clics. Indispensable !", stars: 5, color: '#10b981' },
    { name: 'Leila M.', role: 'Patiente', text: "Service impeccable, j'utilise la plateforme pour mes enfants à Casablanca.", stars: 5, color: '#6366f1' }
  ];
  const testiTrack = document.getElementById('testiTrack');
  if (testiTrack) {
    testimonials.forEach(t => {
      const card = document.createElement('div');
      card.className = 'testi-card';
      card.innerHTML = `<div class="testi-txt">"${t.text}"</div><div class="testi-name">${t.name}</div>`;
      testiTrack.appendChild(card);
    });
  }

  // === CITIES ===
  const cities = [
    { emoji: '🇩🇿', name: 'Alger', count: '8 400+' },
    { emoji: '🇲🇦', name: 'Casablanca', count: '7 200+' },
    { emoji: '🇹🇳', name: 'Tunis', count: '3 800+' },
    { emoji: '🇹🇷', name: 'Istanbul', count: '15 400+' }
  ];
  const citiesGrid = document.getElementById('citiesGrid');
  if (citiesGrid) {
    cities.forEach(c => {
      const card = document.createElement('div');
      card.className = 'city-card fade-in';
      card.innerHTML = `<div class="city-emoji">${c.emoji}</div><div class="city-name">${c.name}</div><div class="city-count">${c.count} docteurs</div>`;
      citiesGrid.appendChild(card);
    });
  }

  // === SEARCH LOGIC ===
  function handleSearch() {
    const spec = document.getElementById('searchSpec')?.value || '';
    const loc = document.getElementById('searchLoc')?.value || '';
    const btn = document.getElementById('searchBtn');
    if (btn) btn.innerHTML = 'Chargement...';
    setTimeout(() => {
      window.location.href = `recherche.html?spec=${encodeURIComponent(spec)}&loc=${encodeURIComponent(loc)}`;
    }, 500);
  }
  const searchBtn = document.getElementById('searchBtn');
  if (searchBtn) searchBtn.addEventListener('click', handleSearch);

  // === MAP (Leaflet) ===
  const mapContainer = document.getElementById('carte');
  if (mapContainer) {
    const mainMap = L.map('carte', { scrollWheelZoom: false }).setView([36.7538, 3.0588], 13);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/voyager/{z}/{x}/{y}{r}.png').addTo(mainMap);
    
    // Correction de l'affichage (évite les zones grises)
    setTimeout(() => {
      mainMap.invalidateSize();
    }, 400);
  }

  // === FADE IN ===
  function observeFadeIns() {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in:not(.visible)').forEach(el => obs.observe(el));
  }
  observeFadeIns();

  // === COUNTERS ===
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      let count = 0;
      const step = target / 50;
      const timer = setInterval(() => {
        count += step;
        if (count >= target) { el.textContent = target.toLocaleString() + (el.dataset.suffix || ''); clearInterval(timer); }
        else { el.textContent = Math.floor(count).toLocaleString() + (el.dataset.suffix || ''); }
      }, 30);
      counterObs.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.h-num').forEach(el => counterObs.observe(el));
});
