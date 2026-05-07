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

// Simulation de soumission (pour la démo)
document.querySelectorAll('.auth-form').forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const isPro = form.parentElement.id === 'form-pro';
    
    // Animation de succès
    const submitBtn = form.querySelector('.btn-auth-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Création en cours...";
    submitBtn.disabled = true;
    
    setTimeout(() => {
      alert(isPro ? "Bienvenue Dr ! Votre compte professionnel est créé. Vous allez être redirigé vers le choix de votre forfait." : "Bienvenue ! Votre compte patient est créé. Vous allez être redirigé vers l'accueil.");
      window.location.href = isPro ? "dashboard.html" : "index.html";
    }, 1500);
  });
});
