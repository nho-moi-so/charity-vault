// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title CharityVault
 * @notice Manage charity funds where anyone can create a fund, donate, and fund owners can withdraw.
 */
contract CharityVault is ReentrancyGuard {
    struct Fund {
        string title;
        string metadataURI;
        address owner;
        uint256 totalReceived;
        uint256 totalWithdrawn;
        bool exists;
    }

    Fund[] private _funds;

    event FundCreated(
        uint256 indexed fundId,
        address indexed owner,
        string title,
        string metadataURI
    );

    event DonationReceived(
        uint256 indexed fundId,
        address indexed donor,
        uint256 amount
    );

    event FundsWithdrawn(
        uint256 indexed fundId,
        address indexed owner,
        uint256 amount
    );

    /**
     * @notice Create a new charity fund.
     * @param title Human readable title of the fund.
     * @param metadataURI Off-chain metadata reference (e.g., IPFS/HTTP).
     * @return fundId identifier of the created fund.
     */
    function createFund(
        string calldata title,
        string calldata metadataURI
    ) external returns (uint256 fundId) {
        require(bytes(title).length > 0, "Title required");

        fundId = _funds.length;
        _funds.push(
            Fund({
                title: title,
                metadataURI: metadataURI,
                owner: msg.sender,
                totalReceived: 0,
                totalWithdrawn: 0,
                exists: true
            })
        );

        emit FundCreated(fundId, msg.sender, title, metadataURI);
    }

    /**
     * @notice Donate ETH to an existing fund.
     * @param fundId target fund id.
     */
    function donate(uint256 fundId) external payable nonReentrant {
        Fund storage fund = _funds[fundId];
        require(fund.exists, "Fund not found");
        require(msg.value > 0, "Zero donation");

        fund.totalReceived += msg.value;
        emit DonationReceived(fundId, msg.sender, msg.value);
    }

    /**
     * @notice Withdraw ETH from a fund you own.
     * @param fundId target fund.
     * @param amount amount to withdraw.
     */
    function withdraw(uint256 fundId, uint256 amount) external nonReentrant {
        Fund storage fund = _funds[fundId];
        require(fund.exists, "Fund not found");
        require(fund.owner == msg.sender, "Not fund owner");
        require(amount > 0, "Zero amount");

        uint256 available = fund.totalReceived - fund.totalWithdrawn;
        require(amount <= available, "Insufficient balance");

        fund.totalWithdrawn += amount;
        (bool success, ) = fund.owner.call{value: amount}("");
        require(success, "Transfer failed");

        emit FundsWithdrawn(fundId, fund.owner, amount);
    }

    /**
     * @notice Returns the number of funds created.
     */
    function totalFunds() external view returns (uint256) {
        return _funds.length;
    }

    /**
     * @notice Get fund details by id.
     */
    function getFund(uint256 fundId) external view returns (Fund memory) {
        require(_funds[fundId].exists, "Fund not found");
        return _funds[fundId];
    }

    /**
     * @notice Returns available balance for a fund.
     */
    function fundBalance(uint256 fundId) external view returns (uint256) {
        Fund storage fund = _funds[fundId];
        require(fund.exists, "Fund not found");
        return fund.totalReceived - fund.totalWithdrawn;
    }
}

