import React, { createContext, useState, useContext } from "react";

const BroadcastContext = createContext();

export const BroadcastProvider = ({ children }) => {
  const [broadcastData, setBroadcastData] = useState({});

  


  return <BroadcastContext.Provider value={{ broadcastData, setBroadcastData }}>{children}</BroadcastContext.Provider>;
};

// Custom Hook to Use Context
export const useBroadcast = () => useContext(BroadcastContext);
