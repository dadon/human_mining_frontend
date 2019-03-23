<template>
    <div class="canvas-parent">
        <canvas id="canvas"></canvas>
    </div>
</template>

<script>
import ImageLoader from "../utils/ImageLoader";


export default {
    name: "DisplayCanvas",
    props: {
        address: String
    },

    data() {
        return {};
    },

    methods: {
        async loadAndDraw() {
            // load image
            const image = await ImageLoader.loadImageAsync("logo.png");
            console.log(image);

            // draw
            const ctx = this.canvas.getContext("2d");
            ctx.drawImage(image.image, 10, 10);
        }
    },

    computed: {},

    mounted() {
        this.canvas = document.getElementById("canvas");
        this.currentAddress = this.address;
        this.loadAndDraw();
    },

    watch: {
        address: function() {
            this.currentAddress = this.address;
            this.loadAndDraw();
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.canvas-parent {
    position: relative;
    margin: auto;
    width: 800px;
    height: 600px;

    /*background: url("../assets/logo.png");*/
}
</style>
