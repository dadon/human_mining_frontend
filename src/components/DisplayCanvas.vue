<template>
    <div class="game-parent">
        <h1>Proof of Human</h1>
        <h3>Level {{ this.address }}</h3>
        <h3>User level {{ this.userLevel }}</h3>
        <div>
            <div class="send-word-parent" v-if="userLevel < level">
                <input type="text" placeholder="Enter the word" v-model="currentWord">
                <button @click="sendWord">Send</button>
            </div>

            <div class="send-word-success" v-if="userLevel >= level">
                Already Solved
                <button @click="nextWord" v-if="hasNext">Next</button>
            </div>

            <div class="canvas-parent">
                <div>
                    <span>X: {{ x }}</span>
                    <span>  Y: {{ y }}</span>
                </div>
                <canvas id="canvas" width="200" height="200"></canvas>
            </div>
            <div class="top" v-if="top">
                <h3>First owners</h3>
                <div class="top-item" v-for="item in top">
                    <span>Level {{ item.level }}</span>
                    <span v-if="item.name">{{ item.name }}</span>
                    <span v-if="!item.name">{{ item.address }}</span>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import ImageLoader from "../utils/ImageLoader";
import Web3Wrapper from "../Web3Wrapper";
import data from "../assets/data";
import {mapState} from "vuex";
import store from "../store";
import Misc from "../utils/Misc";


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

Web3Wrapper.init();



export default {
    name: "DisplayCanvas",
    props: {
        address: String
    },

    store: store,

    data() {
        return {
            img1Data: null,
            img2Data: null,
            ctx: null,
            x: 0,
            y: 0,
            currentWord: null,
            top: null,
            topLoading: false,
        };
    },

    methods: {
        async loadAndDraw() {
            console.log(this.currentAddress);
            const currentImage = data.images[this.currentAddress];
            console.log(currentImage);

            const image1 = await ImageLoader.loadImageAsync("images/" + currentImage.num + "_back.png");
            const image2 = await ImageLoader.loadImageAsync("images/" + currentImage.num + "_front.png");
            this.img1Data = image1.image;
            this.img2Data = image2.image;
            this.ctx = this.canvas.getContext("2d");

            this.canvas.addEventListener("mousemove", this.onMouseMove);

            requestAnimationFrame(this.update);
        },

        async loadTop() {
            if (this.top != null) return;
            this.topLoading = true;
            await Misc.sleep(2000);
            this.top = await Web3Wrapper.getTop();
        },

        onMouseMove(e) {
            // console.log(e);
            const pixelRatio = window.devicePixelRatio || 1;
            const bounds = this.canvas.getBoundingClientRect();
            let x = (e.x - bounds.left - this.canvas.clientLeft);
            let y = (e.y - bounds.top - this.canvas.clientTop);
            this.x = Math.floor(x - this.img2Data.width);
            this.y = Math.floor(y - this.img2Data.height);

            // console.log(this.x, this.y);
        },

        update() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.globalCompositeOperation = "exclusion";
            this.ctx.drawImage(this.img1Data, 0, 0, this.img1Data.width, this.img1Data.height);
            this.ctx.drawImage(this.img2Data, this.x, this.y, this.img2Data.width, this.img2Data.height);
            requestAnimationFrame(this.update);
        },

        sendWord() {
            console.log(this.currentWord);

            // Web3Wrapper.addWords();
            Web3Wrapper.sendWord(this.address, this.currentWord.toLowerCase());
        },

        nextWord() {
            let nextLevel = this.level + 1;
            if (nextLevel > 100) nextLevel = 100;
            this.$router.push({ name: 'level', params: { address: nextLevel.toString() }})
        },
    },

    computed: {
        ...mapState([
            "userLevel"
        ]),

        level() {
            return parseInt(this.address);
        },

        maxLevel() {
            return 100;
        },

        hasNext() {
            return this.level < this.maxLevel;
        }
    },

    mounted() {
        this.canvas = document.getElementById("canvas");
        this.currentAddress = this.address || "1";

        this.loadAndDraw();
        this.loadTop();
    },

    watch: {
        address: function() {
            this.currentAddress = this.address || "1";
            this.loadAndDraw();
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.game-parent {
    position: relative;
    margin: auto;
    width: 800px;
    height: 600px;
}

.canvas-parent {
    position: relative;
    float: left;
    width: 400px;
    height: 400px;

    /*background: url("../assets/logo.png");*/
}

.canvas-parent canvas {
    transform: scale(2);
    transform-origin: 0 0;
    image-rendering: -moz-crisp-edges;
    image-rendering: -webkit-crisp-edges;
    image-rendering: pixelated;
    image-rendering: crisp-edges;
}
</style>
