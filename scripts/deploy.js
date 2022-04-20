// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const {artifacts, network} = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');
// This is just a convenience check
  if (network.name === "hardhat") {
    console.warn(
        "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  // ethers is available in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
      "Deploying the contracts with the account:",
      await deployer.getAddress()
  );
  // We get the contract to deploy
  const Greeter = await hre.ethers.getContractFactory("Greeter");
  const greeter = await Greeter.deploy("Hello, Hardhat!");

  await greeter.deployed();

  saveFrontendFiles(greeter, "Greeter");

  const AccountMng = await hre.ethers.getContractFactory("AccountMng");
  const accountMng = await AccountMng.deploy();
  await accountMng.deployed();
  saveFrontendFiles(accountMng, "AccountMng");
}

function saveFrontendFiles(token, name) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../front-end/src/contracts";
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }
  const TokenArtifact = artifacts.readArtifactSync(name);

  fs.writeFileSync(
      contractsDir + "/" + name+ ".json",
      JSON.stringify({ Token: token.address , artifact: TokenArtifact}, undefined, 2)
  );


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
