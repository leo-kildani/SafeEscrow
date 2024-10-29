# SafeEscrow

Ethereum escrow smart contract.

## Authors

- Mike Chau
- Leonardo Kildani
- Austin Nguyen
- Charlie Nguyen
- Nathan Nguyen
- Alan Vu

## Overview

The goal of this project is to create a safe and streamline way of purchasing online products utilizing the security and speed of the Ethereum Blockchain.

### Contract

- When a product is purchased, both the seller and buyer are required to deposit double the amount of the value of the product. This is to create an incentive for conducting transactions in good faith.
- Distribution of deposits is based on the outcome of the product delivery and the transaction.
- A successful transaction occurs when a buyer confirms their product has delivered, hence the seller gets back their deposit and half of the buyer's deposit (value of the product).
- A failed transaction returns both parties' deposits.

## Dependencies

### Solidity Compiler:

`npm install solc`

### HardHat for Contract Testing:

1. `npm install --save-dev hardhat`