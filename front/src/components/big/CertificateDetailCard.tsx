import { Certificate, ethersContext } from "@/context/EthersContext";
import { useCallback, useContext, useEffect, useState } from "react";
import { HorizontalDivider } from "@/components/ui/divider";
import { Button } from "../ui/button";
import { Link } from "react-router";
import { dateFromTimestamp } from "@/lib/utils";

export function CertificateDetailCard({
  certificateId,
}: {
  certificateId: string;
}) {
  const etherContext = useContext(ethersContext);
  const [loading, setLoading] = useState(true);
  const [certificate, setCertificate] = useState<Certificate | null>(null);

  const fetchCertificate = useCallback(async () => {
    if (!etherContext) return;
    try {
      setLoading(true);
      const result = await etherContext?.contract?.getCertificate(
        certificateId
      );
      if (!result) return;
      setCertificate(result);
      setLoading(false);
    } catch (e) {
      console.error(`Failed to fetch certificate:\n${e}`);
    }
  }, [certificateId, etherContext]);

  useEffect(() => {
    if (etherContext) {
      fetchCertificate();
    }
  }, [etherContext, fetchCertificate]);

  return (
    <div className="rounded p-4 bg-muted flex flex-col gap-4 max-w-xl">
      {loading ? (
        <h1 className="flex flex-col items-center">
          <span className="font-bold">🐇 Loading... </span>
          <span className="text-muted-foreground text-center">
            make sure you have good network and connected to metamask 🛜
          </span>
        </h1>
      ) : certificate ? (
        <div className="flex flex-col gap-2">
          <section className="grid text-xs grid-cols-4 grid-flow-row-dense shrink max-w-full ">
            <p className="font-mono shrink col-span-1">SIGNER: </p>
            <p className="col-span-3 text-muted-foreground font-mono">
              {certificate.signedBy}
            </p>
            <p className="font-mono shrink col-span-1">ID: </p>
            <p className="col-span-3 text-muted-foreground font-mono">
              {certificate.id}
            </p>
            <p className="font-mono shrink col-span-1">DATE TIME: </p>
            <p className="col-span-3 text-muted-foreground font-mono">
              {dateFromTimestamp(certificate.timestamp).toLocaleString()}
            </p>
          </section>
          <h1 className="text-xl font-bold">{certificate.title}</h1>
          <div>
            <p className="font-bold">Description: </p>
            <p>{certificate.description}</p>
          </div>
          <p>{certificate.ipfsHash}</p>
          <HorizontalDivider />
          <div className="flex gap-2">
            <Button asChild>
              <Link to={"/certificates/edit/" + certificate.id}>
                Edit Certificate
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <h1>Certificate not found</h1>
      )}
    </div>
  );
}
