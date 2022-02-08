import { appendTile, deleteTile, revealTiles } from './gameState';

describe('gameState', () => {
  describe('appendTile', () => {
    it('appends tile', () => {
      const tiles = [
        { revealed: true, letters: [
          { letter: 'a', state: 'absent'},
          { letter: 'b', state: 'present'},
          { letter: 'c', state: 'absent'},
          { letter: 'd', state: 'present'},
          { letter: 'e', state: 'absent'},
        ]},
        { revealed: false, letters: [
          { letter: 'a', state: 'tbd'},
          { letter: '', state: 'tbd'},
          { letter: '', state: 'tbd'},
          { letter: '', state: 'tbd'},
          { letter: '', state: 'tbd'},
        ]},
        { revealed: false, letters: [
          { letter: '', state: 'tbd'},
          { letter: '', state: 'tbd'},
          { letter: '', state: 'tbd'},
          { letter: '', state: 'tbd'},
          { letter: '', state: 'tbd'},
        ]},
      ];

      const tileAfter = [
        { revealed: true, letters: [
          { letter: 'a', state: 'absent'},
          { letter: 'b', state: 'present'},
          { letter: 'c', state: 'absent'},
          { letter: 'd', state: 'present'},
          { letter: 'e', state: 'absent'},
        ]},
        { revealed: false, letters: [
          { letter: 'a', state: 'tbd'},
          { letter: 'b', state: 'tbd'}, // added here
          { letter: '', state: 'tbd'},
          { letter: '', state: 'tbd'},
          { letter: '', state: 'tbd'},
        ]},
        { revealed: false, letters: [
          { letter: '', state: 'tbd'},
          { letter: '', state: 'tbd'},
          { letter: '', state: 'tbd'},
          { letter: '', state: 'tbd'},
          { letter: '', state: 'tbd'},
        ]},
      ];
      expect(appendTile({ tiles }, 'b')).toEqual({ tiles: tileAfter });
    });
    it('does not append if full', () => {
      const tiles = [
        { revealed: false, letters: [
          { letter: 'a', state: 'absent'},
          { letter: 'b', state: 'present'},
          { letter: 'c', state: 'absent'},
          { letter: 'd', state: 'present'},
          { letter: 'e', state: 'absent'},
        ]},
        { revealed: false, letters: [
          { letter: 'a', state: 'tbd'},
          { letter: 'b', state: 'tbd'},
          { letter: 'c', state: 'tbd'},
          { letter: 'd', state: 'tbd'},
          { letter: 'e', state: 'tbd'},
        ]},
      ];

      expect(appendTile({ tiles }, 'b')).toEqual({ tiles });
    });
  });
  describe('deleteTile', () => {
    it('deletes last letter', () => {
      const tiles = [
        { revealed: true, letters: [
          { letter: 'a', state: 'absent'},
          { letter: 'b', state: 'present'},
          { letter: 'c', state: 'absent'},
          { letter: 'd', state: 'present'},
          { letter: 'e', state: 'absent'},
        ]},
        { revealed: false, letters: [
          { letter: 'a', state: 'tbd'},
          { letter: 'b', state: 'tbd'},
          { letter: 'c', state: 'tbd'},
          { letter: 'd', state: 'tbd'},
          { letter: '', state: 'tbd'},
        ]},
      ];

      const tilesAfter = [
        { revealed: true, letters: [
          { letter: 'a', state: 'absent'},
          { letter: 'b', state: 'present'},
          { letter: 'c', state: 'absent'},
          { letter: 'd', state: 'present'},
          { letter: 'e', state: 'absent'},
        ]},
        { revealed: false, letters: [
          { letter: 'a', state: 'tbd'},
          { letter: 'b', state: 'tbd'},
          { letter: 'c', state: 'tbd'},
          { letter: '', state: 'tbd'}, // deleted here
          { letter: '', state: 'tbd'},
        ]},
      ];

      expect(deleteTile({ tiles })).toEqual({ tiles: tilesAfter });
    });
  });
  describe('revealTiles', () => {
    it('reveal and evalutates tiles', () => {
      const state = {
        solution: 'ebfag',
        keys: {},
        tiles: [
          { revealed: false, letters: [
            { letter: 'a', state: 'tbd'},
            { letter: 'b', state: 'tbd'},
            { letter: 'c', state: 'tbd'},
            { letter: 'd', state: 'tbd'},
            { letter: 'e', state: 'tbd'},
          ]},
        ],
      };

      const stateAfter = {
        solution: 'ebfag',
        keys: {
          a: 'present',
          b: 'correct',
          c: 'absent',
          d: 'absent',
          e: 'present',
        },
        tiles: [
          { revealed: true, letters: [
            { letter: 'a', state: 'present'},
            { letter: 'b', state: 'correct'},
            { letter: 'c', state: 'absent'},
            { letter: 'd', state: 'absent'},
            { letter: 'e', state: 'present'},
          ]},
        ],
      };

      expect(revealTiles(state)).toEqual(stateAfter);
    })
  });
});
