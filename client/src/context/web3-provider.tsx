import { WagmiProvider, createConfig, http } from "wagmi";
import { arbitrum } from "wagmi/chains";
import { QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { queryClient } from "@/lib/queryClient";

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [arbitrum],
    transports: {
      // RPC URL for each chain
      [arbitrum.id]: http(
        `https://arbitrum-one-rpc.publicnode.com`,
      ),
    },

    // Required API Keys
    walletConnectProjectId: String(import.meta.env.VITE_WALLETCONNECT_PROJECT_ID),

    // Required App Info
    appName: "Nerite - Go Slow Open Edition NFT",

    // Optional App Info
    appDescription: "Support the release of the Nerite protocol by minting an Open Edition NFT",
    appUrl: "https://mint.nerite.org", // your app's url
    appIcon: "https://www.nerite.org/lib_pUThGvfCNUbHihyY/osgfb671m7l8roav.svg?w=110", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  }),
);

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          customTheme={{
            // connectbutton
            "--ck-connectbutton-color": "hsl(var(--primary-foreground))",
            "--ck-connectbutton-background": "hsl(var(--primary))",
            "--ck-connectbutton-hover-color": "hsl(var(--primary-foreground))",
            "--ck-connectbutton-hover-background": "hsl(var(--primary) / 0.4)",
            "--ck-connectbutton-active-color": "hsl(var(--primary-foreground))",
            "--ck-connectbutton-active-background": "hsl(var(--primary))",
            // primary button
            // "--ck-primary-button-color": "hsl(var(--primary-foreground))",
            // "--ck-primary-button-background": "hsl(var(--primary))",
            // "--ck-primary-button-hover-background": "hsl(var(--primary) / 0.4)",
            // "--ck-primary-button-active-background": "hsl(var(--primary))",
            // secondary button
            "--ck-secondary-button-color": "hsl(var(--secondary-foreground))",
            "--ck-secondary-button-background": "hsl(var(--secondary))",
            "--ck-secondary-button-hover-background": "hsl(var(--secondary) / 0.4)",
            "--ck-secondary-button-active-background": "hsl(var(--secondary))",
            // body
            "--ck-body-color": "hsl(var(--foreground))",
            "--ck-body-background": "hsl(var(--background))",
            // border
            "--ck-border-color": "hsl(var(--border))",
            "--ck-border-radius": "var(--radius)",
          }}
          mode="light"
        >
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};