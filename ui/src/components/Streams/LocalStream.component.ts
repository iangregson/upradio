import template from './LocalStream.component.html';
import { Component } from "..";
import { LevelMeter, FreqMeter } from '../LevelMeter';
import { UpRadioOnAirStatus } from '../Channel/ChannelEdit.component';

export interface IUpRadioStream {
  stream: MediaStream;
  start(stream?: MediaStream): Promise<void>;
  stop(): Promise<void>;
}

export class LocalStreamComponent extends Component implements IUpRadioStream {
  private devices: MediaDeviceInfo[];
  private audioInputSelect: any;
  public freqMeter: FreqMeter;
  public broadcastBtn: HTMLButtonElement;
  public stopBroadcastingBtn: HTMLButtonElement;
  private statusPanel: HTMLDivElement;
  private broadcastStatusText: HTMLSpanElement;
  private broadcastStatus = UpRadioOnAirStatus.OFF_AIR;

  public stream: MediaStream;

  constructor(container: HTMLElement) {
    super(container, 'LocalStream', template);

    this.broadcastBtn = this.container.querySelector('button#BroadcastButton');
    this.stopBroadcastingBtn = this.container.querySelector('button#StopBroadcastingButton');
    this.broadcastStatusText = this.container.querySelector('span#broadcastStatus');
    this.statusPanel = this.container.querySelector('div#broadcastStatusPanel');
    this.freqMeter = new FreqMeter(this.statusPanel);
    this.audioInputSelect = <any>container.querySelector('select#audioSource');
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

  public get onAirStatus(): UpRadioOnAirStatus {
    return this.broadcastStatus;
  }
  public set onAirStatus(status: UpRadioOnAirStatus) {
    this.broadcastStatus = status;
    switch (status) {
      case UpRadioOnAirStatus.ON_AIR:
        this.broadcastStatusText.classList.remove('text-red-500');
        this.broadcastStatusText.classList.add('text-green-500');
        this.broadcastStatusText.innerText = 'ON AIR';
        break;
      case UpRadioOnAirStatus.OFF_AIR:
        this.broadcastStatusText.classList.add('text-red-500');
        this.broadcastStatusText.classList.remove('text-green-500');
        this.broadcastStatusText.innerText = 'OFF AIR';
        break;
    }
  }

  public async stop(): Promise<void> {
    if (!this.stream) return;
    this.stream.getTracks().forEach(track => {
      track.stop();
    });
    this.freqMeter.stop();
    this.stopBroadcastingBtn.classList.add('hidden');
    this.broadcastBtn.classList.remove('hidden');
    this.onAirStatus = UpRadioOnAirStatus.OFF_AIR;
  }

  public get selectedDevice(): MediaDeviceInfo | undefined {
    if (!this.devices) return;
    return this.devices.find(d => d.deviceId === this.audioInputSelect.value);
  }

  public setSelectedDeviceId(id: string): void {
    this.audioInputSelect.value = id;
  }

  public async start(): Promise<void> {
    if (this.stream) this.stop();

    this.stream = await UpRadioStreamService.getAudioStream(this.selectedDevice);
    this.freqMeter.init(this.stream);
    this.stopBroadcastingBtn.classList.remove('hidden');
    this.broadcastBtn.classList.add('hidden');
    this.onAirStatus = UpRadioOnAirStatus.ON_AIR;
    
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