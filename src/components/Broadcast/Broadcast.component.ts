import template from './Broadcast.component.html';
import { Component } from '..';

export default class BroadcastComponent extends Component {
  public broadcastBtn: HTMLButtonElement;
  public stopBroadcastingBtn: HTMLButtonElement;

  constructor(parent: HTMLElement) {
    super(parent, 'Broadcast', template);
    
    this.broadcastBtn = this.container.querySelector('button#BroadcastButton');
    this.stopBroadcastingBtn = this.container.querySelector('button#StopBroadcastingButton');
  }
}