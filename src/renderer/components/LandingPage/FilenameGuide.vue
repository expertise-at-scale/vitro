<template>
  <v-layout row>
    <v-flex>
      <v-card>
        <v-card-title primary-title>
          <div>
            <h5 class="grey--text">How to name your image files</h5>
            <div class="headline filename">3T3_{{ magnification }}x_{{ confluency }}_P{{ passageNum }}(D)_{{ dateForFilename }}</div>
          </div>
        </v-card-title>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
    props: {
        magnification: Number,
    },
    computed: {
		dateForFilename() {
            let date = new Date().toLocaleDateString('en-US');
            date = date.replace(/\//g, '');
			return date;
        },
        confluency() {
			return this.$store.state.Session.confluency;
        },
        passageNum() {
			return this.$store.state.Session.passageNum;
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

  .filename {
    font-size: 18px !important;
    font-weight: 800 !important;
  }
</style>
