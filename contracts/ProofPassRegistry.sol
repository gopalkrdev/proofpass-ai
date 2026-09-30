pragma solidity ^0.8.24;

contract ProofPassRegistry {
    struct Proof {
        bytes32 proofHash;
        string claim;
        uint256 timestamp;
        address creator;
    }

    uint256 public proofCount;
    mapping(uint256 => Proof) public proofs;

    event ProofCreated(
        uint256 indexed proofId,
        bytes32 indexed proofHash,
        address indexed creator,
        string claim,
        uint256 timestamp
    );

    function createProof(bytes32 proofHash, string calldata claim)
        external
        returns (uint256 proofId)
    {
        proofId = proofCount++;
        proofs[proofId] = Proof(
            proofHash,
            claim,
            block.timestamp,
            msg.sender
        );

        emit ProofCreated(
            proofId,
            proofHash,
            msg.sender,
            claim,
            block.timestamp
        );
    }

    function getProof(uint256 proofId)
        external
        view
        returns (
            bytes32 proofHash,
            string memory claim,
            uint256 timestamp,
            address creator
        )
    {
        Proof memory p = proofs[proofId];
        return (p.proofHash, p.claim, p.timestamp, p.creator);
    }
}
