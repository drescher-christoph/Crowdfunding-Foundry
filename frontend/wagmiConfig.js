import { createConfig, configureChains, mainnet } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { walletConnectProvider } from '@walletconnect/web3-provider'
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit'

const WALLET_CONNECT_PROJECT_ID = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;

// Konfiguriere Chains und Provider
const { chains, publicClient } = configureChains(
    [mainnet, polygon, optimism, arbitrum, base, bnb], 
  [
    walletConnectProvider({
      projectId: WALLET_CONNECT_PROJECT_ID, 
    }),
    publicProvider()
  ]
)

// WalletConnect und andere Wallets konfigurieren
const { connectors } = getDefaultWallets({
  appName: 'Crowdfunding-Foundry',
  projectId: WALLET_CONNECT_PROJECT_ID,
  chains
})

// Erstelle wagmi-Client
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})

export { wagmiConfig, chains }