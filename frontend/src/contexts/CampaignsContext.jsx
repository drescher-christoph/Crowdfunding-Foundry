// campaigns-context.jsx
import { createContext, useContext } from 'react';

const CampaignsContext = createContext([]);

export const CampaignsProvider = ({ children, campaigns }) => (
  <CampaignsContext.Provider value={campaigns}>
    {children}
  </CampaignsContext.Provider>
);

export const useCampaigns = () => useContext(CampaignsContext);