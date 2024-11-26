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
    async (ethereum: ethers.Eip1193Provider) => {
      try {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const newContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          CertificationJSON.abi,
          signer
        ) as CertificationContract;
        console.log("wait deployed contract");
        setContext({
          provider,
          contract: newContract,
        });
      } catch (e) {
        console.error(e);
      }
    },
    []
  );
  // Add event listener for event change
  useEffect(() => {
    if (context) {
      context.contract.on(
        "CertificateSigned",
        (id, rootId, prevId, signedBy, ipfsHash, timestamp) => {
          console.log(
            "CertificateSigned",
            id,
            rootId,
            prevId,
            signedBy,
            ipfsHash,
            timestamp
          );
        }
      );
    }
    return () => {
      if (context) context.contract.removeAllListeners("CertificateSigned");
    };
  }, [context]);

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
