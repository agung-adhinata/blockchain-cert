import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Certificate, ethersContext } from "@/context/EthersContext";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";

export default function CertificatesScreen() {
  const navigate = useNavigate();
  const ethersData = useContext(ethersContext);
  const [anyData, setAnyData] = useState<Certificate[]>();
  async function getCertificates() {
    try {
      if(ethersData?.provider === undefined) {
        throw new Error("Provider is not set");
      }
      const signer = await ethersData.provider.getSigner();
      const address = await signer?.getAddress();
      const certificates = await ethersData?.contract?.getCertificates(
        address!
      );
      console.log(certificates);  
      setAnyData(certificates);
    } catch(e) {
      console.error(e);
    }
  }

  return (
    <div className="h-full">
      <h1>Certificates Screen</h1>
      <div className="flex gap-2">
        <Button onClick={() => getCertificates()}>Get Certificates</Button>
        <Button asChild>
          <Link to={"/certificates/create"}>Create Certificate</Link>
        </Button>
      </div>
      {!anyData ? (
        <p>No certificates</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Date Time</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {anyData.map((data, index: number) => (
              <TableRow key={index} onClick={
                () => {
                  navigate(`/certificates/${data.id}`);
                }
              }>
                <TableCell>{data.id}</TableCell>
                <TableCell>{new Date(Number(data.timestamp) * 1000).toISOString()}</TableCell>
                <TableCell>{data.title}</TableCell>
                <TableCell>{data.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
