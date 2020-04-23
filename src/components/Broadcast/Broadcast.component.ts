import template from './Broadcast.component.html';
import { Component } from "..";

export class BroadcastComponent extends Component {
  private devices: MediaDeviceInfo[];
  public videoElement: HTMLVideoElement;
  private audioInputSelect: HTMLSelectElement;
  private audioOutputSelect: HTMLSelectElement;
  private videoSelect: HTMLSelectElement;
  private selectors: HTMLSelectElement[];
  public broadcastButton: HTMLButtonElement;
  public stream: MediaStream;
  
  constructor(container: HTMLElement) {
    super(container, template);

    this.videoElement = container.querySelector('video');
    this.audioInputSelect = container.querySelector('select#audioSource');
    this.audioOutputSelect = container.querySelector('select#audioOutput');
    this.videoSelect = container.querySelector('select#videoSource');
    this.selectors = [this.audioInputSelect, this.audioOutputSelect, this.videoSelect];
    this.broadcastButton = container.querySelector('button#broadcast');
  }

  async init(): Promise<void> {
    this.devices = await window.navigator.mediaDevices.enumerateDevices();
    this.gotDevices(this.devices);
    this.audioInputSelect.onchange = this.start.bind(this);
    this.videoSelect.onchange = this.start.bind(this);
    this.start();
    console.log(this);
  }

  private gotDevices(deviceInfos: MediaDeviceInfo[]) {
    // Handles being called several times to update labels. Preserve values.
    const values = this.selectors.map(select => select.value);
    this.selectors.forEach(select => {
      while (select.firstChild) {
        select.removeChild(select.firstChild);
      }
    });
    for (let i = 0; i !== deviceInfos.length; ++i) {
      const deviceInfo = deviceInfos[i];
      const option = document.createElement('option');
      option.value = deviceInfo.deviceId;
      if (deviceInfo.kind === 'audioinput') {
        option.text = deviceInfo.label || `microphone ${this.audioInputSelect.length + 1}`;
        this.audioInputSelect.appendChild(option);
      } else if (deviceInfo.kind === 'audiooutput') {
        option.text = deviceInfo.label || `speaker ${this.audioOutputSelect.length + 1}`;
        this.audioOutputSelect.appendChild(option);
      } else if (deviceInfo.kind === 'videoinput') {
        option.text = deviceInfo.label || `camera ${this.videoSelect.length + 1}`;
        this.videoSelect.appendChild(option);
      } else {
        console.log('Some other kind of source/device: ', deviceInfo);
      }
    }
    this.selectors.forEach((select, selectorIndex) => {
      if (Array.prototype.slice.call(select.childNodes).some(n => n.value === values[selectorIndex])) {
        select.value = values[selectorIndex];
      }
    });
  }

  private start() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => {
        track.stop();
      });
    }
    const audioSource = this.audioInputSelect.value;
    const videoSource = this.videoSelect.value;
    const constraints = {
      audio: {deviceId: audioSource ? {exact: audioSource} : undefined},
      video: {deviceId: videoSource ? {exact: videoSource} : undefined}
    };
    navigator.mediaDevices.getUserMedia(constraints).then(stream => {
      this.stream = stream; // make stream available to console
      this.videoElement.srcObject = stream;
      // Refresh button list in case labels have become available
      return navigator.mediaDevices.enumerateDevices();
    }).then(this.gotDevices.bind(this)).catch(console.error);
  }
}
