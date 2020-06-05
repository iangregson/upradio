import template from './Connect.component.html';
import { Component } from '..';

export enum EConnectComponentState {
  connected = 'connected',
  disconnected = 'disconnected'
}

export default class ConnectComponent extends Component {
  public input: HTMLInputElement;
  public connectBtn: HTMLButtonElement;
  public disconnectBtn: HTMLButtonElement;
  private state: EConnectComponentState;

  constructor(parent: HTMLElement) {
    super(parent, 'Connect', template);
    
    this.input = this.container.querySelector('#ConnectInput');
    this.connectBtn = this.container.querySelector('button#ConnectButton');
    this.disconnectBtn = this.container.querySelector('button#DisconnectButton');
    this.connectionStatus = EConnectComponentState.disconnected;
  }

  set connectionStatus(state: EConnectComponentState) {
    this.state = state;
    switch (this.state) {
      case EConnectComponentState.connected:
        this.disconnectBtn.style.visibility = 'visible';
        this.connectBtn.style.visibility = 'hidden';
        break;
      case EConnectComponentState.disconnected:
        this.disconnectBtn.style.visibility = 'hidden';
        this.connectBtn.style.visibility = 'visible';
        break;
    }
  }
}