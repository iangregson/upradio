import template from './ChannelInfo.component.html';
import { Component } from "..";
import { UpRadioPeerId } from '@upradio-client/UpRadioPeer';
import { UpRadioChannelName, UpRadioChannelId } from './ChannelEdit.component';
import { v4 as uuid } from 'uuid';

const SWH_IMG = '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';
const Identicon = require('identicon.js');

export enum ChannelInfoMode {
  READ = 'READ',
  READ_WRITE = 'READ_WRITE'
}

export interface UpRadioChannelInfo {
  name?: UpRadioChannelName;
  peerId?: UpRadioPeerId;
  id?: UpRadioChannelId;
  description?: string;
  image?: string; // base64 iamge string
  avatar?: string; // base64 iamge string
}

export class ChannelInfo extends Component {
  channelInfo: UpRadioChannelInfo;
  placeholderBox: HTMLDivElement;
  img: HTMLImageElement;
  imgBox: HTMLDivElement;
  nameBox: HTMLDivElement;
  descriptionBox: HTMLDivElement;
  descriptionP: HTMLParagraphElement;
  nameH1: HTMLHeadingElement;
  infoBtn: HTMLButtonElement;
  editBtn: HTMLButtonElement;  
  _mode = ChannelInfoMode.READ;

  constructor(parent: HTMLElement, componentId = 'UpRadioChannelInfo') {
    super(parent, componentId, template);
    this.parent.classList.add('flex');
    this.parent.classList.add('flex-col');
    this.parent.classList.add('flex-grow');
    this.container.classList.add('flex');
    this.container.classList.add('flex-col');
    this.container.classList.add('flex-grow');
    this.channelInfo = {};

    this.placeholderBox = this.container.querySelector('div#channelImagePlaceholder');
    this.imgBox = this.container.querySelector('div#channelImage');
    this.nameBox = this.container.querySelector('div#channelName');
    this.nameH1 = this.nameBox.querySelector('h1');
    this.descriptionBox = this.container.querySelector('div#channelDescription');
    this.descriptionP = this.descriptionBox.querySelector('p');
    this.infoBtn = this.nameBox.querySelector('button#expandInfoBtn');
    this.infoBtn.onclick = () => this.descriptionBox.classList.toggle('hidden');
    this.editBtn = this.nameBox.querySelector('button#editInfoBtn');

    // setTimeout(() => {
    //   this.init({
    //     id: 'scotswhayhae',
    //     peerId: uuid(),
    //     name: 'Scots Whay Hae!',
    //     description: `Talking about Scottish culture so you don't have to`
    //   });
    // }, 1500)
    
    // setTimeout(() => {
    //   this.init({
    //     id: 'scotswhayhae',
    //     peerId: uuid(),
    //     name: 'Scots Whay Hae!',
    //     image: SWH_IMG,
    //     description: `Talking about Scottish culture so you don't have to`
    //   });
    // }, 3000)
  }
  public init(channelInfo: UpRadioChannelInfo) {
    channelInfo.name && (this.name = channelInfo.name);
    channelInfo.id && (this.id = channelInfo.id);
    channelInfo.peerId && (this.peerId = channelInfo.peerId);
    channelInfo.peerId && this.makeAvatar();
    channelInfo.image && (this.image = channelInfo.image);
    channelInfo.description && (this.description = channelInfo.description);
  }

  private makeAvatar() {
    if (!this.peerId) return;
    const avatarOptions = {
      background: [255, 255, 255, 180], // rgba white
      margin: 0.2, // 20% margin
      size: 420
    }
    this.avatar = new Identicon(this.peerId, avatarOptions).toString();
  }

  public set avatar(base64Img: string) {
    this.channelInfo.avatar = base64Img;
    // this.placeholderBox.innerHTML = `<img class="rounded main-mode-icon" src="data:image/svg+xml;base64,${this.avatar}">`;
    this.placeholderBox.innerHTML = `<img class="rounded main-mode-icon" src="data:image/png;base64,${this.avatar}">`;
    const img = "url('data:image/png;base64, " + this.avatar + "')";
    this.imgBox.style.backgroundImage = img;
    this.imgBox.classList.remove('hidden');
    this.placeholderBox.classList.add('hidden');
  }

  public get avatar(): string {
    return this.channelInfo.avatar;
  }
  
  public set image(base64Img: string) {
    this.channelInfo.image = base64Img;
    const img = "url('data:image/png;base64, " + base64Img + "')";
    this.imgBox.style.backgroundImage = img;
    this.imgBox.classList.remove('hidden');
    this.placeholderBox.classList.add('hidden');
  }

  public get image(): string | undefined {
    return this.channelInfo.image;
  }

  public set name(channelName: UpRadioChannelName) {
    this.channelInfo.name = channelName;
    this.nameH1.innerText = channelName;
    this.nameBox.classList.remove('hidden');
  }

  public get name(): UpRadioChannelName {
    return this.channelInfo.name;
  }

  public set channelId(id: UpRadioChannelId) {
    this.channelInfo.id = id;
  }

  public get channelId(): UpRadioChannelId {
    return this.channelInfo.id;
  }
  
  public set peerId(peerId: UpRadioPeerId) {
    this.channelInfo.peerId = peerId;
  }

  public get peerId(): UpRadioPeerId {
    return this.channelInfo.peerId;
  }
  
  public set description(description: string) {
    this.channelInfo.description = description;
    this.descriptionP.innerText = description;
    this.isReadOnly && this.infoBtn.classList.remove('hidden');
  }

  public get description(): UpRadioChannelName {
    return this.channelInfo.description;
  }
  
  public set mode(channelInfoMode: ChannelInfoMode) {
    this._mode = channelInfoMode;
    if (this._mode === ChannelInfoMode.READ_WRITE) {
      this.infoBtn.classList.add('hidden');
      this.editBtn.classList.remove('hidden');
      this.nameBox.classList.remove('hidden');
    }
  }

  public get mode(): ChannelInfoMode {
    return this._mode;
  }

  private get isReadOnly(): boolean {
    return this.mode === ChannelInfoMode.READ;
  }
}
