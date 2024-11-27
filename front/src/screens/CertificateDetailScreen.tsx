import { CertificateDetailCard } from "@/components/big/CertificateDetailCard";
import { CertificateHistoryCard } from "@/components/big/CertificateHistoryCard";
import { ethersContext } from "@/context/EthersContext";
import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router";

export default function CertificateDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const etherContext = useContext(ethersContext);
  const [rootId, setRootId] = useState<string | undefined>();

  const fetchCertificate = useCallback(async () => {
    if (!id) {
      console.log("No certificate id");
      return;
    }
    if (etherContext) {
      const certificate = await etherContext.contract?.getCertificate(id);
      if (certificate) {
        setRootId(certificate.rootId);
      }
    }
  }, [etherContext, id]);

  useEffect(() => {
    if (id) {
      if (etherContext) {
        fetchCertificate();
      }
    }
  }, [etherContext, fetchCertificate, id]);

  return (
    <div className="flex items-center justify-between h-full w-full gap-4">
      <div></div>
      {id ? <CertificateDetailCard certificateId={id} /> : <></>}
      {rootId && id ? <CertificateHistoryCard rootId={rootId} currentId={id} /> : <></>}
    </div>
  );
}
