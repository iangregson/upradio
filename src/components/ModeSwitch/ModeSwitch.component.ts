import template from './ModeSwitch.component.html';
import { Component } from '..';

export enum UpRadioMode {
  LISTEN = 'LISTEN',
  BROADCAST = 'BROADCAST'
}

export class ModeSwitchComponent extends Component {
  public broadcastInput: HTMLInputElement;
  public listenInput: HTMLInputElement;
  public broadcastBtn: HTMLButtonElement;
  public listenBtn: HTMLButtonElement;
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

    this.broadcastBtn = container.querySelector('button#UpRadioModeSwitchBtn-Broadcast');
    this.broadcastBtn.onclick = () => (this.value = UpRadioMode.BROADCAST);
    this.listenBtn = container.querySelector('button#UpRadioModeSwitchBtn-Listen');
    this.listenBtn.onclick = () => (this.value = UpRadioMode.LISTEN);
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
    this.broadcastBtn.style.display = mode === UpRadioMode.LISTEN ? 'unset' : 'none';
    this.listenBtn.style.display = mode === UpRadioMode.BROADCAST ? 'unset' : 'none';
    this.emit('MODE_SWITCH', { mode });
  }

  static createUpdateEvent(mode: UpRadioMode) {
    const updateEvent = new CustomEvent('UpRadio:MODE_SWITCH', { detail: mode, bubbles: true });
    return updateEvent;
  }
}