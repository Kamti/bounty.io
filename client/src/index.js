import { createStore, combineReducers } from 'redux';
import './index.css';
import { throttle } from 'lodash';

const USERNAME = 'Kamti';
const map = document.querySelector('.map');

const movePlayer = (player, movement) => {
    /*const svg = map.querySelector(.map__player--username-${player.username});
    if (movement.x) {
      svg.style.left = parseInt(svg.style.left) + movement.x + 'px';
    }
    if (movement.y) {
      svg.style.top = parseInt(svg.style.top) + movement.y + 'px';
    }*/
    store.dispatch({
      type: 'PLAYERS_MOVE_PLAYER',
      player,
      movement
    });
  };

window.addEventListener(
    'keydown',
    throttle(event => {
        const key = event.keyCode || event.which;

        switch (key) {
            case 37:
                return movePlayer({ username: USERNAME }, { x: -50, y: 0 });
            case 38:
                return movePlayer({ username: USERNAME }, { x: 0, y: -50 });
            case 39:
                return movePlayer({ username: USERNAME }, { x: 50, y: 0 });
            case 40:
                return movePlayer({ username: USERNAME }, { x: 0, y: 50 });
        }
    }, 50)
);

const initialState = [];

const playersReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'PLAYERS_ADD_PLAYER': {
      const newState = state.slice();
      newState.push(action.player);
      return newState;
    }
    case 'PLAYERS_REMOVE_PLAYER':
      return state.filter(player => player.username !== action.player.username);
    default:
      return state;
      case 'PLAYERS_MOVE_PLAYER':
      const index = state.findIndex(
        player => player.username === action.player.username
      );
      const player = state[index];

      const newState = [...state];
      newState[index] = {
        ...player,
        position: {
          x: player.position.x + action.movement.x,
          y: player.position.y + action.movement.y
        }
      };
      return newState;
  }
};

const store = createStore(
    combineReducers({ players: playersReducer }),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
let previousPlayers = initialState;
store.subscribe(() => {
  const players = store.getState().players;

  let newPlayers = [],
    existingPlayers = [],
    removedPlayers = [];
  for (let player of players) {
    const previousPlayer = previousPlayers.find(
      previousPlayer => previousPlayer.username === player.username
    );
    if (!previousPlayer) {
      newPlayers.push(player);
    } else {
      existingPlayers.push(player);
    }
  }
  for (let previousPlayer of previousPlayers) {
    if (!players.some(player => player.username === previousPlayer.username)) {
      removedPlayers.push(previousPlayer);
    }
  }

  for (let player of newPlayers) {
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.classList.add('map__player');
    svg.classList.add(`map__player--username-${player.username}`);
    svg.style.left = player.position.x - player.score / 2 + 'px';
    svg.style.top = player.position.y - player.score / 2 + 'px';

    svg.setAttribute('viewBox', '0 0 2 2');
    svg.setAttribute('width', player.score);
    svg.setAttribute('height', player.score);

    const circle = document.createElementNS(svgNS, 'circle');
    circle.setAttribute('cx', 1);
    circle.setAttribute('cy', 1);
    circle.setAttribute('r', 1);
    circle.setAttribute('fill', 'red');

    svg.appendChild(circle);
    map.appendChild(svg);
  }

  for (let player of existingPlayers) {
    const svg = map.querySelector(`.map__player--username-${player.username}`);
    const previousPlayer = previousPlayers.find(
      previousPlayer => previousPlayer.username === player.username
    );

    if (previousPlayer.score !== player.score) {
      svg.setAttribute('width', player.score);
      svg.setAttribute('height', player.score);
    }

    if (previousPlayer.position.x !== player.position.x) {
      svg.style.left = player.position.x - player.score / 2 + 'px';
    }

    if (previousPlayer.position.y !== player.position.y) {
      svg.style.top = player.position.y - player.score / 2 + 'px';
    }
  }

  for (let player of removedPlayers) {
    const svg = map.querySelector(`.map__player--username-${player.username}`);
    map.removeChild(svg);
  }

  previousPlayers = players;
});


const addPlayer = player => {
  /*const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.classList.add('map__player');
  svg.classList.add(map__player--username-${player.username});
  svg.style.left = player.position.x - player.score / 2 + 'px';
  svg.style.top = player.position.y - player.score / 2 + 'px';

  svg.setAttribute('viewBox', '0 0 2 2');
  svg.setAttribute('width', player.score);
  svg.setAttribute('height', player.score);

  const circle = document.createElementNS(svgNS, 'circle');
  circle.setAttribute('cx', 1);
  circle.setAttribute('cy', 1);
  circle.setAttribute('r', 1);
  circle.setAttribute('fill', 'red');

  svg.appendChild(circle);
  map.appendChild(svg);*/
  store.dispatch({
    type: 'PLAYERS_ADD_PLAYER',
    player
  });
};

const removePlayer = player => {
    /*const svg = map.querySelector(.map__player--username-${player.username});
    map.removeChild(svg);*/
    store.dispatch({
      type: 'PLAYERS_REMOVE_PLAYER',
      player
    });
  };

addPlayer({ username: 'Kamti', position: { x: 0, y: 0 }, score: 100 });
addPlayer({ username: 'Seba', position: { x: 100, y: 100 }, score: 70 });