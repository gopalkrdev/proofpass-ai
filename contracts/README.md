# ProofPassRegistry

A tiny Solidity registry for anchoring a SHA-256 evidence fingerprint.

## Deploy

Use Remix or Hardhat and a testnet wallet.

The backend only needs:
- RPC URL
- private key for a dedicated test wallet
- deployed contract address

**Never use a wallet containing real funds. Never commit the private key.**

The contract stores the hash and claim, not the original document/evidence.
