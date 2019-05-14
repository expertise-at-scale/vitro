<template>
    <v-flex row xs12>
        <canvas id="waves"></canvas>
    </v-flex>
</template>

<script>
import { SineWaves } from 'sine-waves';
export default {
    props: {
    },
    mounted() {
        setTimeout(() => {
            const waves = new SineWaves({ // eslint-disable-line no-unused-vars
                el: document.getElementById('waves'),
                speed: 5,
                ease: 'SineInOut',
                wavesWidth: '100%',
                waves: [
                    {
                        timeModifier: 4,
                        lineWidth: 1,
                        amplitude: -25,
                        wavelength: 25,
                    },
                    {
                        timeModifier: 2,
                        lineWidth: 1,
                        amplitude: -10,
                        wavelength: 30,
                    },
                    {
                        timeModifier: 1,
                        lineWidth: 1,
                        amplitude: -30,
                        wavelength: 30,
                    },
                    {
                        timeModifier: 3,
                        lineWidth: 1,
                        amplitude: 40,
                        wavelength: 40,
                    },
                    {
                        timeModifier: 0.5,
                        lineWidth: 1,
                        amplitude: -60,
                        wavelength: 60,
                    },
                    {
                        timeModifier: 1.3,
                        lineWidth: 1,
                        amplitude: -40,
                        wavelength: 40,
                    },
                ],
                // Called on window resize
                resizeEvent() {
                    let gradient = this.ctx.createLinearGradient(0, 0, this.width, 0);
                    gradient.addColorStop(0, 'rgba(25, 255, 255, 0)');
                    gradient.addColorStop(0.5, 'rgba(255, 25, 255, 0.75)');
                    gradient.addColorStop(1, 'rgba(255, 255, 25, 0');
                    let index = -1;
                    let length = this.waves.length; // eslint-disable-line prefer-destructuring
                    while (++index < length) { // eslint-disable-line no-plusplus
                        this.waves[index].strokeStyle = gradient;
                    }
                    // Clean Up
                    index = undefined;
                    length = undefined;
                    gradient = undefined;
                },
            });
        }, 100);
    },
    methods: {

    },
};
</script>

<style scoped>
    #waves {
        display: flex;
        width: 100% !important;
        height: 125px !important;
    }
</style>
