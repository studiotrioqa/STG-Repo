
const addLetters = 'abcdefghijklmnopqrstuvwxyz'.split('');
export const addRandomLetters = Array.from({ length: 3 }, () =>
  addLetters[Math.floor(Math.random() * addLetters.length)]
).join('');