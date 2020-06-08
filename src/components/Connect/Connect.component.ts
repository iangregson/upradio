import template from './Connect.component.html';
import { Component } from '..';

export enum EConnectComponentState {
  connected = 'connected',
  disconnected = 'disconnected'
}

export default class ConnectComponent extends Component {
  public input: HTMLInputElement;
  public connectBtn: HTMLButtonElement;

  constructor(parent: HTMLElement) {
    super(parent, 'Connect', template);
    
    this.input = this.container.querySelector('#ConnectInput');
    this.connectBtn = this.container.querySelector('button#ConnectButton');
    this.connectBtn.onclick = () => {
      location.href = location.origin + '/' + this.input.value;
    }
  }
}