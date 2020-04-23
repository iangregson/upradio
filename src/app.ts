import template from './app.html';
import { UpRadioPeer, IUpRadioPeer } from './UpRadioPeer';
import ConnectComponent from './components/Connect/Connect.component';
import { BroadcastComponent } from './components/Broadcast';

export class App {
  public root: HTMLElement;
  public content: HTMLElement;
  public peer: IUpRadioPeer;

  constructor(root: HTMLElement) {
    this.root = root;
    this.root.innerHTML = template;
    this.peer = new UpRadioPeer();
    this.peer.init();

    console.log(this);
    
    this.root.querySelector('#PeerId').innerHTML = 'id: ' + this.peer.id;

    this.content = document.createElement('div');
    this.content.id = 'PeerContent';
    this.root.appendChild(this.content)

    const connect = new ConnectComponent(this.content);
    connect.button.onclick = () => {
      console.log('Connecting to ' + connect.input.value);
      this.peer.connect(connect.input.value);
    }
    
    const broadcastContent = document.createElement('div');
    broadcastContent.id = 'BroadcastContent';
    this.content.appendChild(broadcastContent)
    const broadcast = new BroadcastComponent(broadcastContent);
    broadcast.init();
    this.peer.peer.on('call', call => {
      call.answer();
      call.on('stream', stream => {
        console.log('Got stream from ' + call.peer);
        broadcast.videoElement.srcObject = stream;
      });
    })
    broadcast.broadcastButton.onclick = () => {
      this.peer.broadcast(broadcast.stream);
    };

  }
}