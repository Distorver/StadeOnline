const today = new Date().toISOString().split('T')[0];

const competitionOrder = {
  2: 1, // Champions league
  6: 2, // AFCON
  20: 3, // CAF
  39: 4, // Premier League
  140: 5, // La Liga
  135: 6, // Serie A
  78: 7, // Bundesliga
  61: 8, // Ligue 1
  233: 9, // Egyptian League
  307: 10, // Saudi Pro League
  10: 11, // Friendlies matches
  539: 12, // Egypt Super Cup
  860: 13, // Arab Cup
  529: 14, // Germany Super Cup
  547: 15, // Italy Super Cup
  556: 16, // Spain Super Cup
};

function getCompetitionRank(leagueId) {
  return competitionOrder[leagueId] || 999; // 999 for unknown leagues
}

fetch(`../api/fixtures.php?date=${today}`, { method: 'GET' })
  .then((res) => res.json())
  .then((data) => {
    let matches = data.response;
    const container = document.getElementById('matches-container');
    container.innerHTML = '';

    if (matches.length === 0) {
      container.innerHTML =
        '<div class="no-matches schabo">No Matches today</div>';
      return;
    }

    matches.sort((a, b) => {
      const rankA = getCompetitionRank(a.league.id);
      const rankB = getCompetitionRank(b.league.id);
      return rankA - rankB;
    });

    matches.forEach((match) => {
      const home = match.teams.home;
      const away = match.teams.away;
      const status = match.fixture.status.short;
      const leagueName = match.league.name;
      const leagueLogo = match.league.logo;

      let score = 'VS';
      let liveClass = '';

      if (['FT', 'AET', 'PEN'].includes(status)) {
        score = `${match.goals.home} - ${match.goals.away}`;
      } else if (status === 'LIVE') {
        score = `${match.goals.home} - ${match.goals.away}`;
        liveClass = 'live-match';
      }

      const time = new Date(match.fixture.date).toLocaleTimeString('en-GB', {
        timeZone: 'Africa/Cairo',
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
      });

      const row = document.createElement('div');
      row.className = 'match-row';

      row.innerHTML = `
        <div class="match-content">
          <div class="league-info">
            <img src="${leagueLogo}" alt="${leagueName}" class="league-logo">
            <span class="league-name schabo">${leagueName}</span>
          </div>
          <div class="match">
            <div class="team home schabo">
              <p>${home.name}</p>
              <img src="${home.logo}" alt="${home.name}">
            </div>

            <div class="match-time schabo ${liveClass}">
              <p>${time}</p>
              <p>${score}</p>
            </div>

            <div class="team away schabo">
              <img src="${away.logo}" alt="${away.name}">
              <p>${away.name}</p>
            </div>
          </div>
        </div>
      `;

      container.appendChild(row);
    });
  })
  .catch(() => {
    document.getElementById('matches-container').innerHTML =
      '<div class="no-matches">Error fetching data</div>';
  });
