import './Modal.css';
import { generateSharableTiles } from './gameState';

export const Modal = ({ isOpen, onClose, children }) => {
  return (
    <div className={`modal ${isOpen ? 'open' : ''}`} onClose={onClose}>
      <div className="overlay" />
      <div className="body">
        <button className="closeButton" onClick={() => onClose()}>Close</button>
        {children}
      </div>
    </div>
  );
}

export const ShareModal = ({ isOpen, onClose, gameState }) => {
  const sharableTiles = generateSharableTiles(gameState.tiles);
  const attemptCount = gameState.tiles.filter(tile => tile.revealed).length;
  const shareContent =
  `Wordler ${attemptCount}/6\n${sharableTiles}\n\nPlay at ${document.location.href}`;
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>You won!</h2>
      {navigator.share
        ? (<button className="shareButton" onClick={() => {
           navigator.share({
            text: shareContent,
           });
        }}>Share 🤗</button>)
      : (
        <button className="shareButton" onClick={() => {
          navigator.clipboard && navigator.clipboard.writeText(shareContent);
        }}>Copy result 🤗</button>
      )}
    </Modal>
  )
}
