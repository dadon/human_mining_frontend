import MetaCoin from "./abi/MetaCoin";

const Web3 = require("web3");

export default {
    async init() {
        await ethereum.enable();

        try {
            this.web3 = new Web3(ethereum);
        } catch (e) {
            console.error("web3 is not defined");
            return;
        }

        const accounts = await this.web3.eth.getAccounts();
        const option = {from: accounts[0]};

        const Token = new this.web3.eth.Contract(MetaCoin.main, "0xc9056851c74d5d6991cdc4f1769f524fe528a143");
        // Token.events.Transfer({fromBlock: 0}, (error, event) => { console.log(error, event); });
        this.web3.eth.getTransactionReceipt("0xbbf155a1365c8d170ed06b901ee9405d7b28150b71ccdfc16993692dadbe6d70", (error, event) => {
            // console.log(error, event);
            // console.log(Token.events.Transfer.returnValues);
        });

        this.web3.eth.getTransaction("0xbbf155a1365c8d170ed06b901ee9405d7b28150b71ccdfc16993692dadbe6d70", (error, event) => {
            console.log(error, event);
            // console.log(Token.events.Transfer.returnValues);
        });

        // Token.getPastEvents("allEvents", {fromBlock: 0, toBlock: "latest"}, (error, event) => { console.log(error, event); });

        // Token.methods.createTokenType("25,25|dolphin", "image_url").send(option, (error, result) => {
        //     console.log(error, result);
        // });

        // Token.methods.claimToken(1, "25,25|dolphывывin").send(option, (error, result) => {
        //     console.log(error, result);
        // });

        // Token.methods.ownerOf(1).call(option, (error, result) => {
        //     console.log(error, result);
        // });

        // console.log("MetaCoin", MetaCoin);
    },


}