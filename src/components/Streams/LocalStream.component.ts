import template from './LocalStream.component.html';
import { Component } from "..";
import { LevelMeter } from '../LevelMeter';

export interface IUpRadioStream {
  stream: MediaStream;
  start(stream?: MediaStream): Promise<void>;
  stop(): Promise<void>;
}

export class LocalStreamComponent extends Component implements IUpRadioStream {
  private devices: MediaDeviceInfo[];
  private audioInputSelect: HTMLSelectElement;
  public levelMeter: LevelMeter;

  public stream: MediaStream;

  constructor(container: HTMLElement) {
    super(container, 'LocalStream', template);

    this.audioInputSelect = container.querySelector('select#audioSource');
    this.levelMeter = new LevelMeter(container);

    this.initDeviceList();
  }

  async initDeviceList(): Promise<void> {
    this.devices = await UpRadioStreamService.enumerateAudioDevices();
    
    // Keep previous value but clear out existing options
    const selectedDeviceId = this.audioInputSelect.value;
    while (this.audioInputSelect.firstChild) {
      this.audioInputSelect.removeChild(this.audioInputSelect.firstChild);
    }

    for (let audioDevice of this.devices) {
      const option = document.createElement('option');
      option.value = audioDevice.deviceId;
      option.text = audioDevice.label || `microphone ${this.audioInputSelect.length + 1}`;
      this.audioInputSelect.appendChild(option);
    }

    // Reinstate previous value if there was one
    const selectedValueinOptions = Array.prototype.slice.call(this.audioInputSelect.childNodes)
      .some(n => n.value === selectedDeviceId);
    if (selectedValueinOptions) {
      this.audioInputSelect.value = selectedDeviceId;
    }
  }

  public async stop(): Promise<void> {
    if (!this.stream) return;
    this.stream.getTracks().forEach(track => {
      track.stop();
    });
    this.levelMeter.stop();
  }

  public async start(): Promise<void> {
    if (this.stream) this.stop();

    const audioDevice = this.devices.find(d => d.deviceId === this.audioInputSelect.value);
    this.stream = await UpRadioStreamService.getAudioStream(audioDevice);
    this.levelMeter.init(this.stream);
    
    // In-case of proper labels becoming available
    this.initDeviceList();
  }
}

export class UpRadioStreamService {
  static async enumerateAudioDevices(w: Window = window): Promise<MediaDeviceInfo[]> {
    return w.navigator.mediaDevices.enumerateDevices()
      .then(ds => ds.filter(d => d.kind === 'audioinput'));
  }
  static async getAudioStream(audioDevice: MediaDeviceInfo, w: Window = window): Promise<MediaStream> {
    const video = false;
    let audio;

    if (audioDevice && audioDevice.deviceId) {
      audio = { deviceId: { exact: audioDevice.deviceId } }
    } else {
      audio = true;
    }

    return w.navigator.mediaDevices.getUserMedia({ video, audio });
  }
}