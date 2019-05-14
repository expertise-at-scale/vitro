<template>
    <v-flex mb-3>
        <v-card hover>
            <v-card-title primary-title v-if="stepHeader">
                <div>
                    <div>{{ stepHeader }}</div>
                </div>
            </v-card-title>
            <v-card-text>
                <h1 class='mdc-typography--headline1'>{{ stepContent }}</h1>
                <h1 class = 'mdc-typography--headline1' v-for="message of misc" :key="message.id">{{ message }}</h1>
            </v-card-text>
            <v-container grid-list-sm fluid>
                <v-layout row wrap>
                    <v-carousel hide-controls hide-delimiters interval="3000" v-if="images4x && images4x.length > 0">
                        <v-carousel-item 
                            v-for="image of images4x" 
                            :src="image" 
                            :key="image.id">
                        </v-carousel-item>
                    </v-carousel>
                    <v-carousel hide-controls hide-delimiters interval="3000"  v-if="images10x && images10x.length > 0">
                        <v-carousel-item 
                            v-for="image of images10x" 
                            :src="image" 
                            :key="image.id">
                        </v-carousel-item>
                    </v-carousel>
                </v-layout>
            </v-container>
        </v-card>
    </v-flex>
</template>

<script>
export default {
    props: {
        stepHeader: String,
        stepContent: String,
        images4x: Array,
        images10x: Array,
        misc: Array,
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

</style>
