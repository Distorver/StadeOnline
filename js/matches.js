const apiKey = '5890e514e018ea165baff8a5ca7f9bb9';
const today = new Date().toISOString().split('T')[0];

// Define competition popularity order (most watched first)
const competitionOrder = {
  39: 1, // Premier League
  140: 2, // La Liga
  135: 3, // Serie A
  78: 4, // Bundesliga
  61: 5, // Ligue 1
  233: 6, // Egyptian League
  307: 7, // Saudi Pro League
};

function getCompetitionRank(leagueId) {
  return competitionOrder[leagueId] || 999; // 999 for unknown leagues
}

fetch(`https://v3.football.api-sports.io/fixtures?date=${today}`, {
  method: 'GET',
  headers: { 'x-apisports-key': apiKey },
})
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

    // Sort matches by competition popularity
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
