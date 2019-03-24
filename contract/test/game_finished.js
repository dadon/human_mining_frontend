const MetaCoin = artifacts.require("MetaCoin");

contract('MetaCoin', (accounts) => {
  it('game should not work after last token claimed', async () => {
    const metaCoinInstance = await MetaCoin.deployed();

    const accountOne = accounts[0];

    // create 100 items
    for (let i = 0; i < 42; i++) {
      await metaCoinInstance.setTokenType(i+1, "дельфин", "image_url", {from: accountOne});
    }

    for (let i = 0; i < 42; i++) {
      await metaCoinInstance.claimToken(i + 1, "дельфин", {from: accountOne});
    }

    // try to claim one more time
    try {
      await metaCoinInstance.claimToken(1, "дельфин", {from: accounts[1]});
    } catch (e) {
      return;
    }

    assert.equal(1, 2);
  });
});
