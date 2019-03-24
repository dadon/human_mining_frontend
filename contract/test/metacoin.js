const MetaCoin = artifacts.require("MetaCoin");

contract('MetaCoin', (accounts) => {
  it('user should have level 0', async () => {
    const metaCoinInstance = await MetaCoin.deployed();

    const accountOne = accounts[0];

    let level = await metaCoinInstance.getLevel();
    assert.equal(level, 0);
  });
  //
  it('should create token type and claim few tokens', async () => {
    const metaCoinInstance = await MetaCoin.deployed();

    const accountOne = accounts[0];
    const accountTwo = accounts[1];

    const tokenTypeId = await metaCoinInstance.setTokenType(1, "dolphin", "image_url", {from: accountOne});
    // console.log(tokenTypeId);
    // assert.equal(tokenTypeId, 1);

    const tokenImage = await metaCoinInstance.getTokenTypeImage(1);
    // const tokenHash = await metaCoinInstance.getTokenTypeHash(1);

    await metaCoinInstance.claimToken(1, "dolphin", {from: accountOne});
    const owner = await metaCoinInstance.ownerOf(1);
    assert.equal(owner, accountOne);

    const firstOnwer = await metaCoinInstance.getTokenFirstUnlock(1);
    assert.equal(firstOnwer, accountOne);

    await metaCoinInstance.claimToken(1, "dolphin", {from: accountTwo});
    const owner2 = await metaCoinInstance.ownerOf(2);
    assert.equal(owner2, accountTwo);

    const result = await metaCoinInstance.getUnlockedTokens();
    console.log("result", result);
  });

  it('user should have level 1 after claim', async () => {
    const metaCoinInstance = await MetaCoin.deployed();

    const accountOne = accounts[0];

    let level = await metaCoinInstance.getLevel();
    assert.equal(level, 1);
  });

  it('user should not be able to claim token twice', async () => {
    const metaCoinInstance = await MetaCoin.deployed();

    try {
      await metaCoinInstance.claimToken(1, "25,25|dolphin", {from: accounts[0]});
    } catch (e) {
      return;
    }

    assert.equal(1, 2);
  });

  it('level should grow properly', async () => {
    const metaCoinInstance = await MetaCoin.deployed();

    await metaCoinInstance.setTokenType(2, "bullet", "image_url", {from: accounts[0]});

    await metaCoinInstance.claimToken(2, "bullet", {from: accounts[0]});
    let level = await metaCoinInstance.getLevel();
    assert.equal(level, 2);
  });

  it('wrong claim should not work', async () => {
    const metaCoinInstance = await MetaCoin.deployed();

    try {
      await metaCoinInstance.claimToken(2, "dolphin", {from: accounts[1]});
    } catch (e) {

    }

    let level = await metaCoinInstance.getLevel({from: accounts[1]});
    assert.equal(level, 1);
  });

  it('user name should work', async () => {
    const metaCoinInstance = await MetaCoin.deployed();

    let name = await metaCoinInstance.getName(accounts[0]);
    assert.equal(name, "");

    await metaCoinInstance.setName("Dmitry", {from: accounts[0]});
    name = await metaCoinInstance.getName(accounts[0]);
    assert.equal(name, "Dmitry");
  });

  it('should reject setToken from non owner', async () => {
    const metaCoinInstance = await MetaCoin.deployed();

    const accountOne = accounts[0];
    const accountTwo = accounts[1];

    try {
      const tokenTypeId = await metaCoinInstance.setTokenType(10, "dolphin", "image_url", {from: accounts[1]});
    } catch (e) {
      return;
    }

    assert.equal(1, 2);
  });
});
