function selectType(type) {
  // Masquer le choix initial
  document.getElementById('step-choice').classList.remove('active');
  
  // Afficher le formulaire correspondant
  if (type === 'patient') {
    document.getElementById('form-patient').classList.add('active');
  } else if (type === 'pro') {
    document.getElementById('form-pro').classList.add('active');
  }
}

function goBack() {
  // Masquer tous les formulaires
  document.getElementById('form-patient').classList.remove('active');
  document.getElementById('form-pro').classList.remove('active');
  
  // Réafficher le choix initial
  document.getElementById('step-choice').classList.add('active');
}

// Simulation de soumission avec validation
document.querySelectorAll('.auth-form').forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simple validation
    let isValid = true;
    const inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
    
    inputs.forEach(input => {
      if (!input.value.trim()) {
        input.style.borderColor = '#ef4444';
        isValid = false;
      } else {
        input.style.borderColor = 'var(--brd)';
      }
    });

    const checkbox = form.querySelector('input[type="checkbox"]');
    if (checkbox && !checkbox.checked) {
      alert("Veuillez accepter les conditions d'utilisation.");
      isValid = false;
    }

    if (!isValid) return;

    const isPro = form.parentElement.id === 'form-pro';
    
    // Animation de succès
    const submitBtn = form.querySelector('.btn-auth-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Création en cours...";
    submitBtn.disabled = true;
    
    setTimeout(() => {
      alert(isPro ? "Bienvenue Dr ! Votre compte professionnel est créé." : "Bienvenue ! Votre compte patient est créé.");
      // Simuler l'authentification
      localStorage.setItem('userAuth', 'true');
      localStorage.setItem('userType', isPro ? 'pro' : 'patient');
      window.location.href = isPro ? "dashboard.html" : "index.html";
    }, 1500);
  });
});
