const apiKey = "91aa27c5dc3ceb06b69e1090ce3590ba";
const today = new Date().toISOString().split('T')[0];

fetch(`https://v3.football.api-sports.io/fixtures?date=${today}`, {
    method: "GET",
    headers: { "x-apisports-key": apiKey }
})
.then(res => res.json())
.then(data => {
    const matches = data.response;
    const container = document.getElementById("matches-container");
    container.innerHTML = "";

    if(matches.length === 0){
        container.innerHTML = `<div class="no-matches">لا توجد مباريات اليوم</div>`;
        return;
    }

    matches.forEach(match => {
        const leagueName = match.league.name;
        const leagueClass = ['Premier-League','La-Liga','Serie-A','Bundesliga','Ligue-1'].includes(match.league.name.replace(/\s+/g,'-')) 
                            ? match.league.name.replace(/\s+/g,'-') : 'default-league';

        const homeTeam = match.teams.home.name;
        const awayTeam = match.teams.away.name;
        const homeLogo = match.teams.home.logo;
        const awayLogo = match.teams.away.logo;
        const fixtureStatus = match.fixture.status.short;
        const homeScore = match.goals.home;
        const awayScore = match.goals.away;
        const time = new Date(match.fixture.date).toLocaleTimeString('en-GB', { timeZone: 'Africa/Cairo', hour12: false });
                let vsOrScore = "VS";
        let liveClass = '';
        if(fixtureStatus === "FT" || fixtureStatus === "AET" || fixtureStatus === "PEN"){
            vsOrScore = `${homeScore} - ${awayScore}`;
        } else if(fixtureStatus === "LIVE"){
            vsOrScore = `${homeScore} - ${awayScore}`;
            liveClass = 'live-match';
        }

        const row = document.createElement('div');
        row.classList.add('match-row');

        row.innerHTML = `
            <div class="league-label ${leagueClass}">${leagueName}</div>
            <div class="match-content">
                <div class="team home"><span>${homeTeam}</span><img src="${homeLogo}" alt="${homeTeam}"></div>
                <div class="match-time ${liveClass}">${vsOrScore} / ${time}</div>
                <div class="team away"><img src="${awayLogo}" alt="${awayTeam}"><span>${awayTeam}</span></div>
            </div>
        `;

        container.appendChild(row);
    });
})
.catch(err => {
    console.error(err);
    document.getElementById("matches-container").innerHTML = `<div class="no-matches">حدث خطأ في جلب البيانات</div>`;
});
