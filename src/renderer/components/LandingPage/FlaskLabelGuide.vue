<template>
    <v-layout row class="mb-3">
        <v-flex>
            <v-flex sm12>
                <v-card raised> 
                    <v-card-title primary-title>
                        <h5 class="grey--text mb-3">How to label your new flask</h5>

                        <div class="flask">
                            <div>3T3</div>
                            <div>{{ initials }}</div>
                            <div>P{{ passageNum }}(?)</div>
                            <div>{{ dateForFlask }}</div>
                            <div>{{ splitDilution }}</div>
                        </div>
                    </v-card-title>
                </v-card>
            </v-flex>
        </v-flex>
    </v-layout>
</template>

<script>
    export default {
        props: {
            magnification: Number,
        },
        computed: {
            dateForFlask() {
                return new Date().toLocaleDateString('en-US');
            },
            passageNum() {
                return this.$store.state.Session.passageNum;
            },
            splitDilution() {
                return this.$store.state.Session.splitDilution;
            },
            initials() {
                return this.$store.state.Session.initials;
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

  .flask {
    background: #7b1f65;
    clip-path: polygon(0 0, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 0 100%);
    padding: 15px;
    width: 200px;
  }

  .flask > div {
      /* font-family: 'Kalam'; */
      color: #fff
  }
</style>
