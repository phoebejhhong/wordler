import './colors.css';
import { useState, useEffect, useCallback } from 'react';
import { initialState, startGame, appendTile, deleteTile, revealTiles, setInvalidTiles, unsetInvalidTiles } from './gameState';
import { ShareModal } from './Modal';
import { VALID_WORDS } from './validWords';

function TileRow({ letters, invalid }) {
  return (
    <div className="tileRow" style={{ gridTemplateColumns: `repeat(${letters.length}, 1fr)`}}>
    {letters.map(function (letter, i) {
      return (
        <div key={i} className={`tile ${letter.state} ${invalid ? 'invalid' : ''}`}>
          {letter.letter}
        </div>
      );
    })}
    </div>
  )
}

function Board({ tiles }) {
  return (
    <div className="board-container">
      <div className="board" style={{ width: tiles[0].letters.length > 4 ? '70%' : '60%' }}>
        {tiles.map(function (row, i) {
          return (
            <TileRow key={i} letters={row.letters} invalid={row.invalid} />
          );
        })}
      </div>
    </div>
  );
}
function LetterKey({ letter, gameState, setGameState }) {
  const onClick = () => {
    const newState = appendTile(gameState, letter);
    setGameState(newState);
  }
  const letterState = gameState.keys[letter] || 'tbd';
  return (<button className={`key ${letterState}`} onClick={onClick}>{letter}</button>);
}

function EnterKey({ gameState, setGameState }) {
  const onClick = () => {
    try {
      const newState = revealTiles(gameState);
      setGameState(newState);
      return;
    } catch(e) {
      if (e.message === 'invalid word') {
        let newState = setInvalidTiles(gameState);
        setGameState(newState);
        setTimeout(() => {
          newState = unsetInvalidTiles(newState);
          setGameState(newState);
        }, 500);
      }
    }
  }
  return (<button className="key special-key" onClick={onClick}>enter</button>);
}

function DeleteKey({ gameState, setGameState }) {
  const onClick = () => {
    const newState = deleteTile(gameState);
    setGameState(newState);
  }
  return (<button className="key special-key" onClick={onClick}>delete</button>);
}

function Keyboard({ gameState, setGameState }) {
  const renderLetterKey = (letter) => (
    <LetterKey key={letter} letter={letter} gameState={gameState} setGameState={setGameState}  />

  );
  return (
    <div className="keyboard">
      <div className="keyboard-row">
        {['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'].map(renderLetterKey)}
      </div>
      <div className="keyboard-row">
        {['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'].map(renderLetterKey)}
      </div>
      <div className="keyboard-row">
        <EnterKey gameState={gameState} setGameState={setGameState}  />
        {['z', 'x', 'c', 'v', 'b', 'n', 'm'].map(renderLetterKey)}
        <DeleteKey gameState={gameState} setGameState={setGameState}  />
      </div>
    </div>
  );
}

function Game({ gameState, setGameState }) {
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const handleKeyup = useCallback(e => {
    let newState;
    const key = e.key.toLowerCase();
    if (key === 'enter') {
      try {
        newState = revealTiles(gameState);
        setGameState(newState);
        return;
      } catch(e) {
        if (e.message === 'invalid word') {
          newState = setInvalidTiles(gameState);
          setGameState(newState);
          setTimeout(() => {
            newState = unsetInvalidTiles(newState);
            setGameState(newState);
          }, 500);
        }
      }
    }
    if (key === 'backspace' || key === 'delete') {
      newState = deleteTile(gameState);
      setGameState(newState);
      return;
    }
    if ([
      'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',
      'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l',
      'z', 'x', 'c', 'v', 'b', 'n', 'm',
    ].indexOf(key) > -1) {
      newState = appendTile(gameState, key);
      setGameState(newState);
    }
  }, [gameState, setGameState]);

  useEffect(() => {
    document.addEventListener('keyup', handleKeyup);
    return () => {
      document.removeEventListener('keyup', handleKeyup);
    }
  }, [handleKeyup]);

  useEffect(() => {
    if (gameState.state === 'win') {
      setShareModalOpen(true);
    }
  }, [gameState.state]);

  return (
    <>
      <Board
        tiles={gameState.tiles}
      />
      <Keyboard gameState={gameState} setGameState={setGameState} />
      <ShareModal isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} gameState={gameState} />
    </>
  );
}

function GameSetup({ gameState, setGameState }) {
  const [setupState, setSetupState] = useState({
    errorMessage: undefined,
    generatedUrl: undefined,
  });

  return (
    <main className="setup-container">
      <form
        className="setup-form"
        onSubmit={(e) => {
         e.preventDefault();
         const maker = e.target.elements.maker.value;
         const solution = e.target.elements.solution.value;
         if (VALID_WORDS.indexOf(solution) === -1) {
           setSetupState({
             errorMessage: 'Invalid word'
           });
         } else {
           setSetupState({
             generatedUrl: `${document.location.host}${document.location.pathname}#${btoa(JSON.stringify({ solution, maker }))}`,
           });
         }
      }}>
      <ul>
        <li>
          <label htmlFor="maker">Your Name:</label>
          <input type="text" id="maker" name="maker" />
        </li>
        <li>
          <label htmlFor="solution">4-to-6-letter-word of your choice:</label>
          <input type="text" id="solution" name="solution" />
        </li>
        <li>
          <button type="submit">Make your own game</button>
        </li>
       </ul>
      </form>
      <div className={`setupMessage ${setupState.errorMessage ? 'error' : ''}`}>
        {setupState.generatedUrl || setupState.errorMessage || '☕️ waiting for input'}
      </div>
    </main>
  );
}

const parseParams = () => {
  const hash = document.location.hash.substring(1);
  if (hash) {
    try {
      const params = JSON.parse(atob(hash));
      if (params.solution && VALID_WORDS.indexOf(params.solution) > -1) {
        return params;
      }
    } catch(e) {}
  }
}

function App() {
  const [gameState, setGameState] = useState(initialState);
  if (gameState.state === 'notstarted') {
    const setupFromParams = parseParams();
    if (setupFromParams) {
      const newState = startGame(gameState, setupFromParams);
      setGameState(newState);
    }
  }
  let header = "Wordler: Make Custom Wordles";
  if (gameState.state !== 'notstarted') {
    header = `Custom Wordle made by ${gameState.maker || 'anonymous'}`
  }
  return (
    <>
      <header>{header}</header>
      {gameState.state === 'notstarted'
       ? <GameSetup gameState={gameState} setGameState={setGameState} />
       : <Game gameState={gameState} setGameState={setGameState} />}
    </>
  );


}

export default App;
