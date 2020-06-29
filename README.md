# upradio

![UpRadio Icon](ui/images/icons/icon-144x144.png)

[uprad.io](https://uprad.io)

UpRadio is a web application that allows you to broadcast or listen to live audio streams across the internet. The audio is streamed peer-to-peer using WebRTC (with big thanks to [PeerJS](https://peerjs.com/)).

The vision for the future of this project is much larger... but I'm still working on distilling that down to something I can write in a couple of paragraphs.

### Resources

* [FAQ / Help](https://docs.google.com/document/d/1O_khZIHnonInaRL7oNV4jsLyZkSCR9aySwuQDOdMyns)
* [Open Source Software](https://docs.google.com/document/d/1jesuw5drKeFhh6MQBQDzGBP2s5cWRhAt8emQq77Byuc)
* [Feedback form](https://forms.gle/cYhSipMHRhbq4BUJA)

### Want to contribute?

It's very early days here, but contributions are welcome. I could use the help!

Check the [contributing guidelines](CONTRIBUTING.md) and say hello in the [matrix chat](https://matrix.to/#/!tabwwSGkCTKBdIJgVw:matrix.org?via=matrix.org).

### Want to run your own?

You'll need a [Cloudflare Workers](https://workers.cloudflare.com/) account, the [wrangler cli](https://developers.cloudflare.com/workers/tooling/wrangler) and somewhere that's running the [PeerJS Server](https://github.com/peers/peerjs-server) (I'm using Heroku which was really easy).

Next, you need to create a `.env` file in the /ui directory. It should contain 4 key value pairs:

```
PEER_PATH=/peer-server
PEER_SERVER=some-peerjs-server.somewhere.com
PEER_KEY=a-secret-key-that-the-peer-server-uses
MAX_CONNECTIONS=5
```

* `PEER_PATH` is configuration variable on the PeerJS Server that instructs it to serve on the given base path
* `PEER_SERVER` is the DNS or IP of your PeerJS signalling server
* `PEER_KEY` is the secret key used to connect to the PeerJS signalling server
* `MAX_CONNECTIONS` is the number of connections any node in the network should accept

Next you need to copy `wrangler.template.toml` to `wrangler.toml` and add your Cloudflare Workers account details.

Lastly, you can use the Makefile to build and deploy

```
make install
make build
make deploy
```

With any luck, that'll work.

# Big :heart:

* [Scots Whay Hae!](https://scotswhayhae.com/) for actually using the thing
* [PeerJS](https://peerjs.com/)
* [Crypto-js](https://www.npmjs.com/package/crypto-js)
* [Zondicons](http://www.zondicons.com/)
* [Hero Patterns](https://www.heropatterns.com/)
* [identicon.js](https://github.com/stewartlord/identicon.js)