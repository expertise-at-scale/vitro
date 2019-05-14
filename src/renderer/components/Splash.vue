

<template>
    <v-app>
        <v-content>
            <v-container fluid fill-height>
                <v-layout align-center justify-center>
                    <v-flex xs12 sm8 md4>
                        <v-form validate>
                            <v-card class="elevation-12">
                                <v-card-text>
                                    <v-flex xs12>
                                        <v-text-field
                                            v-model="name" 
                                            label="Participant ID"
                                            required
                                        />
                                    </v-flex>
                                    <v-flex xs12>
                                        <v-text-field
                                            v-model="passageNum" 
                                            label="Passage Number"
                                            required
                                        />
                                    </v-flex>
                                    <v-flex xs12>
                                        <v-text-field
                                            v-model="startingStep" 
                                            label="Starting Step"
                                        />
                                    </v-flex>
                                </v-card-text>
                                <v-card-actions>
                                    <v-btn to="landingPage" block color="primary">Start session</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-form>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
    export default {
        name: 'Splash',
        computed: {
            name: {
                get() {
                    return this.$store.state.Session.name;
                },
                set(value) {
                    this.$store.commit('SET_NAME', value);
                },
            },
            passageNum: {
                get() {
                    return this.$store.state.Session.passageNum;
                },
                set(value) {
                    this.$store.commit('SET_PASSAGE_NUM', value);
                },
            },
            startingStep: {
                get() {
                    return this.$store.state.Session.startingStep;
                },
                set(value) {
                    this.$store.commit('SET_STARTING_STEP', value);
                },
            },
        },
        methods: {
            updateName(e) {
                this.$store.commit('SET_NAME', e.target.value);
            },
            updatePassageNum(e) {
                this.$store.commit('SET_PASSAGE_NUM', e.target.value);
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
      background: green;
      clip-path: polygon(0 0, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 0 100%);
  }

  .flask > div {
      font-family: 'Kalam';
      color: #616161
  }
</style>
