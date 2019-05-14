import { EventEmitter } from 'events';
import CBuffer from 'CBuffer';
const hark = require('hark');


export default class Microphone extends EventEmitter {
	constructor(sampleRate = 16000) {
		super();

		this.rawStream = null;
		this.stream = null;
		this.audioProcessor = null;

		this.audioContext = new AudioContext();
		this.bufferSize = 4096;

		this.runningBuffer = new CBuffer(4);

		this.sampleRate = sampleRate;

		this.muted = false;

		this.open();
	}

    /**
     * Opens & initializes the Microphone stream from the browser
     */
	open() {
		navigator.mediaDevices.getUserMedia({
			audio: true,
			video: false,
		}).then((rawStream) => {
			this.rawStream = rawStream;
			this.stream = this.audioContext.createMediaStreamSource(this.rawStream);

			this.audioProcessor = this.audioContext.createScriptProcessor(this.bufferSize, 1, 1);
			this.audioProcessor.onaudioprocess = event => this.onAudioProcess(event);

			this.stream.connect(this.audioProcessor);
			this.audioProcessor.connect(this.audioContext.destination);

			const options = {
				threshold: -40,
			};
			const speechEvents = hark(rawStream, options);
			speechEvents.on('speaking', () => {
                this.speechDetected = true;
                this.enabled = true; // in the future, this might need to be enabled only after the agent's response is finished coming through the headphones.
				console.log('speaking');
			});

			speechEvents.on('stopped_speaking', () => {
                console.log('stopped_speaking');
                // this.speechDetected = false;
			});
		});
	}

    /**
     * Processes the audio to be ready for Google.
     *
     * @param event event
     */
	onAudioProcess(event) {
		let data = event.inputBuffer.getChannelData(0);
		if (!(this.enabled && this.speechDetected && !this.muted)) {
			// this.runningBuffer.push(data);
			return;
		}
		// return;
		// if (this.runningBuffer.length > 0) {
		// 	const bufferLength = (4096 * 4) + data.length;
		// 	const finalBuff = new Float32Array(bufferLength);
		// 	const arr = this.runningBuffer.toArray();
		// 	for (let i = 0; i < arr.length; i++) { // eslint-disable-line no-plusplus
		// 		finalBuff.set(arr[i], i * 4096);
		// 	}
		// 	finalBuff.set(data, arr.length * 4096);

		// 	data = this.downsampleBuffer(finalBuff);
		// 	this.runningBuffer.fill(null).empty();
		// } else {
			data = this.downsampleBuffer(data);
		// }
        // [TODO]: Implement piping?
        this.emit('data', data);
	}

    /**
     * Downsamles the buffer if needed to right sampleRate & converts the data into an int16 buffer
     *
     * @param buffer buffer
     */
	downsampleBuffer(buffer) {
		if (this.audioContext.sampleRate === this.sampleRate) {
			return buffer;
		}
		const sampleRateRatio = this.audioContext.sampleRate / this.sampleRate;
		const newLength = Math.round(buffer.length / sampleRateRatio);
		const result = new Int16Array(newLength);
		let offsetResult = 0;
		let offsetBuffer = 0;
		while (offsetResult < result.length) {
			const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
			let accum = 0;
			let count = 0;
			for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i += 1) {
				accum += buffer[i];
				count += 1;
			}
			result[offsetResult] = Math.min(1, accum / count) * 0x7FFF;
			offsetResult += 1;
			offsetBuffer = nextOffsetBuffer;
		}
		return result.buffer;
	}
}
