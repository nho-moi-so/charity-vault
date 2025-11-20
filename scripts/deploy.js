const hre = require("hardhat");

async function main() {
  const CharityVault = await hre.ethers.getContractFactory("CharityVault");
  const vault = await CharityVault.deploy();
  await vault.waitForDeployment();

  console.log(`CharityVault deployed to: ${vault.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

