// API Configuration
const apiKey = 'PASTE YOUR API';

// Slider state
let leagueCenter = 0;
let teamCenter = 0;
let selectedLeague = null;
let selectedTeam = null;
let teamsData = [];

// ===== LEAGUE SLIDER =====
function initLeagueSlider() {
  const track = document.getElementById('league-slider');
  if (!track) return;

  // Render league items
  track.innerHTML = '';
  leagues.forEach((league, idx) => {
    const el = document.createElement('div');
    el.className = 'slider-item';
    el.dataset.index = idx;
    el.innerHTML = `
      <div class="slider-item-logo">
        <img src="${league.logo}" alt="${league.name}" />
      </div>
      <div class="slider-item-name">${league.name}</div>
    `;
    el.addEventListener('click', () => centerLeague(idx));
    track.appendChild(el);
  });

  // Start at middle league
  leagueCenter = Math.floor(leagues.length / 2);
  centerLeague(leagueCenter);
}

function centerLeague(index) {
  leagueCenter = Math.max(0, Math.min(leagues.length - 1, index));
  const track = document.getElementById('league-slider');
  if (!track) return;

  const items = track.children;
  if (!items.length) return;

  const itemW = items[0].offsetWidth + 32; // 32 is gap
  const viewportW = track.parentElement.offsetWidth;
  const targetScroll = leagueCenter * itemW - (viewportW - itemW) / 2;

  track.style.transform = `translateX(${-targetScroll}px)`;

  // Update selected class
  Array.from(items).forEach((el, i) => {
    el.classList.toggle('active', i === leagueCenter);
  });

  // Store selected league
  selectedLeague = leagues[leagueCenter];
  localStorage.setItem('selectedLeague', JSON.stringify(selectedLeague));

  // Load teams for selected league
  loadTeams(selectedLeague.id);
}

// ===== TEAM SLIDER =====
async function loadTeams(leagueId) {
  const track = document.getElementById('team-slider');
  if (!track) return;

  track.innerHTML =
    '<div style="color: #ceeec6; padding: 2rem;">Loading teams...</div>';

  try {
    const response = await fetch(
      `https://v3.football.api-sports.io/teams?league=${leagueId}&season=2023`,
      { headers: { 'x-apisports-key': apiKey } }
    );

    const data = await response.json();
    const teams = data.response?.map((t) => t.team) || [];

    if (!teams.length) {
      track.innerHTML =
        '<div style="color: #ceeec6; padding: 2rem;">No teams found</div>';
      return;
    }

    // Render team items
    track.innerHTML = '';
    teamsData = teams;
    teams.forEach((team, idx) => {
      const el = document.createElement('div');
      el.className = 'slider-item';
      el.dataset.index = idx;
      el.innerHTML = `
        <div class="slider-item-logo">
          <img src="${team.logo || 'https://via.placeholder.com/140'}" alt="${
        team.name
      }" />
        </div>
        <div class="slider-item-name">${team.name}</div>
      `;
      el.addEventListener('click', () => centerTeam(idx, teams));
      track.appendChild(el);
    });

    // Start at middle team
    teamCenter = Math.floor(teams.length / 2);
    centerTeam(teamCenter, teams);
  } catch (error) {
    console.error('Error:', error);
    track.innerHTML =
      '<div style="color: #ff6b6b; padding: 2rem;">Error loading teams</div>';
  }
}

function centerTeam(index, teams) {
  teamCenter = Math.max(0, Math.min(teams.length - 1, index));
  const track = document.getElementById('team-slider');
  if (!track) return;

  const items = track.children;
  if (!items.length) return;

  const itemW = items[0].offsetWidth + 32;
  const viewportW = track.parentElement.offsetWidth;
  const targetScroll = teamCenter * itemW - (viewportW - itemW) / 2;

  track.style.transform = `translateX(${-targetScroll}px)`;

  Array.from(items).forEach((el, i) => {
    el.classList.toggle('active', i === teamCenter);
  });

  // Store selected team
  selectedTeam = teams[teamCenter];
  localStorage.setItem('selectedTeam', JSON.stringify(selectedTeam));

  // Show CTA button if both league and team are selected
  showCTAButton();
}

// ===== CTA BUTTON =====
function showCTAButton() {
  if (selectedLeague && selectedTeam) {
    const ctaContainer = document.getElementById('cta-container');
    if (ctaContainer) {
      ctaContainer.style.display = 'flex';
    }
  }
}

// ===== BUTTON HANDLERS =====
function setupButtons() {
  document
    .getElementById('league-prev')
    ?.addEventListener('click', () => centerLeague(leagueCenter - 1));
  document
    .getElementById('league-next')
    ?.addEventListener('click', () => centerLeague(leagueCenter + 1));
  document.getElementById('team-prev')?.addEventListener('click', () => {
    const track = document.getElementById('team-slider');
    const count = track?.children.length || 0;
    if (count) centerTeam(teamCenter - 1, Array(count));
  });
  document.getElementById('team-next')?.addEventListener('click', () => {
    const track = document.getElementById('team-slider');
    const count = track?.children.length || 0;
    if (count) centerTeam(teamCenter + 1, Array(count));
  });
}

// ===== INIT =====
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initLeagueSlider();
    setupButtons();
  });
} else {
  initLeagueSlider();
  setupButtons();
}
