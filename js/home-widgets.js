const apiKey = 'PASTE YOUR API';

// Retrieve stored league and team
let selectedLeague = JSON.parse(localStorage.getItem('selectedLeague'));
let selectedTeam = JSON.parse(localStorage.getItem('selectedTeam'));

// Initialize widgets on page load
document.addEventListener('DOMContentLoaded', init);

function init() {
  if (!selectedLeague || !selectedTeam) {
    showNoDataMessage();
    return;
  }

  loadLeagueTable();
  loadTeamMatches();
  loadLastMatch();
}

async function loadLeagueTable() {
  const container = document.getElementById('league-table-container');
  if (!container) return;

  container.innerHTML = '<div class="loading">Loading table...</div>';

  try {
    const response = await fetch(
      `https://v3.football.api-sports.io/standings?league=${selectedLeague.id}&season=2024`,
      {
        headers: { 'x-apisports-key': apiKey },
      }
    );

    const data = await response.json();
    const standings = data.response?.[0]?.league?.standings?.[0] || [];

    if (!standings.length) {
      container.innerHTML =
        '<div class="no-data">No standings data available</div>';
      return;
    }

    let html = `
      <div class="widget-header">
        <h3>${selectedLeague.name} - ${selectedLeague.country}</h3>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>Position</th>
            <th>Team</th>
            <th>Played</th>
            <th>Record</th>
            <th>Goals</th>
            <th>GD</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
    `;

    standings.forEach((item, index) => {
      const team = item.team;
      const isChampion = index === 0;
      const isRelegated = index >= standings.length - 3;
      const rowClass = isChampion
        ? 'highlight-champ'
        : isRelegated
        ? 'highlight-relegated'
        : '';

      html += `
        <tr class="${rowClass}">
          <td>${item.rank}</td>
          <td class="team-cell">
            <img src="${team.logo}" alt="${team.name}" class="team-logo">
            <span class="team-name">${team.name}</span>
          </td>
          <td>${item.all.played}</td>
          <td>${item.all.win}-${item.all.draw}-${item.all.lose}</td>
          <td>${item.all.goals.for}-${item.all.goals.against}</td>
          <td>${item.goalsDiff}</td>
          <td class="points"><strong>${item.points}</strong></td>
        </tr>
      `;
    });

    html += `
        </tbody>
      </table>
    `;

    container.innerHTML = html;
  } catch (error) {
    console.error('Error loading league table:', error);
    container.innerHTML = '<div class="error">Failed to load standings</div>';
  }
}

async function loadTeamMatches() {
  const container = document.getElementById('matches-schedule-container');
  if (!container) return;

  container.innerHTML = '<div class="loading">Loading matches...</div>';

  try {
    const response = await fetch(
      `https://v3.football.api-sports.io/fixtures?team=${selectedTeam.id}&season=2024&last=10`,
      {
        headers: { 'x-apisports-key': apiKey },
      }
    );

    const data = await response.json();
    const matches = data.response || [];

    if (!matches.length) {
      container.innerHTML = '<div class="no-data">No recent matches</div>';
      return;
    }

    let html = `
      <div class="widget-header">
        <h3>${selectedTeam.name} - Recent Matches</h3>
      </div>
      <div class="matches-list">
    `;

    matches.forEach((match) => {
      const isHome = match.teams.home.id === selectedTeam.id;
      const opponent = isHome ? match.teams.away : match.teams.home;
      const score = match.goals;
      const teamScore = isHome ? score.home : score.away;
      const opponentScore = isHome ? score.away : score.home;
      const matchDate = new Date(match.fixture.date);
      const dateStr = matchDate.toLocaleDateString('en-GB', {
        month: 'short',
        day: 'numeric',
      });

      const status = match.fixture.status.short;
      const statusClass =
        status === 'FT' ? 'finished' : status === 'PST' ? 'postponed' : '';

      html += `
        <div class="match-card ${statusClass}">
          <div class="match-date">${dateStr}</div>
          <div class="match-content">
            <div class="team home">
              <img src="${match.teams.home.logo}" alt="${
        match.teams.home.name
      }" class="team-badge">
              <span class="team-name">${match.teams.home.name}</span>
            </div>
            <div class="match-score">
              <span class="score">${score.home ?? '-'}</span>
              <span class="separator">-</span>
              <span class="score">${score.away ?? '-'}</span>
            </div>
            <div class="team away">
              <span class="team-name">${match.teams.away.name}</span>
              <img src="${match.teams.away.logo}" alt="${
        match.teams.away.name
      }" class="team-badge">
            </div>
          </div>
          <div class="match-status">${status}</div>
        </div>
      `;
    });

    html += `
      </div>
    `;

    container.innerHTML = html;
  } catch (error) {
    console.error('Error loading matches:', error);
    container.innerHTML = '<div class="error">Failed to load matches</div>';
  }
}

async function loadLastMatch() {
  const container = document.getElementById('match-overview-container');
  if (!container) return;

  container.innerHTML = '<div class="loading">Loading last match...</div>';

  try {
    const response = await fetch(
      `https://v3.football.api-sports.io/fixtures?team=${selectedTeam.id}&season=2024&last=1&status=FT`,
      {
        headers: { 'x-apisports-key': apiKey },
      }
    );

    const data = await response.json();
    const match = data.response?.[0];

    if (!match) {
      container.innerHTML =
        '<div class="no-data">No completed matches yet</div>';
      return;
    }

    const home = match.teams.home;
    const away = match.teams.away;
    const goals = match.goals;
    const stats = match.statistics || [];

    const homeStats = stats[0] || {};
    const awayStats = stats[1] || {};

    const matchDate = new Date(match.fixture.date);
    const dateStr = matchDate.toLocaleDateString('en-GB', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    const timeStr = matchDate.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });

    let html = `
      <div class="widget-header">
        <h3>Last Match - ${dateStr}</h3>
      </div>
      <div class="last-match-container">
        <div class="match-header">
          <div class="team-section">
            <img src="${home.logo}" alt="${home.name}" class="team-badge">
            <div class="team-info">
              <h4>${home.name}</h4>
            </div>
          </div>

          <div class="match-score-large">
            <span class="score-number">${goals.home}</span>
            <span class="score-separator">-</span>
            <span class="score-number">${goals.away}</span>
          </div>

          <div class="team-section away">
            <div class="team-info">
              <h4>${away.name}</h4>
            </div>
            <img src="${away.logo}" alt="${away.name}" class="team-badge">
          </div>
        </div>

        <div class="match-details">
          <div class="detail-item">
            <span class="label">Date:</span>
            <span class="value">${dateStr} at ${timeStr}</span>
          </div>
          <div class="detail-item">
            <span class="label">Venue:</span>
            <span class="value">${match.fixture.venue.name || 'N/A'}</span>
          </div>
        </div>

        <div class="match-stats">
          <div class="stats-grid">
            <div class="stat-row">
              <div class="stat-home">${homeStats.shots?.total ?? 0}</div>
              <div class="stat-label">Shots</div>
              <div class="stat-away">${awayStats.shots?.total ?? 0}</div>
            </div>
            <div class="stat-row">
              <div class="stat-home">${homeStats.shots?.on_goal ?? 0}</div>
              <div class="stat-label">On Target</div>
              <div class="stat-away">${awayStats.shots?.on_goal ?? 0}</div>
            </div>
            <div class="stat-row">
              <div class="stat-home">${homeStats.passes?.total ?? 0}</div>
              <div class="stat-label">Passes</div>
              <div class="stat-away">${awayStats.passes?.total ?? 0}</div>
            </div>
            <div class="stat-row">
              <div class="stat-home">${homeStats.possession ?? '0%'}</div>
              <div class="stat-label">Possession</div>
              <div class="stat-away">${awayStats.possession ?? '0%'}</div>
            </div>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
  } catch (error) {
    console.error('Error loading last match:', error);
    container.innerHTML = '<div class="error">Failed to load last match</div>';
  }
}

function showNoDataMessage() {
  const containers = [
    'league-table-container',
    'matches-schedule-container',
    'match-overview-container',
  ];

  containers.forEach((id) => {
    const container = document.getElementById(id);
    if (container) {
      container.innerHTML =
        '<div class="no-data">Please select a league and team</div>';
    }
  });
}
