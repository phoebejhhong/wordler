import { VALID_WORDS } from './validWords';

// type LetterState = 'tbd' | 'absent' | 'present' | 'correct';
// type GameState = 'notstarted' | 'progress' | 'lost' | 'win';

const generateEmptyTiles = (wordLength) => {
  return Array(6).fill({
    revealed : false,
    letters: Array(wordLength).fill({
        letter: '', state: 'tbd',
    }),
  });
}
export const initialState = {
  solution: undefined,
  maker: undefined,
  state: 'notstarted',
  keys: {},
  tiles: generateEmptyTiles(5),
};

const copyState = (gameState) => {
  return {
    solution: gameState.solution,
    maker: gameState.maker,
    state: gameState.state,
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

export const startGame = (gameState, { solution, maker }) => {
  return {
    ...copyState(gameState),
    solution,
    maker,
    state: 'progress',
    tiles: generateEmptyTiles(solution.length),
  }
}

export const appendTile = (gameState, letter) => {
  if (gameState.state !== 'progress') {
    return gameState;
  }
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
  if (gameState.state !== 'progress') {
    return gameState;
  }
  const copy = copyState(gameState);
  const currentRow = copy.tiles.find(tile => tile.revealed === false);
  if (!currentRow) {
    return gameState;
  }
  const currentLetters = currentRow.letters;
  let deleteIndex = -1
  for (let i = copy.solution.length - 1; i > -1; i--) {
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

const evaluate = (guessArray, solutionArray) => {
  const solutionLetterTaken = solutionArray.map(() => false);
  const guessEvaluations = solutionArray.map(() => 'tbd');

  // handle correct guesses first
  guessArray.forEach((guessLetter, i) => {
    if (guessLetter === solutionArray[i]) {
      guessEvaluations[i] = 'correct';
      solutionLetterTaken[i] = true;
    }
  });
  guessArray.forEach((guessLetter, i) => {
    if (guessEvaluations[i] === 'correct') {
      return;
    }
    if (!solutionArray.includes(guessLetter)) {
      guessEvaluations[i] = 'absent';
      return;
    }

    const indexOfPresentLetter = solutionArray.findIndex((solutionLetter, i) => {
      return solutionLetter === guessLetter && !solutionLetterTaken[i];
    });

    if (indexOfPresentLetter > -1) {
      guessEvaluations[i] = 'present';
      solutionLetterTaken[indexOfPresentLetter] = true;
      return;
    }
    guessEvaluations[i] = 'absent'
  });

  return guessEvaluations;
}

export const revealTiles = (gameState) => {
  if (gameState.state !== 'progress') {
    return gameState;
  }
  const copy = copyState(gameState);
  const currentRow = copy.tiles.find(tile => tile.revealed === false);
  if (!currentRow || !!currentRow.letters.find(letter => letter.letter === '')) {
    return gameState;
  }
  const guessArray = currentRow.letters.map(letter => letter.letter);
  if (VALID_WORDS.indexOf(guessArray.join('')) === -1) {
    throw new Error('invalid word');
  }
  const guessEvaluations = evaluate(guessArray, copy.solution.split(''));
  currentRow.revealed = true;
  currentRow.letters = currentRow.letters.map((letter, i) => {
    const state = guessEvaluations[i];
    if (state === 'absent' || state === 'present') {
        copy.keys[letter.letter] = state;
    } else if (copy.keys[letter.letter] !== 'correct') {
      // set 'present' only if it isn't 'correct' already
      copy.keys[letter.letter] = state;
    }

    return { ...letter, state };
  });
  if (!guessEvaluations.find(evaluation => evaluation !== 'correct')) {
    copy.state = 'win';
  } else if (!copy.tiles.find(tile => tile.revealed === false)) {
    copy.state = 'lost';
  }
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
