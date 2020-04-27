const { App, UpRadioAppState } = require('./app.ts');

async function main() {
    const root = document.getElementById('root');
    const StateManager = new UpRadioAppState();
    const app = new App(root, StateManager.toJSON());
    StateManager.init(app);
}

main().catch(console.error);