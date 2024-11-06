import { ethers } from "hardhat";

async function main() {
  const [seller] = await ethers.getSigners();
  const itemValue = ethers.parseEther("1.0");
  const requiredDeposit = itemValue * BigInt(2);

  const Escrow = await ethers.getContractFactory("Escrow");
  const escrow = await Escrow.deploy(itemValue, {
    value: requiredDeposit,
  });

  await escrow.waitForDeployment();

  console.log(`Escrow deployed to ${escrow.target}`);
  console.log(`Seller address: ${seller.address}`);
  console.log(`Item value: ${ethers.formatEther(itemValue)} ETH`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
