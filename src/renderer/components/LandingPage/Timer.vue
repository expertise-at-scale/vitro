<template>
  <v-layout row class="my-5">
    <v-flex sm12>
      <v-card raised>
        <v-card-title primary-title>
          <div>
            <h5 class="grey--text">{{ title }}</h5>
            <div class="headline">{{ timer }}</div>
          </div>
        </v-card-title>
        <v-alert v-model="alert" outline type="success" dismissible v-if="complete">
          Your {{ type }} timer finished as of {{ new Date().toLocaleTimeString() }}
        </v-alert>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  props: {
    duration: Number,
    title: String,
    type: String,
  },
	data() {
		return {
      timer: null,
      complete: false,
      alert: true,
		};
  },
  mounted() {
    this.$nextTick(() => {
      this.setTimer(this.duration);
    });
  },
  methods: {
    setTimer(duration) {
			let remainingTime = duration;

      const timerInterval = setInterval(() => {
				let minutes = parseInt(remainingTime / 60, 10);
				let seconds = parseInt(remainingTime % 60, 10);
				minutes = minutes < 10 ? `0${minutes}` : minutes;
				seconds = seconds < 10 ? `0${seconds}` : seconds;

				this.timer = `${minutes}:${seconds}`;

				if (--remainingTime < 0) { // eslint-disable-line no-plusplus
          clearInterval(timerInterval);
          this.$emit('timer-finished');
          this.complete = true;
				}
			}, 1000);
		},
  },
};
</script>

<style scoped>
  .title {
    color: #888;
    font-size: 18px;
    font-weight: initial;
    letter-spacing: .25px;
    margin-top: 10px;
  }

  .items { margin-top: 8px; }

  .item {
    display: flex;
    margin-bottom: 6px;
  }

  .item .name {
    color: #6a6a6a;
    margin-right: 6px;
  }

  .item .value {
    color: #35495e;
    font-weight: bold;
  }
</style>
