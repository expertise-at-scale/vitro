// eslint-disable-next-line
import { remote } from 'electron';
import path from 'path';
import { installed as clientSecret } from './client_secret.json';

export default {
	auth: {
    /** [TODO]: Save tokens in local storage? */
    /** [TODO]: Better secure client secret in main process maybe? */
		key: clientSecret,
		keyFilePath: path.resolve(__dirname, 'client_secret.json'),
		savedTokensPath: path.join(remote.app.getPath('userData'), '/google.json'),
	},
	assistant: {
		audio: {
			sampleRateOut: 24000,
			sampleRateIn: 16000,
			encodingIn: 'LINEAR16',
			encodingOut: 'MP3',
		},
		lang: 'en-US',
		deviceId: 'ga-desktop',
		deviceModelId: 'ga-desktop-electron',
		screen: {
			isOn: true,
		},
	},
};
