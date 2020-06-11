import template from './ChannelEdit.component.html';
import { Component } from "..";
import { UpRadioApi } from '@upradio-client/UpRadioApi';
import { UpRadioApiError } from '@upradio-server/api';

export type UpRadioChannelId = string;
export type UpRadioChannelName = string;
export enum UpRadioChannelStatus {
  valid = 'VALID',
  invalid = 'INVALID'
}

export class ChannelEditComponent extends Component {
  public parent: HTMLElement;
  public api: UpRadioApi;

  private _status: UpRadioChannelStatus;
  private nameInput: HTMLInputElement;
  private descriptionInput: HTMLTextAreaElement;
  private verifyBtn: HTMLButtonElement;

  constructor(parent: HTMLElement, api: UpRadioApi) {
    super(parent, 'ChannelEditComponent', template);
    this.parent = parent;
    this.api = api;
    
    this.nameInput = this.parent.querySelector('input#channelName');
    this.descriptionInput = this.parent.querySelector('textarea#channelDescription');
    
    this.verifyBtn = this.parent.querySelector('button#channelVerify');
    this.verifyBtn.onclick = this.verifyChannelName.bind(this);
  }

  public async verifyChannelName() {
    await this.api.channelVerify(this.name)
      .then(() => {
        this.channelStatus = UpRadioChannelStatus.valid;
      })
      .catch((err: UpRadioApiError) => {
        this.channelStatus = UpRadioChannelStatus.invalid;
      });
  }

  get channelStatus(): UpRadioChannelStatus {
    return this._status;
  }
  set channelStatus(status: UpRadioChannelStatus) {
    this._status = status;
    // do things to alter the look and feel of the input here
    // show error etc
    // switch (status) {
    //   case UpRadioChannelStatus.invalid:
    //     this.parent.classList.remove('channelName__valid');
    //     this.parent.classList.add('channelName__invalid');
    //     break;
    //   case UpRadioChannelStatus.valid:
    //     this.parent.classList.remove('channelName__invalid');
    //     this.parent.classList.add('channelName__valid');
    //     break;
    // }
    this.emit('ChannelComponent::changed::status');
  }

  get name(): UpRadioChannelName {
    return this.nameInput.value;
  }
  set name(name: string) {
    this.nameInput.value = name;
  }

  get description(): string {
    return this.descriptionInput.textContent;
    // return this.descriptionInput.value;
  }
  set description(description: string) {
    this.descriptionInput.textContent = description;
  }
}