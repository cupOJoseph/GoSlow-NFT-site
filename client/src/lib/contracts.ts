import { ethers } from "ethers";

export const NERITE_NFT_ADDRESS = "0x6DA3c02293C96DFA5747b1739EBb492619222a8A";

// Minimal ABI for the mint function
export const NERITE_NFT_ABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "mint",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
];

export function getNeriteNFTContract(signer: ethers.Signer) {
  return new ethers.Contract(NERITE_NFT_ADDRESS, NERITE_NFT_ABI, signer);
}
