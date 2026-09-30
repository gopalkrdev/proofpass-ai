import { ethers } from "ethers";
import { contractAbi } from "./contractAbi.js";

export function blockchainEnabled() {
  return Boolean(
    process.env.CHAIN_RPC_URL &&
    process.env.CHAIN_PRIVATE_KEY &&
    process.env.PROOFPASS_CONTRACT_ADDRESS
  );
}

export async function anchorProof({ proofHash, claim }) {
  if (!blockchainEnabled()) {
    return {
      anchored: false,
      network: null,
      proofId: null,
      txHash: null,
      message: "Blockchain is not configured; running in off-chain demo mode."
    };
  }

  const provider = new ethers.JsonRpcProvider(process.env.CHAIN_RPC_URL);
  const wallet = new ethers.Wallet(process.env.CHAIN_PRIVATE_KEY, provider);
  const contract = new ethers.Contract(
    process.env.PROOFPASS_CONTRACT_ADDRESS,
    contractAbi,
    wallet
  );

  const tx = await contract.createProof(proofHash, claim);
  const receipt = await tx.wait();

  let proofId = null;
  try {
    const count = await contract.proofCount();
    proofId = Number(count) - 1;
  } catch {
  }

  return {
    anchored: true,
    network: process.env.CHAIN_NAME || "Testnet",
    proofId,
    txHash: receipt.hash,
    explorerUrl: null
  };
}
