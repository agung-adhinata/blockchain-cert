import chai from "chai";
import { ethers } from "hardhat";

const { expect } = chai;

const ROOT_ID = "TEST-001";
const ROOT_NEXT_ID = "TEST-002";

describe("Certification", () => {
  it("owner should be same at initial", async () => {
    const [signedOwner] = await ethers.getSigners();
    const certificate = await ethers.deployContract("Certification");
    const ownerId = signedOwner.address;
    console.log(`new owner ${signedOwner.address}`);
    console.log(`certificate owner ${ownerId}`);
    expect(ownerId).to.equal(signedOwner.address);
  });

  it("create new certificate", async () => {
    const [signedOwner] = await ethers.getSigners();
    const certificate = await ethers.deployContract("Certification");
    const certId = ROOT_ID;
    const certName = "certificate name";
    const certDesc = "certificate description";
    const certHash = "ipfshash";
    const certOwner = signedOwner.address;
    const cert = await certificate.signCertificate(
      certId,
      certHash,
      certName,
      certDesc
    );
    console.log(`gas price : ${cert.gasPrice}`);
    const newCertificate = await certificate.getCertificate(certId);
    console.log(`certificate data: ${newCertificate}`);
    expect(newCertificate.signedBy).to.equal(certOwner);
  });

  it("Get certificates using owner address", async () => {
    const [signedOwner] = await ethers.getSigners();
    const certificate = await ethers.deployContract("Certification");
    const certOwner = signedOwner.address;

    await certificate.signCertificate(
      ROOT_ID,
      "ipfshash",
      "certificate name",
      "certificate description"
    );

    const certs = await certificate.getCertificates(certOwner);
    console.log(`certificate length: ${certs.length}`);
    expect(certs.length).to.equal(1);
    expect(certs[0].signedBy).to.equal(certOwner);
  });

  it("edit certificate", async () => {
    const [signedOwner] = await ethers.getSigners();
    const certificate = await ethers.deployContract("Certification");

    //create new certificate
    await certificate.signCertificate(
      ROOT_ID,
      "ipfshash",
      "certificate name",
      "certificate description"
    );

    // update certificate
    const certId = ROOT_ID;
    const certNewId = ROOT_NEXT_ID;
    const certName = "certificate name";
    const certDesc = "custom certificate description";
    const certHash = "another hash";
    const certOwner = signedOwner.address;
    const cert = await certificate.editCertificate(
      certId,
      certNewId,
      certHash,
      certName,
      certDesc
    );

    console.log(`gas price : ${cert.gasPrice}`);
    const newCertificate = await certificate.getCertificate(certNewId);
    console.log(`certificate data: ${newCertificate}`);
    expect(newCertificate.signedBy).to.equal(certOwner);
  });
  it("get certificate history", async () => {
    const certRootID = ROOT_ID;
    const [signedOwner] = await ethers.getSigners();
    const certificate = await ethers.deployContract("Certification");

    //create new certificate
    await certificate.signCertificate(
      ROOT_ID,
      "ipfshash",
      "certificate name",
      "certificate description"
    );

    // update certificate
    const certId = ROOT_ID;
    const certNewId = ROOT_NEXT_ID;
    const certName = "certificate name";
    const certDesc = "custom certificate description";
    const certHash = "another hash";
    const certOwner = signedOwner.address;
    await certificate.editCertificate(
      certId,
      certNewId,
      certHash,
      certName,
      certDesc
    );


    const certs = await certificate.getCertificateHistory(certRootID);
    console.log(`certificate history length: ${certs.length}`);
    certs.forEach((cert) => {
      console.log(`certificate history: ${cert}`);
    });
    expect(certs[1].id).to.equal(certRootID);
  });
});
