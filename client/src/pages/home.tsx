import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NumberInput } from "@/components/ui/number-input";
import { useMetaMask } from "@/lib/web3";
import { useToast } from "@/hooks/use-toast";
import { Wallet, Loader2 } from "lucide-react";

export default function Home() {
  const [mintAmount, setMintAmount] = useState(5);
  const { account, isConnecting, error, connect } = useMetaMask();
  const { toast } = useToast();

  const handleMint = async () => {
    if (!account) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to mint NFTs",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Minting not implemented",
      description: "This is a placeholder for the minting functionality",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between px-6">
          <h1 className="text-xl font-semibold">Nerite NFT</h1>
          <Button
            variant={account ? "outline" : "default"}
            onClick={account ? undefined : connect}
            disabled={isConnecting}
          >
            {isConnecting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wallet className="mr-2 h-4 w-4" />
            )}
            {account
              ? `${account.slice(0, 6)}...${account.slice(-4)}`
              : "Connect Wallet"}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container pt-24 pb-16">
        <div className="max-w-3xl mx-auto">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              {/* NFT Image */}
              <img
                src="https://i.imgur.com/bxfUrVK.jpeg"
                alt="Nerite NFT"
                className="w-full aspect-video object-cover"
              />
              
              {/* Content */}
              <div className="p-6 space-y-6">
                <div className="space-y-2 text-center">
                  <h2 className="text-2xl font-semibold">
                    Nerite - Streamable & Redeemable
                  </h2>
                  <p className="text-muted-foreground">
                    Support funding for security audits for the Nerite Protocol
                  </p>
                </div>

                {error && (
                  <div className="p-4 text-sm text-red-500 bg-red-50 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="flex flex-col items-center gap-4">
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-4">
                      <NumberInput
                        value={mintAmount}
                        onChange={setMintAmount}
                        min={1}
                        max={100}
                        placeholder="Amount to mint"
                      />
                      <span className="text-muted-foreground">
                        @ 0.005 ETH each
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total: {(mintAmount * 0.005).toFixed(3)} ETH
                    </div>
                  </div>

                  <Button
                    onClick={handleMint}
                    className="w-full max-w-xs bg-primary hover:bg-primary/90"
                    size="lg"
                  >
                    Mint
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
