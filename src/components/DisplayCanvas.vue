<template>
    <div class="game-parent">
        <h1>Proof of Human Work</h1>
        <h3>Уровень {{ this.address }}</h3>
        <div>
            <div class="send-word-parent" v-if="userLevel < level">
                Введи то что ты видишь в хаосе ({{ currentWordLen }} букв):
                <input type="text" placeholder="" v-model="currentWord">
                <button @click="sendWord">Send</button>
            </div>

            <div class="send-word-success" v-if="userLevel >= level">
                Эта уровень пройден
                <button @click="nextWord" v-if="hasNext">Следующий</button>
            </div>

            <div class="canvas-parent">
                <canvas id="canvas" width="200" height="200"></canvas>

                <div class="pos">
                    <span>X: {{ x }}</span>
                    <span>  Y: {{ y }}</span>
                </div>
            </div>
            <div class="top" v-if="top">
                <h3>Ваш уровень {{ this.userLevel }}</h3>
                <h3>Топ</h3>
                <div class="top-item" v-for="item in top">
                    <span v-if="item.max"><b>Победитель: </b></span>
                    <span v-if="!item.max">Уровень {{ item.level }}:   </span>
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
            currentWordLen: 0,
            top: null,
            topLoading: false,
        };
    },

    methods: {
        async loadAndDraw() {
            console.log(this.currentAddress);
            const currentImage = data.images[this.currentAddress];
            this.currentWordLen = currentImage.word_len;

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

            Web3Wrapper.addWords();
            // Web3Wrapper.sendWord(this.address, this.currentWord.toLowerCase());
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
        },

        wordLen() {
            if (this.currentAddress) {
                return data.images[this.currentAddress].word_len;
            }
            return 0;
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
    text-align: left;

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

.send-word-parent, .send-word-success {
    text-align: left;
}

.send-word-success {
    color: green;
}

.pos {
    position: absolute;
    top: 410px;
    left: 0px
}
</style>
