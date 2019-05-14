<template>
    <v-container>
        <v-layout row class="ma-4">
            <v-flex xs12>
                <h2 class="stepHeader mb-5" v-if="stepHeader">
                    {{ stepHeader.toUpperCase() }}
                </h2>
                <h1>{{ stepContent }}</h1>
                
                <h1 v-for="message of misc" :key="message.id" v-if="images4x.length == 0">{{ message }}</h1>
                <v-layout row>
                <v-flex xs6>
                    <h4 class="mb-2" v-if="images4x && images4x.length > 0">4x magnification</h4>
                    <v-carousel hide-controls hide-delimiters interval="3000" v-if="images4x && images4x.length > 0">
                        <v-carousel-item 
                            v-for="image of images4x" 
                            :src="image" 
                            :key="image.id">
                        </v-carousel-item>
                    </v-carousel>
                </v-flex>
                <v-flex xs6 class="ml-4">
                    <h4 class="mb-2" v-if="images10x && images10x.length > 0">10x magnification</h4>
                    <v-carousel hide-controls hide-delimiters interval="3000"  v-if="images10x && images10x.length > 0">
                        <v-carousel-item 
                            v-for="image of images10x" 
                            :src="image" 
                            :key="image.id">
                        </v-carousel-item>
                    </v-carousel>
                </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
    props: {
        stepHeader: String,
        stepContent: String,
        images4x: Array,
        images10x: Array,
        misc: Array,
        timer: Object,
    },
    mounted() {
        // whenever data changes and the component re-renders, this is called.
        this.scrollToBottom();
    },
    methods: {
        scrollToBottom() {
            setTimeout(() => {
                // scroll to the start of the last message
                window.scrollTo({
					top: this.$el.offsetTop,
					behavior: 'smooth',
				});
            }, 2);
		},
    },
};
</script>

<style scoped>
    h1 {
        font-size: 50px;
        color: #333333;
        font-weight: 700;
    }

    .stepHeader {
        font-size: 25px;
        font-weight: 300;
        letter-spacing: 0.1em;
    }
</style>
