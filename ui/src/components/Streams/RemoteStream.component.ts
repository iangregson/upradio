import template from './RemoteStream.component.html';
import { Component } from "..";
import { IUpRadioStream } from "./LocalStream.component";
import { UpRadioAudioService } from '../LevelMeter';

export class RemoteStreamComponent extends Component implements IUpRadioStream {
  private audioOutput: HTMLAudioElement;
  private playBtn: HTMLButtonElement;
  private stopBtn: HTMLButtonElement;

  public stream: MediaStream;
  private dialToneGenerator: OscillatorNode;
  public dialTone: MediaStream;

  constructor(container: HTMLElement) {
    super(container, 'RemoteStream', template);

    this.audioOutput = container.querySelector('audio#UpRadioAudioOutput');
    this.playBtn = container.querySelector('button#UpRadioAudioOutput-play');
    this.playBtn.onclick = () => this.audioOutput.play();
    this.stopBtn = container.querySelector('button#UpRadioAudioOutput-stop');
    this.stopBtn.onclick = () => this.audioOutput.pause();
    this.hideBtn(this.stopBtn);

    this.audioOutput.onplay = () => {
      this.hideBtn(this.playBtn);
      this.showBtn(this.stopBtn);
    };
    this.audioOutput.onpause = () => {
      this.hideBtn(this.stopBtn);
      this.showBtn(this.playBtn);
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