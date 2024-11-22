import CertificationJSON from "@blockchain-cert/backend/artifacts/contracts/Certification.sol/Certification.json";
import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import {
  BlockchainContext,
  CertificationContract,
  ethersContext,
} from "./EthersContext";
import { CONTRACT_ADDRESS } from "@/constant";

export function EthersProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [context, setContext] = useState<BlockchainContext | undefined>();
  const [startup, setStartup] = useState(true);

  const setupBlockchainContext = useCallback(
    async function setupBlockchainContext(ethereum: ethers.Eip1193Provider) {
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const newContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CertificationJSON.abi,
        signer
      ) as CertificationContract;

      setContext({
        provider,
        contract: newContract,
      });
    },
    []
  );


  // Add event listener for account change
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", () => {
        setupBlockchainContext(window.ethereum!);
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners("accountsChanged");
      }
    };
  }, [setupBlockchainContext]);

  useEffect(() => {
    if (startup) {
      setStartup(!startup);
      if (typeof window.ethereum !== "undefined") {
        try {
          setupBlockchainContext(window.ethereum);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [startup, context, setupBlockchainContext]);
  return (
    <ethersContext.Provider value={context}>{children}</ethersContext.Provider>
  );
}
