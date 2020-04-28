import template from './RemoteStream.component.html';
import { Component } from "..";
import { IUpRadioStream } from "./LocalStream.component";
import { UpRadioAudioService } from '../LevelMeter';

export class RemoteStreamComponent extends Component implements IUpRadioStream {
  private audioOutput: HTMLAudioElement;

  public stream: MediaStream;
  private dialToneGenerator: OscillatorNode;
  public dialTone: MediaStream;

  constructor(container: HTMLElement) {
    super(container, 'RemoteStream', template);

    this.audioOutput = container.querySelector('audio#UpRadioAudioOutput');
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