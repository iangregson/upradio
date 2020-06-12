"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("..");
var DEFAULT_METER_OPTIONS = {
    width: 200,
    height: 200,
    fftSize: 256
};
var FreqMeter = /** @class */ (function (_super) {
    __extends(FreqMeter, _super);
    function FreqMeter(parent, options) {
        if (options === void 0) { options = DEFAULT_METER_OPTIONS; }
        var _this = _super.call(this, parent, 'FreqMeter', '<canvas id="FreqMeterOutput" class="w-full rounded h-20"></canvas>') || this;
        _this.options = options;
        _this.canvas = _this.parent.querySelector('canvas#FreqMeterOutput');
        return _this;
    }
    FreqMeter.prototype.init = function (stream) {
        this.audioCtx = new UpRadioAudioService.AudioContext();
        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.fftSize = this.options.fftSize;
        this.source = this.audioCtx.createMediaStreamSource(stream);
        this.source.connect(this.analyser);
        this.audioCtx.resume();
        this.draw();
        this.show();
        return this;
    };
    FreqMeter.prototype.stop = function () {
        this.source = null;
        cancelAnimationFrame(this.drawFrame);
        this.drawFrame = null;
        var WIDTH = this.canvas.width;
        var HEIGHT = this.canvas.height;
        var canvasCtx = this.canvas.getContext('2d');
        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
        return this;
    };
    FreqMeter.prototype.draw = function () {
        this.drawFrame = requestAnimationFrame(this.draw.bind(this));
        var WIDTH = this.canvas.width;
        var HEIGHT = this.canvas.height;
        var canvasCtx = this.canvas.getContext('2d');
        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
        var bufferLength = this.analyser.frequencyBinCount;
        var dataArray = new Uint8Array(bufferLength);
        this.analyser.getByteFrequencyData(dataArray);
        var barWidth = (WIDTH / bufferLength) * 2.5;
        var barHeight;
        var x = 0;
        for (var i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] / 2;
            // canvasCtx.fillStyle = 'rgb(' + (barHeight+100) + ',255,255)';
            canvasCtx.fillStyle = 'rgb(255,255,255)';
            canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight);
            x += barWidth + 1;
        }
    };
    return FreqMeter;
}(__1.Component));
exports.FreqMeter = FreqMeter;
var LevelMeter = /** @class */ (function (_super) {
    __extends(LevelMeter, _super);
    function LevelMeter(parent) {
        var _this = _super.call(this, parent, 'LevelMeter', '<meter id="LevelMeterOutput" high="0.25" max="1" value="0" class="w-full"></meter>') || this;
        _this.meter = _this.parent.querySelector('meter#LevelMeterOutput');
        _this.meter.high = 0.25;
        _this.meter.max = 1;
        _this.meter.value = 0;
        _this.value = 0.0;
        return _this;
    }
    LevelMeter.prototype.init = function (stream) {
        var _this = this;
        this.audioCtx = new UpRadioAudioService.AudioContext();
        this.source = this.audioCtx.createMediaStreamSource(stream);
        this.analyser = this.audioCtx.createScriptProcessor(2048, 1, 1);
        this.analyser.onaudioprocess = function (event) {
            var input = event.inputBuffer.getChannelData(0);
            var i;
            var sum = 0.0;
            for (i = 0; i < input.length; ++i) {
                sum += input[i] * input[i];
            }
            _this.value = Math.sqrt(sum / input.length);
        };
        this.source.connect(this.analyser);
        this.analyser.connect(this.audioCtx.destination);
        this.audioCtx.resume();
        this.draw();
        this.show();
        return this;
    };
    LevelMeter.prototype.stop = function () {
        this.source = null;
        cancelAnimationFrame(this.drawFrame);
        this.drawFrame = null;
        this.hide();
        return this;
    };
    LevelMeter.prototype.draw = function () {
        this.drawFrame = requestAnimationFrame(this.draw.bind(this));
        this.meter.value = this.value;
    };
    return LevelMeter;
}(__1.Component));
exports.LevelMeter = LevelMeter;
var UpRadioAudioService = /** @class */ (function () {
    function UpRadioAudioService() {
    }
    Object.defineProperty(UpRadioAudioService, "AudioContext", {
        get: function () {
            var audioContextProvider = window.AudioContext || window.webkitAudioContext;
            return audioContextProvider;
        },
        enumerable: true,
        configurable: true
    });
    UpRadioAudioService.createToneGeneratorAndStream = function (tone /* value for middle A */) {
        if (tone === void 0) { tone = 440; }
        var audioCtx = new UpRadioAudioService.AudioContext();
        audioCtx.resume();
        var oscillator = audioCtx.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(tone, audioCtx.currentTime);
        var outputStream = audioCtx.createMediaStreamDestination();
        oscillator.connect(outputStream);
        return [oscillator, outputStream];
    };
    return UpRadioAudioService;
}());
exports.UpRadioAudioService = UpRadioAudioService;
