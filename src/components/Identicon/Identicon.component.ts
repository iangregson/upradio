import { Component } from '..';
import { UpRadioPeerId } from '@upradio-client/UpRadioPeer';
const Ideniticon = require('identicon.js');

const AVATAR_SIZE = 128;

export class IdenticonComponent extends Component {
  private identiconContainer: HTMLDivElement;
  public identicon: String;

  constructor(container: HTMLElement) {
    super(container, 'Connect', '<div id="UpRadioIdenticon"></div>');
    this.identiconContainer = container.querySelector('div#UpRadioIdenticon');
  }
  draw(id: UpRadioPeerId) {
    const options = { size: AVATAR_SIZE, format: 'svg' };
    this.identicon = new Ideniticon(id, options).toString();
    this.identiconContainer.innerHTML = `<img width=${AVATAR_SIZE} height=${AVATAR_SIZE} src="data:image/svg+xml;base64,${this.identicon}">`;
  }
}