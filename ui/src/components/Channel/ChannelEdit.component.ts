import template from './ChannelEdit.component.html';
import { Component } from "..";
import { UpRadioApi } from '@upradio-client/UpRadioApi';
import { UpRadioApiError } from '../../UpRadioApi';
import { ChannelInfo, ChannelInfoMode } from './ChannelInfo.component';
import { UpRadioPeer } from '@upradio-client/UpRadioPeer';

export type UpRadioChannelId = string;
export type UpRadioChannelName = string;
export enum UpRadioChannelStatus {
  valid = 'VALID',
  invalid = 'INVALID'
}

export enum UpRadioOnAirStatus {
  ON_AIR = 'ON_AIR',
  OFF_AIR = 'OFF_AIR'
}

export class ChannelEditComponent extends Component {
  public parent: HTMLElement;
  public api: UpRadioApi;
  public peer: UpRadioPeer;
  public channelInfo: ChannelInfo;

  private _onAirStatus: UpRadioOnAirStatus = UpRadioOnAirStatus.OFF_AIR;
  private _status: UpRadioChannelStatus;
  private nameInput: HTMLInputElement;
  private descriptionInput: HTMLTextAreaElement;
  private verifyBtn: HTMLButtonElement;
  private copyUrlBtn: HTMLButtonElement;
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
    this.nameInput.onchange = () => {
      this.name = this.nameInput.value;
    }
    this.descriptionInput = this.container.querySelector('textarea#channelDescription');
    
    this.verifyBtn = this.container.querySelector('button#channelVerify');
    this.verifyBtn.onclick = this.verifyChannelName.bind(this);
    this.copyUrlBtn = this.container.querySelector('button#copyUrl');
    this.copyUrlBtn.onclick = this.copyUrl.bind(this);
    this.channelEditBox = this.container.querySelector('div#channelEditor');
    this.channelInfoBox = this.container.querySelector('div#channelInfo');
    this.channelInfo = new ChannelInfo(this.channelInfoBox, 'UpRadioChannelInfo-Listen');
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

  public static htmlEscape(s: string): string {
    if (!s) return '';
    return s.trim()
      .replace('&', '&amp;')
      .replace('<', '&lt;')
      .replace('>', '&gt;');
  }

  public static toUrlSlug(s: string): string {
    if (!s) return '';
    return encodeURIComponent(s.trim()
      .replace(/\s/g, '')
      .replace(/[.!~*'()]/g, '')
      .toLowerCase())
      
  }

  public async copyUrl() {
    const url = new URL(location.origin);
    url.pathname = '/' + this.channelId;
    await navigator.clipboard.writeText(url.toString())
      .catch(err => window.logger.error(err));
  }

  public async verifyChannelName() {
    await this.api.channelVerify(this.channelId)
      .then(() => {
        this.channelStatus = UpRadioChannelStatus.valid;
      })
      .catch((err: UpRadioApiError) => {
        this.channelStatus = UpRadioChannelStatus.invalid;
      });
  }

  get onAirStatus(): UpRadioOnAirStatus {
    return this._onAirStatus;
  }
  set onAirStatus(status: UpRadioOnAirStatus) {
    this._onAirStatus = status;
  }

  get channelStatus(): UpRadioChannelStatus {
    return this._status;
  }
  set channelStatus(status: UpRadioChannelStatus) {
    this._status = status;
    switch (status) {
      case UpRadioChannelStatus.invalid:
        this.nameInput.classList.add('border-red-500');
        this.verifyBtn.classList.add('border-red-500');
        this.emit('status::message', { text: 'Channel name invalid.', level: 'error' });
        break;
      case UpRadioChannelStatus.valid:
        this.nameInput.classList.add('border-green-500');
        this.verifyBtn.classList.add('border-green-500');
        this.emit('status::message', { text: 'Channel verified.', level: 'success' });
        break;
    }
  }

  get name(): UpRadioChannelName {
    return this.nameInput.value;
  }
  set name(name: string) {
    this.nameInput.value = name;
    this.channelInfo.name = ChannelEditComponent.htmlEscape(name);
    this.channelInfo.channelId = ChannelEditComponent.toUrlSlug(name);
  }

  get description(): string {
    return this.descriptionInput.value;
  }
  set description(description: string) {
    this.descriptionInput.textContent = description;
    this.channelInfo.description = ChannelEditComponent.htmlEscape(description);
  }
  
  get image(): string {
    return this.channelInfo.image;
  }
  set image(imageBase64: string) {
    if (!imageBase64) return;
    this.channelInfo.image = imageBase64;
  }
  
  get channelId(): string {
    return this.channelInfo.channelId;
  }
  set channelId(channelId: UpRadioChannelId) {
    this.channelInfo.channelId = ChannelEditComponent.toUrlSlug(channelId);
  }
}