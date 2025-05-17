import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import viteLogo from "/vite.svg";
import NavBar from "./sections/NavBar";
import Dashboard from "./sections/Dashboard";
import Footer from "./sections/Footer";
import DetailView from "./components/DetailView";
import { CampaignsProvider } from "../src/contexts/CampaignsContext";

import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultConfig,
  RainbowKitProvider,
  midnightTheme,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  bscTestnet,
  goerli,
  bsc,
  sepolia,
} from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const WALLET_CONNECT_PROJECT_ID = import.meta.env
  .WALLET_CONNECT_PROJECT_ID;
console.log("App Project ID: " + WALLET_CONNECT_PROJECT_ID);

import HowItWorks from "./sections/HowItWorks";
import UserFundings from "./sections/UserFundings";
import UserCampaigns from "./sections/UserCampaigns";

function App() {
  const queryClient = new QueryClient();

  const config = getDefaultConfig({
    appName: "Crowdfunding-Foundry",
    projectId: WALLET_CONNECT_PROJECT_ID,
    chains: [
      mainnet,
      polygon,
      optimism,
      arbitrum,
      base,
      bscTestnet,
      sepolia,
      bsc,
    ],
    ssr: true,
  });

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Router>
            <NavBar />
            <main>
              <Routes>
                <Route
                  path="/"
                  element={
                    <>
                      <Dashboard />
                      <Footer />
                    </>
                  }
                />

                <Route
                  path="/campaigns/:campaignId"
                  element={
                    <>
                      <DetailView />
                      <Footer />
                    </>
                  }
                />

                <Route
                  path="/how-it-works"
                  element={
                    <>
                      <HowItWorks />
                      <Footer />
                    </>
                  }
                />

                <Route
                  path="/user-fundings/:userAddress"
                  element={
                    <>
                      <UserFundings />
                      <Footer />
                    </>
                  }
                />

                <Route
                  path="/user-campaigns/:userAddress"
                  element={
                    <>
                      <UserCampaigns />
                      <Footer />
                    </>
                  }
                />
              </Routes>
            </main>
          </Router>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
