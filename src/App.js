import './App.css';
import { useState } from 'react';

function TileRow({ tiles }) {
  return (
    <div className="tileRow">
    {tiles.map(function (tile, i) {
      return (
        <div key={i} className={`tile ${tile.state}`}>
          {tile.letter}
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
        {tiles.map(function (rowTiles, i) {
          return (
            <TileRow key={i} tiles={rowTiles} />
          );
        })}
      </div>
    </div>
  );
}
function Key({ letter }) {
  const isSpecialKey = (['enter', 'delete'].indexOf(letter) > -1);
  const className = isSpecialKey ? 'key special-key' : 'key';
  return (<button className={className}>{letter}</button>);
}
function Keyboard() {
  return (
    <div className="keyboard">
      <div className="keyboard-row">
        {['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'].map((letter, i) => (
          <Key key={i} letter={letter} />
        ))}
      </div>
      <div className="keyboard-row">
        {['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'].map((letter, i) => (
          <Key key={i} letter={letter} />
        ))}
      </div>
      <div className="keyboard-row">
        {['enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'delete'].map((letter, i) => (
          <Key key={i} letter={letter} />
        ))}
      </div>
    </div>
  );
}

// type TileData = { letter: string, state: 'tbd' | 'absent' | 'present' | 'correct' };
function App() {
  const [tiles, setTiles] = useState([
    [
      { letter: 'A', state: 'present'},
      { letter: 'D', state: 'present'},
      { letter: 'I', state: 'absent'},
      { letter: 'E', state: 'absent'},
      { letter: 'U', state: 'absent'},
    ],
    [
      { letter: 'S', state: 'correct'},
      { letter: 'H', state: 'correct'},
      { letter: 'A', state: 'correct'},
      { letter: 'D', state: 'present'},
      { letter: 'E', state: 'absent'},
    ],
    [
      { letter: 'S', state: 'tbd'},
      { letter: 'H', state: 'tbd'},
      { letter: 'A', state: 'tbd'},
      { letter: '', state: ''},
      { letter: '', state: ''},
    ],
    [
      { letter: '', state: 'tbd'},
      { letter: '', state: 'tbd'},
      { letter: '', state: 'tbd'},
      { letter: '', state: 'tbd'},
      { letter: '', state: 'tbd'},
    ],
    [
      { letter: '', state: 'tbd'},
      { letter: '', state: 'tbd'},
      { letter: '', state: 'tbd'},
      { letter: '', state: 'tbd'},
      { letter: '', state: 'tbd'},
    ],
    [
      { letter: '', state: 'tbd'},
      { letter: '', state: 'tbd'},
      { letter: '', state: 'tbd'},
      { letter: '', state: 'tbd'},
      { letter: '', state: 'tbd'},
    ],
  ]);
  // const solution = '';

  return (
    <div id="game">
      <header>Wodler</header>
      <Board
        tiles={tiles}
      />
      <Keyboard />
    </div>
  );
}

export default App;
