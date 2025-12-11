const leagues = [
  {
    id: 39,
    name: 'Premier League',
    logo: 'https://media.api-sports.io/football/leagues/39.png',
  },
  {
    id: 140,
    name: 'La Liga',
    logo: 'https://media.api-sports.io/football/leagues/140.png',
  },
  {
    id: 135,
    name: 'Serie A',
    logo: 'https://media.api-sports.io/football/leagues/135.png',
  },
  {
    id: 233,
    name: 'Egyptian League',
    logo: 'https://media.api-sports.io/football/leagues/233.png',
  },
  {
    id: 307,
    name: 'Saudi Pro League',
    logo: 'https://media.api-sports.io/football/leagues/307.png',
  },
  {
    id: 61,
    name: 'Ligue 1',
    logo: 'https://media.api-sports.io/football/leagues/61.png',
  },
  {
    id: 78,
    name: 'Bundesliga',
    logo: 'https://media.api-sports.io/football/leagues/78.png',
  },
];

const leftBtn = document.querySelector('.left');
const rightBtn = document.querySelector('.right');
const slides = document.querySelectorAll('.slide');
const maxSlide = slides.length;
let currSlide = 0;

const active = function (slide) {
  document
    .querySelectorAll('.card')
    .forEach((dot) => dot.classList.remove('active'));

  document.querySelector(`.card${slide}`).classList.add('active');
};

rightBtn.addEventListener('click', function () {
  if (currSlide === maxSlide) {
    currSlide = -1;
  } else {
    currSlide++;
  }
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${25 * (i - currSlide)}rem)`)
  );
});

leftBtn.addEventListener('click', function () {
  if (currSlide === -1) {
    currSlide = maxSlide;
  } else {
    currSlide--;
  }
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${25 * (i - currSlide)}rem)`)
  );
});
