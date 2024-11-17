import chai from "chai";
import { ethers } from "hardhat";

const { expect } = chai;

describe("Certification", () => {
  it("owner should be same at initial", async () => {
    const signedOwner = await ethers.getSigners();
    const certificate = await ethers.deployContract("Certification");
    const ownerId = await certificate.getSignatureOwner();
    console.log(`new owner ${signedOwner[0].address}`);
    console.log(`certificate owner ${ownerId}`);
    expect(ownerId).to.equal(signedOwner[0].address);
  });
  it("create new certificate", async () => {
    const signedOwner = await ethers.getSigners();
    const certificate = await ethers.deployContract("Certification");
    const certId = "123";
    const certName = "certificate name";
    const certDesc = "certificate description";
    const certHash = "ipfshash";
    const certOwner = signedOwner[0].address;
    const cert = await certificate.signCertificate(
      certId,
      certHash,
      certName,
      certDesc
    );
    console.log(`gas price : ${cert.gasPrice}`)
    const newCertificate = await certificate.getLatestCertificate(certId);
    console.log(`certificate data: ${newCertificate}`);
    expect(newCertificate[2]).to.equal(certOwner);
  });
});
