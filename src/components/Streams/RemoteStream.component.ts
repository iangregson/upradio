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
    this.playBtn.style.visibility = 'hidden';
    this.stopBtn = container.querySelector('button#UpRadioAudioOutput-stop');
    this.stopBtn.style.visibility = 'hidden';
    this.stopBtn.onclick = () => this.audioOutput.pause();
    this.audioOutput.onplay = () => {
      this.stopBtn.style.visibility = 'visible';
      this.playBtn.style.visibility = 'hidden';
    };
    this.audioOutput.onpause = () => {
      this.stopBtn.style.visibility = 'visible';
      this.playBtn.style.visibility = 'hidden';
    }
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