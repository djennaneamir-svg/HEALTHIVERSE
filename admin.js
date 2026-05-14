// ADMIN DASHBOARD LOGIC

if (typeof firebase !== 'undefined' && !firebase.apps.length) {
  firebase.initializeApp(HEALTHIVERSE_CONFIG.firebase);
}

if (typeof firebase !== 'undefined') {
  firebase.auth().onAuthStateChanged(user => {
    if (!user || localStorage.getItem('adminAuth') !== 'true') {
      window.location.href = 'login-admin.html';
    }
  });
}


document.addEventListener('DOMContentLoaded', () => {
  initMiniCharts();
  
  // Handle suggestion actions
  document.querySelectorAll('.btn-check').forEach(btn => {
    btn.addEventListener('click', function() {
      const row = this.closest('tr');
      const tag = row.querySelector('.tag-pending');
      if (tag) {
        tag.className = 'tag-approved';
        tag.textContent = 'Validé';
        this.parentElement.innerHTML = '-';
        updateSuggestCount();
      }
    });
  });

  document.querySelectorAll('.btn-reject').forEach(btn => {
    btn.addEventListener('click', function() {
      if(confirm("Voulez-vous vraiment rejeter cette proposition ?")) {
        this.closest('tr').remove();
        updateSuggestCount();
      }
    });
  });
});

function updateSuggestCount() {
  const countSpan = document.getElementById('suggestCount');
  const pendingTags = document.querySelectorAll('.tag-pending').length;
  countSpan.textContent = pendingTags;
}

function initMiniCharts() {
  const chartConfigs = [
    { id: 'miniChart1', color: '#0d9488', data: [10, 15, 8, 25, 18, 30, 45] },
    { id: 'miniChart2', color: '#6366f1', data: [5, 10, 15, 12, 20, 25, 22] },
    { id: 'miniChart3', color: '#fbbf24', data: [2, 5, 3, 8, 10, 15, 12] }
  ];

  chartConfigs.forEach(conf => {
    const ctx = document.getElementById(conf.id).getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['', '', '', '', '', '', ''],
        datasets: [{
          data: conf.data,
          borderColor: conf.color,
          borderWidth: 2,
          pointRadius: 0,
          fill: true,
          backgroundColor: conf.color + '10',
          tension: 0.4
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          x: { display: false },
          y: { display: false }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    });
  });
}
