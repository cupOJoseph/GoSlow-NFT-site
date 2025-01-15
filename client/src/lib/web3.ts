import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

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
      toast({
        title: "Network switched",
        description: "Successfully connected to Arbitrum network",
        variant: "default"
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
          toast({
            title: "Network added",
            description: "Successfully added and connected to Arbitrum network",
            variant: "default"
          });
          return true;
        } catch (addError) {
          toast({
            title: "Network error",
            description: "Failed to add Arbitrum network to MetaMask",
            variant: "destructive"
          });
          setError("Failed to add Arbitrum network to MetaMask");
          return false;
        }
      } else {
        toast({
          title: "Network error",
          description: "Failed to switch to Arbitrum network",
          variant: "destructive"
        });
        setError("Failed to switch to Arbitrum network");
        return false;
      }
    }
  };

  const connect = async () => {
    if (!window.ethereum) {
      toast({
        title: "MetaMask not found",
        description: "Please install MetaMask to continue",
        variant: "destructive"
      });
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
        toast({
          title: "Wrong network",
          description: "Please switch to Arbitrum network",
          variant: "destructive"
        });
        const switched = await switchToArbitrum();
        if (!switched) {
          setError("Please switch to Arbitrum network to continue");
          return;
        }
      }

      setAccount(accounts[0]);
      toast({
        title: "Wallet connected",
        description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
        variant: "default"
      });
    } catch (err: any) {
      toast({
        title: "Connection error",
        description: err.message || "Failed to connect wallet",
        variant: "destructive"
      });
      setError(err.message || "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setError(null);
    setChainId(null);
    toast({
      title: "Wallet disconnected",
      description: "Your wallet has been disconnected",
      variant: "default"
    });
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
          toast({
            title: "Account changed",
            description: `Switched to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
            variant: "default"
          });
        }
      });

      // Listen for network changes
      window.ethereum.on("chainChanged", (newChainId: string) => {
        setChainId(newChainId);
        if (newChainId !== ARBITRUM_CHAIN_ID) {
          toast({
            title: "Wrong network",
            description: "Please switch to Arbitrum network to continue",
            variant: "destructive"
          });
          setError("Please switch to Arbitrum network to continue");
          disconnect();
        } else {
          setError(null);
          toast({
            title: "Network changed",
            description: "Successfully connected to Arbitrum network",
            variant: "default"
          });
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