const { App } = require('./app.ts');
const { UpRadioAppState } = require('./UpRadioState.ts');

async function main() {
  const root = document.getElementById('root');
  const channelName = getChannelName();
  
  const StateManager = new UpRadioAppState();
  if (channelName) {
    StateManager.mode = 'LISTEN';
    StateManager.targetChannelName = channelName;
  } else {
    StateManager.mode = 'BROADCAST';
  }
  const app = new App(root, StateManager.toJSON());
  StateManager.init(app);
  initNav();
  initHelp();
}

function getChannelName() {
  const firstPathParam = location.pathname.split('/')[1];
  return firstPathParam || null;
}

function initNav() {
  const nav = document.querySelector('nav');
  const menuBtn = document.querySelector('button#headerMenuBtn');
  menuBtn.onclick = () => {
    nav.classList.toggle('hidden');
  }
}

function initHelp() {
  const helpText = document.querySelector('div#helpText');
  const helpBtn = document.querySelector('button#helpBtn');
  helpBtn.onclick = () => {
    helpText.classList.toggle('hidden');
  }
}

main().catch(console.error);