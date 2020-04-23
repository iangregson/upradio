const { App } = require('./app.ts');

async function main() {
    const root = document.getElementById('root');
    window.app = new App(root);
}

main().catch(console.error);