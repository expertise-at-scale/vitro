<template>
  	<div id="wrapper">
		<v-app>
			<v-footer flat app inset height="100" v-bind:class="{ listening: listening, transcriptionFooter: true, muted: muted}">
				<v-flex row xs12>
					<h1 class="muteLabel" v-if="muted">
						<v-icon>mic_off</v-icon>
						MICROPHONE MUTED
					</h1>
					<v-toolbar-title>{{ transcription }}</v-toolbar-title>
				</v-flex>
				

				<!-- <transcription v-bind:transcription="transcription" v-if="transcription"/> -->
			</v-footer>
			<v-navigation-drawer permanent app width="400" class="stepSidebar">
				<v-toolbar flat class="transparent">
					<v-list class="pa-0">
					<v-list-tile avatar>
						<v-list-tile-content>
							<v-list-tile-title class="logo">VITRO</v-list-tile-title>
						</v-list-tile-content>
					</v-list-tile>
					</v-list>
				</v-toolbar>
				<v-list class="pt-0">
					<v-divider></v-divider>
					<v-list-tile v-for="(step, index) in outlineSteps" :key="index" v-bind:class="{ activeStep: index == currentStepIndex, completedStep: index < currentStepIndex }">
						<v-list-tile-action>
							<template>
								{{ index + 1 }}
							</template>
						</v-list-tile-action>
						<v-list-tile-content>
							<v-list-tile-title class="stepShorthand">{{ step.shorthand }}</v-list-tile-title>
						</v-list-tile-content>
					</v-list-tile>
				</v-list>
			</v-navigation-drawer>
			<v-content class="mainContent">
				<v-container>
					<v-layout row>
						<v-flex sm12>
							<assistant-step-new v-bind="step" v-if="step"/>
						</v-flex>
					</v-layout>
				</v-container>
			</v-content>
			<v-navigation-drawer
				class="widgets"
				fixed
				right
				stateless
				permanent
				floating 
				app
				clipped
			>
				<v-container>
					<timer v-bind:duration="timer.duration" v-bind:title="timer.title" v-on:timer-finished="playBeep(timer.type)" v-if="timer"/>
					<filename-guide v-bind:magnification="filenameStep.magnification" v-if="filenameStep" />
					<flask-label-guide v-if="flaskLabelGuide" />
					<video-aspirate v-if="videoAspirate" />
				</v-container>
			</v-navigation-drawer>
		</v-app>
	</div>
</template>



<script>
import Authentication from '@/auth';
import AssistantStep from './LandingPage/AssistantStep';
import AssistantStepNew from './LandingPage/AssistantStepNew';
import Assistant from '../assistant/index';
import Timer from './LandingPage/Timer';
import FilenameGuide from './LandingPage/FilenameGuide';
import FlaskLabelGuide from './LandingPage/FlaskLabelGuide';
import VideoAspirate from './LandingPage/VideoAspirate';
import Speech from './LandingPage/Speech';

export default {
	name: 'LandingPage',
	components: {
		AssistantStep,
		AssistantStepNew,
		Timer,
		FilenameGuide,
		FlaskLabelGuide,
		VideoAspirate,
		Speech,
	},
	data: () => ({
		assistantDisplay: null,
		steps: [],
		step: null,
		transcription: null,
		listening: false,
		timer: null,
		filenameStep: null,
		flaskLabelGuide: null,
		videoAspirate: null,
		muted: null,
	}),
	mounted() {
		this.$nextTick(() => {
			Window.Auth = new Authentication();
			Window.Auth.once('authenticated', () => {
				Window.Assistant = new Assistant();
				Window.Assistant.on('responseData', (data) => {
					this.steps.push(data);
					this.step = data;
					if (data.timer) {
						this.timer = data.timer;
					}
					if (data.stepHeader) {
						// extract index
						const stepNum = data.stepHeader.match(/\d+/g)[0];
						const stepIndex = parseInt(stepNum) - 1;
						this.$store.commit('SET_CURRENT_STEP', stepIndex);
						console.log('STEP INDEX');
						console.log(stepIndex);
						if (stepIndex === 7) {
							this.filenameStep = {
								magnification: 4,
							};
						} else if (stepIndex === 8) {
							this.filenameStep = {
								magnification: 10,
							};
						} else if (stepIndex === 24) {
							this.flaskLabelGuide = true;
						} else if (stepIndex === 14) {
							this.videoAspirate = false;
						} else {
							this.filenameStep = null;
							this.flaskLabelGuide = null;
							this.videoAspirate = null;
						}
					}
				});
				Window.Assistant.on('transcription', (transcription) => {
					this.updateTranscription(transcription);
				});
				Window.Assistant.on('userUtterance', (finalTranscription) => {
					const userResponse = {
						misc: [finalTranscription],
					};
					this.steps.push(userResponse);
				});
				Window.Assistant.on('listening', () => {
					this.listening = true;
				});
				Window.Assistant.on('ended', () => {
					this.listening = false;
				});

				Window.Assistant.on('muted', () => {
					this.muted = true;
					this.listening = false;
				});

				Window.Assistant.on('unmuted', () => {
					this.muted = false;
					this.listening = false;
				});

				Window.Assistant.once('ready', () => {
					const skipToStep = this.$store.state.Session.startingStep;
					if (skipToStep) {
						Window.Assistant.say(`Talk to Vitro about step ${skipToStep}`);
					} else {
						Window.Assistant.say('Talk to Vitro');
					}
				});
			});
			Window.Auth.authenticate();
		});
	},
	methods: {
		updateTranscription(transcription) {
			this.transcription = transcription;
		},
		playBeep(type) {
			Window.Assistant.player.playTimerBeep(type);
			if (type === 'centrifuge') {
				Window.Assistant.say('Skip to step 28');
			}
		},
		checkForStartingStep() {

		},
	},
	computed: {
		count() {
			return this.$store.state.Counter.main;
		},
		outlineSteps() {
			return this.$store.state.ProtocolSteps.steps;
		},
		currentStepIndex() {
			return this.$store.state.ProtocolSteps.currentStep;
		},
		startingStep() {
			return this.$store.state.Session.startingStep;
		},
		stepWidth() {
			let className = '';
			if (this.timer) {
				className = 'ma-12';
			} else {
				className = 'ma-4';
			}
			return className;
		},
	},
};
</script>

<style>
	* {
			box-sizing: border-box;
			margin: 0;
			padding: 0;
	}

	#assistant {
			width: 100%;
			height: 100vh;
			border: 0;
	}

	#transcription {
		width: 100%;
		color: #000;
	}

	#assistant-main-cards {
		display: block !important;
	}

	/* Override Google's styles */
	#assistant-shadow {
		display: none;
	}

	#assistant-bar {
		display: none !important;
	}

	#assistant-card-content {
		background: linear-gradient(-180deg,rgba(0,0,0,0.0) 0%,rgba(0,0,0,0.8) 100%);
	}

	.micIsHot {
		background-color: #80cbc4 !important;
		color: #fff !important;
	}

	.micWaves {
		position: fixed;
		bottom: 0px;
	}

	.logo {
		font-weight: 800;
		text-align: center;
		letter-spacing: 0.3em;
		font-size: 1.2em;
	}

	.widgets {
		background-color: transparent !important;
	}

	.activeStep {
		background-color: #7b1f65;
		color: #fff;
	}

	.completedStep > div > div > .stepShorthand {
		color: rgba(0,0,0,0.54);
		text-decoration: line-through;
	}

	.stepSidebar {
		background-color: #f5f5f5 !important;
	}

	.mainContent {
		background-color: #fff;
	}

	.transcriptionFooter {
		border-top: 1px solid #ccc;
		background: #fff !important;
	}

	.listening {
		background: #61d6bb !important;
	}

	.muted {
		background: #FFC107 !important;
	}

	.muteLabel {
		color: #fff;
		text-align: center;
		letter-spacing: 0.1em;
	}

	.muteLabel > i {
		color: #fff !important;
	}

</style>
