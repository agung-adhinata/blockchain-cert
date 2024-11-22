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
import { Link } from "react-router";

export default function CertificatesScreen() {
  const ethersData = useContext(ethersContext);
  const [anyData, setAnyData] = useState<Certificate[]>();
  async function getCertificates() {
    const signer = await ethersData!.provider.getSigner();
    const certificates = await ethersData!.contract.getCertificates(
      await signer.getAddress()
    );
    console.log(certificates);
    setAnyData(certificates);
  }

  return (
    <div>
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
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {anyData.map((data, index: number) => (
              <TableRow key={index}>
                <TableCell>{data.id}</TableCell>
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
