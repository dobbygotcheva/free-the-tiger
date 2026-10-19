import { Game } from './Game';

const host = document.getElementById('app');
if (!host) {
  throw new Error('Missing #app element');
}

new Game(host).start().catch((error: unknown) => {
  console.error('Failed to start the game', error);
});
