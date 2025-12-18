const apiKey = '5890e514e018ea165baff8a5ca7f9bb9';

// fresh selections read at init
let selectedLeague = null;
let selectedTeam = null;

document.addEventListener('DOMContentLoaded', init);

function init() {
  try {
    selectedLeague = JSON.parse(localStorage.getItem('selectedLeague'));
    selectedTeam = JSON.parse(localStorage.getItem('selectedTeam'));
  } catch (e) {
    console.warn('home-widgets: localStorage parse error', e);
  }

  console.log('home-widgets init', { selectedLeague, selectedTeam });

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
    const resp = await fetch(
      `https://v3.football.api-sports.io/standings?league=${selectedLeague.id}&season=2023`,
      { headers: { 'x-apisports-key': apiKey } }
    );

    if (!resp.ok) {
      const txt = await resp.text();
      console.error('Standings API error', resp.status, txt);
      container.innerHTML = `<div class="error">Standings API error: ${resp.status}</div>`;
      return;
    }

    const data = await resp.json();
    const standings = data.response?.[0]?.league?.standings?.[0] || [];

    if (!standings.length) {
      container.innerHTML =
        '<div class="no-data schabo">No standings data available</div>';
      return;
    }

    let html = `
      <table class="table schabo">
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
      const isSelectedTeam = team.id === selectedTeam.id;
      const isRelegated = index >= standings.length - 3;
      const rowClass = isSelectedTeam
        ? 'highlight-selected'
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

  container.innerHTML =
    '<div class="loading">Loading latest week matches...</div>';

  try {
    const resp = await fetch(
      `https://v3.football.api-sports.io/players/topassists?league=${selectedLeague.id}&season=2023`,
      { headers: { 'x-apisports-key': apiKey } }
    );

    if (!resp.ok) {
      const txt = await resp.text();
      console.error('Top assists API error', resp.status, txt);
      container.innerHTML = `<div class="error">Top assists API error: ${resp.status}</div>`;
      return;
    }

    const data = await resp.json();
    const assists = data.response || [];

    if (!assists.length) {
      container.innerHTML =
        '<div class="no-data schabo">No assists data available</div>';
      return;
    }

    let html = `
      <div class="assists-list schabo">
        <div class="assists-header">
          <span class="ranks">Rank</span>
          <span class="player">Player</span>
          <span class="name">name</span>
          <span class="team">Team</span>
          <span class="assists">Assists</span>
        </div>
    `;

    assists.slice(0, 10).forEach((item, index) => {
      const player = item.player;
      const team = item.statistics[0]?.team;

      html += `
        <div class="assist-row">
          <span class="rank">${index + 1}</span>

            <img src="${player.photo}" alt="${
        player.name
      }" class="player-photo" onerror="this.src='https://via.placeholder.com/40'">
            <p class="player-name">${player.name}</p>
          <p class="teams-name">${team?.name || 'N/A'}</p>
          <p class="assists-count"><strong>${
            item.statistics[0]?.assists || 0
          }</strong></p>
        </div>
      `;
    });

    html += `
      </div>
    `;

    container.innerHTML = html;
  } catch (error) {
    console.error('Error loading top assists:', error);
    container.innerHTML = '<div class="error">Failed to load top assists</div>';
  }
}

async function loadLastMatch() {
  const container = document.getElementById('match-overview-container');
  if (!container) return;

  container.innerHTML = '<div class="loading">Loading top scorers...</div>';

  try {
    const resp = await fetch(
      `https://v3.football.api-sports.io/players/topscorers?league=${selectedLeague.id}&season=2023`,
      { headers: { 'x-apisports-key': apiKey } }
    );

    if (!resp.ok) {
      const txt = await resp.text();
      console.error('Top scorers API error', resp.status, txt);
      container.innerHTML = `<div class="error">Top scorers API error: ${resp.status}</div>`;
      return;
    }

    const data = await resp.json();
    const scorers = data.response || [];

    if (!scorers.length) {
      container.innerHTML =
        '<div class="no-data schabo">No scorers data available</div>';
      return;
    }

    let html = `
      <div class="assists-list schabo">
        <div class="assists-header">
          <span class="ranks">Rank</span>
          <span class="player">Player</span>
          <span class="name">name</span>
          <span class="team">Team</span>
          <span class="assists">Goals</span>
        </div>
    `;

    scorers.slice(0, 10).forEach((item, index) => {
      const player = item.player;
      const team = item.statistics[0]?.team;

      html += `
              <div class="assist-row">
          <span class="rank">${index + 1}</span>

            <img src="${player.photo}" alt="${
        player.name
      }" class="player-photo" onerror="this.src='https://via.placeholder.com/40'">
            <span class="player-name">${player.name}</span>
          <p class="teams-name">${team?.name || 'N/A'}</p>
          <span class="goals-count"><strong>${
            item.statistics[0]?.goals || 0
          }</strong></span>
        </div>

      `;
    });

    html += `
      </div>
    `;

    container.innerHTML = html;
  } catch (error) {
    console.error('Error loading top scorers:', error);
    container.innerHTML = '<div class="error">Failed to load top scorers</div>';
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
