import template from './ModeSwitch.component.html';
import { Component } from '..';

export enum UpRadioMode {
  LISTEN = 'LISTEN',
  BROADCAST = 'BROADCAST'
}

export class ModeSwitchComponent extends Component {
  public broadcastInput: HTMLInputElement;
  public listenInput: HTMLInputElement;
  constructor(container: HTMLElement) {
    super(container, 'ModeSwtich', template);
    
    this.broadcastInput = container.querySelector('input#UpRadioModeSwitch-Broadcast');
    this.broadcastInput.onchange = () => {
      const updateEvent = ModeSwitchComponent.createUpdateEvent(this.value);
      this.container.dispatchEvent(updateEvent);
    }
    
    this.listenInput = container.querySelector('input#UpRadioModeSwitch-Listen');
    this.listenInput.onchange = () => {
      const updateEvent = ModeSwitchComponent.createUpdateEvent(this.value);
      this.container.dispatchEvent(updateEvent);
    }
  }

  get value(): UpRadioMode {
    console.log('Trying to get mode...')
    if (this.broadcastInput.checked) {
      return UpRadioMode.BROADCAST;
    }
    return UpRadioMode.LISTEN;
  }
  set value(mode: UpRadioMode) {
    this.broadcastInput.checked = mode === UpRadioMode.BROADCAST;
    this.listenInput.checked = mode === UpRadioMode.LISTEN;
  }

  static createUpdateEvent(mode: UpRadioMode) {
    const updateEvent = new CustomEvent('UpRadio:MODE_SWITCH', { detail: mode, bubbles: true });
    return updateEvent;
  }
}