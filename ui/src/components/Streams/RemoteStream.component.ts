import template from './RemoteStream.component.html';
import { Component } from "..";
import { IUpRadioStream } from "./LocalStream.component";
import { UpRadioAudioService, FreqMeter } from '../LevelMeter';
import { UpRadioOnAirStatus } from '../Channel/ChannelEdit.component';

export class RemoteStreamComponent extends Component implements IUpRadioStream {
  public audioOutput: HTMLAudioElement;
  public playBtn: HTMLButtonElement;
  public stopBtn: HTMLButtonElement;

  public stream: MediaStream;
  private dialToneGenerator: OscillatorNode;
  public dialTone: MediaStream;

  public freqMeter: FreqMeter;
  private statusPanel: HTMLDivElement;
  private statusText: HTMLSpanElement;
  private _onAirStatus: UpRadioOnAirStatus;

  constructor(container: HTMLElement) {
    super(container, 'RemoteStream', template);

    this.audioOutput = container.querySelector('audio#UpRadioAudioOutput');
    this.playBtn = container.querySelector('button#UpRadioAudioOutput-play');
    this.stopBtn = container.querySelector('button#UpRadioAudioOutput-stop');
    this.hideBtn(this.stopBtn);

    this.statusPanel = this.container.querySelector('div#remoteBroadcastStatusPanel');
    this.statusText = this.container.querySelector('span#remoteBroadcastStatus');
    this.freqMeter = new FreqMeter(this.statusPanel);

    this.playBtn.onclick = () => {
      this.freqMeter.init(this.stream);
      this.audioOutput.play();
    };
    this.stopBtn.onclick = () => {
      this.freqMeter.stop();
      this.audioOutput.pause();
    };

    this.audioOutput.onplay = () => {
      this.hideBtn(this.playBtn);
      this.showBtn(this.stopBtn);
    };
    this.audioOutput.onpause = () => {
      this.hideBtn(this.stopBtn);
      this.showBtn(this.playBtn);
    }
  }

  public get onAirStatus(): UpRadioOnAirStatus {
    return this._onAirStatus;
  }
  public set onAirStatus(status: UpRadioOnAirStatus) {
    this._onAirStatus = status;
    switch (status) {
      case UpRadioOnAirStatus.ON_AIR:
        this.statusText.classList.remove('text-red-500');
        this.statusText.classList.add('text-green-500');
        this.statusText.innerText = 'ON AIR';
        break;
      case UpRadioOnAirStatus.OFF_AIR:
        this.statusText.classList.add('text-red-500');
        this.statusText.classList.remove('text-green-500');
        this.statusText.innerText = 'OFF AIR';
        break;
    }
  }

  private hideBtn(btn: HTMLButtonElement) {
    btn.classList.add('hidden');
  }
  
  private showBtn(btn: HTMLButtonElement) {
    btn.classList.remove('hidden');
  }

  public async start(stream: MediaStream): Promise<void> {
    this.stream = stream;
    this.audioOutput.srcObject = stream;
    this.dialToneGenerator.start();
  }
  public async stop(): Promise<void> {
    this.stream = null;
    this.audioOutput.srcObject = null;
    this.dialToneGenerator.stop();
  }
  
  public getDialTone(): void {
    const [oscillator, outputStream] = UpRadioAudioService.createToneGeneratorAndStream();
    this.dialToneGenerator = oscillator;
    this.dialTone = outputStream.stream;
  }

}