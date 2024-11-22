"use client";
import { CertificationABI, CertificationAddress } from "@/lib/etherContext";
import { BrowserProvider } from "ethers";
import { ethers } from "ethers";
import { createContext, useEffect, useState } from "react";

// Certificate struct type
interface Certificate {
  id: string;
  rootId: string;
  prevId: string;
  signedBy: string;
  ipfsHash: string;
  timestamp: bigint;
  title: string;
  description: string;
}

// use function from Certification.sol
interface HardhatContractMethods {
  // Contract methods
  signCertificate(
    _id: string,
    _ipfsHash: string,
    _title: string,
    _description: string
  ): Promise<void>;

  editCertificate(
    _rootId: string,
    _newId: string,
    _ipfsHash: string,
    _title: string,
    _description: string
  ): Promise<void>;

  getLatestCertificate(_rootId: string): Promise<Certificate>;

  getCertificate(_certId: string): Promise<Certificate>;

  getCertificates(_signedAddressOwner: string): Promise<Certificate[]>;

  getCertificateHistory(_initialId: string): Promise<Certificate[]>;

  // View mappings
  certificatesById(id: string): Promise<Certificate>;
  latestCertificateIdByRootId(rootId: string): Promise<string>;
  certificateRootIdsBySignedAddress(address: string): Promise<string[]>;
}

type CertificationContract = ethers.Contract & HardhatContractMethods;

export type BlockchainContext = {
  provider: BrowserProvider;
  signer: ethers.JsonRpcSigner | ethers.Signer;
  contract: CertificationContract;
};

export const ethersContext = createContext<BlockchainContext | undefined>(
  undefined
);

export function EthersProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [context, setContext] = useState<BlockchainContext | undefined>();
  const [startup, setStartup] = useState(true);

  async function setupBlockchainContext(ethereum: ethers.Eip1193Provider) {
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      CertificationAddress,
      CertificationABI.abi,
      provider
    ) as CertificationContract;
    setContext({ provider, signer, contract });
  }

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
  }, [startup, context]);
  return (
    <ethersContext.Provider value={context}>{children}</ethersContext.Provider>
  );
}
