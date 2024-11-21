"use client";
import { BrowserProvider } from "ethers";
import { ethers } from "ethers";
import { createContext, useEffect, useState } from "react";

const ethersContext = createContext<BrowserProvider | undefined>(undefined);

export function EthersProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [web3, setWeb3] = useState<BrowserProvider | undefined>();
  const [startup, setStartup] = useState(true);
  useEffect(() => {
    if (startup) {
      setStartup(!startup);
      if (typeof window.ethereum !== "undefined") {
        try {
          setWeb3(new ethers.BrowserProvider(window.ethereum));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [startup, web3]);
  return (
    <ethersContext.Provider value={web3}>{children}</ethersContext.Provider>
  );
}
