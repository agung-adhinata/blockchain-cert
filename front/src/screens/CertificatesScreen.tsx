import { Button } from "@/components/ui/button";
import { ethersContext } from "@/context/EthersContext";
import { useContext, useState } from "react";

export default function CertificatesScreen() {
  const ethersData = useContext(ethersContext);
const [anyData, setAnyData] = useState<any>();
  async function getCertificates() {
    const signer = await ethersData!.provider.getSigner();
    const certificates = await ethersData!.contract.getCertificates(
      await signer.getAddress()
    );
    console.log(certificates.toString());
    setAnyData(certificates);
  }


  return (
    <div>
      <h1>Certificates Screen</h1>
      <Button onClick={()=> getCertificates()}>Get Certificates</Button>
      <div>
        {anyData}
      </div>
    </div>
  );
}
