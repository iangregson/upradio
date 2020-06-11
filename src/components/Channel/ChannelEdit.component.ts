import template from './ChannelEdit.component.html';
import { Component } from "..";
import { UpRadioApi } from '@upradio-client/UpRadioApi';
import { UpRadioApiError } from '@upradio-server/api';
import { ChannelInfo, ChannelInfoMode } from './ChannelInfo.component';
import { UpRadioPeer } from '@upradio-client/UpRadioPeer';

export type UpRadioChannelId = string;
export type UpRadioChannelName = string;
export enum UpRadioChannelStatus {
  valid = 'VALID',
  invalid = 'INVALID'
}

export class ChannelEditComponent extends Component {
  public parent: HTMLElement;
  public api: UpRadioApi;
  public peer: UpRadioPeer;
  public channelInfo: ChannelInfo;

  private _status: UpRadioChannelStatus;
  private nameInput: HTMLInputElement;
  private descriptionInput: HTMLTextAreaElement;
  private verifyBtn: HTMLButtonElement;
  private channelEditBox: HTMLDivElement;
  private channelInfoBox: HTMLDivElement;
  private channelImageUpload: HTMLInputElement;

  constructor(parent: HTMLElement, api: UpRadioApi, peer: UpRadioPeer) {
    super(parent, 'ChannelEditComponent', template);
    this.api = api;
    this.peer = peer;

    this.parent.classList.add('flex');
    this.parent.classList.add('flex-col');
    this.parent.classList.add('flex-grow');
    this.container.classList.add('flex');
    this.container.classList.add('flex-col');
    this.container.classList.add('flex-grow');
    
    this.nameInput = this.container.querySelector('input#channelName');
    this.descriptionInput = this.container.querySelector('textarea#channelDescription');
    
    this.verifyBtn = this.container.querySelector('button#channelVerify');
    this.verifyBtn.onclick = this.verifyChannelName.bind(this);
    this.channelEditBox = this.container.querySelector('div#channelEditor');
    this.channelInfoBox = this.container.querySelector('div#channelInfo');
    this.channelInfo = new ChannelInfo(this.channelInfoBox);
    this.channelInfo.init({ peerId: this.peer.id });
    this.channelInfo.mode = ChannelInfoMode.READ_WRITE;
    this.channelInfo.editBtn.onclick = () => this.channelEditBox.classList.toggle('hidden');
    this.channelImageUpload = this.container.querySelector('input#channelImageUpload');
    this.channelImageUpload.onchange = () => {
      const reader = new FileReader();
      const self = this;
      reader.addEventListener("load", function () {
        const result = this.result.toString().split(',').pop();
        self.image = result;
      }, false);

      reader.readAsDataURL(this.channelImageUpload.files[0]);
    };
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
    this.channelInfo.name = name;
  }

  get description(): string {
    return this.descriptionInput.value;
    // return this.descriptionInput.value;
  }
  set description(description: string) {
    this.descriptionInput.textContent = description;
    this.channelInfo.description = description;
  }
  
  get image(): string {
    return this.channelInfo.image;
  }
  set image(imageBase64: string) {
    this.channelInfo.image = imageBase64;
  }
}