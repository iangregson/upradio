import template from './Connect.component.html';
import { Component } from '..';

export default class ConnectComponent extends Component {
  public input: HTMLInputElement;
  public connectBtn: HTMLButtonElement;
  public disconnectBtn: HTMLButtonElement;

  constructor(parent: HTMLElement) {
    super(parent, 'Connect', template);
    
    this.input = this.container.querySelector('#ConnectInput');
    this.connectBtn = this.container.querySelector('button#ConnectButton');
    this.disconnectBtn = this.container.querySelector('button#DisconnectButton');
  }
}