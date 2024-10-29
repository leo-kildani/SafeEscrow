// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Escrow {
    uint public immutable itemValue; // Made immutable for gas optimization
    address payable public buyer;
    address payable public immutable seller; // Made immutable
    uint public buyerDeposit;
    uint public sellerDeposit;
    bool private locked; // Reentrancy guard

    enum PackageState {
        Undefined,
        Awaiting,
        Processing,
        Shipped,
        Delivered,
        Cancelled
    }

    PackageState public state;

    // Enhanced error messages
    error OnlyBuyer();
    error OnlySeller();
    error InvalidState();
    error IncorrectPaymentAmount();
    error ContractLocked();
    error TransferFailed();
    error InvalidAddress();
    error InsufficientContractBalance();

    event DepositMade(address indexed from, uint amount, uint timestamp);
    event ItemDelivered(uint timestamp);
    event DeliveryCancelled(address indexed initiator, uint timestamp);
    event FundsDistributed(address indexed to, uint amount, uint timestamp);
    event StateChanged(PackageState previousState, PackageState newState);

    // Reentrancy guard
    modifier nonReentrant() {
        if (locked) revert ContractLocked();
        locked = true;
        _;
        locked = false;
    }

    modifier onlyBuyer() {
        if (msg.sender == seller || msg.sender != buyer) {
            revert OnlyBuyer();
        }
        _;
    }

    modifier onlySeller() {
        if (msg.sender == buyer || msg.sender != seller) {
            revert OnlySeller();
        }
        _;
    }

    modifier inState(PackageState _state) {
        if (state != _state) {
            revert InvalidState();
        }
        _;
    }

    modifier validAddress(address _address) {
        if (_address == address(0)) revert InvalidAddress();
        _;
    }

    constructor(uint _itemValue) payable {
        if (_itemValue == 0) revert IncorrectPaymentAmount();
        if (msg.value != 2 * _itemValue) {
            revert IncorrectPaymentAmount();
        }

        seller = payable(msg.sender);
        itemValue = _itemValue;
        sellerDeposit = msg.value;
        state = PackageState.Awaiting;

        emit DepositMade(seller, msg.value, block.timestamp);
        emit StateChanged(PackageState.Undefined, PackageState.Awaiting);
    }

    function confirmShipping()
        external
        nonReentrant
        onlySeller
        inState(PackageState.Processing)
    {
        PackageState previousState = state;
        state = PackageState.Shipped;
        emit StateChanged(previousState, state);
    }

    function confirmPurchase()
        external
        payable
        nonReentrant
        inState(PackageState.Awaiting)
        validAddress(msg.sender)
    {
        if (msg.value != 2 * itemValue) {
            revert IncorrectPaymentAmount();
        }

        buyer = payable(msg.sender);
        buyerDeposit = msg.value;

        PackageState previousState = state;
        state = PackageState.Processing;

        emit DepositMade(buyer, msg.value, block.timestamp);
        emit StateChanged(previousState, state);
    }

    function cancelPurchase()
        external
        nonReentrant
        inState(PackageState.Processing)
    {
        if (msg.sender != buyer && msg.sender != seller) {
            revert InvalidAddress();
        }

        // Check contract balance
        if (address(this).balance < sellerDeposit + buyerDeposit) {
            revert InsufficientContractBalance();
        }

        PackageState previousState = state;
        state = PackageState.Cancelled;

        // Safe transfer pattern
        (bool successSeller, ) = seller.call{value: sellerDeposit}("");
        if (!successSeller) revert TransferFailed();
        emit FundsDistributed(seller, sellerDeposit, block.timestamp);

        (bool successBuyer, ) = buyer.call{value: buyerDeposit}("");
        if (!successBuyer) revert TransferFailed();
        emit FundsDistributed(buyer, buyerDeposit, block.timestamp);

        sellerDeposit = 0;
        buyerDeposit = 0;

        emit DeliveryCancelled(msg.sender, block.timestamp);
        emit StateChanged(previousState, state);
    }

    function confirmDelivery()
        external
        nonReentrant
        onlyBuyer
        inState(PackageState.Shipped)
    {
        // Check contract balance
        if (address(this).balance < sellerDeposit + buyerDeposit) {
            revert InsufficientContractBalance();
        }

        uint finalBuyerAmount = buyerDeposit - itemValue;
        uint finalSellerAmount = sellerDeposit + itemValue;

        PackageState previousState = state;
        state = PackageState.Delivered;

        // Safe transfer pattern
        (bool successSeller, ) = seller.call{value: finalSellerAmount}("");
        if (!successSeller) revert TransferFailed();
        emit FundsDistributed(seller, finalSellerAmount, block.timestamp);

        (bool successBuyer, ) = buyer.call{value: finalBuyerAmount}("");
        if (!successBuyer) revert TransferFailed();
        emit FundsDistributed(buyer, finalBuyerAmount, block.timestamp);

        // Empty the deposits
        sellerDeposit = 0;
        buyerDeposit = 0;

        emit ItemDelivered(block.timestamp);
        emit StateChanged(previousState, state);
    }

    // View functions for external contracts/interfaces
    function getContractBalance() external view returns (uint) {
        return address(this).balance;
    }

    function getEscrowStatus()
        external
        view
        returns (
            PackageState currentState,
            uint contractBalance,
            uint buyerDepositAmount,
            address buyerAddr,
            uint sellerDepositAmount,
            address sellerAddr
        )
    {
        return (
            state,
            address(this).balance,
            buyerDeposit,
            buyer,
            sellerDeposit,
            seller
        );
    }
}
