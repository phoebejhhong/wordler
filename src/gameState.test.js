import { initialState, appendTile, deleteTile, revealTiles } from './gameState';

describe('gameState', () => {
  describe('appendTile', () => {
    it('appends tile', () => {
      const state = {
        ...initialState,
        tiles: [
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
        ],
      };
      const stateAfter = {
        ...initialState,
        tiles: [
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
        ]
      };

      expect(appendTile(state, 'b')).toEqual(stateAfter);
    });
    it('does not append if full', () => {
      const state = {
        ...initialState,
        tiles: [
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
       ],
      };

      expect(appendTile(state)).toEqual(state);
    });
  });
  describe('deleteTile', () => {
    it('deletes last letter', () => {
      const state = {
        ...initialState,
        tiles: [
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
       ]
      };

      const stateAfter = {
        ...initialState,
        tiles: [
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
       ]
      };

      expect(deleteTile(state)).toEqual(stateAfter);
    });
  });
  describe('revealTiles', () => {
    it('reveal and evalutates tiles', () => {
      const state = {
        solution: 'frame',
        keys: {},
        tiles: [
          { revealed: false, letters: [
            { letter: 'm', state: 'tbd'},
            { letter: 'a', state: 'tbd'},
            { letter: 'g', state: 'tbd'},
            { letter: 'i', state: 'tbd'},
            { letter: 'c', state: 'tbd'},
          ]},
        ],
      };

      const stateAfter = {
        solution: 'frame',
        keys: {
          m: 'present',
          a: 'present',
          g: 'absent',
          i: 'absent',
          c: 'absent',
        },
        tiles: [
          { revealed: true, letters: [
            { letter: 'm', state: 'present'},
            { letter: 'a', state: 'present'},
            { letter: 'g', state: 'absent'},
            { letter: 'i', state: 'absent'},
            { letter: 'c', state: 'absent'},
          ]},
        ],
      };

      expect(revealTiles(state)).toEqual(stateAfter);
    })
  });
  it('edge case with duplicate guess', () => {
    const state = {
      solution: 'frame',
      keys: {},
      tiles: [
        { revealed: false, letters: [
          { letter: 'm', state: 'tbd'},
          { letter: 'a', state: 'tbd'},
          { letter: 'i', state: 'tbd'},
          { letter: 'm', state: 'tbd'},
          { letter: 's', state: 'tbd'},
        ]},
      ],
    };

    const stateAfter = {
      solution: 'frame',
      keys: {
        m: 'absent',
        a: 'present',
        i: 'absent',
        m: 'correct',
        s: 'absent',
      },
      tiles: [
        { revealed: true, letters: [
          { letter: 'm', state: 'absent'}, // absent because correct m exists
          { letter: 'a', state: 'present'},
          { letter: 'i', state: 'absent'},
          { letter: 'm', state: 'correct'},
          { letter: 's', state: 'absent'},
        ]},
      ],
    };

    expect(revealTiles(state)).toEqual(stateAfter);
  });
});
