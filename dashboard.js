// DASHBOARD PRO LOGIC

if (typeof firebase !== 'undefined' && !firebase.apps.length) {
  firebase.initializeApp(HEALTHIVERSE_CONFIG.firebase);
}

if (typeof firebase !== 'undefined') {
  firebase.auth().onAuthStateChanged(user => {
    if (!user || localStorage.getItem('userType') !== 'pro') {
      window.location.href = 'login.html';
    }
  });
}


document.addEventListener('DOMContentLoaded', () => {

  // === VIEW CHART (Chart.js) ===
  const ctx = document.getElementById('viewChart').getContext('2d');
  
  // Dégradé pour le graphique
  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, 'rgba(13, 148, 136, 0.2)');
  gradient.addColorStop(1, 'rgba(13, 148, 136, 0)');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
      datasets: [{
        label: 'Vues du profil',
        data: [120, 190, 150, 280, 220, 110, 130],
        borderColor: '#0d9488',
        borderWidth: 3,
        backgroundColor: gradient,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#0d9488'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: '#f1f5f9' },
          ticks: { color: '#64748b' }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#64748b' }
        }
      }
    }
  });

  // === INTERACTIVITY SIMULATION ===

  // Simulation d'un nouveau rendez-vous
  setTimeout(() => {
    const dot = document.querySelector('.notif-badge .dot');
    if (dot) dot.style.display = 'block';
    console.log("Nouvelle notification : Un patient a pris RDV.");
  }, 5000);

  // Bouton "Nouveau RDV"
  document.querySelector('.btn-primary').addEventListener('click', () => {
    alert("Ouverture du formulaire de création de rendez-vous manuel...");
  });

  // Navigation latérale (simple feedback)
  document.querySelectorAll('.sidebar-nav a').forEach(link => {
    link.addEventListener('click', (e) => {
      if (link.textContent.includes('Vue d\'ensemble')) return;
      e.preventDefault();
      alert(`La section "${link.textContent.trim()}" sera implémentée dans la version v2.0.`);
    });
  });

});
