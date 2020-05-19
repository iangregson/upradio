import { Component } from "..";
import { EventEmitter } from 'events';
import { App } from "../../app";

export enum UpRadioStatusMsgLevel {
  debug = 'log',
  info = 'log',
  log = 'log',
  warn = 'warn',
  error = 'error'
}

export interface UpRadioStatusMsg {
  text: string
  level: UpRadioStatusMsgLevel,
  ttl?: number
}

export class UpRadioStatusBar extends Component {
  public output: HTMLDivElement;
  public state: HTMLDivElement;
  public events: EventEmitter;
  private timeout: NodeJS.Timeout;
  
  constructor(parent: HTMLElement, eventBus: EventEmitter) {
    super(parent, 'UpRadioStatus', '<div id="UpRadioStateOutput"></div><div id="UpRadioStatusOutput"></div>');
    this.output = parent.querySelector('#UpRadioStatusOutput');
    this.state = parent.querySelector('#UpRadioStateOutput');
    this.output.innerText = '>';
    this.events = eventBus;
    this.events.on('status::message', this.displayMessage.bind(this));
  }
  
  private displayMessage(msg: UpRadioStatusMsg) {
    if (this.timeout) {
      this.timeout = null;
    }
    this.output.innerText = '> ' + msg.text;

    if (msg.ttl) {
      this.timeout = setTimeout(() => {
        this.output.innerText = '>';
      }, msg.ttl * 1000);
    }

    switch (msg.level) {
      case UpRadioStatusMsgLevel.debug:
        window.logger.log(msg.text);
        break;
      case UpRadioStatusMsgLevel.info:
        window.logger.log(msg.text);
        break;
      case UpRadioStatusMsgLevel.log:
        window.logger.log(msg.text);
        break;
      case UpRadioStatusMsgLevel.warn:
        window.logger.warn(msg.text);
        break;
      case UpRadioStatusMsgLevel.error:
        window.logger.error(msg.text);
        break;
    }
  }
  public displayState(app: App) {
    this.state.innerHTML = `
      <p>Peer ID: ${app.peer.id}</p>
      <p>Audio Device ID: ${app.localStream.selectedDevice && app.localStream.selectedDevice.deviceId}</p>
      <p>Channel Name: ${app.channel.name}</p>
    `;
  }
}
