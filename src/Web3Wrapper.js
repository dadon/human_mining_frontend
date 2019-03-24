import MetaCoin from "./abi/MetaCoin";
import store from "./store";
import Misc from "./utils/Misc";

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
        this.account = accounts[0];
        const option = { from: accounts[0] };

        this.contract = new this.web3.eth.Contract(MetaCoin.main, "0x4ad0765e7116dd567ca4bea0dabf783e2c342ef6");

        this.updateUserLevel();

        this.checkPendingTransactions();
        // Token.events.Transfer({fromBlock: 0}, (error, event) => { console.log(error, event); });
        // this.web3.eth.getTransactionReceipt("0xbbf155a1365c8d170ed06b901ee9405d7b28150b71ccdfc16993692dadbe6d70", (error, event) => {
        //     // console.log(error, event);
        //     // console.log(Token.events.Transfer.returnValues);
        // });
        //
        // this.web3.eth.getTransaction("0xbbf155a1365c8d170ed06b901ee9405d7b28150b71ccdfc16993692dadbe6d70", (error, event) => {
        //     console.log(error, event);
        //     // console.log(Token.events.Transfer.returnValues);
        // });

        // Token.getPastEvents("allEvents", {fromBlock: 0, toBlock: "latest"}, (error, event) => { console.log(error, event); });

        // Token.methods.createTokenType("25,25|dolphin", "image_url").send(option, (error, result) => {
        //     console.log(error, result);
        // });

        // Token.methods.claimToken(1, "25,25|dolphывывin").send(option, (error, result) => {
        //     console.log(error, result);
        // });

        // this.contract.methods.ownerOf(2).call({from: accounts[0]}, (error, result) => {
        //     console.log(error, result);
        // });

        // this.contract.methods.getUnlockedTokens().call({ from: accounts[0] }, (error, result) => {
        //     console.log(error, result);
        // });

        // this.contract.methods.setName("Dima").send({ from: accounts[0] }, (error, result) => {
        //     console.log(error, result);
        // });

        this.getTop();

        // console.log("MetaCoin", MetaCoin);
    },

    updateUserLevel() {
        this.contract.methods.getLevel().call({ from: this.account }, (error, result) => {
            if (!error) {
                store.commit("userLevel", parseInt(result));
            } else {
                console.error("getUserLevel error", error);
            }
        });
    },

    // remove
    async addWords() {
        const secretData = require("./secret").default;

        for (let el of secretData.data) {
            await new Promise((resolve, reject) => {
                this.contract.methods
                    .setTokenType(el.num, el.word, el.word)
                    .send({ from: this.account }, (error, result) => {
                        if (!error) {
                            resolve(result);
                        } else {
                            reject(result);
                        }
                    });
            });

            await Misc.sleep(1000);
        }
    },

    sendWord(word_num, word) {
        // show warning about metamask

        console.log(parseInt(word_num), word);
        this.contract.methods.claimToken(parseInt(word_num), word).send({ from: this.account }, (error, result) => {
            if (!error) {
                this.addPendingTx(word_num, word, result);
            } else {
                console.error("sendWord error", error);
            }
        });
    },

    getPendingTx() {
        let pendingTransactions = localStorage.getItem("pendingTransactions");
        if (pendingTransactions) {
            pendingTransactions = JSON.parse(pendingTransactions);
        } else {
            pendingTransactions = [];
        }

        return pendingTransactions;
    },

    setPendingTx(data) {
        localStorage.setItem("pendingTransactions", JSON.stringify(data));
    },

    addPendingTx(word_num, word, txHash) {
        let pendingTransactions = this.getPendingTx();
        pendingTransactions.push({
            word_num: word_num,
            word: word,
            txHash: txHash
        });
        this.setPendingTx(pendingTransactions);
        this.checkPendingTransactions();
    },

    removePendingTx(txHash) {
        let pendingTransactions = this.getPendingTx();
        if (!pendingTransactions.length) return;
        let index = -1;
        let i = 0;
        for (let tx of pendingTransactions) {
            if (tx.txHash === txHash) {
                index = i;
                break;
            }
            i++;
        }

        if (index !== -1) {
            pendingTransactions.splice(index, 1);
        }
        this.setPendingTx(pendingTransactions);
    },

    async checkPendingTransactions() {
        let pendingTransactions = this.getPendingTx();
        if (!pendingTransactions.length) return;

        await Misc.sleep(5000);

        // set loading

        for (let tx of pendingTransactions) {
            console.log(tx);

            this.web3.eth.getTransactionReceipt(tx.txHash, (error, event) => {
                console.log(error, event);

                if (event && event.status === true) {
                    this.removePendingTx(tx.txHash);
                    this.updateUserLevel();
                }
                // console.log(Token.events.Transfer.returnValues);
            });
        }

        this.checkPendingTransactions();
    },

    async getTop() {
        // add cache
        // get firstOwners count

        const top = [];

        let maxCrafted = await new Promise((resolve, reject) => {
            this.contract.methods.maxUnlockedTokenType.call({ from: this.account }, (error, result) => {
                console.log("getTop", result);
                resolve(result);
            });
        });

        maxCrafted = parseInt(maxCrafted);

        while (maxCrafted > 0) {
            // check from cache
            let address = localStorage.getItem("top_address_" + maxCrafted);
            if (!address) {
                address = await new Promise((resolve, reject) => {
                    this.contract.methods.getTokenFirstUnlock(maxCrafted).call({ from: this.account }, (error, result) => {
                        resolve(result);
                    });
                });

                if (address) {
                    localStorage.getItem("top_address_" + maxCrafted, address);
                }
            }

            if (!address) {
                maxCrafted--;
                continue;
            }


            // check from cache
            let name = localStorage.getItem("top_name_" + address);
            if (!name) {
                name = await new Promise((resolve, reject) => {
                    this.contract.methods.getName(address).call({ from: this.account }, (error, result) => {
                        resolve(result);
                    });
                });

                if (name) {
                    localStorage.getItem("top_name_" + address, name);
                }
            };

            top.push({
                level: maxCrafted,
                address: address,
                name: name,
                max: maxCrafted === 42
            });

            maxCrafted--;
        }

        if (!top[0].max) {
            top.unshift({
                level: 42,
                address: null,
                name: "unknown"
            });
        }

        console.log(top);

        return top;
    }
};
