const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();

    expect(await greeter.greet()).to.equal("Hello, world!");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});

describe("AccountMng", function () {
  it("Should return the new greeting once it's changed", async function () {
    const AccountMng = await ethers.getContractFactory("AccountMng");
    const accountMng = await AccountMng.deploy();
    await accountMng.deployed();

    await accountMng.registerAccount("Mike");
    expect(await accountMng.getName()).to.equal("Mike");

    await accountMng.setName("Manh");

    expect(await accountMng.getName()).to.equal("Manh");
  });
});
