<template>
    <div class="canvas-parent">
        <canvas id="canvas" width="800" height="800"></canvas>
    </div>
</template>

<script>
import ImageLoader from "../utils/ImageLoader";


// function getPixelRatio() {
//     if(!pixelRatio) {
//         pixelRatio = 1;
//
//         // To account for zoom, change to use deviceXDPI instead of systemXDPI
//         if(window.screen.systemXDPI !== undefined && window.screen.logicalXDPI !== undefined && window.screen.systemXDPI > window.screen.logicalXDPI) {
//             // Only allow for values > 1
//             pixelRatio = window.screen.systemXDPI / window.screen.logicalXDPI;
//         } else if(window.devicePixelRatio !== undefined) {
//             pixelRatio = window.devicePixelRatio;
//         }
//
//         if(pixelRatio > 2) pixelRatio = 2;
//     }
//
//     return pixelRatio;
// }

export default {
    name: "DisplayCanvas",
    props: {
        address: String
    },

    data() {
        return {
            img1Data: null,
            img2Data: null,
            ctx: null,
            x: 0,
            y: 0,
        };
    },

    methods: {
        async loadAndDraw() {
            // load image
            const image1 = await ImageLoader.loadImageAsync("out1.png");
            const image2 = await ImageLoader.loadImageAsync("out2.png");
            this.img1Data = image1.image;
            this.img2Data = image2.image;
            this.ctx = this.canvas.getContext("2d");

            this.pixelRatio =

            this.canvas.addEventListener("mousemove", this.onMouseMove);

            requestAnimationFrame(this.update);
        },

        onMouseMove(e) {
            // console.log(e);
            const pixelRatio = window.devicePixelRatio || 1;
            const bounds = this.canvas.getBoundingClientRect();
            let x = (e.x - bounds.left - this.canvas.clientLeft);
            let y = (e.y - bounds.top - this.canvas.clientTop);
            this.x = x - 128;
            this.y = y - 128;
        },

        update() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.globalCompositeOperation = "exclusion";
            this.ctx.drawImage(this.img1Data, 200, 200, 256, 256);
            this.ctx.drawImage(this.img2Data, this.x, this.y, 256, 256);
            requestAnimationFrame(this.update);
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
