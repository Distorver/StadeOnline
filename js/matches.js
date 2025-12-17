const apiKey = 'd93098b09ac4e7158126a6922d7bea18';
const today = new Date().toISOString().split('T')[0];

fetch(`https://v3.football.api-sports.io/fixtures?date=${today}`, {
  method: 'GET',
  headers: { 'x-apisports-key': apiKey },
})
  .then((res) => res.json())
  .then((data) => {
    const matches = data.response;
    const container = document.getElementById('matches-container');
    container.innerHTML = '';

    if (matches.length === 0) {
      container.innerHTML =
        '<div class="no-matches schabo">No Matches today</div>';
      return;
    }

    matches.forEach((match) => {
      const home = match.teams.home;
      const away = match.teams.away;
      const status = match.fixture.status.short;

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
      });

      const row = document.createElement('div');
      row.className = 'match-row';

      row.innerHTML = `
        <div class="match-content">
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
      `;

      container.appendChild(row);
    });
  })
  .catch(() => {
    document.getElementById('matches-container').innerHTML =
      '<div class="no-matches">Error fetching data</div>';
  });
