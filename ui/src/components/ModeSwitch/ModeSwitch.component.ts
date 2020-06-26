import template from './ModeSwitch.component.html';
import { Component } from '..';

export enum UpRadioMode {
  LISTEN = 'LISTEN',
  BROADCAST = 'BROADCAST'
}

export class ModeSwitchComponent extends Component {
  public broadcastInput: HTMLInputElement;
  public listenInput: HTMLInputElement;
  public broadcastBtnBox: HTMLDivElement;
  public broadcastBtn: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container, 'ModeSwtich', template);
    
    this.broadcastInput = container.querySelector('input#UpRadioModeSwitch-Broadcast');
    this.broadcastInput.onchange = () => {
      this.emit('MODE_SWITCH', { mode: this.value });
    }
    
    this.listenInput = container.querySelector('input#UpRadioModeSwitch-Listen');
    this.listenInput.onchange = () => {
      this.emit('MODE_SWITCH', { mode: this.value });
    }

    this.broadcastBtnBox = container.querySelector('div#UpRadioModeSwitch-Btn');
    this.broadcastBtn = container.querySelector('button#UpRadioModeSwitchBtn-Broadcast');
    this.broadcastBtn.onclick = () => (location.href = location.origin);
  }

  get value(): UpRadioMode {
    if (this.broadcastInput.checked) {
      return UpRadioMode.BROADCAST;
    }
    return UpRadioMode.LISTEN;
  }
  set value(mode: UpRadioMode) {
    this.broadcastInput.checked = mode === UpRadioMode.BROADCAST;
    this.listenInput.checked = mode === UpRadioMode.LISTEN;
    if (mode === UpRadioMode.BROADCAST) {
      this.broadcastBtnBox.classList.add('hidden');
    }
    this.emit('MODE_SWITCH', { mode });
  }

  static createUpdateEvent(mode: UpRadioMode) {
    const updateEvent = new CustomEvent('UpRadio:MODE_SWITCH', { detail: mode, bubbles: true });
    return updateEvent;
  }
}