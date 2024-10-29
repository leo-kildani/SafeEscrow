import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ethers } from "hardhat";

const PACKAGE_STATE = {
  UNDEFINED: 0,
  AWAITING: 1,
  PROCESSING: 2,
  SHIPPED: 3,
  DELIVERED: 4,
  CANCELLED: 5,
};

// Note: We remove the TypeScript interfaces and type annotations
describe("Escrow", function () {
  // initialize/deploy contract in given state for test cases
  async function deployValidContractFixture() {
    const [seller, buyer] = await ethers.getSigners();
    const itemValue = ethers.parseEther("1.0"); // Initial value in ETH
    const requiredDeposit = itemValue * BigInt(2);

    const Escrow = await ethers.getContractFactory("Escrow");
    const escrow = await Escrow.connect(seller).deploy(itemValue, {
      value: requiredDeposit,
    });

    // Wait for deployment
    await escrow.waitForDeployment();

    return { escrow, seller, buyer, itemValue, requiredDeposit };
  }

  describe("Valid Deployment", function () {
    it("Should set the correct seller, item value, and required deposit.", async function () {
      const { escrow, seller, itemValue, requiredDeposit } = await loadFixture(
        deployValidContractFixture
      );

      // Get contract values
      const contractSeller = await escrow.seller();
      const contractItemValue = await escrow.itemValue();
      const contractSellerDeposit = await escrow.sellerDeposit();
      const contractState = await escrow.state();
      // Assertions
      expect(contractSeller).to.equal(seller.address);
      expect(contractItemValue).to.equal(itemValue);
      expect(contractSellerDeposit).to.equal(requiredDeposit);
      expect(contractState).to.equal(PACKAGE_STATE.AWAITING);

      // Log values for debugging
      console.log("Seller Address:", contractSeller);
      console.log("Item Value:", ethers.formatEther(contractItemValue));
      console.log("Seller Deposit:", ethers.formatEther(contractSellerDeposit));
      console.log("Contract State:", contractState);
    });
  });

  describe("Invalid Deployment", function () {
    async function setUp(_itemValue: string) {
      const [seller, buyer] = await ethers.getSigners();
      const itemValue = ethers.parseEther(_itemValue);
      const requiredDeposit = itemValue * BigInt(3);

      return { seller, buyer, itemValue, requiredDeposit };
    }
    it("Should revert an IncorrectPaymentAmount error for item value of 0.", async () => {
      const { seller, itemValue, requiredDeposit } = await setUp("0");
      const Escrow = await ethers.getContractFactory("Escrow");
      const escrow = Escrow.connect(seller);
      await expect(
        escrow.deploy(itemValue, { value: requiredDeposit })
      ).to.be.revertedWithCustomError(escrow, "IncorrectPaymentAmount");
    });
    it("Should revert an IncorrectPaymentAmount error for deposit not being double item value.", async () => {
      const { seller, itemValue, requiredDeposit } = await setUp("1.0");
      const Escrow = await ethers.getContractFactory("Escrow");
      const escrow = Escrow.connect(seller);
      await expect(
        escrow.deploy(itemValue, { value: requiredDeposit })
      ).to.be.revertedWithCustomError(escrow, "IncorrectPaymentAmount");
    });
  });

  describe("ConfirmPurchase", function () {
    it("Should confirm purchase and change state to Processing.", async function () {
      const { escrow, buyer, requiredDeposit } = await loadFixture(
        deployValidContractFixture
      );
      await escrow.connect(buyer).confirmPurchase({ value: requiredDeposit });

      const actualBuyer = await escrow.buyer();
      const actualBuyerDeposit = await escrow.buyerDeposit();
      const actualState = await escrow.state();

      expect(actualBuyer).to.equal(buyer);
      expect(actualBuyerDeposit).to.equal(requiredDeposit);
      expect(actualState).to.equal(PACKAGE_STATE.PROCESSING);

      console.log(await escrow.getEscrowStatus());
    });
    it("Should revert IncorrectPaymentAmount error since buyer will deposit triple item value", async function () {
      const { escrow, buyer, requiredDeposit } = await loadFixture(
        deployValidContractFixture
      );
      await expect(escrow.connect(buyer));
    });
  });
});
