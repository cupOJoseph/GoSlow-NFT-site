import { useState, useEffect } from 'react';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export function useMetaMask() {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          setAccount(accounts[0]);
        }
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners("accountsChanged");
      }
    };
  }, []);

  return {
    account,
    isConnecting,
    error,
    connect,
    disconnect
  };
}
