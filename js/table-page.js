const apiKey = 'd93098b09ac4e7158126a6922d7bea18';

document.addEventListener('DOMContentLoaded', init);

function init() {
  populateLeagueSelector();
  setupLeagueSelectListener();
}

function populateLeagueSelector() {
  const select = document.getElementById('league-select');
  if (!select) return;

  leagues.forEach((league) => {
    const option = document.createElement('option');
    option.value = league.id;
    option.textContent = league.name;
    option.dataset.name = league.name;
    select.appendChild(option);
  });
}

function setupLeagueSelectListener() {
  const select = document.getElementById('league-select');
  if (!select) return;

  select.addEventListener('change', (e) => {
    const leagueId = e.target.value;
    if (leagueId) {
      loadLeagueTablePage(leagueId);
    } else {
      const container = document.getElementById('table-content');
      if (container) {
        container.innerHTML =
          '<div class="no-data">Please select a league to view standings</div>';
      }
    }
  });
}

async function loadLeagueTablePage(leagueId) {
  const container = document.getElementById('table-content');
  if (!container) return;

  container.innerHTML = '<div class="loading">Loading standings...</div>';

  try {
    const resp = await fetch(
      `https://v3.football.api-sports.io/standings?league=${leagueId}&season=2023`,
      { headers: { 'x-apisports-key': apiKey } }
    );

    if (!resp.ok) {
      const txt = await resp.text();
      console.error('Standings API error', resp.status, txt);
      container.innerHTML = `<div class="error">Error loading standings: ${resp.status}</div>`;
      return;
    }

    const data = await resp.json();
    const standings = data.response?.[0]?.league?.standings?.[0] || [];

    if (!standings.length) {
      container.innerHTML =
        '<div class="no-data">No standings data available</div>';
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
