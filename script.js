document.addEventListener('DOMContentLoaded', () => {
  // === NAVBAR SCROLL ===
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  });

  // === LANGUAGE SELECTOR ===
  const langBtn = document.getElementById('langBtn');
  const langDropdown = document.getElementById('langDropdown');
  const langOpts = document.querySelectorAll('.lang-opt');

  if (langBtn && langDropdown) {
    langBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      langDropdown.classList.toggle('show');
    });

    langOpts.forEach(opt => {
      opt.addEventListener('click', () => {
        const lang = opt.dataset.lang;
        const text = opt.textContent;
        const code = lang.toUpperCase();
        const flag = text.split(' ')[0];
        
        // Update Button
        langBtn.innerHTML = `🌍 ${code} ▾`;
        
        // Update Active State
        langOpts.forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        
        // Close Dropdown
        langDropdown.classList.remove('show');
        
        // Save Preference
        localStorage.setItem('healthiverse-lang', lang);
        
        // Trigger Translation (Optional for now, but good to have)
        translatePage(lang);
      });
    });

    document.addEventListener('click', () => langDropdown.classList.remove('show'));
  }

  function translatePage(lang) {
    const translations = {
      'fr': {
        'nav-spec': 'Spécialités', 'nav-contact': 'Contact', 'hero-title': 'Votre santé, sans frontières',
        'hero-sub': 'Le premier réseau médical certifié en Afrique, au Moyen-Orient et en Turquie. Prenez rendez-vous en ligne 24h/24.',
        'search-med': 'Médecin', 'search-clin': 'Clinique', 'search-phar': 'Pharmacie', 'search-btn': 'Rechercher',
        'search-spec-p': 'Spécialité, médecin, symptôme…', 'search-loc-p': 'Ville ou Pays…',
        'spec-h2': 'Toutes les spécialités médicales', 'spec-p': 'Trouvez rapidement le bon spécialiste pour chaque besoin de santé',
        'doc-h2': 'Médecins & Spécialistes', 'doc-p': 'Sélectionnés pour leur expertise et leurs excellents avis patients',
        'aux-h2': 'Services Auxiliaires & Opérateurs', 'aux-p': 'Une prise en charge complète, au-delà de la simple consultation',
        'map-h2': 'Trouver un professionnel autour de vous', 'map-p': 'Visualisez les cabinets médicaux et pharmacies de garde ouverts actuellement à proximité.',
        'how-h2': 'Comment ça marche ?', 'how-p': "Prendre soin de votre santé n'a jamais été aussi simple",
        'stats-h-pro': 'Professionnels de santé', 'stats-h-avis': 'Avis patients vérifiés', 'stats-h-rdv': 'Rendez-vous pris', 'stats-h-sat': 'Taux de satisfaction',
        'footer-desc': 'Votre guide santé de confiance. Trouvez les meilleurs professionnels de santé près de chez vous.'
      },
      'en': {
        'nav-spec': 'Specialties', 'nav-contact': 'Contact', 'hero-title': 'Your health, without borders',
        'hero-sub': 'The leading certified medical network in Africa, the Middle East, and Turkey. Book appointments online 24/7.',
        'search-med': 'Doctor', 'search-clin': 'Clinic', 'search-phar': 'Pharmacy', 'search-btn': 'Search',
        'search-spec-p': 'Specialty, doctor, symptom…', 'search-loc-p': 'City or Country…',
        'spec-h2': 'All Medical Specialties', 'spec-p': 'Quickly find the right specialist for every health need',
        'doc-h2': 'Doctors & Specialists', 'doc-p': 'Selected for their expertise and excellent patient reviews',
        'aux-h2': 'Auxiliary Services & Operators', 'aux-p': 'Comprehensive care, beyond simple consultation',
        'map-h2': 'Find a professional near you', 'map-p': 'Visualize medical offices and on-call pharmacies currently open nearby.',
        'how-h2': 'How it works?', 'how-p': 'Taking care of your health has never been easier',
        'stats-h-pro': 'Health Professionals', 'stats-h-avis': 'Verified Patient Reviews', 'stats-h-rdv': 'Appointments Booked', 'stats-h-sat': 'Satisfaction Rate',
        'footer-desc': 'Your trusted health guide. Find the best health professionals near you.'
      },
      'ar': {
        'nav-spec': 'التخصصات', 'nav-contact': 'اتصل بنا', 'hero-title': 'صحتك، بلا حدود',
        'hero-sub': 'أول شبكة طبية معتمدة في أفريقيا والشرق الأوسط وتركيا. احجز موعدك عبر الإنترنت على مدار الساعة.',
        'search-med': 'طبيب', 'search-clin': 'عيادة', 'search-phar': 'صيدلية', 'search-btn': 'بحث',
        'search-spec-p': 'تخصص، طبيب، أعراض...', 'search-loc-p': 'مدينة أو بلد...',
        'spec-h2': 'جميع التخصصات الطبية', 'spec-p': 'ابحث بسرعة عن المتخصص المناسب لكل احتياجاتك الصحية',
        'doc-h2': 'الأطباء والمتخصصون', 'doc-p': 'تم اختيارهم لخبرتهم وآراء المرضى الممتازة',
        'aux-h2': 'الخدمات المساعدة والمشغلون', 'aux-p': 'رعاية شاملة تتجاوز مجرد الاستشارة',
        'map-h2': 'ابحث عن محترف بالقرب منك', 'map-p': 'شاهد العيادات الطبية والصيدليات المناوبة المفتوحة حاليًا بالقرب منك.',
        'how-h2': 'كيف يعمل؟', 'how-p': 'الاعتناء بصحتك لم يكن أسهل من أي وقت مضى',
        'stats-h-pro': 'متخصصو الصحة', 'stats-h-avis': 'آراء المرضى الموثقة', 'stats-h-rdv': 'المواعيد المحجوزة', 'stats-h-sat': 'معدل الرضا',
        'footer-desc': 'دليلك الصحي الموثوق. ابحث عن أفضل المتخصصين الصحيين بالقرب منك.'
      },
      'tr': {
        'nav-spec': 'Uzmanlıklar', 'nav-contact': 'İletişim', 'hero-title': 'Sağlığınız, sınır tanımadan',
        'hero-sub': 'Afrika, Orta Doğu ve Türkiye\'deki ilk sertifikalı tıbbi ağ. 7/24 online randevu alın.',
        'search-med': 'Doktor', 'search-clin': 'Klinik', 'search-phar': 'Eczane', 'search-btn': 'Ara',
        'search-spec-p': 'Uzmanlık, doktor, semptom…', 'search-loc-p': 'Şehir veya Ülke…',
        'spec-h2': 'Tüm Tıbbi Uzmanlıklar', 'spec-p': 'Her sağlık ihtiyacı için doğru uzmanı hızlıca bulun',
        'doc-h2': 'Doktorlar ve Uzmanlar', 'doc-p': 'Uzmanlıkları ve mükemmel hasta yorumları için seçildi',
        'aux-h2': 'Yardımcı Hizmetler ve Operatörler', 'aux-p': 'Basit konsültasyonun ötesinde kapsamlı bakım',
        'map-h2': 'Yakınınızda bir profesyonel bulun', 'map-p': 'Yakınınızdaki açık tıbbi ofisleri ve nöbetçi eczaneleri görüntüleyin.',
        'how-h2': 'Nasıl çalışır?', 'how-p': 'Sağlığınıza dikkat etmek hiç bu kadar kolay olmamıştı',
        'stats-h-pro': 'Sağlık Profesyonelleri', 'stats-h-avis': 'Doğrulanmış Hasta Yorumları', 'stats-h-rdv': 'Alınan Randevular', 'stats-h-sat': 'Memnuniyet Oranı',
        'footer-desc': 'Güvenilir sağlık rehberiniz. Yakınınızdaki en iyi sağlık profesyonellerini bulun.'
      }
    };
    
    if (!translations[lang]) return;

    // RTL handling
    document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;

    // Apply translations to elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (translations[lang][key]) {
        if (el.tagName === 'INPUT' && el.placeholder) {
          // Special case for placeholders if needed
        } else {
          el.textContent = translations[lang][key];
        }
      }
    });

    if (specInput && translations[lang]['search-spec-p']) specInput.placeholder = translations[lang]['search-spec-p'];
    if (locInput && translations[lang]['search-loc-p']) locInput.placeholder = translations[lang]['search-loc-p'];

    // Update dynamic grids
    renderSpecialties(lang);
    renderDoctors('all', lang);
  }

  // Initial load
  const savedLang = localStorage.getItem('healthiverse-lang');
  if (savedLang) {
    const opt = document.querySelector(`.lang-opt[data-lang="${savedLang}"]`);
    if (opt) opt.click();
  }

  // === REGIONAL DATA & AUTO-DETECTION ===
  const regionalData = {
    'DZ': { flag: '🇩🇿', label: 'Algérie', emergency: [
      { label: 'Protection Civile', num: '14' },
      { label: 'Police', num: '17' },
      { label: 'SAMU', num: '3016' }
    ]},
    'MA': { flag: '🇲🇦', label: 'Maroc', emergency: [
      { label: 'Ambulance', num: '150' },
      { label: 'Police', num: '19' },
      { label: 'Gendarmerie', num: '177' }
    ]},
    'TN': { flag: '🇹🇳', label: 'Tunisie', emergency: [
      { label: 'SAMU', num: '190' },
      { label: 'Protection Civile', num: '198' },
      { label: 'Police', num: '197' }
    ]},
    'TR': { flag: '🇹🇷', label: 'Turquie', emergency: [
      { label: 'Urgences', num: '112' },
      { label: 'Police', num: '155' }
    ]},
    'EG': { flag: '🇪🇬', label: 'Égypte', emergency: [
      { label: 'Ambulance', num: '123' },
      { label: 'Police', num: '122' },
      { label: 'Pompiers', num: '180' }
    ]},
    'SA': { flag: '🇸🇦', label: 'Arabie Saoudite', emergency: [
      { label: 'Ambulance', num: '997' },
      { label: 'Police', num: '999' },
      { label: 'Pompiers', num: '998' }
    ]},
    'AE': { flag: '🇦🇪', label: 'Émirats Arabes Unis', emergency: [
      { label: 'Ambulance', num: '998' },
      { label: 'Police', num: '999' },
      { label: 'Pompiers', num: '997' }
    ]},
    'QA': { flag: '🇶🇦', label: 'Qatar', emergency: [
      { label: 'Urgences', num: '999' }
    ]}
  };

  function applyRegion(cc) {
    const data = regionalData[cc] || regionalData['DZ'];
    
    // Update Top Bar
    const topUrgences = document.getElementById('emergencyNumbers');
    if (topUrgences) {
      const nums = data.emergency.map(e => `<strong>${e.label}:</strong> <a href="tel:${e.num}" style="color:inherit;text-decoration:none">${e.num}</a>`).join(' | ');
      topUrgences.innerHTML = `🚨 Urgences (${data.flag}): ${nums}`;
    }

    // Update FAB Panel
    const fabPanel = document.getElementById('fabPanel');
    if (fabPanel) {
      let html = `<h4>Numéros d'urgence (${data.label})</h4>`;
      data.emergency.forEach(e => {
        html += `
          <a href="tel:${e.num}" class="fab-contact">
            <span class="fab-c-ico samu">${e.num}</span>
            <span>${e.label}</span>
            <span class="fab-c-sub">Appel immédiat</span>
          </a>`;
      });
      fabPanel.innerHTML = html;
    }
  }

  async function detectLocation() {
    try {
      const res = await fetch('https://ipapi.co/json/');
      const json = await res.json();
      applyRegion(json.country_code);
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
  function renderSpecialties(lang = 'fr') {
    const specGrid = document.getElementById('specGrid');
    if (!specGrid) return;
    specGrid.innerHTML = '';
    
    const specsDict = {
      'fr': [
        { emoji: '🫀', name: 'Cardiologie', desc: 'Cœur et vaisseaux' },
        { emoji: '🧠', name: 'Neurologie', desc: 'Cerveau et nerfs' },
        { emoji: '🦴', name: 'Orthopédie', desc: 'Os et articulations' },
        { emoji: '👁️', name: 'Ophtalmologie', desc: 'Yeux et vision' },
        { emoji: '🩺', name: 'Médecine générale', desc: 'Soins courants' },
        { emoji: '🦷', name: 'Dentaire', desc: 'Dents et gencives' },
        { emoji: '👶', name: 'Pédiatrie', desc: 'Enfants et nourrissons' },
        { emoji: '🧬', name: 'Dermatologie', desc: 'Peau et allergies' }
      ],
      'en': [
        { emoji: '🫀', name: 'Cardiology', desc: 'Heart and vessels' },
        { emoji: '🧠', name: 'Neurology', desc: 'Brain and nerves' },
        { emoji: '🦴', name: 'Orthopedics', desc: 'Bones and joints' },
        { emoji: '👁️', name: 'Ophthalmology', desc: 'Eyes and vision' },
        { emoji: '🩺', name: 'General Medicine', desc: 'Routine care' },
        { emoji: '🦷', name: 'Dental', desc: 'Teeth and gums' },
        { emoji: '👶', name: 'Pediatrics', desc: 'Children and infants' },
        { emoji: '🧬', name: 'Dermatology', desc: 'Skin and allergies' }
      ],
      'ar': [
        { emoji: '🫀', name: 'أمراض القلب', desc: 'القلب والأوعية الدموية' },
        { emoji: '🧠', name: 'أعصاب', desc: 'الدماغ والأعصاب' },
        { emoji: '🦴', name: 'جراحة العظام', desc: 'العظام والمفاصل' },
        { emoji: '👁️', name: 'طب العيون', desc: 'العيون والرؤية' },
        { emoji: '🩺', name: 'الطب العام', desc: 'الرعاية الروتينية' },
        { emoji: '🦷', name: 'طب الأسنان', desc: 'الأسنان واللثة' },
        { emoji: '👶', name: 'طب الأطفال', desc: 'الأطفال والرضع' },
        { emoji: '🧬', name: 'طب الجلد', desc: 'الجلد والحساسية' }
      ],
      'tr': [
        { emoji: '🫀', name: 'Kardiyoloji', desc: 'Kalp ve damarlar' },
        { emoji: '🧠', name: 'Nöroloji', desc: 'Beyin ve sinirler' },
        { emoji: '🦴', name: 'Ortopedi', desc: 'Kemikler ve eklemler' },
        { emoji: '👁️', name: 'Göz Hastalıkları', desc: 'Gözler ve görme' },
        { emoji: '🩺', name: 'Genel Tıp', desc: 'Rutin bakım' },
        { emoji: '🦷', name: 'Diş Hekimliği', desc: 'Dişler ve diş etleri' },
        { emoji: '👶', name: 'Pediatri', desc: 'Çocuklar ve bebekler' },
        { emoji: '🧬', name: 'Dermatoloji', desc: 'Cilt ve alerjiler' }
      ]
    };

    const currentSpecs = specsDict[lang] || specsDict['fr'];
    currentSpecs.forEach((s, i) => {
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
    observeFadeIns();
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
  function renderDoctors(filter, lang = 'fr') {
    if (!doctorsGrid) return;
    doctorsGrid.innerHTML = '';
    const btnText = { 'fr': 'Prendre rendez-vous', 'en': 'Book appointment', 'ar': 'حجز موعد', 'tr': 'Randevu al' };
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
          <a href="profil.html" class="doc-btn">${btnText[lang] || btnText['fr']}</a>
        </div>`;
      doctorsGrid.appendChild(card);
    });
    observeFadeIns();
  }
  renderSpecialties();
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
  window.observeFadeIns = observeFadeIns;

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
