import { Component } from "..";

export interface IFreqMeterOptions {
  width: number,
  height: number,
  fftSize: number
}

const DEFAULT_METER_OPTIONS: IFreqMeterOptions = {
  width: 200,
  height: 200,
  fftSize: 256
}

export class FreqMeter extends Component {
  public source: MediaStreamAudioSourceNode;
  public audioCtx: AudioContext;
  public analyser: AnalyserNode;
  public canvas: HTMLCanvasElement;
  private options: IFreqMeterOptions;
  private drawFrame: number;
  
  constructor(parent: HTMLElement, options: IFreqMeterOptions = DEFAULT_METER_OPTIONS) {
    super(parent, 'FreqMeter', '<canvas id="FreqMeterOutput" class="w-full rounded h-20"></canvas>');
    this.options = options;
    this.canvas = this.parent.querySelector('canvas#FreqMeterOutput');
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
    const WIDTH = this.canvas.width;
    const HEIGHT = this.canvas.height;
    const canvasCtx = this.canvas.getContext('2d');
    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
    return this;
  }

  public draw() {
    this.drawFrame = requestAnimationFrame(this.draw.bind(this));
    const WIDTH = this.canvas.width;
    const HEIGHT = this.canvas.height;
    
    const canvasCtx = this.canvas.getContext('2d');
    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteFrequencyData(dataArray);

    var barWidth = (WIDTH / bufferLength) * 2.5;
    var barHeight;
    var x = 0;
    
    for(var i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i]/2;

      // canvasCtx.fillStyle = 'rgb(' + (barHeight+100) + ',255,255)';
      canvasCtx.fillStyle = 'rgb(255,255,255)';
      canvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight);

      x += barWidth + 1;
    }
  }
}

export class LevelMeter extends Component {
  public source: MediaStreamAudioSourceNode;
  public audioCtx: AudioContext;
  public analyser: ScriptProcessorNode;
  public meter: HTMLMeterElement;
  public value: number;
  private drawFrame: number;

  constructor(parent: HTMLElement) {
    super(parent, 'LevelMeter', '<meter id="LevelMeterOutput" high="0.25" max="1" value="0" class="w-full"></meter>');
    this.meter = this.parent.querySelector('meter#LevelMeterOutput');
    this.meter.high = 0.25;
    this.meter.max = 1;
    this.meter.value = 0;
    this.value = 0.0;
  }

  public init(stream: MediaStream): this {
    this.audioCtx = new UpRadioAudioService.AudioContext();
    this.source = this.audioCtx.createMediaStreamSource(stream);
    this.analyser = this.audioCtx.createScriptProcessor(2048, 1, 1);
    this.analyser.onaudioprocess = (event: AudioProcessingEvent) => {
      const input = event.inputBuffer.getChannelData(0);
      let i;
      let sum = 0.0;
      for (i = 0; i < input.length; ++i) {
        sum += input[i] * input[i];
      }
      this.value = Math.sqrt(sum / input.length);
    };
    this.source.connect(this.analyser);
    this.analyser.connect(this.audioCtx.destination);
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
    this.meter.value = this.value;
  }
}

export class UpRadioAudioService {
  static get AudioContext() {
    const audioContextProvider = window.AudioContext || window.webkitAudioContext;
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