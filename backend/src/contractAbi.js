export const contractAbi = [
  "function createProof(bytes32 proofHash, string claim) external returns (uint256)",
  "function getProof(uint256 proofId) external view returns (bytes32 proofHash, string claim, uint256 timestamp, address creator)",
  "function proofCount() external view returns (uint256)"
];
