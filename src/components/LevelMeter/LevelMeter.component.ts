import { Component } from "..";

export interface ILevelMeterOptions {
  width: number,
  height: number,
  fftSize: number
}

const DEFAULT_METER_OPTIONS: ILevelMeterOptions = {
  width: 200,
  height: 200,
  fftSize: 256
}

export class LevelMeter extends Component {
  public source: MediaStreamAudioSourceNode;
  public audioCtx: AudioContext;
  public analyser: AnalyserNode;
  public canvas: HTMLCanvasElement;
  private options: ILevelMeterOptions;
  private drawFrame: number;
  
  constructor(parent: HTMLElement, options: ILevelMeterOptions = DEFAULT_METER_OPTIONS) {
    super(parent, 'LevelMeter', '<canvas id="LevelMeterOutput"></canvas>');
    this.options = options;
    this.canvas = this.parent.querySelector('canvas#LevelMeterOutput');
    this.canvas.width = options.width;
    this.canvas.height = options.height;
    this.hide();
  }

  public init(stream: MediaStream): this {
    this.audioCtx = new UpRadioAudioService.AudioContext();
    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.fftSize = this.options.fftSize;
    this.source = this.audioCtx.createMediaStreamSource(stream);
    this.source.connect(this.analyser);
    this.audioCtx.resume();
    this.draw();
    this.show();
    return this;
  }

  public stop(): this {
    this.source = null;
    cancelAnimationFrame(this.drawFrame);
    this.drawFrame = null;
    this.hide();
    return this;
  }

  public draw() {
    this.drawFrame = requestAnimationFrame(this.draw.bind(this));
    const WIDTH = this.options.width;
    const HEIGHT = this.options.height;
    
    const canvasCtx = this.canvas.getContext('2d');
    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteFrequencyData(dataArray);

    canvasCtx.fillStyle = 'rgb(200, 200, 200)';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
    
    var barWidth = (WIDTH / bufferLength) * 2.5;
    var barHeight;
    var x = 0;
    
    for(var i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i]/2;

      canvasCtx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
      canvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight);

      x += barWidth + 1;
    }
  }
}

export class UpRadioAudioService {
  static get AudioContext() {
    const audioContextProvider = window.AudioContext;
    return audioContextProvider;
  }
  static createToneGeneratorAndStream(tone: number = 440 /* value for middle A */): [OscillatorNode, MediaStreamAudioDestinationNode] {
    const audioCtx = new UpRadioAudioService.AudioContext();
    audioCtx.resume();
    
    const oscillator = audioCtx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(tone, audioCtx.currentTime);
    
    const outputStream = audioCtx.createMediaStreamDestination();
    oscillator.connect(outputStream);
    
    return [oscillator, outputStream];
  }
}