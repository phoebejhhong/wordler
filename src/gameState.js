import { VALID_WORDS } from './validWords';

// type State = 'tbd' | 'absent' | 'present' | 'correct';
export const getInitialState = (solution) => ({
  solution,
  keys: {},
  tiles: [
    {
      revealed : false,
      letters: [
        { letter: '', state: 'tbd'},
        { letter: '', state: 'tbd'},
        { letter: '', state: 'tbd'},
        { letter: '', state: 'tbd'},
        { letter: '', state: 'tbd'},
      ],
    },
    {
      revealed : false,
      letters: [
        { letter: '', state: 'tbd'},
        { letter: '', state: 'tbd'},
        { letter: '', state: 'tbd'},
        { letter: '', state: 'tbd'},
        { letter: '', state: 'tbd'},
      ],
    },
    {
      revealed : false,
      letters: [
        { letter: '', state: 'tbd'},
        { letter: '', state: 'tbd'},
        { letter: '', state: 'tbd'},
        { letter: '', state: 'tbd'},
        { letter: '', state: 'tbd'},
      ],
    },
    {
      revealed : false,
      letters: [
        { letter: '', state: 'tbd'},
        { letter: '', state: 'tbd'},
        { letter: '', state: 'tbd'},
        { letter: '', state: 'tbd'},
        { letter: '', state: 'tbd'},
      ],
    },
    {
      revealed : false,
      letters: [
        { letter: '', state: 'tbd'},
        { letter: '', state: 'tbd'},
        { letter: '', state: 'tbd'},
        { letter: '', state: 'tbd'},
        { letter: '', state: 'tbd'},
      ],
    },
    {
      revealed : false,
      letters: [
        { letter: '', state: 'tbd'},
        { letter: '', state: 'tbd'},
        { letter: '', state: 'tbd'},
        { letter: '', state: 'tbd'},
        { letter: '', state: 'tbd'},
      ],
    },
  ],
});

const copyState = (gameState) => {
  return {
    solution: gameState.solution,
    keys: { ...gameState.keys },
    tiles: gameState.tiles.map(tile => {
      return {
        revealed: tile.revealed,
        letters: tile.letters.map(letter =>{
          return { ...letter };
        }),
      };
    }),
  };
}

export const appendTile = (gameState, letter) => {
  const copy = copyState(gameState);
  const currentRow = copy.tiles.find(tile => tile.revealed === false);
  if (!currentRow) {
    return gameState;
  }
  const currentLetters = currentRow.letters;
  const appendIndex = currentLetters.findIndex(letter => letter.letter === '');
  if (appendIndex === -1) {
    return gameState;
  }
  currentLetters[appendIndex].letter = letter;
  return copy;
}

export const deleteTile = (gameState) => {
  const copy = copyState(gameState);
  const currentRow = copy.tiles.find(tile => tile.revealed === false);
  if (!currentRow) {
    return gameState;
  }
  const currentLetters = currentRow.letters;
  let deleteIndex = -1
  for (let i = 4; i > -1; i--) {
    if (currentLetters[i].letter !== '') {
      deleteIndex = i;
      break;
    }
  }
  if (deleteIndex === -1) {
    return gameState;
  }
  currentLetters[deleteIndex].letter = '';
  return copy;
}

export const revealTiles = (gameState) => {
  const copy = copyState(gameState);
  const currentRow = copy.tiles.find(tile => tile.revealed === false);
  if (!currentRow || !!currentRow.letters.find(letter => letter.letter === '')) {
    return gameState;
  }
  if (VALID_WORDS.indexOf(currentRow.letters.map(letter => letter.letter).join('')) === -1) {
    throw new Error('invalid word');
  }
  currentRow.revealed = true;
  currentRow.letters = currentRow.letters.map(({ letter }, i) => {
    const indexInSolution = copy.solution.indexOf(letter);
    let state;
    if (indexInSolution === -1) {
      state = 'absent';
    } else if (indexInSolution === i) {
      state = 'correct';
    } else {
      state = 'present';
    }
    copy.keys[letter] = state;
    return { letter, state };
  });
  return copy;
}

export const setInvalidTiles = (gameState) => {
  const copy = copyState(gameState);
  const currentRow = copy.tiles.find(tile => tile.revealed === false);
  currentRow.invalid = true;
  return copy;
}
export const unsetInvalidTiles = (gameState) => {
  const copy = copyState(gameState);
  const currentRow = copy.tiles.find(tile => tile.revealed === false);
  delete currentRow.invalid;
  return copy;
}
