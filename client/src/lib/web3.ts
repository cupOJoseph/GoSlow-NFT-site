import { useState, useEffect } from 'react';

declare global {
  interface Window {
    ethereum?: any;
  }
}

const ARBITRUM_CHAIN_ID = '0xa4b1'; // Arbitrum One Mainnet
const ARBITRUM_NETWORK = {
  chainId: ARBITRUM_CHAIN_ID,
  chainName: 'Arbitrum One',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: ['https://arb1.arbitrum.io/rpc'],
  blockExplorerUrls: ['https://arbiscan.io/']
};

export function useMetaMask() {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);

  const checkNetwork = async () => {
    if (!window.ethereum) return false;

    const currentChainId = await window.ethereum.request({
      method: 'eth_chainId'
    });

    setChainId(currentChainId);
    return currentChainId === ARBITRUM_CHAIN_ID;
  };

  const switchToArbitrum = async () => {
    if (!window.ethereum) return false;

    try {
      // Try switching to Arbitrum
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ARBITRUM_CHAIN_ID }],
      });
      return true;
    } catch (switchError: any) {
      // If the network doesn't exist in MetaMask, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [ARBITRUM_NETWORK],
          });
          return true;
        } catch (addError) {
          setError("Failed to add Arbitrum network to MetaMask");
          return false;
        }
      } else {
        setError("Failed to switch to Arbitrum network");
        return false;
      }
    }
  };

  const connect = async () => {
    if (!window.ethereum) {
      setError("Please install MetaMask to continue");
      return;
    }

    try {
      setIsConnecting(true);
      setError(null);

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts"
      });

      // Check if we're on Arbitrum network
      const isCorrectNetwork = await checkNetwork();
      if (!isCorrectNetwork) {
        const switched = await switchToArbitrum();
        if (!switched) {
          setError("Please switch to Arbitrum network to continue");
          return;
        }
      }

      setAccount(accounts[0]);
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setError(null);
    setChainId(null);
  };

  useEffect(() => {
    // Check initial network
    checkNetwork();

    if (window.ethereum) {
      // Listen for account changes
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          setAccount(accounts[0]);
        }
      });

      // Listen for network changes
      window.ethereum.on("chainChanged", (newChainId: string) => {
        setChainId(newChainId);
        if (newChainId !== ARBITRUM_CHAIN_ID) {
          setError("Please switch to Arbitrum network to continue");
          disconnect();
        } else {
          setError(null);
        }
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners("accountsChanged");
        window.ethereum.removeAllListeners("chainChanged");
      }
    };
  }, []);

  return {
    account,
    isConnecting,
    error,
    chainId,
    connect,
    disconnect,
    isArbitrumNetwork: chainId === ARBITRUM_CHAIN_ID
  };
}