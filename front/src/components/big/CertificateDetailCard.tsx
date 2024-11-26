import { Certificate, ethersContext } from "@/context/EthersContext";
import { useCallback, useContext, useEffect, useState } from "react";

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
      const result = await etherContext?.contract?.getCertificate(certificateId);
      if(!result) return
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
    <div className="rounded p-4 flex flex-col gap-4 max-w-md">
      {loading ? (
        <h1>Loading...</h1>
      ) : certificate ? (
        <>
          <h1 className="text-xl font-bold">{certificate.title}</h1>
          <p>{certificate.description}</p>
          <p>{certificate.ipfsHash}</p>
          <p>{certificate.rootId}</p>
        </>
      ) : (
        <h1>Certificate not found</h1>
      )}
    </div>
  );
}
