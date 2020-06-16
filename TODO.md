TODO
----

- [X] Reinstate state manager support; load peer ID / state from session storage
- [X] Get it working on iangregson.workers.dev
- [X] Add a waveform visulizer
- [X] Add a frequency bar visualizer
- [X] Add a noise stream for connecting in relay mode (so we don't have to send voice just to listen)
- [X] Connect to own PeerJS server
- [X] Add a level meter
- [X] Make it work on mobile (ios safari)
- [X] Implement max connections and handoff
- [X] Remember input device in session store
- [X] Put station name / description / image into session storage
- [X] Add station name verification via CloudFlare KV 
- [X] Add station name / description / image component
- [X] Add a status component + event bus
- [X] Add resolve station names via CloudFlare KV
- [X] Add resolve station names via CloudFlare KV from URL path
- [X] Machine generated avatar
- [X] Add status icon to status component
- [X] Top right menu icon
- [X] Top right menu: connect to different channel / start broadcast
- [X] Sanitize inputs
- [X] Channel info component + store in localhost
- [X] Tailwind CSS styling, colors, fonts, etc
- [X] Copy URL component
- [X] Service worker (workbox / precache)
- [X] Rework directory structure
- [X] Build without parceljs
- [X] Remove tailwind unused css
- [ ] Webpack dev server
- [ ] Send channel info / status over RPC
- [ ] Lighthouse tests
  - [ ] Ensure aria-labels
  - [ ] Ensure unique ids
  - [ ] Ensure good button names
  - [ ] Ensure fast performance
  - [ ] Don't log to the console when in prod
  - [X] Esnure correct PWA resources in place including service worker
- [ ] FAQ, Help, About, OSS, Privacy notice, Contact Form, etc
- [ ] Add listener count widget
- [ ] Make ready for open source: github org, license and contributor files, remove keys, etc

### Phase 2

- [ ] Play file component with level control
- [ ] Audio output chooser
- [ ] Lobby