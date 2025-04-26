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

const WALLET_CONNECT_PROJECT_ID = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;

// Annahme: Du hast Bilder importiert oder Platzhalter-URLs
import img from "./assets/images/drone-stock.jpg";
import img2 from "./assets/images/product-stock.jpg";
import img3 from "./assets/images/image1.jpg";
import img4 from "./assets/images/image2.jpg";
import img5 from "./assets/images/image3.jpg";

const data = [
  {
    id: 1,
    img: img,
    title: "SkyDrone Pro - Autonomous Filming Drone",
    description:
      "Revolutionäre Drohne mit 8K-Kamera und KI-gesteuerter Verfolgung",
    daysLeft: 23,
    progress: 82,
    tiers: [
      {
        id: 1,
        tier: "Early Bird",
        amount: 299,
        reward: "30% Rabatt auf die Finalversion",
      },
      {
        id: 2,
        tier: "Pro Bundle",
        amount: 499,
        reward: "Zusätzliche Akkus + Tragetasche",
      },
      {
        id: 3,
        tier: "Enterprise",
        amount: 1499,
        reward: "Priorisierte Lieferung + Workshop",
      },
    ],
  },
  {
    id: 2,
    img: img2,
    title: "EcoBottle - Nachhaltige Trinkflasche",
    description: "100% biologisch abbaubare Flasche mit integriertem Filter",
    daysLeft: 45,
    progress: 155,
    tiers: [
      {
        id: 1,
        tier: "Single",
        amount: 25,
        reward: "1x EcoBottle + Aufkleber",
      },
      {
        id: 2,
        tier: "Duo Pack",
        amount: 40,
        reward: "2x EcoBottle + Gratis-Filter",
      },
    ],
  },
  {
    id: 3,
    img: img3,
    title: "Street Art Kollektiv - Berlin Edition",
    description: "Limitierter Kunstband mit Werken urbaner Künstler*innen",
    daysLeft: 12,
    progress: 68,
    tiers: [
      {
        id: 1,
        tier: "Buch",
        amount: 45,
        reward: "Signierte Ausgabe + Postkarten",
      },
      {
        id: 2,
        tier: "Collector's Edition",
        amount: 150,
        reward: "Mit limitierter Druckgrafik",
      },
    ],
  },
  {
    id: 4,
    img: img4,
    title: "HealthWatch X - Gesundheits-Tracker",
    description: "Medizinisch zertifizierter Sensor-Armband mit EKG-Funktion",
    daysLeft: 67,
    progress: 42,
    tiers: [
      {
        id: 1,
        tier: "Super Early Bird",
        amount: 199,
        reward: "50% Rabatt (UVPR: 399€)",
      },
      {
        id: 2,
        tier: "Family Pack",
        amount: 349,
        reward: "2x HealthWatch X",
      },
    ],
  },
  {
    id: 5,
    img: img,
    title: "PlantBased Burger Startup",
    description: "Fleischlose Burger auf Erbsenprotein-Basis",
    daysLeft: 5,
    progress: 189,
    tiers: [
      {
        id: 1,
        tier: "Taste Tester",
        amount: 15,
        reward: "Probierpaket mit 3 Sorten",
      },
      {
        id: 2,
        tier: "Restaurant",
        amount: 500,
        reward: "Exklusiv-Vertrieb für 1 Jahr",
      },
    ],
  },
];

function App() {
  const [campaigns, setCampaigns] = useState(data); 

  const queryClient = new QueryClient();

  const config = getDefaultConfig({
    appName: 'Crowdfunding-Foundry',
    projectId: WALLET_CONNECT_PROJECT_ID,
    chains: [mainnet, polygon, optimism, arbitrum, base, bscTestnet, sepolia, bsc],
    ssr: true, // If your dApp uses server side rendering (SSR)
  });

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <CampaignsProvider campaigns={campaigns}>
            <Router>
              <NavBar />
              <main>
                <Routes>
                  {/* Hauptroute für Dashboard */}
                  <Route
                    path="/"
                    element={
                      <>
                        <Dashboard />
                        <Footer />
                      </>
                    }
                  />

                  {/* Route für Post-Details */}
                  <Route
                    path="/posts/:postId"
                    element={
                      <>
                        <DetailView />
                        <Footer />
                      </>
                    }
                  />
                </Routes>
              </main>
            </Router>
          </CampaignsProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
