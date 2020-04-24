import template from './RemoteStream.component.html';
import { Component } from "..";
import { IUpRadioStream } from "./LocalStream.component";

export class RemoteStreamComponent extends Component implements IUpRadioStream {
  private audioOutput: HTMLAudioElement;

  public stream: MediaStream;

  constructor(container: HTMLElement) {
    super(container, 'RemoteStream', template);

    this.audioOutput = container.querySelector('audio#UpRadioAudioOutput');
  }

  public async start(stream: MediaStream): Promise<void> {
    this.stream = stream;
    this.audioOutput.srcObject = stream;
  }
  public async stop(): Promise<void> {
    this.stream = null;
    this.audioOutput.srcObject = null;
  }
}