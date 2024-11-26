import CertificationJSON from "@blockchain-cert/backend/artifacts/contracts/Certification.sol/Certification.json";
import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import {
  BlockchainContext,
  CertificationContract,
  ethersContext,
} from "./EthersContext";
import { CONTRACT_ADDRESS } from "@/constant";
import { BrowserProvider } from "ethers";

export function EthersProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [provider, setProvider] = useState<BrowserProvider | undefined>();
  const [contract, setContract] = useState<CertificationContract | undefined>();
  const [login, setLogin] = useState(false);

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

        setProvider(provider);
        setContract(newContract);

        if(provider) {
          const network = await provider.getSigner();
          console.log("network", network);
        }
      } catch (e) {
        console.error(e);
      }
    },
    []
  );
  // Add event listener for event change
  useEffect(() => {
    if (contract) {
      contract.on(
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
      if (contract) contract.removeAllListeners("CertificateSigned");
    };
  }, [contract]);

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

  useEffect(()=> {
    if (login) {
      if (window.ethereum) {
        setupBlockchainContext(window.ethereum);
      }
    }
  }, [login, setupBlockchainContext]);


  const value: BlockchainContext = {
    provider,
    contract,
    async connectMetamask() {
      setLogin(true);
    },
  };
  return (
    <ethersContext.Provider value={value}>{children}</ethersContext.Provider>
  );
}
