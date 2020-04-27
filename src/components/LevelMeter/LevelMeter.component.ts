import { Component } from "..";

export interface ILevelMeterOptions {
  width: number,
  height: number,
  fftSize: number
}

const DEFAULT_METER_OPTIONS: ILevelMeterOptions = {
  width: 200,
  height: 200,
  fftSize: 2048
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
    this.analyser.getByteTimeDomainData(dataArray);

    canvasCtx.fillStyle = 'rgb(200, 200, 200)';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
    canvasCtx.beginPath();

    var sliceWidth = WIDTH * 1.0 / bufferLength;
    var x = 0;
    for(var i = 0; i < bufferLength; i++) {
   
      var v = dataArray[i] / 128.0;
      var y = v * HEIGHT/2;

      if(i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    canvasCtx.lineTo(this.canvas.width, this.canvas.height/2);
    canvasCtx.stroke();
  }
}

export class UpRadioAudioService {
  static get AudioContext() {
    const audioContextProvider = window.AudioContext;
    return audioContextProvider;
  }
}