// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TruthOrDare {
    address public owner;
    string[] public truths;
    string[] public dares;

    // No input fields here – deployment is just "deploy"
    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    // --- OWNER FUNCTIONS: add questions ---

    function addTruth(string calldata _truth) external onlyOwner {
        truths.push(_truth);
    }

    function addDare(string calldata _dare) external onlyOwner {
        dares.push(_dare);
    }

    // --- VIEW COUNTS ---

    function getTruthCount() external view returns (uint256) {
        return truths.length;
    }

    function getDareCount() external view returns (uint256) {
        return dares.length;
    }

    // --- GAME FUNCTIONS: get random truth / dare ---

    function getRandomTruth() external view returns (string memory) {
        require(truths.length > 0, "No truths added yet");

        uint256 randomIndex = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    msg.sender,
                    block.number
                )
            )
        ) % truths.length;

        return truths[randomIndex];
    }

    function getRandomDare() external view returns (string memory) {
        require(dares.length > 0, "No dares added yet");

        uint256 randomIndex = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    msg.sender,
                    block.number
                )
            )
        ) % dares.length;

        return dares[randomIndex];
    }
}