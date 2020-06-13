import template from './Status.component.html';
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

const icons = {
  'debug': `<svg class="status-icon text-gray-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg>`,
  'info': `<svg class="status-icon text-gray-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg>`,
  'log': `<svg class="status-icon text-gray-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg>`,
  'warn': `<svg class="status-icon text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 5h2v6H9V5zm0 8h2v2H9v-2z"/></svg>`,
  'error': `<svg class="status-icon text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zM11.4 10l2.83-2.83-1.41-1.41L10 8.59 7.17 5.76 5.76 7.17 8.59 10l-2.83 2.83 1.41 1.41L10 11.41l2.83 2.83 1.41-1.41L11.41 10z"/></svg>`,
  'success': `<svg class="status-icon text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM6.7 9.29L9 11.6l4.3-4.3 1.4 1.42L9 14.4l-3.7-3.7 1.4-1.42z"/></svg>`
}

export class UpRadioStatusBar extends Component {
  public output: HTMLDivElement;
  public icon: HTMLDivElement;
  public events: EventEmitter;
  
  constructor(parent: HTMLElement, eventBus: EventEmitter) {
    super(parent, 'UpRadioStatus', template);
    this.icon = parent.querySelector('#UpRadioStatusOutput-icon');
    this.output = parent.querySelector('#UpRadioStatusOutput-text');
    this.output.innerText = '';
    this.events = eventBus;
    this.events.on('status::message', this.displayMessage.bind(this));
  }
  
  private displayMessage(msg: UpRadioStatusMsg) {

    this.icon.innerHTML = icons[msg.level];
    this.output.innerText = msg.text;

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
