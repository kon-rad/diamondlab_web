// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

const IPFS_ADDRESS = "ipfs://QmUHD3vGtPomDDD8xdJeGjHKHVaih4dvU7hkbugc5b2i6e";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Market = await hre.ethers.getContractFactory('DLMarket');
  const market = await Market.deploy();
  await market.deployed();
  console.log('DLMarket deployed to: ', market.address);

  const NFT = await hre.ethers.getContractFactory('DLNFT');
  const nft = await NFT.deploy(market.address);
  await nft.deployed();
  console.log('DLNFT deployed to: ', nft.address);
  const MemberNFT = await hre.ethers.getContractFactory('DLMemberNFT');
  const memberNft = await MemberNFT.deploy("Diamond Lab Member", "DMDLBM", IPFS_ADDRESS);
  await memberNft.deployed();
  console.log('DLMemberNFT deployed to: ', memberNft.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
