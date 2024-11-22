import { BrowserProvider, ethers } from "ethers";
import { createContext } from "react";

// Certificate struct type
export interface Certificate {
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
export interface HardhatContractMethods {
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

export type CertificationContract = ethers.Contract & HardhatContractMethods;

export type BlockchainContext = {
  provider: BrowserProvider;
  contract: CertificationContract;
  // connect: (signer: ethers.Signer) => CertificationContract;
};

export const ethersContext = createContext<BlockchainContext | undefined>(
  undefined
);
