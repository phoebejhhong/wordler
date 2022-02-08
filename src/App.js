import './App.css';
import { useState } from 'react';
import { getInitialState, appendTile, deleteTile, revealTiles } from './gameState';

function TileRow({ letters }) {
  return (
    <div className="tileRow">
    {letters.map(function (letter, i) {
      return (
        <div key={i} className={`tile ${letter.state}`}>
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
      <div className="board">
        {tiles.map(function (row, i) {
          return (
            <TileRow key={i} letters={row.letters} />
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
    const newState = revealTiles(gameState);
    setGameState(newState);
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
function App() {
  const [gameState, setGameState] = useState(getInitialState('delute'));

  return (
    <div id="game">
      <header>Wodler</header>
      <Board
        tiles={gameState.tiles}
      />
      <Keyboard gameState={gameState} setGameState={setGameState} />
    </div>
  );
}

export default App;
