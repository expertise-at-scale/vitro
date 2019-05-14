<template>
        <v-flex xs12>
            <div id="transcription">
                {{ transcription }}
            </div>
        </v-flex>
</template>

<script>
export default {
    props: {
        transcription: String,
    },
    methods: {

    },
};
</script>

<style scoped>
    #transcription {
        background-color: #ffffff;
        float: right;
        margin: 5px 20px 5px 17%;
        border-radius: 6px;
        display: block;
        padding: 10px 15px 5px 15px;
        position: relative;
        clear: both;
        border: 1px solid #000;
    }

    #transcription::before {
        content: "\00a0";
        display: block;
        height: 12px;
        position: absolute;
        top: 12px;
        transform: rotate(30deg) skew(-35deg);
        width: 15px;
        background-color: #ffffff;
        right: -9px;
        border-right: 1px solid #000;
        border-top: 1px solid #000;
    }

</style>
