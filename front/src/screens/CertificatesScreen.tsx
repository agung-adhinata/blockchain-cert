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
import { dateFromTimestamp } from "@/lib/utils";
import { Plus, RefreshCcw } from "lucide-react";
import { useCallback, useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

export default function CertificatesScreen() {
  const navigate = useNavigate();
  const etherContext = useContext(ethersContext);
  const [loading, setLoading] = useState(true);
  const [anyData, setAnyData] = useState<Certificate[]>();

  const getCertificates = useCallback(async () => {
    try {
      if (!etherContext) return;
      setLoading(true);
      const signer = await etherContext?.provider?.getSigner();
      const address = await signer?.getAddress();
      const certificates = await etherContext?.contract?.getCertificates(
        address!
      );
      console.log(certificates);
      setAnyData(certificates);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, [etherContext]);

  useEffect(() => {
    getCertificates();
  }, [etherContext, getCertificates]);

  return (
    <div className="h-full max-w-3xl w-full flex flex-col py-4">
      {/* <h1>Certificates Screen</h1> */}
      <div className="flex gap-2">
        <Button
          variant={"outline"}
          size={"icon"}
          onClick={() => getCertificates()}
        >
          <RefreshCcw />
        </Button>
        <Button asChild>
          <Link to={"/certificates/create"}>
            <Plus />
            Create Certificate
          </Link>
        </Button>
      </div>
      <section className="flex-grow flex flex-col justify-center items-center">
        {loading ? (
          <h1 className="flex flex-col items-center">
            <span className="font-bold">🐇 Loading... </span>
            <span className="text-muted-foreground text-center">
              make sure you have good network and connected to metamask 🛜
            </span>
          </h1>
        ) : (
          <section className="flex flex-grow w-full">
            {!anyData ? (
              <p className="">No certificates</p>
            ) : (
              <Table className="min-w-full">
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
                    <TableRow
                      key={index}
                      onClick={() => {
                        navigate(`/certificates/${data.id}`);
                      }}
                    >
                      <TableCell>{data.id}</TableCell>
                      <TableCell>
                        {dateFromTimestamp(data.timestamp).toISOString()}
                      </TableCell>
                      <TableCell>{data.title}</TableCell>
                      <TableCell>{data.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </section>
        )}
      </section>
    </div>
  );
}
