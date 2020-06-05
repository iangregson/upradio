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
}

function getChannelName() {
  const firstPathParam = location.pathname.split('/')[1];
  return firstPathParam || null;
}

main().catch(console.error);