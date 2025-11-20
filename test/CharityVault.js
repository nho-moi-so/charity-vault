const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { ethers } = require("hardhat");

describe("CharityVault", function () {
  async function deployVaultFixture() {
    const [owner, donor, stranger] = await ethers.getSigners();
    const CharityVault = await ethers.getContractFactory("CharityVault");
    const vault = await CharityVault.deploy();
    await vault.waitForDeployment();

    return { vault, owner, donor, stranger };
  }

  async function createSampleFund(vault, creator) {
    await vault.connect(creator).createFund("Clean Water", "ipfs://metadata");
    const total = await vault.totalFunds();
    return total - 1n;
  }

  it("creates funds with owner metadata", async function () {
    const { vault, owner } = await loadFixture(deployVaultFixture);
    const fundId = await createSampleFund(vault, owner);

    const fund = await vault.getFund(fundId);
    expect(fund.owner).to.equal(owner.address);
    expect(fund.title).to.equal("Clean Water");
    expect(fund.metadataURI).to.equal("ipfs://metadata");
  });

  it("accepts donations and tracks totals", async function () {
    const { vault, owner, donor } = await loadFixture(deployVaultFixture);
    const fundId = await createSampleFund(vault, owner);

    await expect(
      vault.connect(donor).donate(fundId, { value: ethers.parseEther("1") })
    )
      .to.emit(vault, "DonationReceived")
      .withArgs(fundId, donor.address, ethers.parseEther("1"));

    await vault
      .connect(owner)
      .donate(fundId, { value: ethers.parseEther("0.5") });

    const fund = await vault.getFund(fundId);
    expect(fund.totalReceived).to.equal(ethers.parseEther("1.5"));
    expect(await vault.fundBalance(fundId)).to.equal(
      ethers.parseEther("1.5")
    );
  });

  it("allows owner to withdraw available balance", async function () {
    const { vault, owner, donor } = await loadFixture(deployVaultFixture);
    const fundId = await createSampleFund(vault, owner);
    await vault
      .connect(donor)
      .donate(fundId, { value: ethers.parseEther("2") });

    await expect(
      vault.connect(owner).withdraw(fundId, ethers.parseEther("1.25"))
    )
      .to.emit(vault, "FundsWithdrawn")
      .withArgs(fundId, owner.address, ethers.parseEther("1.25"));

    const fund = await vault.getFund(fundId);
    expect(fund.totalWithdrawn).to.equal(ethers.parseEther("1.25"));
    expect(await vault.fundBalance(fundId)).to.equal(
      ethers.parseEther("0.75")
    );
  });

  it("prevents non-owners from withdrawing", async function () {
    const { vault, owner, stranger, donor } = await loadFixture(
      deployVaultFixture
    );
    const fundId = await createSampleFund(vault, owner);
    await vault
      .connect(donor)
      .donate(fundId, { value: ethers.parseEther("1") });

    await expect(
      vault.connect(stranger).withdraw(fundId, ethers.parseEther("0.5"))
    ).to.be.revertedWith("Not fund owner");
  });

  it("prevents withdrawing more than available balance", async function () {
    const { vault, owner, donor } = await loadFixture(deployVaultFixture);
    const fundId = await createSampleFund(vault, owner);
    await vault
      .connect(donor)
      .donate(fundId, { value: ethers.parseEther("1") });

    await expect(
      vault.connect(owner).withdraw(fundId, ethers.parseEther("2"))
    ).to.be.revertedWith("Insufficient balance");
  });
});

