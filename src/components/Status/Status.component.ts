import { Component } from "..";
import { EventEmitter } from 'events';
import { App } from "../../app";

export enum UpRadioStatusMsgLevel {
  debug = 'log',
  info = 'log',
  log = 'log',
  warn = 'warn',
  error = 'error',
  success = 'success'
}

export interface UpRadioStatusMsg {
  text: string
  level: UpRadioStatusMsgLevel,
}

export class UpRadioStatusBar extends Component {
  public output: HTMLDivElement;
  public events: EventEmitter;
  
  constructor(parent: HTMLElement, eventBus: EventEmitter) {
    super(parent, 'UpRadioStatus', '<div id="UpRadioStatusOutput"></div>');
    this.output = parent.querySelector('#UpRadioStatusOutput');
    this.output.innerText = '>';
    this.events = eventBus;
    this.events.on('status::message', this.displayMessage.bind(this));
  }
  
  private displayMessage(msg: UpRadioStatusMsg) {

    this.output.innerText = '> ' + msg.text;

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
      case UpRadioStatusMsgLevel.success:
        window.logger.log(msg.text);
        break;
      case UpRadioStatusMsgLevel.error:
        window.logger.error(msg.text);
        break;
    }
  }
}
