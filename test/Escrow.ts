import { expect } from "chai";
import {
  loadFixture,
  time,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ethers } from "hardhat";
import { Escrow } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

const PACKAGE_STATE = {
  UNDEFINED: 0,
  AWAITING: 1,
  PROCESSING: 2,
  SHIPPED: 3,
  DELIVERED: 4,
  CANCELLED: 5,
} as const;

const PACKAGE_STATE_LOG: Record<number, string> = {
  0: "UNDEFINED",
  1: "AWAITING",
  2: "PROCESSING",
  3: "SHIPPED",
  4: "DELIVERED",
  5: "CANCELLED",
};

describe("Escrow", function () {
  // Helper function to get escrow status
  async function getEscrowStatus(escrow: Escrow) {
    const [_state, _balance, _buyerDeposit, _buyer, _sellerDeposit, _seller] =
      await escrow.getEscrowStatus();

    return {
      state: "State: " + PACKAGE_STATE_LOG[Number(_state)],
      balance: "Contract Balance: " + ethers.formatEther(_balance),
      buyerDeposit: "Buyer Deposit: " + ethers.formatEther(_buyerDeposit),
      buyer: "Buyer Addr: " + _buyer,
      sellerDeposit: "Seller Deposit: " + ethers.formatEther(_sellerDeposit),
      seller: "Seller Addr: " + _seller,
    };
  }

  // Deploy fixture with contract in initial state
  async function deployValidContractFixture() {
    const [seller, buyer, thirdParty] = await ethers.getSigners();
    const itemValue = ethers.parseEther("1.0");
    const requiredDeposit = itemValue * BigInt(2);

    const Escrow = await ethers.getContractFactory("Escrow");
    const escrow = await Escrow.connect(seller).deploy(itemValue, {
      value: requiredDeposit,
    });

    await escrow.waitForDeployment();

    return { escrow, seller, buyer, thirdParty, itemValue, requiredDeposit };
  }

  // Deploy fixture with contract in Processing state
  async function deployProcessingStateFixture() {
    const { escrow, seller, buyer, thirdParty, itemValue, requiredDeposit } =
      await deployValidContractFixture();

    await escrow.connect(buyer).confirmPurchase({ value: requiredDeposit });

    return { escrow, seller, buyer, thirdParty, itemValue, requiredDeposit };
  }

  // Deploy fixture with contract in Shipped state
  async function deployShippedStateFixture() {
    const { escrow, seller, buyer, thirdParty, itemValue, requiredDeposit } =
      await deployProcessingStateFixture();

    await escrow.connect(seller).confirmShipping();

    return { escrow, seller, buyer, thirdParty, itemValue, requiredDeposit };
  }

  describe("Valid Deployment", function () {
    it("Should set the correct seller, item value, and required deposit", async function () {
      const { escrow, seller, itemValue, requiredDeposit } = await loadFixture(
        deployValidContractFixture
      );

      const contractSeller = await escrow.seller();
      const contractItemValue = await escrow.itemValue();
      const contractSellerDeposit = await escrow.sellerDeposit();
      const contractState = await escrow.state();

      expect(contractSeller).to.equal(seller.address);
      expect(contractItemValue).to.equal(itemValue);
      expect(contractSellerDeposit).to.equal(requiredDeposit);
      expect(contractState).to.equal(PACKAGE_STATE.AWAITING);

      console.log(await getEscrowStatus(escrow));
    });
  });

  describe("Invalid Deployment", function () {
    async function setUp(itemValueEth: string) {
      const [seller, buyer] = await ethers.getSigners();
      const itemValue = ethers.parseEther(itemValueEth);
      const requiredDeposit = itemValue * BigInt(3);

      return { seller, buyer, itemValue, requiredDeposit };
    }

    it("Should revert with IncorrectPaymentAmount for zero item value", async () => {
      const { seller, itemValue, requiredDeposit } = await setUp("0");
      const Escrow = await ethers.getContractFactory("Escrow");
      const escrow = Escrow.connect(seller);
      await expect(
        escrow.deploy(itemValue, { value: requiredDeposit })
      ).to.be.revertedWithCustomError(escrow, "IncorrectPaymentAmount");
    });

    it("Should revert with IncorrectPaymentAmount for invalid deposit", async () => {
      const { seller, itemValue, requiredDeposit } = await setUp("1.0");
      const Escrow = await ethers.getContractFactory("Escrow");
      const escrow = Escrow.connect(seller);
      await expect(
        escrow.deploy(itemValue, { value: requiredDeposit })
      ).to.be.revertedWithCustomError(escrow, "IncorrectPaymentAmount");
    });
  });

  describe("ConfirmPurchase", function () {
    it("Should confirm purchase and change state to Processing", async function () {
      const { escrow, buyer, requiredDeposit } = await loadFixture(
        deployValidContractFixture
      );

      const tx = await escrow
        .connect(buyer)
        .confirmPurchase({ value: requiredDeposit });

      await expect(tx)
        .to.emit(escrow, "DepositMade")
        .withArgs(buyer.address, requiredDeposit, await time.latest())
        .and.to.emit(escrow, "StateChanged")
        .withArgs(PACKAGE_STATE.AWAITING, PACKAGE_STATE.PROCESSING);

      console.log(await getEscrowStatus(escrow));
    });

    it("Should revert with IncorrectPaymentAmount for invalid deposit", async function () {
      const { escrow, buyer, itemValue, requiredDeposit } = await loadFixture(
        deployValidContractFixture
      );

      const tx = escrow
        .connect(buyer)
        .confirmPurchase({ value: requiredDeposit + itemValue });

      await expect(tx).to.be.revertedWithCustomError(
        escrow,
        "IncorrectPaymentAmount"
      );

      console.log(await getEscrowStatus(escrow));
    });

    it("Should revert with InvalidState if not in Awaiting state", async function () {
      const { escrow, buyer, requiredDeposit } = await loadFixture(
        deployProcessingStateFixture
      );

      await expect(
        escrow.connect(buyer).confirmPurchase({ value: requiredDeposit })
      ).to.be.revertedWithCustomError(escrow, "InvalidState");
    });
  });

  describe("ConfirmShipping", function () {
    it("Should allow seller to confirm shipping", async function () {
      const { escrow, seller } = await loadFixture(
        deployProcessingStateFixture
      );

      const tx = await escrow.connect(seller).confirmShipping();

      await expect(tx)
        .to.emit(escrow, "StateChanged")
        .withArgs(PACKAGE_STATE.PROCESSING, PACKAGE_STATE.SHIPPED);

      console.log(await getEscrowStatus(escrow));
    });

    it("Should revert with OnlySeller if not seller", async function () {
      const { escrow, buyer } = await loadFixture(deployProcessingStateFixture);

      await expect(
        escrow.connect(buyer).confirmShipping()
      ).to.be.revertedWithCustomError(escrow, "OnlySeller");
    });

    it("Should revert with InvalidState if not in Processing state", async function () {
      const { escrow, seller } = await loadFixture(deployValidContractFixture);

      await expect(
        escrow.connect(seller).confirmShipping()
      ).to.be.revertedWithCustomError(escrow, "InvalidState");
    });
  });

  describe("ConfirmDelivery", function () {
    it("Should allow buyer to confirm delivery and distribute funds", async function () {
      const { escrow, buyer, seller, itemValue, requiredDeposit } =
        await loadFixture(deployShippedStateFixture);

      const initialSellerBalance = await ethers.provider.getBalance(
        seller.address
      );
      const initialBuyerBalance = await ethers.provider.getBalance(
        buyer.address
      );

      const tx = await escrow.connect(buyer).confirmDelivery();
      const receipt = await tx.wait();
      const gasUsed = receipt!.gasUsed * receipt!.gasPrice;

      const finalSellerBalance = await ethers.provider.getBalance(
        seller.address
      );
      const finalBuyerBalance = await ethers.provider.getBalance(buyer.address);

      // Calculate expected amounts
      // Seller gets their deposit (2x itemValue) + the itemValue from buyer = 3x itemValue
      const expectedSellerAmount = requiredDeposit + itemValue;
      // Buyer gets their deposit (2x itemValue) - itemValue = 1x itemValue
      const expectedBuyerAmount = requiredDeposit - itemValue;

      // Verify seller received correct amount
      expect(finalSellerBalance - initialSellerBalance).to.equal(
        expectedSellerAmount
      );

      // Verify buyer received correct amount (accounting for gas)
      expect(finalBuyerBalance - initialBuyerBalance + gasUsed).to.equal(
        expectedBuyerAmount
      );

      // Verify final state
      expect(await escrow.state()).to.equal(PACKAGE_STATE.DELIVERED);

      console.log(await getEscrowStatus(escrow));

      // Log the actual amounts for verification
      console.log(
        "Seller received:",
        ethers.formatEther(finalSellerBalance - initialSellerBalance)
      );
      console.log(
        "Buyer received (including gas):",
        ethers.formatEther(finalBuyerBalance - initialBuyerBalance + gasUsed)
      );
    });

    it("Should revert with OnlyBuyer if not buyer", async function () {
      const { escrow, seller } = await loadFixture(deployShippedStateFixture);

      await expect(
        escrow.connect(seller).confirmDelivery()
      ).to.be.revertedWithCustomError(escrow, "OnlyBuyer");
    });

    it("Should revert with InvalidState if not in Shipped state", async function () {
      const { escrow, buyer } = await loadFixture(deployProcessingStateFixture);

      await expect(
        escrow.connect(buyer).confirmDelivery()
      ).to.be.revertedWithCustomError(escrow, "InvalidState");
    });
  });

  describe("CancelPurchase", function () {
    it("Should allow buyer to cancel and refund deposits", async function () {
      const { escrow, buyer, seller, requiredDeposit } = await loadFixture(
        deployProcessingStateFixture
      );

      const initialSellerBalance = await ethers.provider.getBalance(
        seller.address
      );
      const initialBuyerBalance = await ethers.provider.getBalance(
        buyer.address
      );

      const tx = await escrow.connect(buyer).cancelPurchase();
      const receipt = await tx.wait();
      const gasUsed = receipt!.gasUsed * receipt!.gasPrice;

      const finalSellerBalance = await ethers.provider.getBalance(
        seller.address
      );
      const finalBuyerBalance = await ethers.provider.getBalance(buyer.address);

      expect(finalSellerBalance - initialSellerBalance).to.equal(
        requiredDeposit
      );
      expect(finalBuyerBalance - initialBuyerBalance + gasUsed).to.equal(
        requiredDeposit
      );

      expect(await escrow.state()).to.equal(PACKAGE_STATE.CANCELLED);
      console.log(await getEscrowStatus(escrow));
    });

    it("Should allow seller to cancel", async function () {
      const { escrow, seller } = await loadFixture(
        deployProcessingStateFixture
      );

      await expect(escrow.connect(seller).cancelPurchase())
        .to.emit(escrow, "StateChanged")
        .withArgs(PACKAGE_STATE.PROCESSING, PACKAGE_STATE.CANCELLED);
    });

    it("Should revert with InvalidAddress if neither buyer nor seller", async function () {
      const { escrow, thirdParty } = await loadFixture(
        deployProcessingStateFixture
      );

      await expect(
        escrow.connect(thirdParty).cancelPurchase()
      ).to.be.revertedWithCustomError(escrow, "InvalidAddress");
    });
  });
});
