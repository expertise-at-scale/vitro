<template>
    <v-layout row class="mb-3">
        <v-flex>
            <v-flex sm12>
                <v-card raised> 
                    <v-card-title primary-title>
                        <h5 class="grey--text mb-3">How to aspirate media from a flask</h5>

                        <video id="videoElement" autoplay controls muted loop>
                            <source src="static/aspirate.mp4" type="video/mp4"> 
                            <p>Sorry, there's a problem playing this video. Please try using a different browser.</p>
                        </video>
                    </v-card-title>
                </v-card>
            </v-flex>
        </v-flex>
    </v-layout>
</template>

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
