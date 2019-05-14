// eslint-disable-next-line
import { EventEmitter } from 'events';
import GoogleAssistant from 'google-assistant';
import Mousetrap from 'mousetrap';
import Configuration from '@/config';
import Microphone from './microphone';
import Player from './player';

export default class Assistant extends EventEmitter {
	constructor() {
        super();

        /** Audio player for Google Assistant responses */
		this.player = new Player();
		this.initialized = false;

		this.microphone = new Microphone(Configuration.assistant.audio.sampleRateIn);

		this.assistant = new GoogleAssistant(Configuration.auth);

		this.startConversation = (conversation) => {
			this.conversation = conversation;
			this.conversation.forceEnded = false;
			console.log('[Assistant SDK]', 'Starting conversation...');

			this.microphone.enabled = true;
			if (this.initialized) {
				this.player.reset();
			}

			conversation.on('audio-data', (data) => { // eslint-disable-line no-unused-vars
                // if (this.disableOutput) return;
				console.log('incoming audio buffer...');
                this.player.appendBuffer(Buffer.from(data));
			});

			conversation.on('end-of-utterance', () => {
				this.microphone.enabled = false;
                // this.emit('waiting');
				console.log('end of utterance');
			});

			conversation.on('device-action', (data) => {
				console.log('Device action: ', data);
			});

			conversation.on('transcription', ({ transcription, done }) => {
				console.log('Transcription: ', transcription, done);
				this.emit('transcription', transcription);
				if (this.player.previousPlayer.readyState > 2) {
					this.player.previousPlayer.pause();
				}
				if (transcription === 'quit' && !conversation.forceEnded) {
					// console.log('NOOO DON\'T LEAVE');
					// console.log(conversation);
					// conversation.forceEnded = true;
					// conversation.emit('ended');
				}
                if (done) {
					console.log('done transcribing: ', transcription);

					// Add transcription as card
					this.emit('userUtterance', transcription);
				}
			});

			conversation.on('response', (text) => {
                // if (this.disableOutput) return;
				console.log('HERE IS THE RESPONSE');
				console.log(text);
			});

			conversation.on('screen-data', ({ format, data }) => {
                // if (this.disableOutput) return;

				switch (format) {
				case 'HTML': {
					// step label class: 'KN7Wie pIpgAc lrS5H XO51F OAX6kd'
					// step text classes: 'DA9Mke pIpgAc KKgUze XO51F xsLG9d'
					// image class: 'Ac3v0e'
					// image label class: 'pIpgAc KKgUze gWx9Bc xsLG9d'
					const responseData = this.sanitize(data.toString());
					this.emit('responseData', responseData);
					console.log(responseData);
					break;
				}
				default:
					console.log('Error: unknown data format.');
				}
			});

			conversation.on('ended', (error = undefined, followOn = false) => { // eslint-disable-line no-unused-vars
				console.log('[Assistant SDK]', 'Conversation ended...');
                // this.followOn = !Configuration.assistant.textQuery ? followOn : false;
                this.microphone.enabled = false;
                this.microphone.speechDetected = false;
				this.emit('ended');

				if (error) {
					console.log('Conversation error', error);
                } else {
                    console.log('Agent finished responding. Awaiting additional user request:');
                }
				console.log(this.conversation);
                this.conversation = undefined;
			});

			Mousetrap.bind('option+m', () => {
				console.log('muted!!!');
				console.log(this.microphone);
				this.microphone.muted = true;
				this.emit('muted');
			});
			Mousetrap.bind('option+u', () => {
				console.log('unmuted!!!');
				this.microphone.muted = false;
				this.emit('unmuted');
			});

			this.initialized = true;
        };

		this.microphone.on('data', (data) => {
			this.emit('listening');
			const buffer = Buffer.from(data); // eslint-disable-line no-unused-vars
			// console.log(buffer);
            console.log('receiving data');
            if (this.conversation) {
                this.conversation.write(buffer);
            } else {
                this.assistant.start(Configuration.assistant);
                this.conversation.write(buffer);
			}
		});

		this.assistant.on('ready', () => {
			console.log('[Assistant SDK]', 'Ready...');
			this.emit('ready');
            // this.assistant.start(Configuration.assistant);
		});

		this.assistant.on('error', (error) => {
			console.log('[Assistant SDK]', error);
		});

		this.assistant.on('started', this.startConversation);
	}

	say = (text) => {
		Configuration.assistant.textQuery = text;
		this.assistant.start(Configuration.assistant);
		delete Configuration.assistant.textQuery; // Ensures that future bot invocations aren't expecting a textQuery instead
	};

	sanitize = (rawHtml) => { // eslint-disable-line class-methods-use-this
        const tmp = document.implementation.createHTMLDocument();
		tmp.body.innerHTML = rawHtml;
        const nodeIterator = tmp.createNodeIterator(
            tmp.body,
            NodeFilter.SHOW_ELEMENT,
            function (node) { // eslint-disable-line prefer-arrow-callback
				// console.log(node.firstElementChild);
				if (node.firstElementChild) {
					return NodeFilter.FILTER_REJECT;
				}
				const nodeName = node.nodeName.toLowerCase();

				const acceptableImg = (nodeName === 'img' && node.src !== 'https://www.gstatic.com/actions/devices_platform/assistant_tv_logo.svg');
				const acceptableText = ((nodeName === 'div' || nodeName === 'span') && node.innerHTML.trim() !== '' && node.id !== 'suggestion_header');

                return (acceptableImg || acceptableText) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
            },
		);

		const relevantElems = {
			images4x: [],
			images10x: [],
			misc: [],
			timer: null,
		};
		let nextNode = nodeIterator.nextNode();
		let currentNode = nextNode;

        while (currentNode) { // eslint-disable-line no-cond-assign
			currentNode.style = null;
			nextNode = nodeIterator.nextNode();
			// Step header
			console.log(currentNode);
			if (currentNode.classList.contains('KN7Wie')) {
				relevantElems.stepHeader = currentNode.innerText;
				// Hacky special cases for steps corresponding to timers:
				if (relevantElems.stepHeader === 'Step 18') {
					relevantElems.timer = {
						type: 'incubator',
						title: 'Cells in incubator',
						duration: 5 * 60, // duration is in seconds: this represents 10 min
					};
				} else if (relevantElems.stepHeader === 'Step 24') {
					relevantElems.timer = {
						type: 'centrifuge',
						title: 'Cells in centrifuge',
						duration: 10 * 60, // duration is in seconds: this represents 5 min
					};
				}
			// Step text
			} else if (currentNode.classList.contains('DA9Mke')) {
				console.log(currentNode);
				relevantElems.stepContent = currentNode.innerText;
			// Images
			} else if (currentNode.className === 'Ac3v0e') {
				const biggerImg = currentNode.src.replace('=w388-h216', '');
				const labelForImg = (nextNode ? nextNode.innerText : '');
				if (labelForImg.endsWith('4x')) {
					relevantElems.images4x.push(biggerImg);
				} else if (labelForImg.endsWith('10x')) {
					relevantElems.images10x.push(biggerImg);
				} else {
					relevantElems.images4x.push(biggerImg);
				}
			// Uncategorized text
			} else {
				relevantElems.misc.push(currentNode.innerText);
			}
			currentNode = nextNode;
        }
        return relevantElems;
	}
}
