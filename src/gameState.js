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
    ...gameState,
    tiles: gameState.tiles.map(tile => {
      return {
        ...tile,
        letters: [ ...tile.letters],
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
